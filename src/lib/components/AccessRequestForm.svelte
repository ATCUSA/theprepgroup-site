<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import StatementOfValues from './StatementOfValues.svelte';
  
  // Define TypeScript interfaces for our data structures
  interface FormData {
    name: string;
    email: string;
    zipCode: string;
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
  let formData = $state<FormData>({
    name: '',
    email: '',
    zipCode: '',
    reason: '',
    agreeToValues: false
  });
  
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
          name: '',
          email: '',
          zipCode: '',
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
        const sitekey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';
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
  
  /**
   * Handle form submission
   */
  function handleSubmit(event: SubmitEvent) {
    // Prevent default form submission
    event.preventDefault();
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }
    
    formStatus.submitting = true;
    formStatus.error = false;
    formStatus.success = false;
    
    // Get the Turnstile token
    const token = getTurnstileToken();
    if (!token) {
      formStatus.error = true;
      formStatus.message = 'Please complete the Turnstile verification';
      formStatus.submitting = false;
      return;
    }
    
    // Create request data for our API
    const requestData = {
      name: formData.name,
      email: formData.email,
      zipCode: formData.zipCode,
      reason: formData.reason,
      agreeToValues: formData.agreeToValues,
      'cf-turnstile-response': token // Include the Turnstile token
    };
    
    // Submit to our API endpoint for Stack Auth integration
    fetch('/api/request-access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        formStatus.success = true;
        formStatus.message = result.message || 'Your request has been submitted successfully! An administrator will review your request and contact you soon.';
        
        // If in modal context, close the modal after a delay
        if (isModal) {
          setTimeout(() => {
            closeAccessRequestModal();
          }, 3000);
        }
        
        // Reset form
        formData = {
          name: '',
          email: '',
          zipCode: '',
          reason: '',
          agreeToValues: false
        };
        
        // Reset Turnstile
        resetTurnstile();
      } else {
        formStatus.error = true;
        formStatus.message = result.message || 'There was an error submitting your request. Please try again.';
      }
    })
    .catch(error => {
      formStatus.error = true;
      formStatus.message = 'There was an error submitting your request. Please try again.';
      console.error('Form submission error:', error);
    })
    .finally(() => {
      formStatus.submitting = false;
    });
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
          Since our community is focused on local support and resources, we ask for your zip code to ensure you're in our service area. Complete the form below to request access to our community. Once approved, you'll receive an email with instructions to set up your account.
        </p>
        
        <form method="POST" onsubmit={handleSubmit} class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              required
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="zipCode" class="block text-sm font-medium text-gray-300 mb-1">Zip Code</label>
            <input
              type="text"
              id="zipCode"
              bind:value={formData.zipCode}
              required
              inputmode="numeric"
              maxlength="5"
              title="Five digit zip code"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label for="reason" class="block text-sm font-medium text-gray-300 mb-1">Why are you interested in joining?</label>
            <textarea
              id="reason"
              bind:value={formData.reason}
              rows="4"
              required
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
                  bind:checked={formData.agreeToValues}
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
