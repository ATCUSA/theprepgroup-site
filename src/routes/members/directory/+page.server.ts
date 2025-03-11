import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm/expressions';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  // Get all users who have opted to be in the directory
  const profiles = await db
    .select({
      id: schema.userProfile.id,
      firstName: schema.userProfile.firstName,
      lastName: schema.userProfile.lastName,
      email: schema.user.email,
      phone: schema.userProfile.phone,
      address: schema.userProfile.address,
      city: schema.userProfile.city,
      state: schema.userProfile.state,
      zip: schema.userProfile.zip,
      country: schema.userProfile.country,
      bio: schema.userProfile.bio,
      directoryPreferences: schema.userProfile.directoryPreferences
    })
    .from(schema.userProfile)
    .innerJoin(schema.user, eq(schema.userProfile.userId, schema.user.id))
    .where(eq(schema.userProfile.showInDirectory, true));
  
  return {
    members: profiles,
    user: locals.user
  };
};
