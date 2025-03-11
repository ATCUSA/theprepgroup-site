import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    // Redirect unauthenticated users to the login page
    throw redirect(302, '/login');
  }

  // User is authenticated, return any data needed for the members page
  return {
    user: locals.user
  };
};
