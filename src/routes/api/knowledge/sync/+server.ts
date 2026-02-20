import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { knowledgeNodes, knowledgeEdges } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import type { RequestHandler } from './$types';

// Parse [[wikilinks]] from content
function extractWikilinks(content: string): string[] {
	const regex = /\[\[([^\]]+)\]\]/g;
	const links: string[] = [];
	let match;
	while ((match = regex.exec(content)) !== null) {
		links.push(match[1].split('|')[0].trim()); // Handle [[target|alias]]
	}
	return links;
}

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const notes: { title: string; content: string }[] = body.notes ?? [];

	let nodesCreated = 0;
	let edgesCreated = 0;

	// Get existing nodes
	const existing = await db
		.select()
		.from(knowledgeNodes)
		.where(eq(knowledgeNodes.archived, false));
	const nodesByTitle = new Map(existing.map((n) => [n.title.toLowerCase(), n]));

	// Create nodes for any new notes
	for (const note of notes) {
		if (!nodesByTitle.has(note.title.toLowerCase())) {
			const id = nanoid();
			const [node] = await db
				.insert(knowledgeNodes)
				.values({
					id,
					title: note.title,
					content: note.content,
					type: 'note',
					x: Math.random() * 800,
					y: Math.random() * 600
				})
				.returning();
			nodesByTitle.set(note.title.toLowerCase(), node);
			nodesCreated++;
		} else {
			// Update content
			const existing = nodesByTitle.get(note.title.toLowerCase())!;
			await db
				.update(knowledgeNodes)
				.set({ content: note.content, updatedAt: new Date().toISOString() })
				.where(eq(knowledgeNodes.id, existing.id));
		}
	}

	// Get existing edges
	const existingEdges = await db.select().from(knowledgeEdges);
	const edgeSet = new Set(existingEdges.map((e) => `${e.sourceId}→${e.targetId}`));

	// Parse wikilinks and create edges
	for (const note of notes) {
		const sourceNode = nodesByTitle.get(note.title.toLowerCase());
		if (!sourceNode) continue;

		const links = extractWikilinks(note.content);
		for (const linkTitle of links) {
			const targetNode = nodesByTitle.get(linkTitle.toLowerCase());
			if (!targetNode || targetNode.id === sourceNode.id) continue;

			const edgeKey = `${sourceNode.id}→${targetNode.id}`;
			if (!edgeSet.has(edgeKey)) {
				await db.insert(knowledgeEdges).values({
					id: nanoid(),
					sourceId: sourceNode.id,
					targetId: targetNode.id,
					label: ''
				});
				edgeSet.add(edgeKey);
				edgesCreated++;
			}
		}
	}

	return json({ data: { nodesCreated, edgesCreated, totalNodes: nodesByTitle.size } });
};
