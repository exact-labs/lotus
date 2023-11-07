import { Fragment } from 'react';
import tw from 'twin.macro';
import { onPage } from '@/helpers';
import { Link } from 'react-router-dom';
import { dashNav } from '@/globals';

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
		</Fragment>
	);
};

export default Services;
