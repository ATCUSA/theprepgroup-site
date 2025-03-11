import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
  // Only allow access in development mode
  if (import.meta.env.PROD) {
    throw redirect(302, '/');
  }
  
  return {};
};
