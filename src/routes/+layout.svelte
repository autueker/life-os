<script lang="ts">
	import { page } from '$app/state';
	import '../app.css';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	import TopBar from '$lib/components/layout/TopBar.svelte';

	let { children } = $props();
	let sidebarCollapsed = $state(false);
	let mobileMenuOpen = $state(false);

	const pageTitles: Record<string, string> = {
		'/': 'Today',
		'/habits': 'Habits',
		'/tasks': 'Tasks',
		'/dashboard': 'Dashboard',
		'/knowledge': 'Knowledge'
	};

	const currentTitle = $derived(pageTitles[page.url.pathname] ?? 'Life OS');
</script>

<!-- Desktop sidebar -->
<div class="hidden lg:block">
	<Sidebar bind:collapsed={sidebarCollapsed} />
</div>

<!-- Mobile overlay -->
{#if mobileMenuOpen}
	<button
		class="fixed inset-0 z-30 h-full w-full bg-black/50 lg:hidden"
		onclick={() => (mobileMenuOpen = false)}
	>
		<span class="sr-only">Close menu</span>
	</button>
	<div class="fixed left-0 top-0 z-40 lg:hidden">
		<Sidebar collapsed={false} />
	</div>
{/if}

<!-- Main content -->
<div
	class="flex min-h-screen flex-col transition-all duration-200 lg:ml-56"
	class:lg:!ml-16={sidebarCollapsed}
>
	<TopBar title={currentTitle} onMenuClick={() => (mobileMenuOpen = !mobileMenuOpen)} />
	<main class="flex-1 p-6">
		{@render children()}
	</main>
</div>
