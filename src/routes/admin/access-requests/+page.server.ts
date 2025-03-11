import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and, ne, isNotNull, sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated and is an admin
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  if (!locals.user.isAdmin) {
    throw redirect(302, '/members');
  }
  
  // Get all pending access requests
  const pendingRequests = await db
    .select()
    .from(schema.accessRequest)
    .where(eq(schema.accessRequest.status, 'pending'));
  
  // Get all approved and rejected requests for history
  const processedRequests = await db
    .select()
    .from(schema.accessRequest)
    .where(and(
      ne(schema.accessRequest.status, 'pending'),
      isNotNull(schema.accessRequest.processedAt)
    ))
    .orderBy(schema.accessRequest.processedAt);
  
  return {
    pendingRequests,
    processedRequests
  };
};

export const actions: Actions = {
  approve: async ({ request, locals }) => {
    // Check if user is authenticated and is an admin
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    if (!locals.user.isAdmin) {
      throw redirect(302, '/members');
    }
    
    const data = await request.formData();
    const requestId = data.get('requestId')?.toString();
    const username = data.get('username')?.toString();
    const password = data.get('password')?.toString();
    const notes = data.get('notes')?.toString() || '';
    
    if (!requestId) {
      return fail(400, { success: false, message: 'Request ID is required' });
    }
    
    if (!username || !password) {
      return fail(400, { success: false, message: 'Username and password are required' });
    }
    
    try {
      // Get the access request
      const [accessRequest] = await db
        .select()
        .from(schema.accessRequest)
        .where(eq(schema.accessRequest.id, requestId));
      
      if (!accessRequest) {
        return fail(404, { success: false, message: 'Access request not found' });
      }
      
      // Check if username is already taken
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.username, username))
        .limit(1);
      
      if (existingUser.length > 0) {
        return fail(400, { success: false, message: 'Username is already taken' });
      }
      
      // Hash the password
      const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(password)));
      
      // Create a new user from the access request
      const userId = uuidv4();
      
      // Since we're making birthdate optional for the user profile, we'll just skip it here
      // This will allow the user to be created without a birthdate
      
      // Insert the new user without the birthdate field
      await db.insert(schema.user).values({
        id: userId,
        username,
        passwordHash,
        email: accessRequest.email,
        isAdmin: false,
        createdAt: new Date()
      });
      
      // Create user profile
      const profileId = uuidv4();
      await db.insert(schema.userProfile).values({
        id: profileId,
        userId,
        firstName: accessRequest.firstName,
        lastName: accessRequest.lastName,
        phone: accessRequest.phone,
        address: accessRequest.address,
        city: accessRequest.city,
        state: accessRequest.state,
        zip: accessRequest.zipCode,
        country: accessRequest.country,
        showInDirectory: false,
        directoryPreferences: {},
        updatedAt: new Date()
      });
      
      // Update the access request status to approved
      await db.update(schema.accessRequest)
        .set({
          status: 'approved',
          processedAt: new Date(),
          processedBy: locals.user.id,
          notes
        })
        .where(eq(schema.accessRequest.id, requestId));
      
      // In a real application, you would send a welcome email with login instructions
      
      return { 
        success: true, 
        message: `Access request for ${accessRequest.email} has been approved and user account created` 
      };
    } catch (error) {
      console.error('Error approving access request:', error);
      return fail(500, { 
        success: false, 
        message: 'An error occurred while approving the access request' 
      });
    }
  },
  
  reject: async ({ request, locals }) => {
    // Check if user is authenticated and is an admin
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    if (!locals.user.isAdmin) {
      throw redirect(302, '/members');
    }
    
    const data = await request.formData();
    const requestId = data.get('requestId')?.toString();
    const notes = data.get('notes')?.toString() || '';
    
    if (!requestId) {
      return fail(400, { success: false, message: 'Request ID is required' });
    }
    
    try {
      // Get the access request
      const [accessRequest] = await db
        .select()
        .from(schema.accessRequest)
        .where(eq(schema.accessRequest.id, requestId));
      
      if (!accessRequest) {
        return fail(404, { success: false, message: 'Access request not found' });
      }
      
      // Update the access request status to rejected
      await db.update(schema.accessRequest)
        .set({
          status: 'rejected',
          processedAt: new Date(),
          processedBy: locals.user.id,
          notes
        })
        .where(eq(schema.accessRequest.id, requestId));
      
      // In a real application, you would send a rejection email
      
      return { 
        success: true, 
        message: `Access request for ${accessRequest.email} has been rejected` 
      };
    } catch (error) {
      console.error('Error rejecting access request:', error);
      return { 
        success: false, 
        message: 'An error occurred while rejecting the access request' 
      };
    }
  }
};
