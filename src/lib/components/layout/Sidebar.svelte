<script lang="ts">
	import { page } from '$app/state';
	import {
		CalendarDays,
		CheckSquare,
		BarChart3,
		Brain,
		Sun,
		ChevronLeft,
		ChevronRight
	} from 'lucide-svelte';

	let { collapsed = $bindable(false) } = $props();

	const navItems = [
		{ href: '/', label: 'Today', icon: Sun },
		{ href: '/habits', label: 'Habits', icon: CalendarDays },
		{ href: '/tasks', label: 'Tasks', icon: CheckSquare },
		{ href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
		{ href: '/knowledge', label: 'Knowledge', icon: Brain }
	];

	function isActive(href: string): boolean {
		if (href === '/') return page.url.pathname === '/';
		return page.url.pathname.startsWith(href);
	}
</script>

<aside
	class="fixed left-0 top-0 z-40 flex h-full flex-col border-r transition-all duration-200"
	style="background-color: var(--color-sidebar); border-color: var(--color-border); width: {collapsed ? '4rem' : '14rem'}"
>
	<div class="flex h-14 items-center justify-between px-4">
		{#if !collapsed}
			<span class="text-lg font-bold" style="color: var(--color-accent)">Life OS</span>
		{/if}
		<button
			onclick={() => (collapsed = !collapsed)}
			class="rounded-md p-1.5 transition-colors hover:bg-black/10 dark:hover:bg-white/10"
			aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
		>
			{#if collapsed}
				<ChevronRight size={18} />
			{:else}
				<ChevronLeft size={18} />
			{/if}
		</button>
	</div>

	<nav class="mt-2 flex flex-1 flex-col gap-1 px-2">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors {active ? 'nav-active text-white' : 'nav-inactive'}"
				style={active ? `background-color: var(--color-accent)` : `color: var(--color-text-secondary)`}
				title={collapsed ? item.label : undefined}
			>
				<item.icon size={20} />
				{#if !collapsed}
					<span>{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>
</aside>

<style>
	.nav-inactive:hover {
		background-color: rgba(0, 0, 0, 0.05);
	}
	:global(.dark) .nav-inactive:hover {
		background-color: rgba(255, 255, 255, 0.1);
	}
</style>
