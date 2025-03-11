#!/bin/bash
# Deploy script for The Prep Group Docker setup

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== The Prep Group Docker Deployment ===${NC}"
echo "This script will help you deploy the application with Docker Compose."

# Check if .env file exists, if not create it from .env.docker
if [ ! -f .env ]; then
  echo -e "${YELLOW}Creating .env file from .env.docker...${NC}"
  cp .env.docker .env
  echo -e "${GREEN}Created .env file. Please check and update it if needed.${NC}"
else
  echo -e "${GREEN}.env file already exists.${NC}"
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}Error: Docker is not running. Please start Docker and try again.${NC}"
  exit 1
fi

# Check if Cloudflare Tunnel token is set
if ! grep -q "CLOUDFLARE_TUNNEL_TOKEN" .env || grep -q "CLOUDFLARE_TUNNEL_TOKEN=\"\"" .env; then
  echo -e "${YELLOW}Warning: Cloudflare Tunnel token might not be set in .env file.${NC}"
  echo -e "Please make sure to set it before continuing."
  read -p "Continue anyway? (y/n) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled.${NC}"
    exit 1
  fi
fi

# Create necessary directories
echo -e "${GREEN}Creating necessary directories...${NC}"
mkdir -p files filebrowser data

# Build and start the containers
echo -e "${GREEN}Building and starting containers...${NC}"
docker-compose up -d --build

# Check if containers are running
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Deployment successful!${NC}"
  echo -e "Your services should now be running:"
  echo -e "  - Main website: https://theprepgroup.us"
  echo -e "  - File Browser: https://files.theprepgroup.us"
  
  # Check if FileBrowser needs initialization
  if [ ! -f filebrowser/filebrowser.db ]; then
    echo -e "${YELLOW}Note: You need to initialize FileBrowser with an admin user:${NC}"
    echo -e "  docker-compose exec filebrowser filebrowser users add admin PASSWORD --perm.admin"
    echo -e "  (Replace PASSWORD with a secure password)"
  fi
  
  echo -e "\n${GREEN}To view logs:${NC}"
  echo -e "  docker-compose logs -f"
  echo -e "\n${GREEN}To stop the services:${NC}"
  echo -e "  docker-compose down"
else
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
fi
