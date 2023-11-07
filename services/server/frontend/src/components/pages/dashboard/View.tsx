import api from '@/api';
import { useEffect, useState, useRef, Fragment } from 'react';
import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { PageContentBlock, Spinner } from '@/components/elements/generic';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import { matchSorter } from 'match-sorter';
import InfiniteScroll from 'react-infinite-scroller';

const LogRow = ({ match, children }: any) => {
	const _match = match.toLowerCase();
	const chunks = match.length ? children.split(new RegExp('(' + match + ')', 'ig')) : [children];

	return (
		<div>
			{chunks.map((chunk: any, index: number) =>
				chunk.toLowerCase() === _match ? (
					<span key={index} tw="bg-yellow-400 text-black">
						{chunk}
					</span>
				) : (
					<span key={index} tw=" text-zinc-200">
						{chunk}
					</span>
				)
			)}
		</div>
	);
};

const LogViewer = (props: { server: number; id: number }) => {
	const [page, setPage] = useState(1);
	const [logs, setLogs] = useState<string[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchOpen, setSearchOpen] = useState(false);
	const lastRow = useRef<HTMLDivElement | null>(null);
	const [componentHeight, setComponentHeight] = useState(0);
	const filtered = (!searchQuery && logs) || matchSorter(logs, searchQuery);

	useEffect(() => {
		const updateComponentHeight = () => {
			const windowHeight = window.innerHeight;
			const newHeight = (windowHeight * 4.4) / 6;
			setComponentHeight(newHeight);
		};

		updateComponentHeight();
		window.addEventListener('resize', updateComponentHeight);

		return () => {
			window.removeEventListener('resize', updateComponentHeight);
		};
	}, []);

	const componentStyle = {
		height: componentHeight + 'px',
	};

	useEffect(() => {
		const handleKeydown = (event: any) => {
			if ((event.ctrlKey || event.metaKey) && event.key === 'f') {
				setSearchOpen(true);
				event.preventDefault();
			}
		};

		const handleKeyup = (event: any) => {
			if (event.key === 'Escape') {
				setSearchQuery('');
				setSearchOpen(false);
			}
		};

		const handleClick = (event: any) => {
			setSearchQuery('');
			setSearchOpen(false);
		};

		window.addEventListener('click', handleClick);
		window.addEventListener('keydown', handleKeydown);
		window.addEventListener('keyup', handleKeyup);

		return () => {
			window.removeEventListener('click', handleClick);
			window.removeEventListener('keydown', handleKeydown);
			window.removeEventListener('keyup', handleKeyup);
		};
	}, [searchOpen]);

	const loadLogs = () => {
		if (page != null) {
			api.daemon
				.logs(props.server, props.id, page, 'out')
				.then((data: any) => {
					setPage(data!.logs.nextPage);
					setLogs(data!.logs.lines.reverse().concat(logs));
				})
				.finally(() => lastRow.current?.scrollIntoView({ behavior: 'smooth' }));
		}
	};

	useEffect(() => {
		loadLogs();
	}, []);

	return (
		<div>
			{searchOpen && (
				<div tw="z-50 fixed top-56 right-5 w-96 flex bg-zinc-800/50 backdrop-blur-md px-3 py-1 rounded-lg border border-zinc-700 shadow">
					<input
						tw="grow bg-transparent p-2 border-0 text-white focus:ring-0 sm:text-sm"
						autoFocus
						placeholder="Filter logs..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<span tw="grow-0 text-zinc-400 font-medium mt-1.5">{searchQuery && filtered.length + ' matches'}</span>
				</div>
			)}
			<div tw="p-5 break-words overflow-y-scroll font-mono" style={componentStyle}>
				<InfiniteScroll pageStart={0} loadMore={loadLogs} hasMore={true} useWindow={false} isReverse={true} threshold={componentHeight}>
					{filtered.map((log, index) => (
						<LogRow key={index} match={searchQuery}>
							{log}
						</LogRow>
					))}
				</InfiniteScroll>
				<div ref={lastRow} />
			</div>
		</div>
	);
};

const View = () => {
	const { id } = useParams();
	const [info, setInfo] = useState<any>();
	const [loaded, setLoaded] = useState(false);
	const server = useSearchParams()[0].get('server');

	useEffect(() => {
		api.daemon
			.info(parseInt(server!), parseInt(id!))
			.then((data: any) => setInfo(data))
			.finally(() => setLoaded(true));
	}, []);

	if (!server || !loaded) {
		return (
			<div tw="h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	} else {
		return (
			<Fragment>
				{/* Heading */}
				<div tw="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-zinc-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
					<div>
						<div tw="flex items-center gap-x-3">
							<h1 tw="flex gap-x-1 text-base leading-7">
								<Link to={`/server/${info.server!.id}`} tw="font-semibold text-zinc-400">
									{info.server!.name}
								</Link>
								<span tw="text-zinc-600">/</span>
								<span tw="font-semibold text-white cursor-default">{info.info!.name}</span>
							</h1>
							<div tw="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
								<div tw="h-2 w-2 rounded-full bg-current" />
							</div>
							{info.git!.branch != '' && (
								<div tw="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
									{info.git!.branch}:{info.git!.commit}
								</div>
							)}
						</div>
						<p tw="text-xs leading-6 text-zinc-400">{info.info!.uuid}</p>
					</div>
					<div tw="mt-5 flex lg:ml-4 lg:mt-0">
						<span>
							<button
								type="button"
								tw="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-0 focus:ring-offset-0 focus:z-10 shrink-0 saturate-[110%] border-zinc-700 hover:border-zinc-600 bg-zinc-800 text-zinc-50 hover:bg-zinc-700 px-4 py-2 text-sm font-semibold rounded-lg">
								Reload
							</button>
						</span>
						<span tw="ml-3">
							<Menu as="div" tw="relative inline-block text-left">
								<div>
									<Menu.Button tw="transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-0 focus:ring-offset-0 focus:z-10 shrink-0 border-zinc-700 bg-transparent hover:bg-zinc-800 p-2 text-sm font-semibold rounded-lg">
										<EllipsisVerticalIcon tw="h-5 w-5 text-zinc-50" aria-hidden="true" />
									</Menu.Button>
								</div>

								<Transition
									as={Fragment}
									enter="transition ease-out duration-100"
									enterFrom="transform opacity-0 scale-95"
									enterTo="transform opacity-100 scale-100"
									leave="transition ease-in duration-75"
									leaveFrom="transform opacity-100 scale-100"
									leaveTo="transform opacity-0 scale-95">
									<Menu.Items tw="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-base divide-y divide-zinc-800/50">
										<div tw="p-1.5">
											<Menu.Item>
												{({ active }) => (
													<a href="#" className={classNames(active ? 'bg-blue-700/10 text-blue-500' : 'text-zinc-200', 'rounded-md block px-2 py-2')}>
														Redeploy
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a href="#" className={classNames(active ? 'bg-yellow-400/10 text-amber-500' : 'text-zinc-200', 'rounded-md block p-2')}>
														Terminate
													</a>
												)}
											</Menu.Item>
										</div>
										<div tw="p-1.5">
											<Menu.Item>
												{({ active }) => (
													<a href="#" className={classNames(active ? 'bg-zinc-800/80 text-zinc-50' : 'text-zinc-200', 'rounded-md block px-2 py-2')}>
														Rename
													</a>
												)}
											</Menu.Item>
											<Menu.Item>
												{({ active }) => (
													<a href="#" className={classNames(active ? 'bg-zinc-800/80 text-zinc-50' : 'text-zinc-200', 'rounded-md block p-2')}>
														View service metrics
													</a>
												)}
											</Menu.Item>
										</div>
										<div tw="p-1.5">
											<Menu.Item>
												{({ active }) => (
													<a href="#" className={classNames(active ? 'bg-zinc-800/80 text-red-400' : 'text-red-400', 'rounded-md block p-2')}>
														Delete
													</a>
												)}
											</Menu.Item>
										</div>
									</Menu.Items>
								</Transition>
							</Menu>
						</span>
					</div>
				</div>

				{/* Stats */}
				<div tw="grid grid-cols-1 bg-zinc-700/10 sm:grid-cols-2 lg:grid-cols-4">
					{info.stats!.map((stat: any, index: number) => (
						<div
							key={stat.name}
							className={classNames(
								index % 2 === 1 ? 'sm:border-l' : index === 2 ? 'lg:border-l' : '',
								'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8'
							)}>
							<p tw="text-sm font-medium leading-6 text-zinc-400">{stat.name}</p>
							<p tw="mt-2 flex items-baseline gap-x-2">
								<span tw="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
								{stat.unit ? <span tw="text-sm text-zinc-400">{stat.unit}</span> : null}
							</p>
						</div>
					))}
				</div>

				<LogViewer server={parseInt(server!)} id={parseInt(id!)} />
			</Fragment>
		);
	}
};

export default View;
