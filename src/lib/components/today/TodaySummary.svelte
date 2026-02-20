<script lang="ts">
	import { Flame } from 'lucide-svelte';

	let {
		completed = 0,
		total = 0,
		bestStreak = 0
	}: { completed?: number; total?: number; bestStreak?: number } = $props();

	const pct = $derived(total > 0 ? Math.round((completed / total) * 100) : 0);
	// SVG ring params
	const radius = 50;
	const circumference = 2 * Math.PI * radius;
	const strokeOffset = $derived(circumference - (pct / 100) * circumference);
</script>

<div
	class="flex items-center gap-6 rounded-xl border p-5"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<!-- Completion ring -->
	<div class="relative flex-shrink-0">
		<svg width="120" height="120" viewBox="0 0 120 120">
			<circle
				cx="60"
				cy="60"
				r={radius}
				fill="none"
				stroke="var(--color-bg-tertiary)"
				stroke-width="8"
			/>
			<circle
				cx="60"
				cy="60"
				r={radius}
				fill="none"
				stroke="var(--color-accent)"
				stroke-width="8"
				stroke-linecap="round"
				stroke-dasharray={circumference}
				stroke-dashoffset={strokeOffset}
				transform="rotate(-90 60 60)"
				class="transition-all duration-500"
			/>
		</svg>
		<div class="absolute inset-0 flex flex-col items-center justify-center">
			<span class="text-2xl font-bold">{completed}/{total}</span>
			<span class="text-xs" style="color: var(--color-text-secondary)">habits</span>
		</div>
	</div>

	<div>
		<p class="text-sm" style="color: var(--color-text-secondary)">Today's Progress</p>
		<p class="text-xl font-bold">{pct}% Complete</p>
		{#if bestStreak > 0}
			<div class="mt-2 flex items-center gap-1.5 text-sm">
				<Flame size={16} style="color: #f59e0b" />
				<span>Best active streak: <strong>{bestStreak} day{bestStreak !== 1 ? 's' : ''}</strong></span>
			</div>
		{/if}
	</div>
</div>
