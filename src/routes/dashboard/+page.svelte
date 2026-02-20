<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import {
		Plus,
		CalendarDays,
		CheckSquare,
		Target,
		TrendingUp,
		BarChart3
	} from 'lucide-svelte';
	import type { MetricType, MetricWithEntries } from '$lib/types';
	import StatCard from '$lib/components/dashboard/StatCard.svelte';
	import MetricCard from '$lib/components/dashboard/MetricCard.svelte';
	import MetricForm from '$lib/components/dashboard/MetricForm.svelte';
	import MetricEntryForm from '$lib/components/dashboard/MetricEntryForm.svelte';
	import ChartWidget from '$lib/components/dashboard/ChartWidget.svelte';

	let { data } = $props();

	let showMetricForm = $state(false);
	let loggingMetric = $state<MetricWithEntries | null>(null);

	async function createMetric(formData: {
		name: string;
		description: string;
		unit: string;
		color: string;
		type: MetricType;
		targetValue: number | null;
	}) {
		await fetch('/api/metrics', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		showMetricForm = false;
		await invalidateAll();
	}

	async function deleteMetric(id: string) {
		await fetch(`/api/metrics/${id}`, { method: 'DELETE' });
		await invalidateAll();
	}

	async function logEntry(
		metricId: string,
		entry: { date: string; value: number; note: string }
	) {
		await fetch(`/api/metrics/${metricId}/entries`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(entry)
		});
		loggingMetric = null;
		await invalidateAll();
	}

	// Chart data derived from server data
	const habitChartLabels = $derived(
		data.habitCompletionByDay.map((d) => d.date.slice(5)) // "MM-DD"
	);
	const habitChartData = $derived(data.habitCompletionByDay.map((d) => d.rate));

	const taskChartLabels = $derived(['Backlog', 'To Do', 'In Progress', 'Done']);
	const taskChartData = $derived([
		data.tasksByStatus.backlog,
		data.tasksByStatus.todo,
		data.tasksByStatus.in_progress,
		data.tasksByStatus.done
	]);
</script>

<div class="mx-auto max-w-6xl">
	<div class="mb-6 flex items-center justify-between">
		<h2 class="text-xl font-bold">Dashboard</h2>
		<button
			onclick={() => (showMetricForm = true)}
			class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
			style="background-color: var(--color-accent)"
		>
			<Plus size={16} />
			Metric
		</button>
	</div>

	<!-- Summary Stats -->
	<div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
		<StatCard
			label="Habits Today"
			value="{data.completedToday}/{data.habitCount}"
			subtext={data.habitCount > 0
				? `${Math.round((data.completedToday / data.habitCount) * 100)}% complete`
				: 'No habits yet'}
			icon={CalendarDays}
			color="#10b981"
		/>
		<StatCard
			label="Total Tasks"
			value={data.totalTasks}
			subtext="{data.tasksByStatus.done} completed"
			icon={CheckSquare}
			color="#3b82f6"
		/>
		<StatCard
			label="In Progress"
			value={data.tasksByStatus.in_progress}
			subtext="{data.tasksByStatus.todo} queued"
			icon={Target}
			color="#f59e0b"
		/>
		<StatCard
			label="Metrics Tracked"
			value={data.metrics.length}
			subtext={data.metrics.length > 0
				? `${data.metrics.filter((m) => m.latest !== null).length} with data`
				: 'Add your first metric'}
			icon={TrendingUp}
			color="#8b5cf6"
		/>
	</div>

	<!-- Charts Row -->
	<div class="mb-6 grid gap-4 lg:grid-cols-2">
		{#if data.habitCompletionByDay.length > 0}
			<ChartWidget
				title="Habit Completion Rate (30d)"
				chartType="line"
				color="#10b981"
				data={habitChartData}
				xLabels={habitChartLabels}
			/>
		{/if}

		{#if data.totalTasks > 0}
			<ChartWidget
				title="Tasks by Status"
				chartType="bar"
				color="#3b82f6"
				data={taskChartData}
				xLabels={taskChartLabels}
			/>
		{/if}

		{#each data.metrics.filter((m) => m.entries.length > 0) as metric (metric.id)}
			<ChartWidget
				title="{metric.name}{metric.unit ? ` (${metric.unit})` : ''}"
				chartType="line"
				color={metric.color}
				data={metric.entries.map((e) => e.value)}
				xLabels={metric.entries.map((e) => e.date.slice(5))}
			/>
		{/each}
	</div>

	<!-- Metrics Grid -->
	{#if data.metrics.length > 0}
		<div class="mb-4 flex items-center gap-2">
			<BarChart3 size={18} style="color: var(--color-text-secondary)" />
			<h3 class="font-semibold">Your Metrics</h3>
		</div>
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.metrics as metric (metric.id)}
				<MetricCard
					{metric}
					onLogEntry={(m) => (loggingMetric = m)}
					onDelete={deleteMetric}
				/>
			{/each}
		</div>
	{:else if data.habitCount === 0 && data.totalTasks === 0}
		<div
			class="flex flex-col items-center justify-center rounded-xl border p-12"
			style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		>
			<BarChart3 size={48} style="color: var(--color-text-secondary)" />
			<p class="mt-4 text-lg font-medium">Your dashboard is empty</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				Start by adding habits, tasks, or custom metrics to see your data here
			</p>
		</div>
	{/if}

	<!-- Modals -->
	{#if showMetricForm}
		<MetricForm onClose={() => (showMetricForm = false)} onSubmit={createMetric} />
	{/if}

	{#if loggingMetric}
		<MetricEntryForm
			metric={loggingMetric}
			onClose={() => (loggingMetric = null)}
			onSubmit={logEntry}
		/>
	{/if}
</div>
