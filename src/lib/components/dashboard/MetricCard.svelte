<script lang="ts">
	import { Trash2, TrendingUp, TrendingDown, Minus } from 'lucide-svelte';
	import type { MetricWithEntries } from '$lib/types';

	let {
		metric,
		onLogEntry,
		onDelete
	}: {
		metric: MetricWithEntries;
		onLogEntry?: (metric: MetricWithEntries) => void;
		onDelete?: (id: string) => void;
	} = $props();

	const TrendIcon = $derived(
		metric.trend === null || metric.trend === 0
			? Minus
			: metric.trend > 0
				? TrendingUp
				: TrendingDown
	);

	const trendColor = $derived(
		metric.trend === null || metric.trend === 0
			? 'var(--color-text-secondary)'
			: metric.trend > 0
				? '#10b981'
				: '#ef4444'
	);

	function formatValue(val: number | null): string {
		if (val === null) return '—';
		if (metric.type === 'boolean') return val >= 1 ? 'Yes' : 'No';
		if (metric.type === 'percentage') return `${Math.round(val)}%`;
		if (metric.type === 'duration') {
			const h = Math.floor(val / 60);
			const m = Math.round(val % 60);
			return h > 0 ? `${h}h ${m}m` : `${m}m`;
		}
		return val % 1 === 0 ? String(val) : val.toFixed(1);
	}
</script>

<div
	class="rounded-xl border p-4"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="mb-2 flex items-start justify-between">
		<div>
			<div class="flex items-center gap-2">
				<span class="h-3 w-3 rounded-full" style="background-color: {metric.color}"></span>
				<h3 class="text-sm font-semibold">{metric.name}</h3>
			</div>
			{#if metric.description}
				<p class="mt-0.5 text-xs" style="color: var(--color-text-secondary)">
					{metric.description}
				</p>
			{/if}
		</div>
		{#if onDelete}
			<button
				onclick={() => onDelete(metric.id)}
				class="rounded-lg p-1 transition-colors hover:bg-red-500/20"
				style="color: var(--color-text-secondary)"
				aria-label="Delete metric"
			>
				<Trash2 size={14} />
			</button>
		{/if}
	</div>

	<div class="flex items-end justify-between">
		<div>
			<span class="text-2xl font-bold">{formatValue(metric.latest)}</span>
			{#if metric.unit}
				<span class="ml-1 text-sm" style="color: var(--color-text-secondary)">{metric.unit}</span>
			{/if}
		</div>
		{#if metric.trend !== null}
			<div class="flex items-center gap-1 text-xs" style="color: {trendColor}">
				<TrendIcon size={14} />
				<span>{metric.trend > 0 ? '+' : ''}{Math.round(metric.trend)}%</span>
			</div>
		{/if}
	</div>

	{#if metric.targetValue}
		<div class="mt-2">
			<div class="flex justify-between text-[10px]" style="color: var(--color-text-secondary)">
				<span>Target: {metric.targetValue}{metric.unit ? ` ${metric.unit}` : ''}</span>
				{#if metric.latest !== null}
					<span>{Math.round((metric.latest / metric.targetValue) * 100)}%</span>
				{/if}
			</div>
			<div
				class="mt-1 h-1.5 overflow-hidden rounded-full"
				style="background-color: var(--color-bg-tertiary)"
			>
				<div
					class="h-full rounded-full transition-all"
					style="width: {metric.latest !== null ? Math.min(100, (metric.latest / metric.targetValue) * 100) : 0}%; background-color: {metric.color}"
				></div>
			</div>
		</div>
	{/if}

	<button
		onclick={() => onLogEntry?.(metric)}
		class="mt-3 w-full rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
		style="border-color: var(--color-border); color: var(--color-text-primary)"
	>
		Log Entry
	</button>
</div>
