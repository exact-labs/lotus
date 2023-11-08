import { Fragment } from 'react';
import tw, { css } from 'twin.macro';
import { onPage } from '@/helpers';
import { Link } from 'react-router-dom';
import { dashNav } from '@/globals';

const statuses = { Completed: '', Error: 'text-rose-400 bg-rose-400/10' };
const activityItems = [
	{
		user: {
			name: 'Michael Foster',
			imageUrl:
				'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
		},
		commit: '2d89f0c8',
		branch: 'main',
		status: 'Completed',
		duration: '25s',
		date: '45 minutes ago',
		dateTime: '2023-01-23T11:00',
	},
	// More items...
];

const Services = () => {
	return (
		<Fragment>
			{/* Secondary navigation (migrate to components) */}
			<nav tw="flex overflow-x-auto border-b border-white/10 py-4">
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

			<div tw="border-t border-white/10 pt-11">
				<h2 tw="px-4 text-base font-semibold leading-7 text-white sm:px-6 lg:px-8">Latest activity</h2>
				<table tw="mt-6 w-full whitespace-nowrap text-left">
					<colgroup>
						<col tw="w-full sm:w-4/12" />
						<col tw="lg:w-4/12" />
						<col tw="lg:w-2/12" />
						<col tw="lg:w-1/12" />
						<col tw="lg:w-1/12" />
					</colgroup>
					<thead tw="border-b border-white/10 text-sm leading-6 text-white">
						<tr>
							<th scope="col" tw="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8">
								User
							</th>
							<th scope="col" tw="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell">
								Commit
							</th>
							<th scope="col" tw="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20">
								Status
							</th>
							<th scope="col" tw="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20">
								Duration
							</th>
							<th scope="col" tw="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8">
								Deployed at
							</th>
						</tr>
					</thead>
					<tbody tw="divide-y divide-white/5">
						{activityItems.map((item: any) => (
							<tr key={item.commit}>
								<td tw="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
									<div tw="flex items-center gap-x-4">
										<img src={item.user.imageUrl} alt="" tw="h-8 w-8 rounded-full bg-gray-800" />
										<div tw="truncate text-sm font-medium leading-6 text-white">{item.user.name}</div>
									</div>
								</td>
								<td tw="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
									<div tw="flex gap-x-3">
										<div tw="font-mono text-sm leading-6 text-gray-400">{item.commit}</div>
										<span tw="inline-flex items-center rounded-md bg-gray-400/10 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-400/20">
											{item.branch}
										</span>
									</div>
								</td>
								<td tw="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
									<div tw="flex items-center justify-end gap-x-2 sm:justify-start">
										<time tw="text-gray-400 sm:hidden" dateTime={item.dateTime}>
											{item.date}
										</time>
										<div tw="text-green-400 bg-green-400/10 flex-none rounded-full p-1">
											<div tw="h-1.5 w-1.5 rounded-full bg-current" />
										</div>
										<div tw="hidden text-white sm:block">{item.status}</div>
									</div>
								</td>
								<td tw="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">{item.duration}</td>
								<td tw="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
									<time dateTime={item.dateTime}>{item.date}</time>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</Fragment>
	);
};

export default Services;
