<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, CheckSquare, FolderPlus, ChevronDown } from 'lucide-svelte';
	import type { Task, TaskStatus, TaskPriority } from '$lib/types';
	import KanbanBoard from '$lib/components/tasks/KanbanBoard.svelte';
	import ProjectSidebar from '$lib/components/tasks/ProjectSidebar.svelte';
	import TaskForm from '$lib/components/tasks/TaskForm.svelte';
	import ProjectForm from '$lib/components/tasks/ProjectForm.svelte';

	let { data } = $props();

	let showTaskForm = $state(false);
	let showProjectForm = $state(false);
	let editingTask = $state<Task | null>(null);
	let selectedProjectId = $state<string | null>(null);
	let showMobileProjects = $state(false);

	const filteredTasks = $derived(
		selectedProjectId
			? data.tasks.filter((t) => t.projectId === selectedProjectId)
			: data.tasks
	);

	const plainProjects = $derived(
		data.projects.map((p) => ({ id: p.id, name: p.name, description: p.description, color: p.color, icon: p.icon, sortOrder: p.sortOrder, archived: p.archived, createdAt: p.createdAt, updatedAt: p.updatedAt }))
	);

	async function createTask(formData: {
		title: string;
		description: string;
		status: TaskStatus;
		priority: TaskPriority;
		projectId: string | null;
		dueDate: string | null;
	}) {
		await fetch('/api/tasks', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		showTaskForm = false;
		await invalidateAll();
	}

	async function updateTask(formData: {
		title: string;
		description: string;
		status: TaskStatus;
		priority: TaskPriority;
		projectId: string | null;
		dueDate: string | null;
	}) {
		if (!editingTask) return;
		await fetch(`/api/tasks/${editingTask.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		editingTask = null;
		await invalidateAll();
	}

	async function deleteTask(id: string) {
		await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
		editingTask = null;
		await invalidateAll();
	}

	async function createProject(formData: { name: string; description: string; color: string }) {
		await fetch('/api/projects', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		showProjectForm = false;
		await invalidateAll();
	}

	async function deleteProject(id: string) {
		await fetch(`/api/projects/${id}`, { method: 'DELETE' });
		if (selectedProjectId === id) selectedProjectId = null;
		await invalidateAll();
	}

	async function handleReorder(updates: { id: string; status: string; sortOrder: number }[]) {
		await fetch('/api/tasks/reorder', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ tasks: updates })
		});
		await invalidateAll();
	}

	function handleTaskClick(task: Task) {
		editingTask = task;
	}
</script>

<div class="mx-auto max-w-7xl">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<div class="flex items-center gap-3">
			<!-- Mobile project filter -->
			<button
				class="flex items-center gap-1 rounded-lg border px-3 py-2 text-sm md:hidden"
				style="border-color: var(--color-border); color: var(--color-text-primary)"
				onclick={() => (showMobileProjects = !showMobileProjects)}
			>
				Projects
				<ChevronDown size={14} />
			</button>
			<h2 class="text-xl font-bold">Your Tasks</h2>
		</div>
		<div class="flex items-center gap-2">
			<button
				onclick={() => (showProjectForm = true)}
				class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
				style="border-color: var(--color-border); color: var(--color-text-primary)"
			>
				<FolderPlus size={16} />
				<span class="hidden sm:inline">Project</span>
			</button>
			<button
				onclick={() => (showTaskForm = true)}
				class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				<Plus size={16} />
				Task
			</button>
		</div>
	</div>

	<!-- Mobile project dropdown -->
	{#if showMobileProjects}
		<div
			class="mb-4 rounded-xl border p-3 md:hidden"
			style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		>
			<ProjectSidebar
				projects={data.projects}
				totalTaskCount={data.tasks.length}
				{selectedProjectId}
				onSelect={(id) => { selectedProjectId = id; showMobileProjects = false; }}
				onDelete={deleteProject}
			/>
		</div>
	{/if}

	{#if data.tasks.length === 0 && data.projects.length === 0}
		<!-- Empty state -->
		<div
			class="flex flex-col items-center justify-center rounded-xl border p-12"
			style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		>
			<CheckSquare size={48} style="color: var(--color-text-secondary)" />
			<p class="mt-4 text-lg font-medium">No tasks yet</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				Create a project and start adding tasks
			</p>
			<div class="mt-4 flex gap-2">
				<button
					onclick={() => (showProjectForm = true)}
					class="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium"
					style="border-color: var(--color-border)"
				>
					<FolderPlus size={16} />
					New Project
				</button>
				<button
					onclick={() => (showTaskForm = true)}
					class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
					style="background-color: var(--color-accent)"
				>
					<Plus size={16} />
					New Task
				</button>
			</div>
		</div>
	{:else}
		<div class="flex gap-6">
			<!-- Desktop sidebar -->
			<div
				class="hidden w-52 flex-shrink-0 rounded-xl border p-3 md:block"
				style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
			>
				<ProjectSidebar
					projects={data.projects}
					totalTaskCount={data.tasks.length}
					{selectedProjectId}
					onSelect={(id) => (selectedProjectId = id)}
					onDelete={deleteProject}
				/>
			</div>

			<!-- Kanban board -->
			<div class="min-w-0 flex-1">
				<KanbanBoard
					tasks={filteredTasks}
					projects={plainProjects}
					onTaskClick={handleTaskClick}
					onReorder={handleReorder}
				/>
			</div>
		</div>
	{/if}

	<!-- Modals -->
	{#if showTaskForm}
		<TaskForm
			projects={plainProjects}
			onClose={() => (showTaskForm = false)}
			onSubmit={createTask}
		/>
	{/if}

	{#if editingTask}
		<TaskForm
			task={editingTask}
			projects={plainProjects}
			onClose={() => (editingTask = null)}
			onSubmit={updateTask}
			onDelete={deleteTask}
		/>
	{/if}

	{#if showProjectForm}
		<ProjectForm onClose={() => (showProjectForm = false)} onSubmit={createProject} />
	{/if}
</div>
