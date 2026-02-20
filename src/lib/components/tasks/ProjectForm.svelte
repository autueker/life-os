<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { Project } from '$lib/types';

	let {
		project = null,
		onClose,
		onSubmit
	}: {
		project?: Project | null;
		onClose: () => void;
		onSubmit: (data: { name: string; description: string; color: string }) => void;
	} = $props();

	let name = $state(project?.name ?? '');
	let description = $state(project?.description ?? '');
	let color = $state(project?.color ?? '#6366f1');

	const colors = [
		'#6366f1',
		'#ec4899',
		'#f59e0b',
		'#10b981',
		'#3b82f6',
		'#8b5cf6',
		'#ef4444',
		'#06b6d4'
	];

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name: name.trim(), description, color });
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
			<h2 class="text-lg font-semibold">{project ? 'Edit Project' : 'New Project'}</h2>
			<button
				onclick={onClose}
				class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
			>
				<X size={20} />
			</button>
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div>
				<label for="name" class="mb-1 block text-sm font-medium">Name</label>
				<input
					id="name"
					bind:value={name}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="e.g. Work, Personal, Health"
					required
				/>
			</div>

			<div>
				<label for="desc" class="mb-1 block text-sm font-medium">Description</label>
				<input
					id="desc"
					bind:value={description}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="Optional description"
				/>
			</div>

			<div>
				<span class="mb-2 block text-sm font-medium">Color</span>
				<div class="flex gap-2">
					{#each colors as c}
						<button
							type="button"
							onclick={() => (color = c)}
							class="h-8 w-8 rounded-full transition-transform"
							class:ring-2={color === c}
							class:ring-white={color === c}
							class:scale-110={color === c}
							style="background-color: {c}"
							aria-label="Color {c}"
						></button>
					{/each}
				</div>
			</div>

			<button
				type="submit"
				class="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				{project ? 'Save Changes' : 'Create Project'}
			</button>
		</form>
	</div>
</div>
