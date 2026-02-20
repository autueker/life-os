<script lang="ts">
	import { onMount } from 'svelte';
	import type { KnowledgeNode, KnowledgeEdge } from '$lib/types';
	import { NODE_TYPES } from '$lib/types';

	let {
		nodes,
		edges,
		onNodeSelect,
		onPositionUpdate
	}: {
		nodes: KnowledgeNode[];
		edges: KnowledgeEdge[];
		onNodeSelect?: (node: KnowledgeNode | null) => void;
		onPositionUpdate?: (id: string, x: number, y: number) => void;
	} = $props();

	let container: HTMLDivElement;
	let cy: any;

	onMount(async () => {
		const cytoscape = (await import('cytoscape')).default;

		const textColor =
			getComputedStyle(document.documentElement)
				.getPropertyValue('--color-text-primary')
				.trim() || '#1f2937';
		const bgColor =
			getComputedStyle(document.documentElement)
				.getPropertyValue('--color-bg-secondary')
				.trim() || '#f9fafb';
		const borderColor =
			getComputedStyle(document.documentElement)
				.getPropertyValue('--color-border')
				.trim() || '#e5e7eb';

		cy = cytoscape({
			container,
			elements: buildElements(),
			style: [
				{
					selector: 'node',
					style: {
						label: 'data(label)',
						'background-color': 'data(color)',
						color: textColor,
						'text-valign': 'bottom',
						'text-margin-y': 6,
						'font-size': '11px',
						width: 32,
						height: 32,
						'border-width': 2,
						'border-color': borderColor
					}
				},
				{
					selector: 'node:selected',
					style: {
						'border-width': 3,
						'border-color': '#6366f1',
						'overlay-opacity': 0.1,
						'overlay-color': '#6366f1'
					}
				},
				{
					selector: 'edge',
					style: {
						width: 1.5,
						'line-color': borderColor,
						'target-arrow-color': borderColor,
						'target-arrow-shape': 'triangle',
						'curve-style': 'bezier',
						'arrow-scale': 0.8
					}
				}
			],
			layout: { name: 'preset' },
			minZoom: 0.3,
			maxZoom: 3
		});

		// If no positions set (all 0,0), run a force layout
		const allZero = nodes.every((n) => n.x === 0 && n.y === 0);
		if (allZero && nodes.length > 0) {
			cy.layout({
				name: 'cose',
				animate: true,
				animationDuration: 500,
				nodeRepulsion: () => 8000,
				idealEdgeLength: () => 120
			}).run();
		}

		cy.on('tap', 'node', (evt: any) => {
			const nodeData = evt.target.data();
			const node = nodes.find((n) => n.id === nodeData.id);
			onNodeSelect?.(node ?? null);
		});

		cy.on('tap', (evt: any) => {
			if (evt.target === cy) {
				onNodeSelect?.(null);
			}
		});

		cy.on('dragfree', 'node', (evt: any) => {
			const pos = evt.target.position();
			const id = evt.target.data('id');
			onPositionUpdate?.(id, pos.x, pos.y);
		});

		return () => {
			cy?.destroy();
		};
	});

	function buildElements() {
		const nodeElements = nodes.map((n) => ({
			data: {
				id: n.id,
				label: n.title,
				color: n.color || NODE_TYPES.find((t) => t.value === n.type)?.color || '#6366f1'
			},
			position: { x: n.x || Math.random() * 800, y: n.y || Math.random() * 600 }
		}));

		const nodeIds = new Set(nodes.map((n) => n.id));
		const edgeElements = edges
			.filter((e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId))
			.map((e) => ({
				data: {
					id: e.id,
					source: e.sourceId,
					target: e.targetId,
					label: e.label
				}
			}));

		return [...nodeElements, ...edgeElements];
	}

	// Update graph when data changes
	$effect(() => {
		if (!cy) return;
		cy.elements().remove();
		cy.add(buildElements());
	});
</script>

<div
	bind:this={container}
	class="h-full w-full rounded-xl border"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
></div>
