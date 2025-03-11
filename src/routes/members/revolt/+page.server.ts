import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is authenticated
  if (!locals.user) {
    throw redirect(302, '/login');
  }
  
  return {
    user: locals.user,
    revoltServerUrl: 'https://chat.theprepgroup.us'
  };
};
