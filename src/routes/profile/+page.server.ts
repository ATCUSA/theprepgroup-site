import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/expressions';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Get the user profile
  const [profile] = await db
    .select()
    .from(schema.userProfile)
    .where(eq(schema.userProfile.userId, locals.user.id));
  
  return {
    user: locals.user,
    profile
  };
};

export const actions: Actions = {
  updateProfile: async ({ request, locals }) => {
    // Check if user is authenticated
    if (!locals.user) {
      throw redirect(302, '/login');
    }
    
    const data = await request.formData();
    
    // Extract profile data from form
    const firstName = data.get('firstName')?.toString() || null;
    const lastName = data.get('lastName')?.toString() || null;
    const phone = data.get('phone')?.toString() || null;
    const address = data.get('address')?.toString() || null;
    const city = data.get('city')?.toString() || null;
    const state = data.get('state')?.toString() || null;
    const zip = data.get('zip')?.toString() || null;
    const country = data.get('country')?.toString() || null;
    const bio = data.get('bio')?.toString() || null;
    const showInDirectory = data.get('showInDirectory') === 'on' || false;
    
    // Extract directory preferences
    const directoryPreferences = {
      showEmail: data.get('directoryPreferences.showEmail') === 'on',
      showPhone: data.get('directoryPreferences.showPhone') === 'on',
      showAddress: data.get('directoryPreferences.showAddress') === 'on',
      showBio: data.get('directoryPreferences.showBio') === 'on'
    };
    
    try {
      // Get the user profile
      const [profile] = await db
        .select()
        .from(schema.userProfile)
        .where(eq(schema.userProfile.userId, locals.user.id));
      
      if (profile) {
        // Update existing profile
        await db.update(schema.userProfile)
          .set({
            firstName,
            lastName,
            phone,
            address,
            city,
            state,
            zip,
            country,
            bio,
            showInDirectory,
            directoryPreferences,
            updatedAt: new Date()
          })
          .where(eq(schema.userProfile.id, profile.id));
      } else {
        // Create new profile if it doesn't exist
        await db.insert(schema.userProfile).values({
          id: crypto.randomUUID(),
          userId: locals.user.id,
          firstName,
          lastName,
          phone,
          address,
          city,
          state,
          zip,
          country,
          bio,
          showInDirectory,
          directoryPreferences,
          updatedAt: new Date()
        });
      }
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return fail(500, {
        success: false,
        message: 'An error occurred while updating your profile'
      });
    }
  }
};
