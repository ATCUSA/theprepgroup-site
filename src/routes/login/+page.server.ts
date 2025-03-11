import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { query, getUserByEmail, stackAuth } from '$lib/server/db/index.js';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
  // Check if user is already authenticated
  if (locals.user) {
    // If user is already logged in, redirect to members page
    return redirect(302, '/members');
  }
  
  return {};
};

export const actions: Actions = {
  login: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) {
      return fail(400, {
        message: 'Please enter a valid email address'
      });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password (min 6 characters)' });
    }

    try {
      // Using Stack Auth with Neon Auth integration
      // First, check if the user exists in the neon_auth.users_sync table
      const user = await getUserByEmail(email as string);
      
      if (!user) {
        return fail(400, { message: 'User not found' });
      }
      
      // In a real implementation, we would verify the password against Stack Auth
      // For now, we're using a simplified approach where we just check if the user exists
      // In production, you would use Stack Auth's API to verify credentials
      
      // Simulate a password verification with Stack Auth
      // This is where you would normally call Stack Auth's API to verify the password
      const isValidPassword = password === 'password123'; // Replace with actual Stack Auth verification
      
      if (!isValidPassword) {
        return fail(400, { message: 'Invalid password' });
      }
      
      // Set a session cookie with Stack Auth user ID
      event.cookies.set('session', user.id, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD, // Use SvelteKit's env variable for production mode
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      // Store additional user information in the session if needed
      event.cookies.set('user_email', user.email, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: import.meta.env.PROD,
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });
      
      // Redirect to members area
      return redirect(302, '/members');
    } catch (error) {
      console.error('Login error:', error);
      return fail(500, { message: 'An error occurred during login' });
    }
  }
};

function validateEmail(email: unknown): email is string {
  return (
    typeof email === 'string' &&
    email.length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  );
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6;
}
