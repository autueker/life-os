<script lang="ts">
	import { Flame, Trophy } from 'lucide-svelte';

	let { current = 0, longest = 0 }: { current?: number; longest?: number } = $props();
</script>

<div class="flex items-center gap-4 text-sm">
	<div class="flex items-center gap-1.5" title="Current streak">
		<Flame size={16} style="color: #f59e0b" />
		<span class="font-semibold">{current}</span>
		<span style="color: var(--color-text-secondary)">day{current !== 1 ? 's' : ''}</span>
	</div>
	<div class="flex items-center gap-1.5" title="Longest streak">
		<Trophy size={16} style="color: #6366f1" />
		<span class="font-semibold">{longest}</span>
		<span style="color: var(--color-text-secondary)">best</span>
	</div>
</div>
