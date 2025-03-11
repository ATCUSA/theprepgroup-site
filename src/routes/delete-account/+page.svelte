<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  
  // We need to keep this export for SvelteKit's component contract
  // even though we don't use it in this component
  export let data: PageData;
  
  let confirmDelete = false;
  let password = '';
  let errorMessage = '';
  
  function validateForm() {
    if (!password) {
      errorMessage = 'Please enter your password to confirm account deletion';
      return false;
    }
    
    if (!confirmDelete) {
      errorMessage = 'Please confirm that you want to delete your account';
      return false;
    }
    
    return true;
  }
</script>

<svelte:head>
  <title>Delete Account | The Prep Group</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-100 mb-6">Delete Account</h1>
  
  <div class="bg-gray-800 rounded-lg shadow-lg p-6">
    <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-6" role="alert">
      <p class="font-bold">Warning: This action cannot be undone</p>
      <p class="mt-2">Deleting your account will permanently remove all your data from our system, including:</p>
      <ul class="list-disc list-inside mt-2 ml-2">
        <li>Your profile information</li>
        <li>Your membership status</li>
        <li>Your access to member resources</li>
      </ul>
    </div>
    
    {#if errorMessage}
      <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4" role="alert">
        <p>{errorMessage}</p>
      </div>
    {/if}
    
    <form method="POST" action="?/deleteAccount" use:enhance={() => {
      // Reset error message
      errorMessage = '';
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      return async ({ result }) => {
        if (result.type === 'redirect') {
          // Account deleted successfully, will redirect to home page
        } else if (result.type === 'failure') {
          errorMessage = (result.data?.message as string) || 'Failed to delete account';
        } else {
          errorMessage = 'An error occurred';
        }
      };
    }}>
      <div class="mb-4">
        <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
          Enter your password to confirm <span class="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          bind:value={password}
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div class="mb-6">
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:checked={confirmDelete}
            name="confirmDelete"
            class="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-600 rounded bg-gray-700"
          />
          <span class="ml-2 text-gray-300">I understand that this action cannot be undone</span>
        </label>
      </div>
      
      <div class="flex justify-between items-center">
        <a href="/profile" class="text-blue-400 hover:text-blue-300 text-sm">
          Back to Profile
        </a>
        <button
          type="submit"
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition"
          disabled={!confirmDelete || !password}
        >
          Delete Account
        </button>
      </div>
    </form>
  </div>
</div>
