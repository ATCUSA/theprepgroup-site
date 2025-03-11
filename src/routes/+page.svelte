<script lang="ts">
  import Header from '$lib/components/Header.svelte';
  import GroupInfo from '$lib/components/GroupInfo.svelte';
  import TableOfContents from '$lib/components/TableOfContents.svelte';
  import { openAccessRequestModal } from '$lib/stores/modalStore';
</script>

<svelte:head>
  <title>The Prep Group - Community Resource Hub</title>
  <meta name="description" content="The Prep Group is a local community focused on preparedness, self-sufficiency, and building resilient communities." />
</svelte:head>

<Header />

<main>
  <GroupInfo />
  <TableOfContents />
  
  <section class="py-12 bg-gray-900">
    <div class="container mx-auto px-4 text-center">
      <div class="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-md p-8 border border-gray-700">
        <h2 class="text-3xl font-bold mb-6 text-white">Join Our Community</h2>
        <p class="mb-6 text-gray-300">
          Ready to join our community? Request access to our Revolt server and connect with like-minded individuals focused on preparedness and community resilience.
        </p>
        <button
          onclick={openAccessRequestModal}
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Request Access Now
        </button>
      </div>
    </div>
  </section>
</main>
