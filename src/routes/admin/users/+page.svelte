<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  
  // Get the data from the page
  const users = $derived($page.data.users || []);
  
  // Track which user is being deleted (for confirmation modal)
  let userToDelete = $state<{ id: string; username: string; isAdmin: boolean } | null>(null);
  
  // Function to open the delete confirmation modal
  function confirmDelete(user: { id: string; username: string; isAdmin: boolean }) {
    userToDelete = user;
  }
  
  // Function to close the delete confirmation modal
  function cancelDelete() {
    userToDelete = null;
  }
</script>

<svelte:head>
  <title>User Management | The Prep Group</title>
</svelte:head>

<div class="min-h-screen bg-gray-900 text-white">
  <div class="container mx-auto px-4 py-8">
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">User Management</h1>
        <p class="text-gray-400">View and manage user accounts</p>
      </div>
      <a href="/admin" class="text-blue-400 hover:text-blue-300">← Back to Dashboard</a>
    </div>
    

    
    <!-- User Table -->
    <div class="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-700">
            {#each users as user}
              <tr class="hover:bg-gray-750">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {#if user.isAdmin}
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-200">Admin</span>
                  {:else}
                    <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-700 text-gray-300">Member</span>
                  {/if}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <form method="POST" action="?/toggleAdmin" use:enhance class="inline-block">
                    <input type="hidden" name="userId" value={user.id} />
                    <button 
                      type="submit"
                      class="text-blue-400 hover:text-blue-300"
                    >
                      {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                    </button>
                  </form>
                  <button 
                    onclick={() => confirmDelete(user)}
                    class="text-red-400 hover:text-red-300 ml-4"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            {:else}
              <tr>
                <td colspan="4" class="px-6 py-4 text-center text-gray-400">No users found</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

<!-- Delete Confirmation Modal -->
{#if userToDelete}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-gray-700">
      <h2 class="text-xl font-bold text-white mb-4">Confirm Delete</h2>
      <p class="text-gray-300 mb-6">
        Are you sure you want to delete the user <span class="font-semibold text-white">{userToDelete.username}</span>? 
        This action cannot be undone.
      </p>
      
      <div class="flex justify-end space-x-4">
        <button 
          onclick={cancelDelete}
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
        >
          Cancel
        </button>
        
        <form method="POST" action="?/deleteUser" use:enhance>
          <input type="hidden" name="userId" value={userToDelete.id} />
          <button 
            type="submit"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            Delete User
          </button>
        </form>
      </div>
    </div>
  </div>
{/if}
