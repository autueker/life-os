<script lang="ts">
	let {
		percentage,
		color = 'var(--color-accent)',
		height = '6px'
	}: {
		percentage: number;
		color?: string;
		height?: string;
	} = $props();
</script>

<div
	class="w-full overflow-hidden rounded-full"
	style="background-color: var(--color-bg-tertiary); height: {height}"
>
	<div
		class="h-full rounded-full transition-all duration-300"
		style="width: {Math.min(100, Math.max(0, percentage))}%; background-color: {color}"
	></div>
</div>
