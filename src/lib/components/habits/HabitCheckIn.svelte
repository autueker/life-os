<script lang="ts">
	import { Check } from 'lucide-svelte';
	import { formatDate } from '$lib/utils/dates';

	let {
		habitId,
		checked = false,
		color = '#6366f1',
		onToggle
	}: {
		habitId: string;
		checked?: boolean;
		color?: string;
		onToggle?: (habitId: string, date: string, newState: boolean) => void;
	} = $props();

	let loading = $state(false);
	let optimisticChecked = $state(checked);

	// Keep in sync with parent
	$effect(() => {
		optimisticChecked = checked;
	});

	async function toggle() {
		if (loading) return;
		loading = true;
		const newState = !optimisticChecked;
		optimisticChecked = newState; // optimistic

		try {
			const date = formatDate(new Date());
			const res = await fetch(`/api/habits/${habitId}/entries`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ date })
			});

			if (!res.ok) {
				optimisticChecked = !newState; // revert
			} else {
				onToggle?.(habitId, date, newState);
			}
		} catch {
			optimisticChecked = !newState; // revert
		} finally {
			loading = false;
		}
	}
</script>

<button
	onclick={toggle}
	disabled={loading}
	class="flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all"
	style={optimisticChecked
		? `background-color: ${color}; border-color: ${color}`
		: `border-color: var(--color-border); background: transparent`}
	aria-label={optimisticChecked ? 'Uncheck habit' : 'Check in habit'}
>
	{#if optimisticChecked}
		<Check size={20} color="white" />
	{/if}
</button>
