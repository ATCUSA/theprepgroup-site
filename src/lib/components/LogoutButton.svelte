<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // State variables
  let isLoggingOut = $state(false);
  let logoutError = $state('');
  
  // Reset any errors when the component mounts
  onMount(() => {
    logoutError = '';
  });

  async function handleLogout() {
    try {
      // Reset error state and set loading state
      logoutError = '';
      isLoggingOut = true;
      console.log('Logging out...');
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // If the response is a redirect, handle it client-side
      if (response.redirected) {
        console.log('Redirect received, navigating to:', response.url);
        window.location.href = response.url; // Use window.location for a hard redirect
      } else if (response.ok) {
        // If it's not a redirect but successful, go to home page
        console.log('Logout successful, navigating to home page');
        // Clear any auth-related data from localStorage if you're using it
        localStorage.removeItem('user');
        
        // Use window.location for a hard redirect that will definitely work
        window.location.href = '/';
      } else {
        // Handle error response
        const errorText = await response.text();
        console.error('Logout failed:', errorText);
        logoutError = 'Failed to log out. Please try again.';
      }
    } catch (error) {
      console.error('Error during logout:', error);
      logoutError = 'Network error during logout. Please try again.';
    } finally {
      isLoggingOut = false;
    }
  }
</script>

<button 
  onclick={handleLogout}
  disabled={isLoggingOut}
  class="px-4 py-2 {isLoggingOut ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'} text-white font-medium rounded-md transition duration-200"
>
  {#if isLoggingOut}
    Logging out...
  {:else}
    Logout
  {/if}
</button>

{#if logoutError}
  <div class="mt-2 text-red-500 text-sm">{logoutError}</div>
{/if}
