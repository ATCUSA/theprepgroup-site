<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/Header.svelte';
  import { goto } from '$app/navigation';
  
  // Use runes syntax for props
  const { data, form } = $props();
  
  let submitting = $state(false);
  let showPassword = $state(false);
  let changePassword = $state(false);
  
  // Form data
  let username = $state(data.user.username);
  let email = $state(data.user.email);
  let currentPassword = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  
  function handleSubmit() {
    submitting = true;
    return async ({ update, result }: { update: () => void; result: { type: string; data?: any } }) => {
      submitting = false;
      
      if (result.type === 'success' && result.data?.passwordChanged) {
        // If password was changed, redirect to login
        goto('/login');
        return;
      }
      
      // For other result types, let SvelteKit handle the update
      update();
    };
  }
</script>

<svelte:head>
  <title>Account Settings - The Prep Group</title>
  <meta name="description" content="Manage your account settings for The Prep Group." />
</svelte:head>

<Header title="Account Settings" subtitle="Manage Your Account" />

<section class="py-12 bg-gray-900">
  <div class="container mx-auto px-4">
    <div class="max-w-3xl mx-auto">
      <div class="bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
        <h2 class="text-2xl font-semibold mb-6 text-white">Account Information</h2>
        
        <form method="post" action="?/updateAccount" use:enhance={handleSubmit} class="space-y-6">
          <!-- Username -->
          <div>
            <label for="username" class="block text-sm font-medium text-gray-300 mb-2">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              required
              bind:value={username}
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-sm text-gray-400">Your username is used for login and is visible to other members.</p>
          </div>
          
          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              required
              bind:value={email}
              class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p class="mt-1 text-sm text-gray-400">You can use your email address to log in.</p>
          </div>
          
          <!-- Password Change Toggle -->
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="changePassword" 
              bind:checked={changePassword}
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label for="changePassword" class="ml-2 block text-sm text-gray-300">
              I want to change my password
            </label>
          </div>
          
          {#if changePassword}
            <div class="space-y-4 p-4 border border-gray-700 rounded-md bg-gray-800/50">
              <!-- Current Password -->
              <div>
                <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                <div class="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="currentPassword" 
                    name="currentPassword" 
                    required={changePassword}
                    bind:value={currentPassword}
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <!-- New Password -->
              <div>
                <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                <div class="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="newPassword" 
                    name="newPassword" 
                    required={changePassword}
                    bind:value={newPassword}
                    minlength="6"
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <p class="mt-1 text-sm text-gray-400">Password must be at least 6 characters long.</p>
              </div>
              
              <!-- Confirm New Password -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                <div class="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword" 
                    name="confirmPassword" 
                    required={changePassword}
                    bind:value={confirmPassword}
                    class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <!-- Show Password Toggle -->
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="showPassword" 
                  bind:checked={showPassword}
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                />
                <label for="showPassword" class="ml-2 block text-sm text-gray-300">
                  Show password
                </label>
              </div>
            </div>
          {/if}
          
          <!-- Form Messages -->
          {#if form?.message}
            <div class={`p-3 border rounded-md ${form.success ? 'bg-green-900/50 border-green-700' : 'bg-red-900/50 border-red-700'}`}>
              <p class={form.success ? 'text-green-200' : 'text-red-200'}>{form.message}</p>
            </div>
          {/if}
          
          <!-- Submit Button -->
          <div class="flex justify-end">
            <button 
              type="submit"
              disabled={submitting}
              class="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
      
      <!-- Account Info -->
      <div class="mt-8 bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
        <h2 class="text-2xl font-semibold mb-6 text-white">Account Details</h2>
        
        <dl class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-400">Member Since</dt>
            <dd class="mt-1 text-lg text-white">
              {new Date(data.user.createdAt).toLocaleDateString()}
            </dd>
          </div>
          
          <div>
            <dt class="text-sm font-medium text-gray-400">Account Type</dt>
            <dd class="mt-1 text-lg text-white">
              {data.user.isAdmin ? 'Administrator' : 'Member'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</section>
