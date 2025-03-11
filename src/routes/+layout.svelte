<script lang="ts">
	import { i18n } from "$lib/i18n";
	import { ParaglideJS } from "@inlang/paraglide-sveltekit";
	import '../app.css';
	import Footer from '$lib/components/Footer.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import AccessRequestModal from '$lib/components/AccessRequestModal.svelte';
	let { children } = $props();

	// Get the current path for active navigation highlighting
	let path = $state('/');
	
	// Update path when the page changes
	$effect(() => {
		if (typeof window !== 'undefined') {
			path = window.location.pathname;
			
			// Listen for route changes
			const updatePath = () => {
				path = window.location.pathname;
			};
			
			window.addEventListener('popstate', updatePath);
			return () => window.removeEventListener('popstate', updatePath);
		}
	});
</script>

<ParaglideJS {i18n}>
	div class="flex flex-col min-h-screen bg-gray-900 text-white">
	<Navigation activeRoute={path} />
	<div class="flex-grow">
		{@render children()}
	</div>
	<Footer />
	<AccessRequestModal />
</div>
</ParaglideJS>

<svelte:head>
	<meta name="color-scheme" content="dark" />
	<meta name="theme-color" content="#111827" />
</svelte:head>