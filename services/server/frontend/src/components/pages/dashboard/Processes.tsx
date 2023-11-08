import { Fragment } from 'react';
import tw, { css } from 'twin.macro';
import { onPage } from '@/helpers';
import { Link } from 'react-router-dom';
import { dashNav } from '@/globals';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

const deployments = [
	{
		id: 1,
		href: '#',
		projectName: 'ios-app',
		teamName: 'Planetaria',
		status: 'offline',
		statusText: 'Initiated 1m 32s ago',
		description: 'Deploys from GitHub',
		production: true,
	},
	{
		id: 2,
		href: '#',
		projectName: 'ios-app',
		teamName: 'Planetaria',
		status: 'online',
		statusText: 'Initiated 1m 32s ago',
		description: 'Deploys from GitHub',
		production: false,
	},
];

const Services = () => {
	return (
		<Fragment>
			{/* Secondary navigation (migrate to components) */}
			<nav tw="fixed flex overflow-x-auto border-b border-l border-l-white/5 border-white/10 py-4 z-50 bg-zinc-950/50 backdrop-blur-md w-full">
				<ul role="list" tw="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-zinc-400 sm:px-6 lg:px-8">
					{dashNav.map((item) => (
						<li key={item.name}>
							<Link to={item.to} className={onPage(item.to) ? 'text-indigo-400' : ''}>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
			</nav>
			<div tw="pt-14">
				<header tw="flex items-center justify-between border-b border-white/5 px-4 py-3 sm:px-6 sm:py-3 lg:px-8">
					<h1 tw="text-base font-semibold leading-7 text-white">Server Name</h1>
				</header>
				<ul role="list" className="divide-y divide-white/5">
					{deployments.map((deployment: any) => (
						<li key={deployment.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
							<div className="min-w-0 flex-auto">
								<div className="flex items-center gap-x-3">
									<div
										css={[
											deployment.status == 'online'
												? tw`text-green-400 bg-green-400/10 animate-pulse`
												: deployment.status == 'offline'
												? tw`text-zinc-500 bg-zinc-100/10`
												: tw`text-rose-400 bg-rose-400/10`,
											tw`flex-none rounded-full p-1`,
										]}>
										<div className="h-2 w-2 rounded-full bg-current" />
									</div>
									<h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
										<Link to={`/services/view/${deployment.id}?server=1`} className="flex gap-x-2">
											<span className="truncate">{deployment.teamName}</span>
											<span className="text-zinc-400">/</span>
											<span className="whitespace-nowrap">{deployment.projectName}</span>
											<span className="absolute inset-0" />
										</Link>
									</h2>
								</div>
								<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-zinc-400">
									<p className="truncate">{deployment.description}</p>
									<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-zinc-300">
										<circle cx={1} cy={1} r={1} />
									</svg>
									<p className="whitespace-nowrap">{deployment.statusText}</p>
								</div>
							</div>
							<div
								css={[
									deployment.production ? tw`text-indigo-400 bg-indigo-400/10 ring-indigo-400/30` : tw`text-zinc-400 bg-zinc-400/10 ring-zinc-400/20`,
									tw`rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset`,
								]}>
								{deployment.production ? 'Production' : 'Preview'}
							</div>
							<ChevronRightIcon className="h-5 w-5 flex-none text-zinc-400" aria-hidden="true" />
						</li>
					))}
				</ul>
				<header tw="flex items-center justify-between border-y border-white/5 px-4 py-3 sm:px-6 sm:py-3 lg:px-8">
					<h1 tw="text-base font-semibold leading-7 text-white">Server Name</h1>
				</header>
				<ul role="list" className="divide-y divide-white/5">
					{deployments.map((deployment: any) => (
						<li key={deployment.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
							<div className="min-w-0 flex-auto">
								<div className="flex items-center gap-x-3">
									<div
										css={[
											deployment.status == 'online'
												? tw`text-green-400 bg-green-400/10 animate-pulse`
												: deployment.status == 'offline'
												? tw`text-zinc-500 bg-zinc-100/10`
												: tw`text-rose-400 bg-rose-400/10`,
											tw`flex-none rounded-full p-1`,
										]}>
										<div className="h-2 w-2 rounded-full bg-current" />
									</div>
									<h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
										<Link to={`/services/view/${deployment.id}?server=1`} className="flex gap-x-2">
											<span className="truncate">{deployment.teamName}</span>
											<span className="text-zinc-400">/</span>
											<span className="whitespace-nowrap">{deployment.projectName}</span>
											<span className="absolute inset-0" />
										</Link>
									</h2>
								</div>
								<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-zinc-400">
									<p className="truncate">{deployment.description}</p>
									<svg viewBox="0 0 2 2" className="h-0.5 w-0.5 flex-none fill-zinc-300">
										<circle cx={1} cy={1} r={1} />
									</svg>
									<p className="whitespace-nowrap">{deployment.statusText}</p>
								</div>
							</div>
							<div
								css={[
									deployment.production ? tw`text-indigo-400 bg-indigo-400/10 ring-indigo-400/30` : tw`text-zinc-400 bg-zinc-400/10 ring-zinc-400/20`,
									tw`rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset`,
								]}>
								{deployment.production ? 'Production' : 'Preview'}
							</div>
							<ChevronRightIcon className="h-5 w-5 flex-none text-zinc-400" aria-hidden="true" />
						</li>
					))}
				</ul>
			</div>
		</Fragment>
	);
};

export default Services;
