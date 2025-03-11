<script lang="ts">
  import { page } from '$app/stores';
  import LogoutButton from '$lib/components/LogoutButton.svelte';
  
  // Get the current path to highlight active nav item
  let currentPath = $derived($page.url.pathname);
  
  // Admin navigation items
  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Users', path: '/admin/users' },
    { name: 'Access Requests', path: '/admin/access-requests' }
  ];
</script>

<div class="min-h-screen bg-gray-900 flex flex-col">
  <!-- Admin Header -->
  <header class="bg-gray-800 border-b border-gray-700">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center py-4">
        <div class="flex items-center">
          <a href="/admin" class="text-xl font-bold text-white">Admin Panel</a>
          <div class="hidden md:flex ml-10 space-x-8">
            {#each navItems as item}
              <a 
                href={item.path} 
                class="text-sm font-medium {currentPath === item.path ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-gray-300 hover:text-white'}"
              >
                {item.name}
              </a>
            {/each}
          </div>
        </div>
      </div>
    </div>
  </header>
  
  <!-- Mobile Navigation (shown on small screens) -->
  <div class="md:hidden bg-gray-800 border-b border-gray-700">
    <div class="container mx-auto px-4 py-2 flex overflow-x-auto space-x-4">
      {#each navItems as item}
        <a 
          href={item.path} 
          class="whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md {currentPath === item.path ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}"
        >
          {item.name}
        </a>
      {/each}
    </div>
  </div>
  
  <!-- Page Content -->
  <main class="flex-1">
    <slot />
  </main>
  
  <!-- Footer -->
  <footer class="bg-gray-800 border-t border-gray-700 py-4">
    <div class="container mx-auto px-4">
      <p class="text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} The Prep Group - Admin Panel
      </p>
    </div>
  </footer>
</div>
