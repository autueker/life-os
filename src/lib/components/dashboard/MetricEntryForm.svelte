<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { MetricWithEntries } from '$lib/types';
	import { formatDate } from '$lib/utils/dates';

	let {
		metric,
		onClose,
		onSubmit
	}: {
		metric: MetricWithEntries;
		onClose: () => void;
		onSubmit: (metricId: string, data: { date: string; value: number; note: string }) => void;
	} = $props();

	let date = $state(formatDate(new Date()));
	let value = $state('');
	let boolValue = $state(true);
	let note = $state('');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const numValue = metric.type === 'boolean' ? (boolValue ? 1 : 0) : parseFloat(value);
		if (isNaN(numValue)) return;
		onSubmit(metric.id, { date, value: numValue, note });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="fixed inset-0" onclick={onClose}></div>
	<div
		class="relative z-10 w-full max-w-sm rounded-xl border p-6 shadow-xl"
		style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
		role="dialog"
	>
		<div class="mb-4 flex items-center justify-between">
			<div>
				<h2 class="text-lg font-semibold">Log {metric.name}</h2>
				{#if metric.unit}
					<p class="text-xs" style="color: var(--color-text-secondary)">Unit: {metric.unit}</p>
				{/if}
			</div>
			<button
				onclick={onClose}
				class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
			>
				<X size={20} />
			</button>
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div>
				<label for="date" class="mb-1 block text-sm font-medium">Date</label>
				<input
					id="date"
					type="date"
					bind:value={date}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
				/>
			</div>

			{#if metric.type === 'boolean'}
				<div>
					<span class="mb-2 block text-sm font-medium">Value</span>
					<div class="flex gap-2">
						{#each [{ val: true, label: 'Yes' }, { val: false, label: 'No' }] as opt}
							<button
								type="button"
								onclick={() => (boolValue = opt.val)}
								class="flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
								style={boolValue === opt.val
									? 'background-color: var(--color-accent); color: white; border-color: var(--color-accent)'
									: 'border-color: var(--color-border); color: var(--color-text-secondary)'}
							>
								{opt.label}
							</button>
						{/each}
					</div>
				</div>
			{:else}
				<div>
					<label for="value" class="mb-1 block text-sm font-medium">Value</label>
					<input
						id="value"
						type="number"
						step="any"
						bind:value
						class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
						style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
						placeholder={metric.type === 'duration' ? 'Minutes' : 'Enter value'}
						required
					/>
				</div>
			{/if}

			<div>
				<label for="note" class="mb-1 block text-sm font-medium">Note (optional)</label>
				<input
					id="note"
					bind:value={note}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="Optional note"
				/>
			</div>

			<button
				type="submit"
				class="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				Save Entry
			</button>
		</form>
	</div>
</div>
