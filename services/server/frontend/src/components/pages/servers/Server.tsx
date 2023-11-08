import ky from 'ky';
import tw, { css } from 'twin.macro';
import { Fragment, useState, useEffect } from 'react';

import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler);

const bytesToSize = (bytes: number, precision: number) => {
	if (isNaN(bytes) || bytes === 0) return '0b';

	const sizes = ['b', 'kb', 'mb', 'gb', 'tb'];
	const kilobyte = 1024;

	const index = Math.floor(Math.log(bytes) / Math.log(kilobyte));
	const size = (bytes / Math.pow(kilobyte, index)).toFixed(precision);
	return size + sizes[index];
};

const stats = [
	{ name: 'Total Subscribers', stat: '71,897' },
	{ name: 'Avg. Open Rate', stat: '58.16%' },
	{ name: 'Avg. Click Rate', stat: '24.57%' },
	{ name: 'Avg. Click Rate', stat: '24.57%' },
];

const options = {
	responsive: true,
	maintainAspectRatio: false,
	layout: {
		padding: {
			left: 0,
			right: 0,
			bottom: 0,
			top: 0,
		},
	},
	plugins: {
		tooltips: {
			enabled: false,
		},
		title: {
			display: false,
		},
	},
	animation: {
		duration: 0,
	},
	elements: {
		point: {
			radius: 0,
		},
		line: {
			tension: 0.5,
			backgroundColor: 'rgba(15, 178, 184, 0.35)',
			borderColor: '#32D0D9',
			borderWidth: 1,
		},
	},
	scales: {
		x: {
			display: false,
		},
		y: {
			display: false,
			suggestedMin: 0,
		},
	},
	data: {
		labels: Array(20).fill(''),
		datasets: [
			{
				fill: true,
				data: Array(20).fill(0),
			},
		],
	},
};

const Server = () => {
	const [cpu, setCpu] = useState<Chart>();
	const [memory, setMemory] = useState<Chart>();

	const [data, setData] = useState({
		memoryUsage: [],
		cpuUsage: [],
		loadAverage: [],
		uptime: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			ky.get('http://127.0.0.1:9001/metrics/graphs')
				.json()
				.then((response: any) => setData(response));
		};

		fetchData();
		const intervalId = setInterval(fetchData, 2000);
		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const cpuChart = {
		labels: Array(20).fill(''),
		datasets: [
			{
				fill: true,
				data: data.cpuUsage,
				borderColor: '#6466F1',
				backgroundColor: (ctx: any) => {
					const chart = ctx.chart;
					const { ctx: context, chartArea } = chart;
					if (!chartArea) {
						return null;
					}

					// Create a linear gradient for the chart background
					const gradient = context.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
					gradient.addColorStop(0, 'rgba(100, 102, 241, 0.1)'); // Bottom color (transparent)
					gradient.addColorStop(1, 'rgba(100, 102, 241, 0.5)'); // Top color

					return gradient;
				},
			},
		],
	};

	const memoryChart = {
		labels: Array(20).fill(''),
		datasets: [
			{
				fill: true,
				data: data.memoryUsage,
				borderColor: '#6466F1',
				backgroundColor: (ctx: any) => {
					const chart = ctx.chart;
					const { ctx: context, chartArea } = chart;
					if (!chartArea) {
						return null;
					}

					// Create a linear gradient for the chart background
					const gradient = context.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
					gradient.addColorStop(0, 'rgba(100, 102, 241, 0.1)'); // Bottom color (transparent)
					gradient.addColorStop(1, 'rgba(100, 102, 241, 0.5)'); // Top color

					return gradient;
				},
			},
		],
	};

	const chartContainerStyle = {
		borderRadius: '0 0 0.5rem 0.5rem',
		marginBottom: '0.5px',
		zIndex: 1,
	};

	return (
		<Fragment>
			<h3 tw="ml-8 mt-6 mb-5 text-2xl font-bold leading-6 text-zinc-200">Overview</h3>
			<dl tw="grid grid-cols-1 gap-5 sm:grid-cols-4 px-5">
				{stats.map((item) => (
					<div key={item.name} tw="overflow-hidden rounded-lg bg-zinc-900/25 border border-zinc-800 px-4 py-5 shadow sm:p-6">
						<dt tw="truncate text-sm font-medium text-zinc-400">{item.name}</dt>
						<dd tw="mt-1 text-3xl font-semibold tracking-tight text-zinc-100">{item.stat}</dd>
					</div>
				))}
			</dl>
			<h3 tw="ml-8 mt-8 mb-5 text-2xl font-bold leading-6 text-zinc-200">Metrics</h3>
			<dl tw="grid grid-cols-1 gap-5 sm:grid-cols-2 px-5">
				<div tw="overflow-hidden rounded-lg bg-zinc-900/25 border border-zinc-800 shadow">
					<dt tw="truncate text-sm font-bold text-zinc-400 pt-4 px-4">CPU Usage</dt>
					<dt tw="truncate text-xl font-bold text-zinc-100 p-1 px-4">
						{data.cpuUsage.slice(-1)[0]}
						<span tw="text-base text-zinc-400">%</span>
					</dt>
					<dd tw="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 h-52" style={chartContainerStyle}>
						<Line data={cpuChart} options={options} />
					</dd>
				</div>
				<div tw="overflow-hidden rounded-lg bg-zinc-900/25 border border-zinc-800 shadow">
					<dt tw="truncate text-sm font-bold text-zinc-400 pt-4 px-4">Memory Usage</dt>
					<dt tw="truncate text-xl font-bold text-zinc-100 p-1 px-4">{bytesToSize(data.memoryUsage.slice(-1)[0], 2)}</dt>
					<dd tw="mt-2 text-3xl font-semibold tracking-tight text-zinc-100 h-52" style={chartContainerStyle}>
						<Line data={memoryChart} options={options} />
					</dd>
				</div>
			</dl>
		</Fragment>
	);
};

export default Server;
