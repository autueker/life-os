<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { formatDisplayDate } from '$lib/utils/dates';
	import TodaySummary from '$lib/components/today/TodaySummary.svelte';
	import TodayHabits from '$lib/components/today/TodayHabits.svelte';

	let { data } = $props();

	const now = new Date();
	const greeting =
		now.getHours() < 12 ? 'Good morning' : now.getHours() < 18 ? 'Good afternoon' : 'Good evening';

	async function handleToggle(_habitId: string, _date: string, _newState: boolean) {
		await invalidateAll();
	}
</script>

<div class="mx-auto max-w-3xl">
	<div class="mb-8">
		<p class="text-sm" style="color: var(--color-text-secondary)">{formatDisplayDate(now)}</p>
		<h2 class="mt-1 text-2xl font-bold">{greeting}</h2>
	</div>

	<div class="flex flex-col gap-6">
		<TodaySummary
			completed={data.completedToday}
			total={data.totalHabits}
			bestStreak={data.bestActiveStreak}
		/>

		<TodayHabits habits={data.habits} onToggle={handleToggle} />
	</div>
</div>
