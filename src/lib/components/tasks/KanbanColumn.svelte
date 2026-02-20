<script lang="ts">
	import { dndzone } from 'svelte-dnd-action';
	import type { Task, Project } from '$lib/types';
	import TaskCard from './TaskCard.svelte';

	let {
		status,
		label,
		color,
		tasks,
		projects = [],
		onTaskClick,
		onDndConsider,
		onDndFinalize
	}: {
		status: string;
		label: string;
		color: string;
		tasks: Task[];
		projects?: Project[];
		onTaskClick?: (task: Task) => void;
		onDndConsider: (status: string, e: CustomEvent) => void;
		onDndFinalize: (status: string, e: CustomEvent) => void;
	} = $props();

	const flipDurationMs = 200;
</script>

<div class="flex min-w-[220px] flex-1 flex-col">
	<div class="mb-3 flex items-center gap-2">
		<span class="inline-block h-3 w-3 rounded-full" style="background-color: {color}"></span>
		<h3 class="text-sm font-semibold">{label}</h3>
		<span
			class="rounded-full px-2 py-0.5 text-xs font-medium"
			style="background-color: var(--color-bg-tertiary); color: var(--color-text-secondary)"
		>
			{tasks.length}
		</span>
	</div>

	<div
		class="flex min-h-[120px] flex-1 flex-col gap-2 rounded-lg border p-2"
		style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		use:dndzone={{ items: tasks, flipDurationMs, type: 'task' }}
		onconsider={(e) => onDndConsider(status, e)}
		onfinalize={(e) => onDndFinalize(status, e)}
	>
		{#each tasks as task (task.id)}
			<TaskCard {task} {projects} onClick={onTaskClick} />
		{/each}
	</div>
</div>
