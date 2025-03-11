<script lang="ts">
  import AccessRequestForm from '$lib/components/AccessRequestForm.svelte';
</script>

<svelte:head>
  <title>Request Access - The Prep Group</title>
  <meta name="description" content="Request access to The Prep Group community and resources" />
</svelte:head>

<div class="bg-gray-900 min-h-screen">
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-3xl mx-auto">
      <h1 class="text-4xl font-bold text-white mb-8 text-center">Join Our Community</h1>
      <p class="text-xl text-gray-300 mb-12 text-center">
        Complete the form below to request access to The Prep Group community. 
        Once approved, you'll receive an email with instructions to set up your account.
      </p>
      
      <AccessRequestForm title="Request Access" />
    </div>
  </div>
</div>
