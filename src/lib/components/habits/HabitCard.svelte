<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import type { HabitWithEntries } from '$lib/types';
	import StreakCounter from './StreakCounter.svelte';
	import HabitCheckIn from './HabitCheckIn.svelte';
	import { formatDate } from '$lib/utils/dates';

	let {
		habit,
		onSelect,
		onToggle,
		onDelete
	}: {
		habit: HabitWithEntries;
		onSelect?: (id: string) => void;
		onToggle?: (habitId: string, date: string, newState: boolean) => void;
		onDelete?: (id: string) => void;
	} = $props();

	const todayStr = formatDate(new Date());
	const todayChecked = $derived(habit.entries.some((e) => e.date === todayStr && e.value > 0));

	// Mini heatmap: last 30 days as small dots
	const last30 = $derived(() => {
		const days: { date: string; done: boolean }[] = [];
		const today = new Date();
		const entryDates = new Set(habit.entries.filter((e) => e.value > 0).map((e) => e.date));
		for (let i = 29; i >= 0; i--) {
			const d = new Date(today);
			d.setDate(d.getDate() - i);
			const ds = formatDate(d);
			days.push({ date: ds, done: entryDates.has(ds) });
		}
		return days;
	});
</script>

<div
	class="rounded-xl border p-4 transition-colors"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="mb-3 flex items-start justify-between">
		<button class="flex-1 text-left" onclick={() => onSelect?.(habit.id)}>
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
					style="background-color: {habit.color}"
				>
					{habit.name.charAt(0).toUpperCase()}
				</div>
				<div>
					<h3 class="font-semibold">{habit.name}</h3>
					{#if habit.description}
						<p class="text-xs" style="color: var(--color-text-secondary)">{habit.description}</p>
					{/if}
				</div>
			</div>
		</button>
		<div class="flex items-center gap-2">
			<HabitCheckIn habitId={habit.id} checked={todayChecked} color={habit.color} {onToggle} />
			<button
				onclick={() => onDelete?.(habit.id)}
				class="rounded-lg p-1.5 transition-colors hover:bg-red-500/20"
				style="color: var(--color-text-secondary)"
				aria-label="Delete habit"
			>
				<Trash2 size={16} />
			</button>
		</div>
	</div>

	<StreakCounter current={habit.streak.current} longest={habit.streak.longest} />

	<!-- Mini 30-day heatmap -->
	<div class="mt-3 flex gap-[3px]">
		{#each last30() as day}
			<div
				class="h-3 w-3 rounded-sm"
				title={day.date}
				style="background-color: {day.done ? habit.color : 'var(--color-bg-tertiary)'}"
			></div>
		{/each}
	</div>
</div>
