import { hash } from '@node-rs/argon2';
import { encodeBase32LowerCase } from '@oslojs/encoding';
import { json } from '@sveltejs/kit';
import { query } from '$lib/server/db/index.js';
import * as table from '$lib/server/db/schema';
import type { RequestHandler } from './$types';

// Function to generate a user ID with 120 bits of entropy
function generateUserId() {
  const bytes = crypto.getRandomValues(new Uint8Array(15));
  const id = encodeBase32LowerCase(bytes);
  return id;
}

// Function to validate username
function validateUsername(username: string): boolean {
  return (
    username.length >= 3 &&
    username.length <= 31 &&
    /^[a-z0-9_-]+$/.test(username)
  );
}

// Function to validate password
function validatePassword(password: string): boolean {
  return password.length >= 6 && password.length <= 255;
}

export const POST: RequestHandler = async (event) => {
  // This endpoint should only be accessible in development mode
  if (import.meta.env.PROD) {
    return new Response('Not available in production', { status: 403 });
  }
  
  try {
    // Database tables should be initialized automatically by the db/index.js file
    console.log('Checking database connection...');
    await query('SELECT 1');
    console.log('Database connection successful.');
    
    const data = await event.request.json();
    const { username, password, secretKey } = data;
    
    // Verify the secret key (this is a simple protection mechanism)
    // In a real app, you'd use a more secure approach
    if (secretKey !== 'dev-only-secret-key') {
      return json({ success: false, message: 'Invalid secret key' }, { status: 403 });
    }
    
    // Validate inputs
    if (!validateUsername(username)) {
      return json({ 
        success: false, 
        message: 'Invalid username (min 3, max 31 characters, alphanumeric, underscore, and hyphen only)' 
      }, { status: 400 });
    }
    
    if (!validatePassword(password)) {
      return json({ 
        success: false, 
        message: 'Invalid password (min 6, max 255 characters)' 
      }, { status: 400 });
    }
    
    // Check if user already exists
    const existingUsers = await query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (existingUsers.rows.length > 0) {
      return json({ 
        success: false, 
        message: `User "${username}" already exists` 
      }, { status: 400 });
    }
    
    // Generate user ID
    const userId = generateUserId();
    
    // Hash password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1
    });
    
    // Insert user into database
    await query(
      'INSERT INTO users (id, username, password_hash, is_admin) VALUES ($1, $2, $3, $4)',
      [userId, username, passwordHash, true]
    );
    
    return json({ 
      success: true, 
      message: `Admin user "${username}" created successfully` 
    });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return json({ 
      success: false, 
      message: 'Error creating admin user' 
    }, { status: 500 });
  }
};
