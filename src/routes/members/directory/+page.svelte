<script lang="ts">
  import type { PageData } from './$types';
  
  export let data: PageData;
  
  // Search functionality
  let searchQuery = '';
  let searchType = 'all';
  
  // Type definition for directory preferences
  type DirectoryPreferences = {
    showEmail?: boolean;
    showPhone?: boolean;
    showAddress?: boolean;
    showBio?: boolean;
  };
  
  // Helper function to safely access directory preferences
  function getDirectoryPreference(prefs: any, key: keyof DirectoryPreferences): boolean {
    if (!prefs || typeof prefs !== 'object') return false;
    return !!prefs[key];
  }
  
  // Helper function to get full address as a string
  function getFullAddress(member: any): string {
    const addressParts = [
      member.address,
      member.city,
      member.state,
      member.zip,
      member.country
    ].filter(Boolean);
    return addressParts.join(' ').toLowerCase();
  }
  
  $: filteredMembers = data.members.filter(member => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const address = getFullAddress(member);
    
    if (searchType === 'name') {
      return fullName.includes(query);
    } else if (searchType === 'address') {
      return address.includes(query);
    } else {
      // Search in both name and address
      return fullName.includes(query) || address.includes(query);
    }
  });
</script>

<svelte:head>
  <title>Member Directory | The Prep Group</title>
</svelte:head>

<div class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold text-gray-100 mb-6">Member Directory</h1>
  
  <div class="mb-8">
    <div class="flex flex-col md:flex-row gap-4">
      <div class="relative flex-grow">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search members..."
          class="w-full px-4 py-2 pl-10 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div class="flex-shrink-0">
        <div class="flex bg-gray-700 rounded-md overflow-hidden border border-gray-600">
          <button 
            class="px-4 py-2 text-sm {searchType === 'all' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
            on:click={() => searchType = 'all'}
          >
            All
          </button>
          <button 
            class="px-4 py-2 text-sm {searchType === 'name' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
            on:click={() => searchType = 'name'}
          >
            Name
          </button>
          <button 
            class="px-4 py-2 text-sm {searchType === 'address' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-600'}"
            on:click={() => searchType = 'address'}
          >
            Address
          </button>
        </div>
      </div>
    </div>
    
    <div class="mt-2 text-sm text-gray-400">
      <p>Found {filteredMembers.length} {filteredMembers.length === 1 ? 'member' : 'members'} {searchQuery ? `matching "${searchQuery}"` : ''}</p>
    </div>
  </div>
  
  {#if filteredMembers.length === 0}
    <div class="bg-gray-800 rounded-lg shadow-lg p-6 text-center">
      <p class="text-gray-300">No members found matching your search criteria.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each filteredMembers as member}
        <div class="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div class="p-6">
            <h2 class="text-xl font-semibold text-gray-100 mb-2">{member.firstName} {member.lastName}</h2>
            
            {#if getDirectoryPreference(member.directoryPreferences, 'showEmail')}
              <div class="mb-3">
                <p class="text-gray-400 text-sm">Email</p>
                <p class="text-gray-200">{member.email}</p>
              </div>
            {/if}
            
            {#if member.phone && getDirectoryPreference(member.directoryPreferences, 'showPhone')}
              <div class="mb-3">
                <p class="text-gray-400 text-sm">Phone</p>
                <p class="text-gray-200">{member.phone}</p>
              </div>
            {/if}
            
            {#if getDirectoryPreference(member.directoryPreferences, 'showAddress') && (member.address || member.city || member.state || member.zip || member.country)}
              <div class="mb-3">
                <p class="text-gray-400 text-sm">Location</p>
                <p class="text-gray-200">
                  {#if member.address}{member.address}<br>{/if}
                  {#if member.city || member.state || member.zip}
                    {member.city || ''}{member.city && (member.state || member.zip) ? ', ' : ''}
                    {member.state || ''}{member.state && member.zip ? ' ' : ''}
                    {member.zip || ''}<br>
                  {/if}
                  {#if member.country}{member.country}{/if}
                </p>
              </div>
            {/if}
            
            {#if member.bio && getDirectoryPreference(member.directoryPreferences, 'showBio')}
              <div class="mt-4 pt-4 border-t border-gray-700">
                <p class="text-gray-400 text-sm mb-1">About</p>
                <p class="text-gray-200">{member.bio}</p>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
