<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import MembersSection from '$lib/components/MembersSection.svelte';
  import { enhance } from '$app/forms';
  
  // Get the data from the server
  export let data;
  const { user } = data;
</script>

<svelte:head>
  <title>Members Area - The Prep Group</title>
  <meta name="description" content="Members-only resources for The Prep Group community." />
</svelte:head>

<Header title="Members Area" subtitle="Exclusive Resources for Our Community" />

<section class="py-8 bg-gray-900">
  <div class="container mx-auto px-4">
    <div class="bg-gray-800 rounded-lg shadow-md p-6 border border-gray-700 mb-8">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-xl font-semibold text-white">Welcome, {user?.name || 'Member'}</h2>
          <p class="text-gray-300 mt-1">{user?.email}</p>
        </div>
        <form method="POST" action="/api/auth/logout" use:enhance>
          <button 
            type="submit"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition duration-200"
          >
            Logout
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

<main>
  <MembersSection />
</main>
