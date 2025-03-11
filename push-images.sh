#!/bin/bash
# Script to build and push Docker images to GitHub Container Registry or Docker Hub

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Default values
REGISTRY="github"
IMAGE_NAME="theprepgroup-site"
IMAGE_TAG="latest"

# Display help message
function show_help {
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -r, --registry    Registry to push to (github or docker) [default: github]"
  echo "  -n, --name        Image name [default: theprepgroup-site]"
  echo "  -t, --tag         Image tag [default: latest]"
  echo "  -u, --username    Username for the registry"
  echo "  -h, --help        Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 --registry github --username yourgithubusername --name theprepgroup-site"
  echo "  $0 --registry docker --username yourdockerhubusername --name yourorg/theprepgroup-site"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  key="$1"
  case $key in
    -r|--registry)
      REGISTRY="$2"
      shift
      shift
      ;;
    -n|--name)
      IMAGE_NAME="$2"
      shift
      shift
      ;;
    -t|--tag)
      IMAGE_TAG="$2"
      shift
      shift
      ;;
    -u|--username)
      USERNAME="$2"
      shift
      shift
      ;;
    -h|--help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      show_help
      exit 1
      ;;
  esac
done

# Check if username is provided
if [ -z "$USERNAME" ]; then
  echo -e "${RED}Error: Username is required.${NC}"
  show_help
  exit 1
fi

# Set registry URL based on selected registry
if [ "$REGISTRY" == "github" ]; then
  REGISTRY_URL="ghcr.io/$USERNAME"
  echo -e "${GREEN}Using GitHub Container Registry (ghcr.io)${NC}"
  
  # Check if GitHub CLI is installed and user is logged in
  if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI (gh) is not installed. You may need to authenticate manually.${NC}"
    echo "You can install it from: https://cli.github.com/"
  else
    # Check if user is logged in to GitHub
    if ! gh auth status &> /dev/null; then
      echo -e "${YELLOW}You are not logged in to GitHub. Please login:${NC}"
      gh auth login
    else
      echo -e "${GREEN}Already logged in to GitHub.${NC}"
    fi
  fi
  
  # Login to GitHub Container Registry
  echo -e "${YELLOW}Logging in to GitHub Container Registry...${NC}"
  echo -e "${YELLOW}You may be prompted for your GitHub Personal Access Token.${NC}"
  echo -e "${YELLOW}Make sure your token has 'write:packages' permission.${NC}"
  docker login ghcr.io -u $USERNAME
  
elif [ "$REGISTRY" == "docker" ]; then
  REGISTRY_URL="$USERNAME"
  echo -e "${GREEN}Using Docker Hub Registry (hub.docker.com)${NC}"
  
  # Login to Docker Hub
  echo -e "${YELLOW}Logging in to Docker Hub...${NC}"
  docker login -u $USERNAME
else
  echo -e "${RED}Error: Invalid registry. Use 'github' or 'docker'.${NC}"
  exit 1
fi

# Full image name with registry
FULL_IMAGE_NAME="$REGISTRY_URL/$IMAGE_NAME:$IMAGE_TAG"

# Build the Docker image
echo -e "${GREEN}Building Docker image: $FULL_IMAGE_NAME${NC}"
docker build -t $FULL_IMAGE_NAME .

# Check if build was successful
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Docker build failed.${NC}"
  exit 1
fi

# Push the image to the registry
echo -e "${GREEN}Pushing image to $REGISTRY...${NC}"
docker push $FULL_IMAGE_NAME

# Check if push was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Successfully pushed $FULL_IMAGE_NAME to $REGISTRY.${NC}"
  
  if [ "$REGISTRY" == "github" ]; then
    echo -e "${YELLOW}Note: Make sure your GitHub repository is set to public or has proper visibility settings${NC}"
    echo -e "${YELLOW}to allow access to the container image.${NC}"
  fi
  
  echo -e "${GREEN}You can use this image in your docker-compose.yml:${NC}"
  echo -e "  webapp:"
  echo -e "    image: $FULL_IMAGE_NAME"
  echo -e "    # ... other settings"
else
  echo -e "${RED}Error: Failed to push image to $REGISTRY.${NC}"
  exit 1
fi
