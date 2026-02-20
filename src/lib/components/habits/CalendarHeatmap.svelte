<script lang="ts">
	import { onMount } from 'svelte';
	import type { HabitEntry } from '$lib/types';

	let {
		entries = [],
		year = new Date().getFullYear(),
		color = '#6366f1'
	}: {
		entries?: HabitEntry[];
		year?: number;
		color?: string;
	} = $props();

	let chartEl: HTMLDivElement;
	let chart: any;

	function getChartData() {
		const map = new Map<string, number>();
		for (const e of entries) {
			map.set(e.date, (map.get(e.date) ?? 0) + e.value);
		}
		return [...map.entries()].map(([date, value]) => [date, value]);
	}

	function hexToRgb(hex: string) {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return { r, g, b };
	}

	function getColorScale(base: string) {
		const { r, g, b } = hexToRgb(base);
		return [
			'#161b22', // no activity (dark bg)
			`rgba(${r}, ${g}, ${b}, 0.25)`,
			`rgba(${r}, ${g}, ${b}, 0.5)`,
			`rgba(${r}, ${g}, ${b}, 0.75)`,
			`rgb(${r}, ${g}, ${b})`
		];
	}

	async function renderChart() {
		const echarts = await import('echarts');
		if (!chartEl) return;

		if (chart) chart.dispose();
		chart = echarts.init(chartEl);

		const data = getChartData();
		const colors = getColorScale(color);

		chart.setOption({
			tooltip: {
				formatter: (params: any) => {
					const val = params.value?.[1] ?? 0;
					return `${params.value[0]}<br/>${val > 0 ? `${val} check-in${val > 1 ? 's' : ''}` : 'No activity'}`;
				}
			},
			visualMap: {
				min: 0,
				max: 1,
				show: false,
				inRange: {
					color: colors
				}
			},
			calendar: {
				range: `${year}`,
				cellSize: [14, 14],
				top: 30,
				left: 40,
				right: 10,
				itemStyle: {
					borderWidth: 2,
					borderColor: 'transparent',
					borderRadius: 3
				},
				yearLabel: { show: false },
				dayLabel: {
					nameMap: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
					color: '#888',
					fontSize: 10
				},
				monthLabel: {
					color: '#888',
					fontSize: 10
				},
				splitLine: { show: false }
			},
			series: [
				{
					type: 'heatmap',
					coordinateSystem: 'calendar',
					data
				}
			]
		});
	}

	onMount(() => {
		renderChart();

		const handleResize = () => chart?.resize();
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
			chart?.dispose();
		};
	});

	$effect(() => {
		// Re-render when entries or color changes
		entries;
		color;
		year;
		if (chart) renderChart();
	});
</script>

<div bind:this={chartEl} class="h-[180px] w-full"></div>
