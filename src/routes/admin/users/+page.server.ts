import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { user as userTable, session as sessionTable } from '$lib/server/db/schema';
import type { User } from '$lib/server/db/schema';
import { eq, count } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Type assertion to ensure TypeScript knows user has isAdmin property
  const user = locals.user as User;
  
  // Check if user is an admin
  if (!user.isAdmin) {
    throw redirect(302, '/members');
  }
  
  try {
    // Fetch all users from the database
    const users = await db.select().from(userTable).orderBy(userTable.username);
    
    return {
      users
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      users: []
    };
  }
};

export const actions: Actions = {
  deleteUser: async ({ request, locals }) => {
    // Check if user is authenticated and is an admin
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const user = locals.user as User;
    if (!user.isAdmin) {
      throw redirect(302, '/members');
    }
    
    const formData = await request.formData();
    const userId = formData.get('userId');
    
    if (!userId || typeof userId !== 'string') {
      return fail(400, { message: 'Invalid user ID' });
    }
    
    try {
      // Don't allow admins to delete themselves
      if (userId === locals.user.id) {
        return fail(400, { message: 'You cannot delete your own account' });
      }
      
      // First delete all sessions for this user
      await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
      
      // Then delete the user
      const result = await db.delete(userTable).where(eq(userTable.id, userId));
      
      if (result) {
        return { success: true };
      } else {
        return fail(404, { message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      return fail(500, { message: 'An error occurred while deleting the user' });
    }
  },
  
  toggleAdmin: async ({ request, locals }) => {
    // Check if user is authenticated and is an admin
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const user = locals.user as User;
    if (!user.isAdmin) {
      throw redirect(302, '/members');
    }
    
    const formData = await request.formData();
    const userId = formData.get('userId');
    
    if (!userId || typeof userId !== 'string') {
      return fail(400, { message: 'Invalid user ID' });
    }
    
    try {
      // Find the user
      const [userToUpdate] = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId));
      
      if (!userToUpdate) {
        return fail(404, { message: 'User not found' });
      }
      
      // Don't allow the last admin to remove their admin status
      if (userToUpdate.isAdmin && userId === (locals.user as User).id) {
        const adminCount = await db
          .select({ countValue: count() })
          .from(userTable)
          .where(eq(userTable.isAdmin, true));
        
        if (adminCount.length === 1 && Number(adminCount[0].countValue) === 1) {
          return fail(400, { message: 'Cannot remove admin status from the last admin' });
        }
      }
      
      // Toggle the admin status
      await db
        .update(userTable)
        .set({ isAdmin: !userToUpdate.isAdmin })
        .where(eq(userTable.id, userId));
      
      return { success: true };
    } catch (error) {
      console.error('Error toggling admin status:', error);
      return fail(500, { message: 'An error occurred while updating the user' });
    }
  }
};
