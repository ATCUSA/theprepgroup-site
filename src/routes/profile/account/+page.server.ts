import { redirect, fail } from '@sveltejs/kit';
import type { ServerLoad, Actions, RequestEvent } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, not } from 'drizzle-orm/expressions';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';
import * as auth from '$lib/server/auth';

interface Locals {
  user: {
    id: string;
    username: string;
    isAdmin: boolean;
  } | null;
}

export const load: ServerLoad = async ({ locals }: { locals: Locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Get the user account details
  const [user] = await db
    .select({
      id: schema.user.id,
      username: schema.user.username,
      email: schema.user.email,
      isAdmin: schema.user.isAdmin,
      createdAt: schema.user.createdAt
    })
    .from(schema.user)
    .where(eq(schema.user.id, locals.user.id));
  
  return {
    user
  };
};

export const actions: Actions = {
  updateAccount: async ({ request, locals }: RequestEvent & { locals: Locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    
    // Extract account data from form
    const username = data.get('username')?.toString();
    const email = data.get('email')?.toString();
    const currentPassword = data.get('currentPassword')?.toString();
    const newPassword = data.get('newPassword')?.toString();
    const confirmPassword = data.get('confirmPassword')?.toString();
    
    // Validate required fields
    if (!username || !email) {
      return fail(400, {
        message: 'Username and email are required',
        success: false
      });
    }
    
    try {
      // Get the current user
      const [currentUser] = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.id, locals.user.id));
      
      if (!currentUser) {
        return fail(404, {
          message: 'User not found',
          success: false
        });
      }
      
      // Check if username is already taken by another user
      if (username !== currentUser.username) {
        const existingUsername = await db
          .select()
          .from(schema.user)
          .where(
            and(
              eq(schema.user.username, username),
              not(eq(schema.user.id, locals.user.id))
            )
          )
          .limit(1);
        
        if (existingUsername.length > 0) {
          return fail(400, {
            message: 'Username is already taken',
            success: false
          });
        }
      }
      
      // Check if email is already taken by another user
      if (email !== currentUser.email) {
        const existingEmail = await db
          .select()
          .from(schema.user)
          .where(
            and(
              eq(schema.user.email, email),
              not(eq(schema.user.id, locals.user.id))
            )
          )
          .limit(1);
        
        if (existingEmail.length > 0) {
          return fail(400, {
            message: 'Email is already taken',
            success: false
          });
        }
      }
      
      // Prepare update data
      const updateData: Record<string, any> = {
        username,
        email
      };
      
      // Handle password change if provided
      if (newPassword) {
        // Validate current password
        if (!currentPassword) {
          return fail(400, {
            message: 'Current password is required to change password',
            success: false
          });
        }
        
        // Verify current password
        const currentPasswordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(currentPassword)));
        if (currentPasswordHash !== currentUser.passwordHash) {
          return fail(400, {
            message: 'Current password is incorrect',
            success: false
          });
        }
        
        // Validate new password
        if (newPassword.length < 6) {
          return fail(400, {
            message: 'New password must be at least 6 characters',
            success: false
          });
        }
        
        // Confirm passwords match
        if (newPassword !== confirmPassword) {
          return fail(400, {
            message: 'New passwords do not match',
            success: false
          });
        }
        
        // Hash the new password
        const newPasswordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(newPassword)));
        updateData.passwordHash = newPasswordHash;
        
        // Invalidate all other sessions for security
        await auth.invalidateAllUserSessions(locals.user.id);
      }
      
      // Update user account
      await db.update(schema.user)
        .set(updateData)
        .where(eq(schema.user.id, locals.user.id));
      
      // If password was changed, we need to create a new session
      if (newPassword) {
        return {
          success: true,
          passwordChanged: true,
          message: 'Account updated successfully. Please log in with your new password.'
        };
      }
      
      return {
        success: true,
        message: 'Account updated successfully'
      };
    } catch (error) {
      console.error('Error updating account:', error);
      return fail(500, {
        message: 'An error occurred while updating your account',
        success: false
      });
    }
  }
};
