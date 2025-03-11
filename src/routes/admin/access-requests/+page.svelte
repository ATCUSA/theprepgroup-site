<script lang="ts">
  import { enhance } from '$app/forms';
  import type { PageData } from './$types';
  import type { AccessRequest } from '$lib/server/db/schema';
  
  const { data } = $props<{ data: PageData }>();
  
  // State for managing the UI
  let selectedRequest = $state<AccessRequest | null>(null);
  let actionType = $state<'approve' | 'reject' | null>(null);
  let notes = $state('');
  let formStatus = $state({
    submitting: false,
    success: false,
    error: false,
    message: ''
  });
  
  // Format date for display
  function formatDate(date: string | Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }
  
  // Handle selecting a request for action
  function selectRequest(request: AccessRequest, action: 'approve' | 'reject'): void {
    selectedRequest = request;
    actionType = action;
    notes = '';
    formStatus = {
      submitting: false,
      success: false,
      error: false,
      message: ''
    };
  }
  
  // Close the action modal
  function closeModal(): void {
    selectedRequest = null;
    actionType = null;
    notes = '';
  }
  
  // Get the form action based on the action type
  function getFormAction(): string {
    return actionType === 'approve' ? '?/approve' : '?/reject';
  }
  
  // Get the action button text based on the action type
  function getActionButtonText(): string {
    if (formStatus.submitting) {
      return actionType === 'approve' ? 'Approving...' : 'Rejecting...';
    }
    return actionType === 'approve' ? 'Approve Request' : 'Reject Request';
  }
  
  // Get the modal title based on the action type
  function getModalTitle(): string {
    return actionType === 'approve' 
      ? `Approve Request from ${selectedRequest?.firstName} ${selectedRequest?.lastName}`
      : `Reject Request from ${selectedRequest?.firstName} ${selectedRequest?.lastName}`;
  }
</script>

<svelte:head>
  <title>Manage Access Requests - Admin - The Prep Group</title>
</svelte:head>

<div class="bg-gray-900 min-h-screen py-12">
  <div class="container mx-auto px-4">
    <h1 class="text-3xl font-bold text-white mb-8">Manage Access Requests</h1>
    
    {#if data.pendingRequests.length === 0}
      <div class="bg-gray-800 rounded-lg p-6 text-center">
        <p class="text-gray-300 text-lg">No pending access requests at this time.</p>
      </div>
    {:else}
      <div class="bg-gray-800 rounded-lg shadow overflow-hidden">
        <table class="min-w-full divide-y divide-gray-700">
          <thead class="bg-gray-700">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Zip Code</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Phone</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date Requested</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-gray-800 divide-y divide-gray-700">
            {#each data.pendingRequests as request}
              <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.firstName} {request.lastName}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.email}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.zipCode}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{request.phone || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatDate(request.createdAt)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    type="button"
                    class="text-green-500 hover:text-green-400 mr-4"
                    onclick={() => selectRequest(request, 'approve')}
                  >
                    Approve
                  </button>
                  <button 
                    type="button"
                    class="text-red-500 hover:text-red-400"
                    onclick={() => selectRequest(request, 'reject')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
              <tr class="bg-gray-900">
                <td colspan="5" class="px-6 py-4">
                  <div class="text-sm text-gray-400">
                    <strong>Reason for joining:</strong> {request.reason}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>

<!-- Modal for approve/reject actions -->
{#if selectedRequest && actionType}
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg max-w-lg w-full mx-4 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-700">
        <h3 class="text-xl font-medium text-white">{getModalTitle()}</h3>
      </div>
      
      <form method="POST" action={getFormAction()} use:enhance={() => {
        formStatus.submitting = true;
        formStatus.success = false;
        formStatus.error = false;
        
        return async ({ result }) => {
          formStatus.submitting = false;
          
          if (result.type === 'success') {
            formStatus.success = true;
            // Handle different result types safely
            const resultData = result.type === 'success' ? result.data : {};
            formStatus.message = (resultData as Record<string, string>)?.message || 'Action completed successfully';
            
            // Refresh the page data after a short delay
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            formStatus.error = true;
            // Handle different result types safely
            const resultData = result.type === 'failure' ? result.data : {};
            formStatus.message = (resultData as Record<string, string>)?.message || 'An error occurred';
          }
        };
      }}>
        <div class="px-6 py-4">
          <input type="hidden" name="requestId" value={selectedRequest.id} />
          
          <div class="mb-4">
            <p class="text-gray-300 mb-2">
              <strong>Name:</strong> {selectedRequest.firstName} {selectedRequest.lastName}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>Email:</strong> {selectedRequest.email}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>Phone:</strong> {selectedRequest.phone || 'N/A'}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>Zip Code:</strong> {selectedRequest.zipCode || 'N/A'}
            </p>
            <p class="text-gray-300 mb-2">
              <strong>Reason:</strong> {selectedRequest.reason || 'None provided'}
            </p>
          </div>
          
          {#if actionType === 'approve'}
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-300 mb-1">
                Username <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a username for this user"
              />
            </div>
            
            <div class="mb-4">
              <label for="password" class="block text-sm font-medium text-gray-300 mb-1">
                Password <span class="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a temporary password"
              />
            </div>
          {/if}
          
          <div class="mb-4">
            <label for="notes" class="block text-sm font-medium text-gray-300 mb-1">
              Admin Notes (optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              bind:value={notes}
              rows="3"
              class="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about this request..."
            ></textarea>
          </div>
          
          {#if formStatus.success}
            <div class="bg-green-900 border border-green-600 text-green-200 px-4 py-3 rounded mb-4" role="alert">
              <p>{formStatus.message}</p>
            </div>
          {/if}
          
          {#if formStatus.error}
            <div class="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-4" role="alert">
              <p>{formStatus.message}</p>
            </div>
          {/if}
        </div>
        
        <div class="px-6 py-4 bg-gray-900 flex justify-end">
          <button
            type="button"
            class="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded mr-2"
            onclick={closeModal}
            disabled={formStatus.submitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            class={actionType === 'approve' 
              ? 'bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded' 
              : 'bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded'}
            disabled={formStatus.submitting}
          >
            {getActionButtonText()}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
