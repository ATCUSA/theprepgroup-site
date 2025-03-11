import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Define the type for the form data
interface AccessRequestForm {
  name: string;
  email: string;
  zipCode: string;
  reason: string;
  'cf-turnstile-response': string;
}

// Define the type for the Turnstile verification response
interface TurnstileResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

export const load: PageServerLoad = async () => {
  return {};
};

export const actions: Actions = {
  default: async ({ request, fetch }) => {
    // Get form data
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const zipCode = formData.get('zipCode') as string;
    const reason = formData.get('reason') as string;
    const turnstileResponse = formData.get('cf-turnstile-response') as string;

    // Validate required fields
    if (!name || !email || !zipCode || !reason) {
      return fail(400, {
        error: true,
        message: 'All fields are required',
        data: { name, email, zipCode, reason }
      });
    }

    // Validate zip code
    if (!/^\d{5}$/.test(zipCode)) {
      return fail(400, {
        error: true,
        message: 'Please enter a valid 5-digit zip code',
        data: { name, email, zipCode, reason }
      });
    }

    // Validate Turnstile token
    if (!turnstileResponse) {
      return fail(400, {
        error: true,
        message: 'Please complete the Turnstile verification',
        data: { name, email, zipCode, reason }
      });
    }

    // Verify Turnstile token with Cloudflare
    const turnstileSecretKey = import.meta.env.TURNSTILE_SECRET_KEY || ''; // Get secret key from environment variable
    const turnstileVerification = await verifyTurnstileToken(turnstileResponse, turnstileSecretKey);

    if (!turnstileVerification.success) {
      console.error('Turnstile verification failed:', turnstileVerification['error-codes']);
      return fail(400, {
        error: true,
        message: 'Turnstile verification failed. Please try again.',
        data: { name, email, zipCode, reason }
      });
    }

    // Submit to Formspree
    const formspreeId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID || '';
    try {
      const formspreeResponse = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          zipCode,
          reason
        })
      });

      if (!formspreeResponse.ok) {
        throw new Error('Form submission failed');
      }

      // Return success
      return {
        success: true,
        message: 'Your request has been submitted successfully!'
      };
    } catch (error) {
      console.error('Form submission error:', error);
      return fail(500, {
        error: true,
        message: 'There was an error submitting your request. Please try again later.',
        data: { name, email, zipCode, reason }
      });
    }
  }
};

/**
 * Verifies a Turnstile token with Cloudflare
 * @param token - The Turnstile token to verify
 * @param secret - The Turnstile secret key
 * @returns The verification response from Cloudflare
 */
async function verifyTurnstileToken(token: string, secret: string): Promise<TurnstileResponse> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        secret,
        response: token
      })
    });

    return await response.json() as TurnstileResponse;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return { success: false, 'error-codes': ['verification-failed'] };
  }
}
