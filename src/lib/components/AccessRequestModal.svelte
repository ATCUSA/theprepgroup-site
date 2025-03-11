<script lang="ts">
  import Modal from './Modal.svelte';
  import AccessRequestForm from './AccessRequestForm.svelte';
  import { accessRequestModalOpen, closeAccessRequestModal } from '$lib/stores/modalStore';
</script>

<Modal 
  open={$accessRequestModalOpen} 
  title="Request Access" 
  onClose={closeAccessRequestModal}
>
  <div class="py-2">
    <AccessRequestForm title="" isModal={true} />
  </div>
  
  <div slot="footer">
    <button
      type="button"
      class="mt-3 inline-flex w-full justify-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 sm:mt-0 sm:w-auto"
      onclick={closeAccessRequestModal}
    >
      Cancel
    </button>
  </div>
</Modal>
