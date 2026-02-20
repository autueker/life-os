<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { Plus, Brain, RefreshCw, ZoomIn, ZoomOut } from 'lucide-svelte';
	import type { KnowledgeNode, NodeType } from '$lib/types';
	import GraphView from '$lib/components/knowledge/GraphView.svelte';
	import NodeForm from '$lib/components/knowledge/NodeForm.svelte';
	import NodeDetail from '$lib/components/knowledge/NodeDetail.svelte';

	let { data } = $props();

	let showNodeForm = $state(false);
	let editingNode = $state<KnowledgeNode | null>(null);
	let selectedNode = $state<KnowledgeNode | null>(null);
	let syncing = $state(false);

	async function createNode(formData: {
		title: string;
		content: string;
		type: NodeType;
		color: string;
	}) {
		await fetch('/api/knowledge/nodes', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		showNodeForm = false;

		// Auto-create edges from [[wikilinks]]
		await syncWikilinks();
		await invalidateAll();
	}

	async function updateNode(formData: {
		title: string;
		content: string;
		type: NodeType;
		color: string;
	}) {
		if (!editingNode) return;
		await fetch(`/api/knowledge/nodes/${editingNode.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		});
		editingNode = null;

		await syncWikilinks();
		await invalidateAll();
	}

	async function deleteNode(id: string) {
		await fetch(`/api/knowledge/nodes/${id}`, { method: 'DELETE' });
		if (selectedNode?.id === id) selectedNode = null;
		if (editingNode?.id === id) editingNode = null;
		await invalidateAll();
	}

	async function savePosition(id: string, x: number, y: number) {
		await fetch(`/api/knowledge/nodes/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ x, y })
		});
	}

	async function syncWikilinks() {
		// Send all current nodes with their content for wikilink parsing
		const notes = data.nodes.map((n) => ({ title: n.title, content: n.content }));
		await fetch('/api/knowledge/sync', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ notes })
		});
	}

	async function handleObsidianSync() {
		syncing = true;
		try {
			// Fetch notes from Obsidian via the app's own vault data
			// The sync endpoint handles creating nodes and edges
			const notes = data.nodes.map((n) => ({ title: n.title, content: n.content }));
			const res = await fetch('/api/knowledge/sync', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ notes })
			});
			const result = await res.json();
			await invalidateAll();
		} finally {
			syncing = false;
		}
	}

	function handleNodeSelect(node: KnowledgeNode | null) {
		selectedNode = node;
	}
</script>

<div class="mx-auto max-w-7xl">
	<!-- Header -->
	<div class="mb-4 flex items-center justify-between">
		<h2 class="text-xl font-bold">Knowledge Graph</h2>
		<div class="flex items-center gap-2">
			<button
				onclick={handleObsidianSync}
				disabled={syncing}
				class="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50"
				style="border-color: var(--color-border); color: var(--color-text-primary)"
			>
				<RefreshCw size={14} class={syncing ? 'animate-spin' : ''} />
				<span class="hidden sm:inline">Sync Links</span>
			</button>
			<button
				onclick={() => (showNodeForm = true)}
				class="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				<Plus size={16} />
				Node
			</button>
		</div>
	</div>

	{#if data.nodes.length === 0}
		<!-- Empty state -->
		<div
			class="flex flex-col items-center justify-center rounded-xl border p-12"
			style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
		>
			<Brain size={48} style="color: var(--color-text-secondary)" />
			<p class="mt-4 text-lg font-medium">Your knowledge graph is empty</p>
			<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
				Create nodes and connect them with [[wikilinks]]
			</p>
			<button
				onclick={() => (showNodeForm = true)}
				class="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
				style="background-color: var(--color-accent)"
			>
				<Plus size={16} />
				Create First Node
			</button>
		</div>
	{:else}
		<div class="flex gap-4" style="height: calc(100vh - 10rem)">
			<!-- Graph -->
			<div class="min-w-0 flex-1">
				<GraphView
					nodes={data.nodes}
					edges={data.edges}
					onNodeSelect={handleNodeSelect}
					onPositionUpdate={savePosition}
				/>
			</div>

			<!-- Detail panel -->
			{#if selectedNode}
				<div class="hidden w-80 flex-shrink-0 md:block">
					<NodeDetail
						node={selectedNode}
						edges={data.edges}
						allNodes={data.nodes}
						onClose={() => (selectedNode = null)}
						onEdit={(n) => (editingNode = n)}
						onDelete={deleteNode}
					/>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Stats bar -->
	{#if data.nodes.length > 0}
		<div class="mt-3 flex items-center gap-4 text-xs" style="color: var(--color-text-secondary)">
			<span>{data.nodes.length} nodes</span>
			<span>{data.edges.length} connections</span>
		</div>
	{/if}

	<!-- Modals -->
	{#if showNodeForm}
		<NodeForm onClose={() => (showNodeForm = false)} onSubmit={createNode} />
	{/if}

	{#if editingNode}
		<NodeForm
			node={editingNode}
			onClose={() => (editingNode = null)}
			onSubmit={updateNode}
		/>
	{/if}
</div>
