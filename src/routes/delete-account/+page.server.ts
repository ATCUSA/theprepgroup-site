import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  return {
    user: locals.user
  };
};

export const actions: Actions = {
  deleteAccount: async ({ request, locals, cookies }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    const password = data.get('password')?.toString();
    const confirmDelete = data.get('confirmDelete') === 'on';
    
    // Validate inputs
    if (!password) {
      return fail(400, { message: 'Password is required' });
    }
    
    if (!confirmDelete) {
      return fail(400, { message: 'You must confirm account deletion' });
    }
    
    try {
      // Get user from database to check password
      const [user] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, locals.user.id));
      
      if (!user) {
        return fail(404, { message: 'User not found' });
      }
      
      // Verify password
      const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
      
      if (passwordHash !== user.passwordHash) {
        return fail(400, { message: 'Incorrect password' });
      }
      
      // Begin transaction to delete all user data
      await db.transaction(async (tx) => {
        // Delete user profile
        await tx.delete(schema.userProfile)
          .where(eq(schema.userProfile.userId, user.id));
        
        // Delete any other user-related data
        // For example, if you have user posts, comments, etc.
        // await tx.delete(schema.userPosts).where(eq(schema.userPosts.userId, user.id));
        
        // Finally, delete the user account
        await tx.delete(schema.user)
          .where(eq(schema.user.id, user.id));
      });
      
      // Clear authentication cookies
      cookies.delete('session', { path: '/' });
      
      // Redirect to home page
      throw redirect(302, '/');
    } catch (error) {
      console.error('Error deleting account:', error);
      return fail(500, { message: 'An error occurred while deleting your account' });
    }
  }
};
