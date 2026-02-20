<script lang="ts">
	import { onMount } from 'svelte';
	import * as echarts from 'echarts';

	let {
		title,
		chartType = 'line',
		color = '#6366f1',
		data,
		xLabels
	}: {
		title: string;
		chartType?: 'line' | 'bar' | 'gauge';
		color?: string;
		data: number[];
		xLabels: string[];
	} = $props();

	let container: HTMLDivElement;
	let chart: echarts.ECharts;

	onMount(() => {
		chart = echarts.init(container, undefined, { renderer: 'svg' });

		const resizeObs = new ResizeObserver(() => chart?.resize());
		resizeObs.observe(container);

		return () => {
			resizeObs.disconnect();
			chart?.dispose();
		};
	});

	$effect(() => {
		if (!chart) return;

		const textColor = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-text-secondary')
			.trim() || '#9ca3af';
		const borderColor = getComputedStyle(document.documentElement)
			.getPropertyValue('--color-border')
			.trim() || '#e5e7eb';

		if (chartType === 'gauge') {
			chart.setOption({
				series: [
					{
						type: 'gauge',
						progress: { show: true, width: 12 },
						axisLine: { lineStyle: { width: 12, color: [[1, borderColor]] } },
						axisTick: { show: false },
						splitLine: { show: false },
						axisLabel: { show: false },
						pointer: { show: false },
						title: { show: true, offsetCenter: [0, '30%'], color: textColor, fontSize: 12 },
						detail: {
							valueAnimation: true,
							offsetCenter: [0, '-10%'],
							fontSize: 24,
							fontWeight: 'bold',
							color: 'inherit',
							formatter: '{value}%'
						},
						data: [{ value: data[data.length - 1] ?? 0, name: title }],
						itemStyle: { color }
					}
				]
			});
		} else {
			chart.setOption({
				grid: { top: 8, right: 8, bottom: 24, left: 36 },
				xAxis: {
					type: 'category',
					data: xLabels,
					axisLine: { lineStyle: { color: borderColor } },
					axisLabel: { color: textColor, fontSize: 10 },
					axisTick: { show: false }
				},
				yAxis: {
					type: 'value',
					axisLine: { show: false },
					axisLabel: { color: textColor, fontSize: 10 },
					splitLine: { lineStyle: { color: borderColor, type: 'dashed' } }
				},
				tooltip: {
					trigger: 'axis',
					backgroundColor: 'var(--color-bg-secondary)',
					borderColor,
					textStyle: { color: textColor, fontSize: 12 }
				},
				series: [
					{
						type: chartType,
						data,
						smooth: chartType === 'line',
						symbol: 'circle',
						symbolSize: 4,
						lineStyle: { color, width: 2 },
						itemStyle: { color },
						areaStyle:
							chartType === 'line'
								? {
										color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
											{ offset: 0, color: color + '40' },
											{ offset: 1, color: color + '05' }
										])
									}
								: undefined
					}
				]
			});
		}
	});
</script>

<div
	class="overflow-hidden rounded-xl border"
	style="background-color: var(--color-bg-secondary); border-color: var(--color-border)"
>
	<div class="px-4 pt-3">
		<h3 class="text-sm font-semibold">{title}</h3>
	</div>
	<div bind:this={container} class="h-48 w-full"></div>
</div>
