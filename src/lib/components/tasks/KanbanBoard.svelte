<script lang="ts">
	import type { Task, Project, TaskStatus } from '$lib/types';
	import { TASK_STATUSES } from '$lib/types';
	import KanbanColumn from './KanbanColumn.svelte';

	let {
		tasks,
		projects = [],
		onTaskClick,
		onReorder
	}: {
		tasks: Task[];
		projects?: Project[];
		onTaskClick?: (task: Task) => void;
		onReorder: (updates: { id: string; status: string; sortOrder: number }[]) => void;
	} = $props();

	// Group tasks by status, keeping a reactive copy for DnD
	let tasksByStatus = $state<Record<string, Task[]>>({});

	$effect(() => {
		const grouped: Record<string, Task[]> = {};
		for (const s of TASK_STATUSES) {
			grouped[s.value] = tasks
				.filter((t) => t.status === s.value)
				.sort((a, b) => a.sortOrder - b.sortOrder);
		}
		tasksByStatus = grouped;
	});

	function handleConsider(status: string, e: CustomEvent) {
		tasksByStatus[status] = e.detail.items;
	}

	function handleFinalize(status: string, e: CustomEvent) {
		tasksByStatus[status] = e.detail.items;

		// Collect all tasks with their new status and sort order
		const updates: { id: string; status: string; sortOrder: number }[] = [];
		for (const s of TASK_STATUSES) {
			const columnTasks = tasksByStatus[s.value] ?? [];
			for (let i = 0; i < columnTasks.length; i++) {
				const t = columnTasks[i];
				if (t.status !== s.value || t.sortOrder !== i) {
					updates.push({ id: t.id, status: s.value, sortOrder: i });
				}
			}
		}
		if (updates.length > 0) {
			onReorder(updates);
		}
	}
</script>

<div class="flex gap-4 overflow-x-auto pb-4">
	{#each TASK_STATUSES as col (col.value)}
		<KanbanColumn
			status={col.value}
			label={col.label}
			color={col.color}
			tasks={tasksByStatus[col.value] ?? []}
			{projects}
			{onTaskClick}
			onDndConsider={handleConsider}
			onDndFinalize={handleFinalize}
		/>
	{/each}
</div>
