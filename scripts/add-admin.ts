import * as schema from '../src/lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import { v4 as uuidv4 } from 'uuid';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';

// Bun automatically loads environment variables from .env files

// Get database URL from environment
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

// Create database client
const client = neon(databaseUrl);
const db = drizzle(client, { schema });

async function addAdminUser(username: string, password: string, email: string) {
  try {
    // Check if user already exists
    const existingUser = await db.select()
      .from(schema.user)
      .where(eq(schema.user.username, username))
      .limit(1);
    
    if (existingUser.length > 0) {
      console.log(`User ${username} already exists. Updating to admin...`);
      
      // Update existing user to admin
      await db.update(schema.user)
        .set({ isAdmin: true })
        .where(eq(schema.user.username, username));
      
      console.log(`User ${username} has been updated to admin.`);
      return;
    }
    
    // Hash the password
    const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
    
    // Create a new admin user
    const userId = uuidv4();
    await db.insert(schema.user).values({
      id: userId,
      username,
      passwordHash,
      email,
      isAdmin: true
    });
    
    console.log(`Admin user ${username} created successfully!`);
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
}

// Get command line arguments
const args = process.argv.slice(2);
const username = args[0];
const password = args[1];
const email = args[2];

if (!username || !password || !email) {
  console.error('Usage: npx tsx scripts/add-admin.ts <username> <password> <email>');
  process.exit(1);
}

addAdminUser(username, password, email).catch(console.error);
