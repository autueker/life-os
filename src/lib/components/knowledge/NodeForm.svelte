<script lang="ts">
	import { X } from 'lucide-svelte';
	import type { KnowledgeNode, NodeType } from '$lib/types';
	import { NODE_TYPES } from '$lib/types';

	let {
		node = null,
		onClose,
		onSubmit
	}: {
		node?: KnowledgeNode | null;
		onClose: () => void;
		onSubmit: (data: { title: string; content: string; type: NodeType; color: string }) => void;
	} = $props();

	let title = $state(node?.title ?? '');
	let content = $state(node?.content ?? '');
	let type = $state<NodeType>(node?.type ?? 'note');
	let color = $state(node?.color ?? '#6366f1');

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
		if (!title.trim()) return;
		onSubmit({ title: title.trim(), content, type, color });
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
		class="relative z-10 w-full max-w-lg rounded-xl border p-6 shadow-xl"
		style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
		role="dialog"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">{node ? 'Edit Node' : 'New Node'}</h2>
			<button
				onclick={onClose}
				class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
			>
				<X size={20} />
			</button>
		</div>

		<form onsubmit={handleSubmit} class="flex flex-col gap-4">
			<div>
				<label for="title" class="mb-1 block text-sm font-medium">Title</label>
				<input
					id="title"
					bind:value={title}
					class="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="Node title"
					required
				/>
			</div>

			<div>
				<label for="content" class="mb-1 block text-sm font-medium">
					Content
					<span class="font-normal" style="color: var(--color-text-secondary)">
						— use [[links]] to connect nodes
					</span>
				</label>
				<textarea
					id="content"
					bind:value={content}
					rows="5"
					class="w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
					style="background-color: var(--color-bg-secondary); border-color: var(--color-border); color: var(--color-text-primary)"
					placeholder="Write notes here. Use [[Title]] to link to other nodes."
				></textarea>
			</div>

			<div>
				<span class="mb-2 block text-sm font-medium">Type</span>
				<div class="flex gap-2">
					{#each NODE_TYPES as t}
						<button
							type="button"
							onclick={() => { type = t.value; color = t.color; }}
							class="rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
							style={type === t.value
								? `background-color: ${t.color}; color: white; border-color: ${t.color}`
								: `border-color: var(--color-border); color: var(--color-text-secondary)`}
						>
							{t.label}
						</button>
					{/each}
				</div>
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
				{node ? 'Save Changes' : 'Create Node'}
			</button>
		</form>
	</div>
</div>
