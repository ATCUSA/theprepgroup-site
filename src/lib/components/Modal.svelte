<script lang="ts">
  // Props
  let { open = false, title = '', onClose = () => {} } = $props<{
    open?: boolean;
    title?: string;
    onClose?: () => void;
  }>();
  
  // Handle escape key to close modal
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && open) {
      onClose();
    }
  }
  
  // Prevent scroll when modal is open
  $effect(() => {
    if (typeof window !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  });
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
        onclick={onClose}
        aria-hidden="true"
      ></div>
      
      <!-- Modal panel -->
      <div 
        class="relative transform overflow-hidden rounded-lg bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-gray-700"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          {#if title}
            <div class="mb-4 border-b border-gray-700 pb-3">
              <h3 class="text-2xl font-bold text-white" id="modal-title">
                {title}
              </h3>
            </div>
          {/if}
          
          <div class="mt-2">
            <slot />
          </div>
        </div>
        
        <div class="bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <slot name="footer">
            <button
              type="button"
              class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:mt-0 sm:w-auto"
              onclick={onClose}
            >
              Close
            </button>
          </slot>
        </div>
      </div>
    </div>
  </div>
{/if}
