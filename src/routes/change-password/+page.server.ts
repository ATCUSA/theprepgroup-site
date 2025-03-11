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
  changePassword: async ({ request, locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    const currentPassword = data.get('currentPassword')?.toString();
    const newPassword = data.get('newPassword')?.toString();
    const confirmPassword = data.get('confirmPassword')?.toString();
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return fail(400, { message: 'All fields are required' });
    }
    
    if (newPassword.length < 8) {
      return fail(400, { message: 'New password must be at least 8 characters long' });
    }
    
    if (newPassword !== confirmPassword) {
      return fail(400, { message: 'New passwords do not match' });
    }
    
    try {
      // Get user from database to check current password
      const [user] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, locals.user.id));
      
      if (!user) {
        return fail(404, { message: 'User not found' });
      }
      
      // Verify current password
      const currentPasswordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(currentPassword)));
      
      if (currentPasswordHash !== user.passwordHash) {
        return fail(400, { message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const newPasswordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(newPassword)));
      
      // Update password in database
      await db.update(schema.user)
        .set({ passwordHash: newPasswordHash })
        .where(eq(schema.user.id, user.id));
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error changing password:', error);
      return fail(500, { message: 'An error occurred while changing your password' });
    }
  }
};
