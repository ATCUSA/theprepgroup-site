<script lang="ts">
  import { page } from '$app/stores';
  
  // Get the current user from the page store
  let user = $derived($page.data.user);
</script>

<svelte:head>
  <title>Admin Dashboard | The Prep Group</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
  <div class="container mx-auto px-4 py-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
      <p class="text-gray-400">Manage your site and users</p>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Admin Card -->
      <a href="/admin/users" class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
        <h2 class="text-xl font-semibold mb-3 text-white">User Management</h2>
        <p class="text-gray-400 mb-4">View, edit, and delete user accounts</p>
        <div class="flex justify-end">
          <span class="text-blue-400">Manage Users →</span>
        </div>
      </a>
      
      <!-- Access Requests Card -->
      <a href="/admin/access-requests" class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
        <h2 class="text-xl font-semibold mb-3 text-white">Access Requests</h2>
        <p class="text-gray-400 mb-4">Review and manage pending access requests</p>
        <div class="flex justify-end">
          <span class="text-blue-400">View Requests →</span>
        </div>
      </a>
      
      <!-- Settings Card -->
      <a href="/admin/settings" class="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
        <h2 class="text-xl font-semibold mb-3 text-white">Site Settings</h2>
        <p class="text-gray-400 mb-4">Configure site-wide settings and preferences</p>
        <div class="flex justify-end">
          <span class="text-blue-400">Edit Settings →</span>
        </div>
      </a>
    </div>
  </div>
</div>
