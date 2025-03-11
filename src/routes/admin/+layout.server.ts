import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/server/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
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
  
  return {
    user: locals.user
  };
};
