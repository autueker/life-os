<script lang="ts">
	import { Calendar } from 'lucide-svelte';
	import type { Task, Project } from '$lib/types';
	import { TASK_PRIORITIES } from '$lib/types';

	let {
		task,
		projects = [],
		onClick
	}: {
		task: Task;
		projects?: Project[];
		onClick?: (task: Task) => void;
	} = $props();

	const priorityInfo = $derived(TASK_PRIORITIES.find((p) => p.value === task.priority));
	const project = $derived(projects.find((p) => p.id === task.projectId));

	function isOverdue(dateStr: string | null): boolean {
		if (!dateStr) return false;
		return dateStr < new Date().toISOString().slice(0, 10);
	}
</script>

<button
	class="w-full cursor-pointer rounded-lg border p-3 text-left transition-colors hover:brightness-95"
	style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
	onclick={() => onClick?.(task)}
>
	<div class="mb-1.5 flex items-center gap-2">
		<span
			class="inline-block h-2.5 w-2.5 flex-shrink-0 rounded-full"
			style="background-color: {priorityInfo?.color ?? '#6b7280'}"
			title={priorityInfo?.label}
		></span>
		<span class="text-sm font-medium leading-tight">{task.title}</span>
	</div>

	<div class="flex flex-wrap items-center gap-2">
		{#if project}
			<span
				class="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium text-white"
				style="background-color: {project.color}"
			>
				{project.name}
			</span>
		{/if}

		{#if task.dueDate}
			<span
				class="inline-flex items-center gap-1 text-[11px]"
				style="color: {isOverdue(task.dueDate) && task.status !== 'done' ? '#ef4444' : 'var(--color-text-secondary)'}"
			>
				<Calendar size={10} />
				{task.dueDate}
			</span>
		{/if}
	</div>
</button>
