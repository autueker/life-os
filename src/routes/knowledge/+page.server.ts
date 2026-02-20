import { db } from '$lib/server/db';
import { knowledgeNodes, knowledgeEdges } from '$lib/server/schema';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const nodes = await db
		.select()
		.from(knowledgeNodes)
		.where(eq(knowledgeNodes.archived, false));

	const edges = await db.select().from(knowledgeEdges);

	// Filter edges to only include those referencing active nodes
	const nodeIds = new Set(nodes.map((n) => n.id));
	const activeEdges = edges.filter((e) => nodeIds.has(e.sourceId) && nodeIds.has(e.targetId));

	return { nodes, edges: activeEdges };
};
