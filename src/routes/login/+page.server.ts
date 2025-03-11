import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import * as schema from '$lib/server/db/schema';
import * as auth from '$lib/server/auth';
import { eq, or } from 'drizzle-orm';
import { sha256 } from '@oslojs/crypto/sha2';
import { encodeHexLowerCase } from '@oslojs/encoding';

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
    const usernameOrEmail = formData.get('username');
    const password = formData.get('password');

    if (!validateUsernameOrEmail(usernameOrEmail)) {
      return fail(400, {
        message: 'Please enter a valid username or email'
      });
    }
    if (!validatePassword(password)) {
      return fail(400, { message: 'Invalid password (min 6 characters)' });
    }

    try {
      // Find the user by username or email
      const [user] = await db
        .select()
        .from(schema.user)
        .where(
          or(
            eq(schema.user.username, usernameOrEmail as string),
            eq(schema.user.email, usernameOrEmail as string)
          )
        )
        .limit(1);
      
      if (!user) {
        return fail(400, { message: 'User not found' });
      }
      
      // Hash the password for comparison
      const passwordHash = encodeHexLowerCase(sha256(new TextEncoder().encode(password as string)));
      
      // Verify the password
      const passwordMatch = passwordHash === user.passwordHash;
      
      if (!passwordMatch) {
        return fail(400, { message: 'Invalid password' });
      }
      
      // Create a session for the user
      const sessionToken = auth.generateSessionToken();
      const session = await auth.createSession(sessionToken, user.id);
      
      // Set the session cookie
      auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
      
      // Use a direct redirect approach
      throw redirect(303, user.isAdmin ? '/admin' : '/members');
    } catch (error) {
      // Check if this is a redirect response
      if (error instanceof Response) {
        // This is a redirect, just pass it through
        throw error;
      }
      
      console.error('Login error:', error);
      return fail(500, { message: 'An error occurred during login. Please try again.' });
    }
  }
};

function validateUsernameOrEmail(usernameOrEmail: unknown): usernameOrEmail is string {
  return (
    typeof usernameOrEmail === 'string' &&
    usernameOrEmail.length > 0
  );
}

function validatePassword(password: unknown): password is string {
  return typeof password === 'string' && password.length >= 6;
}
