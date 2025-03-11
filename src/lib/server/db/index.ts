import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import * as schema from './schema';
import { env } from '$env/dynamic/private';
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = neon(env.DATABASE_URL);

export const db = drizzle(client, {
	schema
});

// Generic query function
export async function query(sql: string, params: any[] = []) {
  try {
    // Use the raw SQL execution capability of the neon client
    return await client(sql, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Get user by email
export async function getUserByEmail(email: string) {
  try {
    const users = await db.select().from(schema.user).where(eq(schema.user.email, email));
    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }
}

// Get access request by email
export async function getAccessRequestByEmail(email: string) {
  try {
    const requests = await db.select().from(schema.accessRequest).where(eq(schema.accessRequest.email, email));
    return requests.length > 0 ? requests[0] : null;
  } catch (error) {
    console.error('Error getting access request by email:', error);
    throw error;
  }
}

// Create access request
export async function createAccessRequest(data: {
  name: string;
  email: string;
  zipCode: string;
  reason: string;
}) {
  try {
    // Split the name into first and last name
    const nameParts = data.name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
    
    // Generate a random ID
    const id = crypto.randomUUID();
    
    const result = await db.insert(schema.accessRequest).values({
      id,
      email: data.email,
      firstName,
      lastName,
      zipCode: data.zipCode,
      reason: data.reason,
      status: 'pending'
    }).returning();
    
    return result[0];
  } catch (error) {
    console.error('Error creating access request:', error);
    throw error;
  }
}
