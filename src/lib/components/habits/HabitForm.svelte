<script lang="ts">
	import { X } from 'lucide-svelte';

	let {
		onClose,
		onSubmit
	}: {
		onClose: () => void;
		onSubmit: (data: {
			name: string;
			description: string;
			color: string;
			icon: string;
			frequency: string;
		}) => void;
	} = $props();

	let name = $state('');
	let description = $state('');
	let color = $state('#6366f1');
	let frequency = $state('daily');

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

	const icons = [
		'activity',
		'book',
		'dumbbell',
		'heart',
		'coffee',
		'code',
		'music',
		'pen-tool',
		'sunrise',
		'droplets',
		'moon',
		'brain'
	];

	let selectedIcon = $state('activity');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (!name.trim()) return;
		onSubmit({ name: name.trim(), description, color, icon: selectedIcon, frequency });
	}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
	onkeydown={(e) => e.key === 'Escape' && onClose()}
>
	<div
		class="w-full max-w-md rounded-xl border p-6 shadow-xl"
		style="background-color: var(--color-bg-primary); border-color: var(--color-border)"
		role="dialog"
	>
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-lg font-semibold">New Habit</h2>
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
					placeholder="e.g. Morning meditation"
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

			<div>
				<span class="mb-2 block text-sm font-medium">Icon</span>
				<div class="flex flex-wrap gap-2">
					{#each icons as ic}
						<button
							type="button"
							onclick={() => (selectedIcon = ic)}
							class="rounded-lg border px-3 py-1.5 text-xs transition-colors"
							style={selectedIcon === ic
								? `background-color: var(--color-accent); color: white; border-color: var(--color-accent)`
								: `border-color: var(--color-border); color: var(--color-text-secondary)`}
						>
							{ic}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<span class="mb-2 block text-sm font-medium">Frequency</span>
				<div class="flex gap-2">
					{#each ['daily', 'weekly'] as f}
						<button
							type="button"
							onclick={() => (frequency = f)}
							class="rounded-lg border px-4 py-2 text-sm capitalize transition-colors"
							style={frequency === f
								? `background-color: var(--color-accent); color: white; border-color: var(--color-accent)`
								: `border-color: var(--color-border); color: var(--color-text-secondary)`}
						>
							{f}
						</button>
					{/each}
				</div>
			</div>

			<button
				type="submit"
				class="mt-2 w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors"
				style="background-color: var(--color-accent)"
			>
				Create Habit
			</button>
		</form>
	</div>
</div>
