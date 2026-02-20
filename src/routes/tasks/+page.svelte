<script lang="ts">
	import { CheckSquare } from 'lucide-svelte';
</script>

<div class="mx-auto max-w-5xl">
	<div
		class="flex flex-col items-center justify-center rounded-xl border p-12"
		style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
	>
		<CheckSquare size={48} style="color: var(--color-text-secondary)" />
		<p class="mt-4 text-lg font-medium">Tasks</p>
		<p class="mt-1 text-sm" style="color: var(--color-text-secondary)">
			Task management coming in Phase 3
		</p>
	</div>
</div>
