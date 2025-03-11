import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
  try {
    // Clear the session cookie
    event.cookies.delete('session', {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: import.meta.env.PROD // Use SvelteKit's env variable for production mode
    });
    
    // Redirect to the home page
    throw redirect(302, '/');
  } catch (error) {
    if (error instanceof Response) {
      // This is a redirect response, just pass it through
      throw error;
    }
    
    console.error('Logout error:', error);
    return json({ success: false, error: 'Failed to sign out' }, { status: 500 });
  }
};
