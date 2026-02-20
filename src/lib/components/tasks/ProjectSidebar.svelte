<script lang="ts">
	import { Folder, Trash2 } from 'lucide-svelte';
	import type { ProjectWithTasks } from '$lib/types';
	import ProgressBar from './ProgressBar.svelte';

	let {
		projects,
		totalTaskCount,
		selectedProjectId,
		onSelect,
		onDelete
	}: {
		projects: ProjectWithTasks[];
		totalTaskCount: number;
		selectedProjectId: string | null;
		onSelect: (projectId: string | null) => void;
		onDelete?: (id: string) => void;
	} = $props();
</script>

<div class="flex flex-col gap-1">
	<button
		class="flex items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
		style={selectedProjectId === null
			? 'background-color: var(--color-accent); color: white'
			: 'color: var(--color-text-primary)'}
		onclick={() => onSelect(null)}
	>
		<span>All Tasks</span>
		<span
			class="rounded-full px-2 py-0.5 text-xs"
			style={selectedProjectId === null
				? 'background-color: rgba(255,255,255,0.2)'
				: 'background-color: var(--color-bg-tertiary); color: var(--color-text-secondary)'}
		>
			{totalTaskCount}
		</span>
	</button>

	{#each projects as project (project.id)}
		<div class="group relative">
			<button
				class="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors"
				style={selectedProjectId === project.id
					? 'background-color: var(--color-accent); color: white'
					: 'color: var(--color-text-primary)'}
				onclick={() => onSelect(project.id)}
			>
				<span
					class="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded"
					style="background-color: {project.color}"
				>
					<Folder size={12} class="text-white" />
				</span>
				<span class="flex-1 truncate">{project.name}</span>
				<span
					class="rounded-full px-2 py-0.5 text-xs"
					style={selectedProjectId === project.id
						? 'background-color: rgba(255,255,255,0.2)'
						: 'background-color: var(--color-bg-tertiary); color: var(--color-text-secondary)'}
				>
					{project.progress.total}
				</span>
			</button>

			{#if onDelete}
				<button
					class="absolute right-8 top-1/2 -translate-y-1/2 rounded p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500/20"
					style="color: var(--color-text-secondary)"
					onclick={(e) => { e.stopPropagation(); onDelete(project.id); }}
					aria-label="Delete project"
				>
					<Trash2 size={14} />
				</button>
			{/if}

			{#if project.progress.total > 0}
				<div class="px-3 pb-1">
					<ProgressBar percentage={project.progress.percentage} color={project.color} />
				</div>
			{/if}
		</div>
	{/each}
</div>
