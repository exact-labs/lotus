import { Fragment } from 'react';
import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';

import { PageContentBlock } from '@/components/elements/generic';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon as XIconMini, CheckIcon } from '@heroicons/react/20/solid';
import { ChartBarSquareIcon, Cog6ToothIcon, FireIcon, ServerIcon, SignalIcon, XMarkIcon } from '@heroicons/react/24/outline';

const secondaryNavigation = [
	{ name: 'Overview', href: '#', current: true },
	{ name: 'Processes', href: '#', current: false },
	{ name: 'Activity', href: '#', current: false },
	{ name: 'Notifications', href: '#', current: false },
];

const Services = () => {
	return (
		<Fragment>
			{/* Secondary navigation */}
			<nav tw="flex overflow-x-auto border-b border-white/10 py-4">
				<ul role="list" tw="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
					{secondaryNavigation.map((item) => (
						<li key={item.name}>
							<a href={item.href} className={item.current ? 'text-indigo-400' : ''}>
								{item.name}
							</a>
						</li>
					))}
				</ul>
			</nav>
		</Fragment>
	);
};

export default Services;
