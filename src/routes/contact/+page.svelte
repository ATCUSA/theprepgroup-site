<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import { openAccessRequestModal } from '$lib/stores/modalStore';
  
  // Form data
  let formData = $state({
    name: '',
    email: '',
    message: ''
  });
  
  // Form status
  let formStatus = $state({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  
  /**
   * Handle form submission
   */
  function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      formStatus.error = true;
      formStatus.message = 'Please fill out all fields';
      return;
    }
    
    formStatus.submitting = true;
    formStatus.error = false;
    formStatus.success = false;
    
    // Get the Formspree ID from environment variables
    const formspreeId = import.meta.env.PUBLIC_FORMSPREE_FORM_ID || 'meoaqqbl';
    
    // Submit to Formspree
    fetch(`https://formspree.io/f/${formspreeId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        subject: 'Contact Form Submission - The Prep Group'
      })
    })
    .then(response => response.json())
    .then(result => {
      if (result.ok || result.success) {
        formStatus.success = true;
        formStatus.message = 'Your message has been sent successfully!';
        
        // Reset form
        formData = {
          name: '',
          email: '',
          message: ''
        };
      } else {
        throw new Error('Form submission failed');
      }
    })
    .catch(error => {
      formStatus.error = true;
      formStatus.message = 'There was an error sending your message. Please try again.';
      console.error('Form submission error:', error);
    })
    .finally(() => {
      formStatus.submitting = false;
    });
  }
</script>

<svelte:head>
  <title>Contact - The Prep Group</title>
  <meta name="description" content="Get in touch with The Prep Group. Contact us for general inquiries or information about our community." />
</svelte:head>

<Header />

<main>
  <section class="py-16 bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <h1 class="text-4xl font-bold mb-8 text-white">Contact Us</h1>
        
        <div class="max-w-2xl mx-auto mb-12">
          <!-- Contact Form -->
          <div class="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
            <h2 class="text-2xl font-semibold mb-6 text-white">Send Us a Message</h2>
            
            {#if formStatus.success}
              <div class="bg-green-900 border border-green-600 text-green-200 px-6 py-4 rounded-lg mb-6" role="alert">
                <p class="text-center">{formStatus.message}</p>
              </div>
            {:else}
              {#if formStatus.error}
                <div class="bg-red-900 border border-red-600 text-red-200 px-6 py-4 rounded-lg mb-6" role="alert">
                  <p class="text-center">{formStatus.message}</p>
                </div>
              {/if}
              
              <form onsubmit={handleSubmit} class="space-y-6">
                <div>
                  <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    bind:value={formData.name}
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    bind:value={formData.email}
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label for="message" class="block text-sm font-medium text-gray-300 mb-2">Message</label>
                  <textarea
                    id="message"
                    bind:value={formData.message}
                    rows="6"
                    required
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                
                <div class="pt-4">
                  <button
                    type="submit"
                    disabled={formStatus.submitting}
                    class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {formStatus.submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            {/if}
          </div>
        </div>
        

      </div>
    </div>
  </section>
</main>
