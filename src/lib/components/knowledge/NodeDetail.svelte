<script lang="ts">
	import { X, Pencil, Trash2, Link } from 'lucide-svelte';
	import type { KnowledgeNode, KnowledgeEdge } from '$lib/types';
	import { NODE_TYPES } from '$lib/types';

	let {
		node,
		edges,
		allNodes,
		onClose,
		onEdit,
		onDelete
	}: {
		node: KnowledgeNode;
		edges: KnowledgeEdge[];
		allNodes: KnowledgeNode[];
		onClose: () => void;
		onEdit: (node: KnowledgeNode) => void;
		onDelete: (id: string) => void;
	} = $props();

	const typeInfo = $derived(NODE_TYPES.find((t) => t.value === node.type));

	// Find connected nodes
	const connections = $derived(() => {
		const connected: { node: KnowledgeNode; direction: 'outgoing' | 'incoming' }[] = [];
		for (const edge of edges) {
			if (edge.sourceId === node.id) {
				const target = allNodes.find((n) => n.id === edge.targetId);
				if (target) connected.push({ node: target, direction: 'outgoing' });
			}
			if (edge.targetId === node.id) {
				const source = allNodes.find((n) => n.id === edge.sourceId);
				if (source) connected.push({ node: source, direction: 'incoming' });
			}
		}
		return connected;
	});

	// Render content with highlighted [[wikilinks]]
	function renderContent(text: string): string {
		return text.replace(
			/\[\[([^\]]+)\]\]/g,
			'<span style="color: var(--color-accent); font-weight: 500">$&</span>'
		);
	}
</script>

<div
	class="flex h-full flex-col overflow-hidden rounded-xl border"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="flex items-center justify-between border-b p-4" style="border-color: var(--color-border)">
		<div class="flex items-center gap-2">
			<span class="h-3 w-3 rounded-full" style="background-color: {node.color}"></span>
			<h3 class="font-semibold">{node.title}</h3>
			<span
				class="rounded px-1.5 py-0.5 text-[10px] font-medium"
				style="background-color: {typeInfo?.color ?? '#6366f1'}20; color: {typeInfo?.color ?? '#6366f1'}"
			>
				{typeInfo?.label ?? node.type}
			</span>
		</div>
		<div class="flex items-center gap-1">
			<button
				onclick={() => onEdit(node)}
				class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
				style="color: var(--color-text-secondary)"
				aria-label="Edit node"
			>
				<Pencil size={14} />
			</button>
			<button
				onclick={() => onDelete(node.id)}
				class="rounded-lg p-1.5 transition-colors hover:bg-red-500/20"
				style="color: var(--color-text-secondary)"
				aria-label="Delete node"
			>
				<Trash2 size={14} />
			</button>
			<button
				onclick={onClose}
				class="rounded-lg p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
			>
				<X size={16} />
			</button>
		</div>
	</div>

	<div class="flex-1 overflow-y-auto p-4">
		{#if node.content}
			<div class="prose mb-4 whitespace-pre-wrap text-sm" style="color: var(--color-text-primary)">
				{@html renderContent(node.content)}
			</div>
		{:else}
			<p class="mb-4 text-sm italic" style="color: var(--color-text-secondary)">No content</p>
		{/if}

		{#if connections().length > 0}
			<div class="border-t pt-3" style="border-color: var(--color-border)">
				<div class="mb-2 flex items-center gap-1.5 text-xs font-semibold" style="color: var(--color-text-secondary)">
					<Link size={12} />
					<span>Connections ({connections().length})</span>
				</div>
				<div class="flex flex-col gap-1">
					{#each connections() as conn}
						<div class="flex items-center gap-2 rounded px-2 py-1 text-sm">
							<span class="h-2 w-2 rounded-full" style="background-color: {conn.node.color}"></span>
							<span class="text-xs" style="color: var(--color-text-secondary)">
								{conn.direction === 'outgoing' ? '→' : '←'}
							</span>
							<span>{conn.node.title}</span>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="border-t px-4 py-2 text-[10px]" style="border-color: var(--color-border); color: var(--color-text-secondary)">
		Created {new Date(node.createdAt).toLocaleDateString()}
		· Updated {new Date(node.updatedAt).toLocaleDateString()}
	</div>
</div>
