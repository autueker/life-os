<script lang="ts">
	import type { Component } from 'svelte';

	let {
		label,
		value,
		subtext = '',
		icon,
		color = 'var(--color-accent)'
	}: {
		label: string;
		value: string | number;
		subtext?: string;
		icon: Component;
		color?: string;
	} = $props();

	const Icon = $derived(icon);
</script>

<div
	class="rounded-xl border p-4"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="mb-2 flex items-center gap-2">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg"
			style="background-color: {color}20; color: {color}"
		>
			<Icon size={16} />
		</div>
		<span class="text-xs font-medium" style="color: var(--color-text-secondary)">{label}</span>
	</div>
	<p class="text-2xl font-bold">{value}</p>
	{#if subtext}
		<p class="mt-0.5 text-xs" style="color: var(--color-text-secondary)">{subtext}</p>
	{/if}
</div>
