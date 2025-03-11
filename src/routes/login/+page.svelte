<script lang="ts">
  import { enhance } from '$app/forms';
  import Header from '$lib/components/Header.svelte';
  import type { ActionData } from './$types';

  let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
  <title>Member Login - The Prep Group</title>
  <meta name="description" content="Login to access members-only resources for The Prep Group community." />
</svelte:head>

<Header title="Member Login" subtitle="Access Members-Only Resources" />

<section class="py-12 bg-gray-900">
  <div class="container mx-auto px-4">
    <div class="max-w-md mx-auto bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
      <h2 class="text-2xl font-semibold mb-6 text-white">Login to Your Account</h2>
      
      <form method="post" action="?/login" use:enhance class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required
            autocomplete="email"
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required
            class="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {#if form?.message}
          <div class="p-3 bg-red-900/50 border border-red-700 rounded-md">
            <p class="text-red-200">{form.message}</p>
          </div>
        {/if}
        
        <div>
          <button 
            type="submit"
            class="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
          >
            Login
          </button>
        </div>
        
        <div class="text-center">
          <p class="text-gray-400 text-sm">
            Don't have an account? <a href="/about" class="text-blue-400 hover:underline">Request access</a> to join our community.
          </p>
        </div>
      </form>
    </div>
  </div>
</section>
