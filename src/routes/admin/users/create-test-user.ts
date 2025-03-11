import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

// Function to create a test user if none exists
export async function createTestUser() {
  try {
    // Check if any users exist
    const existingUsers = await db.select().from(userTable);
    console.log('Existing users:', existingUsers);
    
    if (existingUsers.length === 0) {
      // Create a test admin user
      const userId = 'test-admin-' + Math.random().toString(36).substring(2, 10);
      const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode('password123')));
      
      await db.insert(userTable).values({
        id: userId,
        username: 'admin',
        passwordHash,
        email: 'admin@example.com',
        isAdmin: true
      });
      
      console.log('Created test admin user with ID:', userId);
      return { success: true, message: 'Test admin user created' };
    } else {
      return { success: false, message: 'Users already exist, no need to create test user' };
    }
  } catch (error) {
    console.error('Error creating test user:', error);
    return { success: false, message: 'Error creating test user', error };
  }
}
