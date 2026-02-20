<script lang="ts">
	import { Moon, Sun } from 'lucide-svelte';
	import { theme, toggleTheme } from '$lib/stores/theme';
</script>

<button
	onclick={toggleTheme}
	class="rounded-lg p-2 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
	aria-label="Toggle theme"
>
	{#if $theme === 'dark'}
		<Sun size={20} />
	{:else}
		<Moon size={20} />
	{/if}
</button>
