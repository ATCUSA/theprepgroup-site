import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';
import { sql } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

export const actions: Actions = {
  requestAccess: async ({ request }) => {
    try {
      const formData = await request.formData();
      
      // Extract form data
      const firstName = formData.get('firstName')?.toString();
      const lastName = formData.get('lastName')?.toString();
      const email = formData.get('email')?.toString();
      const phone = formData.get('phone')?.toString();
      // Birthdate field removed
      const address = formData.get('address')?.toString();
      const city = formData.get('city')?.toString();
      const state = formData.get('state')?.toString();
      const zipCode = formData.get('zipCode')?.toString();
      const country = formData.get('country')?.toString();
      const reason = formData.get('reason')?.toString();
      
      // Validate required fields
      if (!firstName || !lastName || !email) {
        return fail(400, {
          error: true,
          message: 'First name, last name, and email are required'
        });
      }
      
      // Check if email already exists in access requests
      const existingRequest = await db
        .select()
        .from(schema.accessRequest)
        .where(eq(schema.accessRequest.email, email))
        .limit(1);
      
      if (existingRequest.length > 0) {
        return fail(400, {
          error: true,
          message: 'An access request with this email already exists'
        });
      }
      
      // Check if email already exists in users
      const existingUser = await db
        .select()
        .from(schema.user)
        .where(eq(schema.user.email, email))
        .limit(1);
      
      if (existingUser.length > 0) {
        return fail(400, {
          error: true,
          message: 'An account with this email already exists. Please log in or reset your password.'
        });
      }
      
      // Create access request
      const requestId = uuidv4();
      
      // Birthdate field has been removed from the schema
      
      await db.insert(schema.accessRequest).values({
        id: requestId,
        firstName,
        lastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        country: country || null,
        reason: reason || null,
        status: 'pending',
        createdAt: new Date()
      });
      
      return {
        success: true,
        message: 'Your access request has been submitted successfully! An administrator will review your request and contact you soon.'
      };
    } catch (error) {
      console.error('Error submitting access request:', error);
      return fail(500, {
        error: true,
        message: 'An error occurred while submitting your request. Please try again later.'
      });
    }
  }
};
