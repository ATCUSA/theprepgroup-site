<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  
  // We don't actually use the data in this component, but we need to keep the export
  // to maintain the component contract
  export let data: PageData;
  
  let formStatus = {
    success: false,
    error: false,
    message: ''
  };
  
  let formData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Client-side validation
  let passwordsMatch = true;
  let passwordStrong = true;
  
  $: {
    passwordsMatch = formData.newPassword === formData.confirmPassword;
    passwordStrong = formData.newPassword.length >= 8;
  }
  
  function validateForm() {
    if (!formData.currentPassword) {
      formStatus.error = true;
      formStatus.message = 'Current password is required';
      return false;
    }
    
    if (!formData.newPassword) {
      formStatus.error = true;
      formStatus.message = 'New password is required';
      return false;
    }
    
    if (formData.newPassword.length < 8) {
      formStatus.error = true;
      formStatus.message = 'Password must be at least 8 characters long';
      return false;
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      formStatus.error = true;
      formStatus.message = 'Passwords do not match';
      return false;
    }
    
    return true;
  }
</script>

<svelte:head>
  <title>Change Password | The Prep Group</title>
</svelte:head>

<div class="max-w-md mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-100 mb-6">Change Password</h1>
  
  <div class="bg-gray-800 rounded-lg shadow-lg p-6">
    {#if formStatus.success}
      <div class="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-4" role="alert">
        <p>{formStatus.message}</p>
      </div>
    {/if}
    
    {#if formStatus.error}
      <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4" role="alert">
        <p>{formStatus.message}</p>
      </div>
    {/if}
    
    <form method="POST" action="?/changePassword" use:enhance={() => {
      // Reset form status
      formStatus.success = false;
      formStatus.error = false;
      formStatus.message = '';
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      return async ({ result }) => {
        if (result.type === 'success') {
          formStatus.success = true;
          formStatus.message = 'Password changed successfully';
          
          // Clear form
          formData.currentPassword = '';
          formData.newPassword = '';
          formData.confirmPassword = '';
        } else {
          formStatus.error = true;
          formStatus.message = result.type === 'failure' 
            ? (result.data?.message as string) || 'Failed to change password' 
            : 'An error occurred';
        }
      };
    }}>
      <div class="mb-4">
        <label for="currentPassword" class="block text-sm font-medium text-gray-300 mb-1">
          Current Password <span class="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="currentPassword"
          name="currentPassword"
          bind:value={formData.currentPassword}
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div class="mb-4">
        <label for="newPassword" class="block text-sm font-medium text-gray-300 mb-1">
          New Password <span class="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          bind:value={formData.newPassword}
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {#if !passwordStrong && formData.newPassword}
          <p class="text-red-400 text-sm mt-1">Password must be at least 8 characters long</p>
        {/if}
      </div>
      
      <div class="mb-6">
        <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-1">
          Confirm New Password <span class="text-red-500">*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          bind:value={formData.confirmPassword}
          required
          class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {#if !passwordsMatch && formData.confirmPassword}
          <p class="text-red-400 text-sm mt-1">Passwords do not match</p>
        {/if}
      </div>
      
      <div class="flex justify-between items-center">
        <a href="/profile" class="text-blue-400 hover:text-blue-300 text-sm">
          Back to Profile
        </a>
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
          disabled={!passwordsMatch || !passwordStrong}
        >
          Change Password
        </button>
      </div>
    </form>
  </div>
</div>
