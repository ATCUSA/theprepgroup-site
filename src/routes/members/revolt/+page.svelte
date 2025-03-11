<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Get the Revolt server URL from the server
  const revoltServerUrl = data.revoltServerUrl;
</script>

<svelte:head>
  <title>Revolt Chat Server | The Prep Group</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-100 mb-6">Revolt Chat Server</h1>
  
  <div class="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
    <h2 class="text-xl font-semibold text-gray-100 mb-4">Connect to Our Community Chat</h2>
    <p class="text-gray-300 mb-4">
      Our community uses Revolt, a privacy-focused chat platform similar to Discord but with better privacy protections.
      You can access our Revolt server directly in your browser or download the app for a better experience.
    </p>
    
    <div class="flex flex-col sm:flex-row gap-4 mt-6">
      <a 
        href={revoltServerUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        class="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
        </svg>
        Open in Browser
      </a>
    </div>
  </div>
</div>
