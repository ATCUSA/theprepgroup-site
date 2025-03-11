<script>
  import { openAccessRequestModal } from '$lib/stores/modalStore';
  import { page } from '$app/stores';
  
  let { activeRoute = '/' } = $props();
  
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Members', path: '/members' }
  ];
  
  const memberNavItems = [
    { name: 'Dashboard', path: '/members' },
    { name: 'Revolt Server', path: '/members/revolt' },
    { name: 'File Share', path: '/members/files' },
    { name: 'Resources', path: '/members/resources' },
    { name: 'Profile', path: '/members/profile' }
  ];
  
  // Check if the current route is in the members area
  let isMembersArea = $derived(activeRoute.startsWith('/members'));
  
  // Get the current user from the page store
  let user = $derived($page.data.user);
  let isLoggedIn = $derived(!!user);
  
  // Handle logout
  async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Redirect to home page after logout
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
</script>

<nav class="bg-gray-900 border-b border-gray-700">
  <div class="container mx-auto px-4">
    <div class="flex justify-between">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-white font-bold text-xl">The Prep Group</a>
        </div>
        <div class="hidden md:ml-6 md:flex md:items-center md:space-x-4">
          {#each navItems as item}
            <a 
              href={item.path} 
              class="px-3 py-4 text-sm font-medium {activeRoute === item.path ? 'text-white border-b-2 border-blue-500' : 'text-gray-300 hover:text-white hover:border-b-2 hover:border-gray-300'}"
              aria-current={activeRoute === item.path ? 'page' : undefined}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
      <div class="flex items-center space-x-3">
        {#if !isLoggedIn}
          <button 
            onclick={openAccessRequestModal}
            class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium border border-gray-700"
          >
            Request Access
          </button>
          <a href="/login" class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Login
          </a>
        {:else}
          <span class="text-gray-300 mr-2">Welcome, {user.username}</span>
          <button 
            onclick={handleLogout}
            class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium border border-gray-700"
          >
            Logout
          </button>
        {/if}
      </div>
    </div>
  </div>
  
  {#if isMembersArea}
    <div class="bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="flex overflow-x-auto py-2 space-x-4">
          {#each memberNavItems as item}
            <a 
              href={item.path} 
              class="px-3 py-2 text-sm font-medium whitespace-nowrap rounded-md {activeRoute === item.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
              aria-current={activeRoute === item.path ? 'page' : undefined}
            >
              {item.name}
            </a>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</nav>

<div class="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
