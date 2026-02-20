<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, CalendarDays } from 'lucide-svelte';
	import HabitCard from '$lib/components/habits/HabitCard.svelte';
	import HabitForm from '$lib/components/habits/HabitForm.svelte';
	import CalendarHeatmap from '$lib/components/habits/CalendarHeatmap.svelte';

	let { data } = $props();

	let showForm = $state(false);
	let selectedHabitId = $state<string | null>(null);

	const selectedHabit = $derived(data.habits.find((h) => h.id === selectedHabitId));

	async function createHabit(formData: {
		name: string;
		description: string;
		color: string;
		icon: string;
		frequency: string;
	}) {
		await fetch('/api/habits', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		showForm = false;
		await invalidateAll();
	}

	async function handleToggle(_habitId: string, _date: string, _newState: boolean) {
		// Refresh data after toggle
		await invalidateAll();
	}

	async function handleDelete(id: string) {
		await fetch(`/api/habits/${id}`, { method: 'DELETE' });
		if (selectedHabitId === id) selectedHabitId = null;
		await invalidateAll();
	}
</script>

<div class="mx-auto max-w-5xl">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Your Habits</h2>
		<button
			onclick={() => (showForm = true)}
			class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
			style="background-color: var(--color-accent)"
		>
			<Plus size={18} />
			Add Habit
		</button>
	</div>

	{#if data.habits.length === 0}
		<div
			class="flex flex-col items-center justify-center rounded-xl border p-12"
			style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		>
			<CalendarDays size={48} style="color: var(--color-text-secondary)" />
			<p class="mt-4 text-lg font-medium">No habits yet</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				Create your first habit to start tracking
			</p>
			<button
				onclick={() => (showForm = true)}
				class="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
				style="background-color: var(--color-accent)"
			>
				<Plus size={18} />
				Create Habit
			</button>
		</div>
	{:else}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.habits as habit (habit.id)}
				<HabitCard
					{habit}
					onSelect={(id) => (selectedHabitId = selectedHabitId === id ? null : id)}
					onToggle={handleToggle}
					onDelete={handleDelete}
				/>
			{/each}
		</div>

		{#if selectedHabit}
			<div
				class="mt-6 rounded-xl border p-4"
				style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
			>
				<h3 class="mb-2 font-semibold">{selectedHabit.name} — Year Overview</h3>
				<CalendarHeatmap
					entries={selectedHabit.entries}
					color={selectedHabit.color ?? '#6366f1'}
				/>
			</div>
		{/if}
	{/if}

	{#if showForm}
		<HabitForm onClose={() => (showForm = false)} onSubmit={createHabit} />
	{/if}
</div>
