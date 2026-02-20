<script lang="ts">
	import { X, Trash2 } from 'lucide-svelte';
	import type { Task, Project, TaskStatus, TaskPriority } from '$lib/types';
	import { TASK_STATUSES, TASK_PRIORITIES } from '$lib/types';

	let {
		task = null,
		projects = [],
		onClose,
		onSubmit,
		onDelete
	}: {
		task?: Task | null;
		projects?: Project[];
		onClose: () => void;
		onSubmit: (data: {
			title: string;
			description: string;
			status: TaskStatus;
			priority: TaskPriority;
			projectId: string | null;
			dueDate: string | null;
		}) => void;
		onDelete?: (id: string) => void;
	} = $props();

	let title = $state(task?.title ?? '');
	let description = $state(task?.description ?? '');
	let status = $state<TaskStatus>(task?.status ?? 'todo');
	let priority = $state<TaskPriority>(task?.priority ?? 'medium');
	let projectId = $state<string | null>(task?.projectId ?? null);
	let dueDate = $state(task?.dueDate ?? '');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!title.trim()) return;
		onSubmit({
			title: title.trim(),
			description,
			status,
			priority,
			projectId: projectId || null,
			dueDate: dueDate || null
		});
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="fixed inset-0" onclick={onClose}></div>
	<div
		class="relative z-10 w-full max-w-md rounded-xl border p-6 shadow-xl"
		style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
		role="dialog"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">{task ? 'Edit Task' : 'New Task'}</h2>
			<div class="flex items-center gap-1">
				{#if task && onDelete}
					<button
						onclick={() => onDelete(task!.id)}
						class="rounded-lg p-1.5 transition-colors hover:bg-red-500/20"
						style="color: var(--color-text-secondary)"
						aria-label="Delete task"
					>
						<Trash2 size={18} />
					</button>
				{/if}
				<button
					onclick={onClose}
					class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
				>
					<X size={20} />
				</button>
			</div>
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div>
				<label for="title" class="mb-1 block text-sm font-medium">Title</label>
				<input
					id="title"
					bind:value={title}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="What needs to be done?"
					required
				/>
			</div>

			<div>
				<label for="desc" class="mb-1 block text-sm font-medium">Description</label>
				<textarea
					id="desc"
					bind:value={description}
					rows="2"
					class="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="Optional details"
				></textarea>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="status" class="mb-1 block text-sm font-medium">Status</label>
					<select
						id="status"
						bind:value={status}
						class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
						style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					>
						{#each TASK_STATUSES as s}
							<option value={s.value}>{s.label}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="priority" class="mb-1 block text-sm font-medium">Priority</label>
					<select
						id="priority"
						bind:value={priority}
						class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
						style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					>
						{#each TASK_PRIORITIES as p}
							<option value={p.value}>{p.label}</option>
						{/each}
					</select>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="project" class="mb-1 block text-sm font-medium">Project</label>
					<select
						id="project"
						bind:value={projectId}
						class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
						style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					>
						<option value={null}>No project</option>
						{#each projects as proj}
							<option value={proj.id}>{proj.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="due" class="mb-1 block text-sm font-medium">Due date</label>
					<input
						id="due"
						type="date"
						bind:value={dueDate}
						class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
						style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					/>
				</div>
			</div>

			<button
				type="submit"
				class="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				{task ? 'Save Changes' : 'Create Task'}
			</button>
		</form>
	</div>
</div>
