import { json, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import * as auth from '$lib/server/auth';

export const POST: RequestHandler = async (event) => {
  try {
    // Get the session and user from locals
    const { session, user } = event.locals;
    
    if (session) {
      // Invalidate the current session in the database
      await auth.invalidateSession(session.id);
      
      // Optionally, uncomment this to invalidate ALL sessions for this user (logout everywhere)
      // if (user) {
      //   await auth.invalidateAllUserSessions(user.id);
      // }
    }
    
    // Delete the session cookie
    auth.deleteSessionTokenCookie(event);
    
    // Check if the request wants JSON response (from our LogoutButton component)
    const acceptHeader = event.request.headers.get('Accept');
    if (acceptHeader && acceptHeader.includes('application/json')) {
      return json({ success: true, message: 'Logged out successfully' });
    }
    
    // Otherwise redirect to the home page
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
