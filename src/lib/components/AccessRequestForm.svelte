<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import StatementOfValues from './StatementOfValues.svelte';
  import type { ActionResult } from '@sveltejs/kit';
  import { env } from '$env/dynamic/private';
  
  // Define TypeScript interfaces for our data structures
  interface AccessRequestFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    birthdate: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    reason: string;
    agreeToValues: boolean;
  }
  
  interface FormStatus {
    submitting: boolean;
    success: boolean;
    error: boolean;
    message: string;
  }
  
  // Component props
  let { title = 'Request Access', isModal = false } = $props<{ title?: string, isModal?: boolean }>();
  
  // If we're in a modal, close it on successful submission
  import { closeAccessRequestModal } from '$lib/stores/modalStore';
  
  // State variables with proper typing
  let formData = $state<AccessRequestFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthdate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    reason: '',
    agreeToValues: false
  });
  
  /**
   * Reset the form data to its initial state
   */
  function resetFormData(): void {
    formData = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      birthdate: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'USA',
      reason: '',
      agreeToValues: false
    };
  }
  
  let formStatus = $state<FormStatus>({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  
  // Handle form response from server
  $effect(() => {
    const form = $page.form;
    if (form) {
      if (form.error) {
        formStatus.error = true;
        formStatus.success = false;
        formStatus.message = form.message || 'An error occurred';
      } else if (form.success) {
        formStatus.success = true;
        formStatus.error = false;
        formStatus.message = form.message || 'Form submitted successfully';
        // Reset form
        formData = {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          birthdate: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: 'USA',
          reason: '',
          agreeToValues: false
        };
      }
      formStatus.submitting = false;
    }
  });
  
  let turnstileLoaded = $state(false);
  let turnstileVerified = $state(false);
  
  // Define TypeScript interface for Turnstile window
  interface TurnstileWindow extends Window {
    turnstile?: {
      render: (container: string, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback'?: () => void;
        'error-callback'?: (error: any) => void;
      }) => string;
      reset: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string;
    };
    onloadTurnstileCallback?: () => void;
  }
  
  // Store the widget ID for later reference
  let turnstileWidgetId: string | undefined;
  
  // Load Turnstile script
  $effect(() => {
    if (typeof window !== 'undefined') {
      // Check if script is already loaded
      if (document.querySelector('script[src*="turnstile"]')) {
        turnstileLoaded = true;
        return;
      }
      
      // Define the callback function that will be called when Turnstile loads
      (window as TurnstileWindow).onloadTurnstileCallback = () => {
        console.log('Turnstile script loaded');
        turnstileLoaded = true;
      };
      
      // Create and append the script
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      
      return () => {
        if (document.querySelector('script[src*="turnstile"]')) {
          document.head.removeChild(script);
        }
        delete (window as TurnstileWindow).onloadTurnstileCallback;
      };
    }
  });
  
  /**
   * Renders the Turnstile widget when the component is mounted
   */
  function renderTurnstile(): void {
    if (typeof window !== 'undefined' && turnstileLoaded) {
      const turnstileWindow = window as TurnstileWindow;
      if (turnstileWindow.turnstile) {
        // Get the sitekey from environment variables
        const sitekey = env.PUBLIC_TURNSTILE_SITE_KEY || '';
        console.log('Rendering Turnstile widget with sitekey:', sitekey);
        
        try {
          // Use the explicit render method following Cloudflare's documentation
          turnstileWidgetId = turnstileWindow.turnstile.render('#turnstile-container', {
            sitekey: sitekey,
            callback: (token: string) => {
              console.log('Turnstile verification succeeded');
              turnstileVerified = true;
            },
            'expired-callback': () => {
              console.log('Turnstile token expired');
              turnstileVerified = false;
            },
            'error-callback': (error: any) => {
              console.error('Turnstile error:', error);
              turnstileVerified = false;
            }
          });
          
          console.log('Turnstile widget rendered with ID:', turnstileWidgetId);
        } catch (error) {
          console.error('Error rendering Turnstile:', error);
        }
      }
    }
  }
  
  // Render Turnstile when it's loaded
  $effect(() => {
    if (turnstileLoaded) {
      setTimeout(renderTurnstile, 100); // Small delay to ensure DOM is ready
    }
  });
  
  /**
   * Validates that the provided string is a 5-digit US zip code
   * @param zip - The zip code string to validate
   * @returns boolean indicating if the zip code is valid
   */
  function validateZipCode(zip: string): boolean {
    return /^\d{5}$/.test(zip);
  }
  
  /**
   * Validates the form before submission
   * @returns boolean indicating if the form is valid
   */
  function validateForm(): boolean {
    // Validate zip code
    if (!validateZipCode(formData.zipCode)) {
      formStatus.error = true;
      formStatus.message = 'Please enter a valid 5-digit zip code';
      return false;
    }
    
    // Validate agreement to values
    if (!formData.agreeToValues) {
      formStatus.error = true;
      formStatus.message = 'You must agree to our Statement of Values to join';
      return false;
    }
    
    // Validate Turnstile
    if (!turnstileVerified) {
      formStatus.error = true;
      formStatus.message = 'Please complete the Turnstile verification';
      return false;
    }
    
    return true;
  }
  
  /**
   * Get the Turnstile token from the widget
   */
  function getTurnstileToken(): string | null {
    if (typeof window !== 'undefined') {
      const turnstileWindow = window as TurnstileWindow;
      if (turnstileWindow.turnstile && turnstileWidgetId) {
        return turnstileWindow.turnstile.getResponse(turnstileWidgetId);
      }
    }
    return null;
  }
  
  /**
   * Reset the Turnstile widget
   */
  function resetTurnstile(): void {
    if (typeof window !== 'undefined') {
      const turnstileWindow = window as TurnstileWindow;
      if (turnstileWindow.turnstile && turnstileWidgetId) {
        turnstileWindow.turnstile.reset(turnstileWidgetId);
        turnstileVerified = false;
      }
    }
  }
  

</script>

<div class={title ? 'py-12 bg-gray-900' : ''}>
  <div class={title ? 'container mx-auto px-4' : ''}>
    <div class={title ? 'max-w-2xl mx-auto bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700' : ''}>
      {#if title}
        <h2 class="text-3xl font-bold mb-6 text-center text-white">{title}</h2>
      {/if}
      
      {#if formStatus.success}
        <div class="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-6" role="alert">
          <p>{formStatus.message}</p>
        </div>
      {:else}
        {#if formStatus.error}
          <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-6" role="alert">
            <p>{formStatus.message}</p>
          </div>
        {/if}
        
        <p class="mb-6 text-gray-300">
          Complete the form below to request access to our community. Once approved, you'll receive an email with instructions to set up your account.
        </p>
        
        <form
          method="POST"
          action={isModal ? "/request-access?/requestAccess" : "?/requestAccess"}
          use:enhance={({ formElement, formData, action, cancel }) => {
            // Client-side validation
            if (!validateForm()) {
              cancel();
              return;
            }
            
            // Ensure the birthdate is in the correct format (YYYY-MM-DD) before submission
            // We need to validate our component's formData, not the FormData from the form
            // The browser's FormData object doesn't have a birthdate property
            const birthdateValue = formData.get('birthdate');
            if (birthdateValue) {
              const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
              if (!dateRegex.test(birthdateValue.toString())) {
                formStatus.error = true;
                formStatus.message = 'Birth date must be in YYYY-MM-DD format';
                formStatus.submitting = false;
                cancel();
                return;
              }
            }
            
            // Set form status
            formStatus.submitting = true;
            formStatus.error = false;
            formStatus.success = false;
            
            // Get the Turnstile token
            const token = getTurnstileToken();
            if (!token) {
              formStatus.error = true;
              formStatus.message = 'Please complete the Turnstile verification';
              formStatus.submitting = false;
              cancel();
              return;
            }
            
            // Add the Turnstile token to the form data
            formData.append('cf-turnstile-response', token);
            
            return async ({ result }) => {
              console.log('Form submission result:', result);
              
              // Handle the result based on its type
              if (result.type === 'success') {
                formStatus.success = true;
                formStatus.error = false;
                formStatus.message = typeof result.data === 'object' && result.data && 'message' in result.data 
                  ? String(result.data.message) 
                  : 'Your request has been submitted successfully! An administrator will review your request and contact you soon.';
                
                // Reset the form element first
                formElement.reset();
                
                // Then manually reset our component state
                // We need to do this outside the current function to avoid TypeScript errors
                setTimeout(() => {
                  // This will run after the current function completes
                  // and avoids TypeScript errors with the FormData interface
                  resetFormData();
                }, 0);
                
                // Reset Turnstile
                resetTurnstile();
                
                // If in modal context, close the modal after a delay
                if (isModal) {
                  setTimeout(() => {
                    closeAccessRequestModal();
                  }, 3000);
                }
              } else if (result.type === 'failure') {
                formStatus.error = true;
                formStatus.success = false;
                formStatus.message = typeof result.data === 'object' && result.data && 'message' in result.data 
                  ? String(result.data.message) 
                  : 'There was an error submitting your request. Please try again.';
              } else if (result.type === 'error') {
                formStatus.error = true;
                formStatus.success = false;
                formStatus.message = 'There was an error submitting your request. Please try again.';
                console.error('Form submission error:', result);
              }
              
              // Reset form status
              formStatus.submitting = false;
            };
          }}
          class="space-y-4"
        >
          <!-- Name fields -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                bind:value={formData.firstName}
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                bind:value={formData.lastName}
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <!-- Contact Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                bind:value={formData.email}
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                bind:value={formData.phone}
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <!-- Address fields -->
          <div>
            <label for="address" class="block text-sm font-medium text-gray-300 mb-1">Street Address</label>
            <input
              type="text"
              id="address"
              name="address"
              bind:value={formData.address}
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="city" class="block text-sm font-medium text-gray-300 mb-1">City</label>
              <input
                type="text"
                id="city"
                name="city"
                bind:value={formData.city}
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-300 mb-1">State</label>
              <input
                type="text"
                id="state"
                name="state"
                bind:value={formData.state}
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label for="zipCode" class="block text-sm font-medium text-gray-300 mb-1">Zip Code</label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                bind:value={formData.zipCode}
                inputmode="numeric"
                maxlength="5"
                title="Five digit zip code"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label for="country" class="block text-sm font-medium text-gray-300 mb-1">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              bind:value={formData.country}
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <!-- Reason field -->
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-300 mb-1">Why are you interested in joining?</label>
            <textarea
              id="reason"
              name="reason"
              bind:value={formData.reason}
              rows="4"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          
          <!-- Statement of Values -->
          <div class="mb-6">
            <h3 class="text-lg font-medium text-white mb-3">Our Statement of Values</h3>
            <p class="text-gray-300 mb-3">Please review our Statement of Values. By requesting access, you agree to uphold these values as a member of our community:</p>
            <StatementOfValues compactMode={true} showTitle={false} />
            
            <div class="mt-4">
              <label class="flex items-start cursor-pointer">
                <input 
                  type="checkbox" 
                  name="agreeToValues"
                  bind:checked={formData.agreeToValues}
                  required
                  class="mt-1 h-4 w-4 text-blue-600 rounded focus:ring-blue-500 bg-gray-700 border-gray-600"
                />
                <span class="ml-2 text-gray-300">I agree to uphold these values as a member of The Prep Group community</span>
              </label>
            </div>
          </div>
          
          <div class="mb-4">
            {#if turnstileLoaded}
              <div id="turnstile-container" class="flex justify-center"></div>
            {:else}
              <div class="h-[65px] bg-gray-700 rounded flex items-center justify-center">
                <p class="text-gray-300">Loading verification...</p>
              </div>
            {/if}
          </div>
          
          <div>
            <button
              type="submit"
              disabled={formStatus.submitting}
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {formStatus.submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      {/if}
    </div>
  </div>
</div>

<svelte:head>
  <script>
    // This global function will be defined by the component
    // but needs to be declared here for TypeScript
    window.onloadTurnstileCallback = window.onloadTurnstileCallback || function() {};
  </script>
</svelte:head>
