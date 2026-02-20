<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import ThemeToggle from './ThemeToggle.svelte';

	let { title = 'Life OS', onMenuClick }: { title?: string; onMenuClick?: () => void } = $props();
</script>

<header
	class="sticky top-0 z-30 flex h-14 items-center justify-between border-b px-6"
	style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
>
	<div class="flex items-center gap-3">
		{#if onMenuClick}
			<button
				onclick={onMenuClick}
				class="rounded-lg p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10 lg:hidden"
				aria-label="Toggle menu"
			>
				<Menu size={20} />
			</button>
		{/if}
		<h1 class="text-lg font-semibold">{title}</h1>
	</div>
	<ThemeToggle />
</header>
