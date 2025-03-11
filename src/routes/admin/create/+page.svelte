<script lang="ts">
  import { enhance } from '$app/forms';
  
  let username = '';
  let password = '';
  let secretKey = '';
  let message = '';
  let success = false;
  
  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    try {
      const response = await fetch('/api/admin/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, secretKey })
      });
      
      const data = await response.json();
      message = data.message;
      success = data.success;
      
      if (success) {
        // Clear form on success
        username = '';
        password = '';
        secretKey = '';
      }
    } catch (error) {
      message = 'An error occurred while creating the admin user';
      success = false;
    }
  }
</script>

<div class="max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-lg mt-10">
  <h1 class="text-2xl font-bold text-white mb-6">Create Admin User</h1>
  
  {#if message}
    <div class={`p-4 mb-4 rounded-md ${success ? 'bg-green-800 text-green-100' : 'bg-red-800 text-red-100'}`}>
      {message}
    </div>
  {/if}
  
  <form on:submit={handleSubmit} class="space-y-4">
    <div>
      <label for="username" class="block text-sm font-medium text-gray-300">Username</label>
      <input
        type="text"
        id="username"
        bind:value={username}
        class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        minlength="3"
        maxlength="31"
        pattern="[a-z0-9_-]+"
      />
      <p class="text-xs text-gray-400 mt-1">Min 3, max 31 characters. Only lowercase letters, numbers, underscore, and hyphen.</p>
    </div>
    
    <div>
      <label for="password" class="block text-sm font-medium text-gray-300">Password</label>
      <input
        type="password"
        id="password"
        bind:value={password}
        class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
        minlength="6"
      />
      <p class="text-xs text-gray-400 mt-1">Min 6 characters</p>
    </div>
    
    <div>
      <label for="secretKey" class="block text-sm font-medium text-gray-300">Secret Key</label>
      <input
        type="password"
        id="secretKey"
        bind:value={secretKey}
        class="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <p class="text-xs text-gray-400 mt-1">Development-only secret key (use "dev-only-secret-key")</p>
    </div>
    
    <div>
      <button
        type="submit"
        class="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Create Admin User
      </button>
    </div>
  </form>
</div>
