<script lang="ts">
	import HabitCheckIn from '$lib/components/habits/HabitCheckIn.svelte';
	import type { HabitWithEntries } from '$lib/types';
	import { formatDate } from '$lib/utils/dates';

	let {
		habits = [],
		onToggle
	}: {
		habits?: HabitWithEntries[];
		onToggle?: (habitId: string, date: string, newState: boolean) => void;
	} = $props();

	const todayStr = formatDate(new Date());

	function isCheckedToday(habit: HabitWithEntries): boolean {
		return habit.entries.some((e) => e.date === todayStr && e.value > 0);
	}
</script>

<div
	class="rounded-xl border"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="border-b px-5 py-3" style="border-color: var(--color-border)">
		<h3 class="font-semibold">Today's Habits</h3>
	</div>

	{#if habits.length === 0}
		<div class="px-5 py-8 text-center">
			<p class="text-sm" style="color: var(--color-text-secondary)">
				No habits to track. <a href="/habits" class="underline" style="color: var(--color-accent)">Create one</a>
			</p>
		</div>
	{:else}
		<div class="divide-y" style="border-color: var(--color-border)">
			{#each habits as habit (habit.id)}
				<div class="flex items-center justify-between px-5 py-3">
					<div class="flex items-center gap-3">
						<div
							class="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white"
							style="background-color: {habit.color}"
						>
							{habit.name.charAt(0).toUpperCase()}
						</div>
						<div>
							<p class="text-sm font-medium">{habit.name}</p>
							{#if habit.streak.current > 0}
								<p class="text-xs" style="color: var(--color-text-secondary)">
									{habit.streak.current} day streak
								</p>
							{/if}
						</div>
					</div>
					<HabitCheckIn
						habitId={habit.id}
						checked={isCheckedToday(habit)}
						color={habit.color ?? '#6366f1'}
						{onToggle}
					/>
				</div>
			{/each}
		</div>
	{/if}
</div>
