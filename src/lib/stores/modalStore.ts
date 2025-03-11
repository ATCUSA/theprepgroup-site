import { writable } from 'svelte/store';

// Create a store to manage the access request modal state
export const accessRequestModalOpen = writable(false);

// Function to open the access request modal
export function openAccessRequestModal() {
  accessRequestModalOpen.set(true);
}

// Function to close the access request modal
export function closeAccessRequestModal() {
  accessRequestModalOpen.set(false);
}
