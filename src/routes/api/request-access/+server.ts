import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { query, getUserByEmail, getAccessRequestByEmail, createAccessRequest } from '$lib/server/db';
import { env } from '$env/dynamic/private';

// Define interface for request body
interface RequestBody {
  name: string;
  email: string;
  zipCode: string;
  reason: string;
  agreeToValues: boolean;
  'cf-turnstile-response': string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    // Parse the request body
    const data: RequestBody = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.zipCode || !data.reason || !data.agreeToValues) {
      return json({ success: false, message: 'All fields are required' }, { status: 400 });
    }
    
    // Validate Turnstile token
    if (!data['cf-turnstile-response']) {
      return json({ success: false, message: 'Turnstile verification is required' }, { status: 400 });
    }
    
    // Verify Turnstile token with Cloudflare
    const turnstileVerified = await verifyTurnstileToken(data['cf-turnstile-response']);
    if (!turnstileVerified) {
      return json({ success: false, message: 'Turnstile verification failed' }, { status: 400 });
    }
    
    // Check if user already exists in neon_auth.users_sync
    const existingUser = await getUserByEmail(data.email);
    
    if (existingUser) {
      return json({ 
        success: false, 
        message: 'An account with this email already exists. Please login or reset your password.' 
      }, { status: 400 });
    }
    
    // Check if there's already a pending request for this email
    const existingRequest = await getAccessRequestByEmail(data.email);
    
    if (existingRequest && existingRequest.status === 'pending') {
      return json({ 
        success: false, 
        message: 'You already have a pending access request. An administrator will review it soon.' 
      }, { status: 400 });
    }
    
    // Store the access request in the access_requests table for admin approval
    const accessRequest = await createAccessRequest(
      data.name,
      data.email,
      data.zipCode,
      data.reason,
      data.agreeToValues
    );
    
    if (!accessRequest) {
      return json({ 
        success: false, 
        message: 'Failed to create access request. Please try again later.' 
      }, { status: 500 });
    }
    
    // Also submit to Formspree as a backup
    if (env.PUBLIC_FORMSPREE_FORM_ID) {
      try {
        await fetch(`https://formspree.io/f/${env.PUBLIC_FORMSPREE_FORM_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(data)
        });
      } catch (error) {
        console.error('Error submitting to Formspree:', error);
        // Continue processing even if Formspree fails
      }
    }
    
    return json({
      success: true,
      message: 'Your access request has been submitted successfully. An administrator will review your request and contact you soon.'
    });
  } catch (error) {
    console.error('Error processing access request:', error);
    return json({ 
      success: false, 
      message: 'An error occurred while processing your request. Please try again later.' 
    }, { status: 500 });
  }
};

/**
 * Verify Turnstile token with Cloudflare
 */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        response: token,
        secret: env.TURNSTILE_SECRET_KEY
      })
    });
    
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Error verifying Turnstile token:', error);
    return false;
  }
}
