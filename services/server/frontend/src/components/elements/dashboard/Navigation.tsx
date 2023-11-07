import { Fragment, useState, useEffect } from 'react';
import { Menu, Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon as XIconMini, CheckIcon } from '@heroicons/react/20/solid';
import { ChartBarSquareIcon, Cog6ToothIcon, FireIcon, ServerIcon, SignalIcon, XMarkIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

import api from '@/api';
import tw, { css } from 'twin.macro';
import { classNames, getGravatar } from '@/helpers';
import { PageContentBlock } from '@/components/elements/generic';
import { useStoreState } from 'easy-peasy';
import { store, ApplicationStore } from '@/state';
import Logo from '@/assets/images/logo.png';

const navigation = [
	{ name: 'Services', to: '/services', icon: ServerIcon },
	{ name: 'Deployments', to: '/deployments', icon: FireIcon },
	{ name: 'Metrics', to: '/metrics', icon: ChartBarSquareIcon },
	{ name: 'Settings', to: '/settings', icon: Cog6ToothIcon },
];

const onPage = (path: string) => {
	return location.pathname.startsWith(path.split('?')[0]);
};

const Navigation = (props: { title: string; element: any }) => {
	const [servers, setServers] = useState<any[]>([]);
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const user = useStoreState((state: ApplicationStore) => state.user.data?.user);

	const signOut = () => {
		api.auth.logout().then(() => {
			store.getActions().user.reset();
			location.reload();
		});
	};

	useEffect(() => {
		api.daemon.list().then((data: any) => setServers(data));
	}, []);

	return (
		<PageContentBlock title={props.title}>
			<Transition.Root show={sidebarOpen} as={Fragment}>
				<Dialog as="div" tw="relative z-50 xl:hidden" onClose={setSidebarOpen}>
					<Transition.Child
						as={Fragment}
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0">
						<div tw="fixed inset-0 bg-zinc-900/80" />
					</Transition.Child>

					<div tw="fixed inset-0 flex">
						<Transition.Child
							as={Fragment}
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full">
							<Dialog.Panel tw="relative mr-16 flex w-full max-w-xs flex-1">
								<Transition.Child
									as={Fragment}
									enter="ease-in-out duration-300"
									enterFrom="opacity-0"
									enterTo="opacity-100"
									leave="ease-in-out duration-300"
									leaveFrom="opacity-100"
									leaveTo="opacity-0">
									<div tw="absolute left-full top-0 flex w-16 justify-center pt-5">
										<button type="button" tw="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
											<span tw="sr-only">Close sidebar</span>
											<XMarkIcon tw="h-6 w-6 text-white" aria-hidden="true" />
										</button>
									</div>
								</Transition.Child>
								<div tw="flex grow flex-col gap-y-5 overflow-y-auto bg-zinc-900 px-6 ring-1 ring-white/10">
									<div tw="flex h-16 shrink-0 items-center">
										<img tw="h-8 w-auto" src={Logo} />
									</div>
									<nav tw="flex flex-1 flex-col">
										<ul role="list" tw="flex flex-1 flex-col gap-y-7">
											<li>
												<ul role="list" tw="-mx-2 space-y-1">
													{navigation.map((item) => (
														<li key={item.name}>
															<Link
																to={item.to}
																className={classNames(
																	onPage(item.to) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
																	'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
																)}>
																<item.icon tw="h-6 w-6 shrink-0" aria-hidden="true" />
																{item.name}
															</Link>
														</li>
													))}
												</ul>
											</li>
											<li>
												<div tw="text-xs font-semibold leading-6 text-zinc-400">Your servers</div>
												<ul role="list" tw="-mx-2 mt-2 space-y-1">
													{servers.map((server) => (
														<li key={server.id}>
															<Link
																to={`/server/${server.id}`}
																css={[
																	server.status == 'online' ? tw`text-zinc-400` : tw`text-zinc-600`,
																	tw`hover:bg-zinc-800 flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold`,
																]}>
																<span
																	css={[
																		server.status == 'online'
																			? tw`text-green-400 border-green-800 bg-zinc-800`
																			: tw`text-red-300 border-red-600 bg-red-900`,
																		tw`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium`,
																	]}>
																	{server.status == 'online' ? (
																		<CheckIcon tw="h-3 w-3 shrink-0" aria-hidden="true" />
																	) : (
																		<XIconMini tw="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
																	)}
																</span>
																<span tw="truncate">{server.name}</span>
															</Link>
														</li>
													))}
												</ul>
											</li>
											<li tw="-mx-6 mt-auto">
												<a href="#" tw="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-zinc-800">
													<img tw="h-8 w-8 rounded-full bg-zinc-800" src={getGravatar(user?.email)} alt="" />
													<span tw="sr-only">Your profile</span>
													<span aria-hidden="true">{user?.username}</span>
												</a>
											</li>
										</ul>
									</nav>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</Dialog>
			</Transition.Root>

			{/* Static sidebar for desktop */}
			<div tw="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
				<div tw="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
					<div tw="flex h-16 shrink-0 items-center">
						<img tw="h-8 w-auto" src={Logo} />
					</div>
					<nav tw="flex flex-1 flex-col">
						<ul role="list" tw="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" tw="-mx-2 space-y-1">
									{navigation.map((item) => (
										<li key={item.name}>
											<Link
												to={item.to}
												className={classNames(
													onPage(item.to) ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800',
													'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
												)}>
												<item.icon tw="h-6 w-6 shrink-0" aria-hidden="true" />
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li>
								<div tw="text-xs font-semibold leading-6 text-zinc-400">Your servers</div>
								<ul role="list" tw="-mx-2 mt-1">
									{servers.map((server) => (
										<li key={server.id}>
											<Link
												to={`/server/${server.id}`}
												css={[
													server.status == 'online' ? tw`text-zinc-400` : tw`text-zinc-600`,
													tw`hover:bg-zinc-800 flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold`,
												]}>
												<span
													css={[
														server.status == 'online' ? tw`text-green-400 border-green-800 bg-zinc-800` : tw`text-red-300 border-red-600 bg-red-900`,
														tw`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium`,
													]}>
													{server.status == 'online' ? (
														<CheckIcon tw="h-3 w-3 shrink-0" aria-hidden="true" />
													) : (
														<XIconMini tw="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
													)}
												</span>
												<span tw="truncate">{server.name}</span>
											</Link>
										</li>
									))}
								</ul>
							</li>
							<li tw="-mx-6 mt-auto">
								<Menu as="div" tw="relative inline-block text-left">
									<div>
										<Menu.Button
											className="group"
											tw="flex items-center gap-x-4 w-72 px-3.5 py-2 text-left hover:bg-zinc-900 focus:outline-none transition">
											<span tw="flex w-full justify-between items-center">
												<span tw="flex min-w-0 items-center justify-between space-x-3">
													<img tw="h-8 w-8 rounded-full bg-zinc-800" src={getGravatar(user?.email)} alt="" />
													<span tw="flex-1 flex flex-col min-w-0">
														<span tw="text-zinc-50 text-sm font-semibold truncate">{user?.username}</span>
														<span tw="text-zinc-400 font-normal text-xs truncate">{user?.email}</span>
													</span>
												</span>
												<ChevronUpDownIcon tw="flex-shrink-0 h-5 w-5 text-zinc-400 group-hover:text-zinc-500 transition" aria-hidden="true" />
											</span>
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
										<Menu.Items tw="-top-4 z-10 mx-3 origin-top absolute right-0 left-0 mt-1 divide-y divide-zinc-200 focus:outline-none -translate-y-full rounded-lg bg-zinc-900/80 backdrop-blur-md border border-zinc-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none text-base divide-y divide-zinc-800/50 text-sm">
											<div className="px-4 py-3">
												<p tw="text-zinc-400 text-xs">Signed in as</p>
												<p tw="font-medium text-zinc-200 truncate">{user?.email}</p>
											</div>
											<div tw="p-1.5">
												<Menu.Item>
													{({ active }) => (
														<Link
															to="/account"
															className={classNames(
																active ? 'bg-zinc-800/80 text-zinc-50' : 'text-zinc-300',
																'rounded-md block px-2.5 py-2 cursor-pointer'
															)}>
															View profile
														</Link>
													)}
												</Menu.Item>
												<Menu.Item>
													{({ active }) => (
														<a
															href="#"
															className={classNames(
																active ? 'bg-zinc-800/80 text-zinc-50' : 'text-zinc-300',
																'rounded-md block px-2.5 py-2 cursor-pointer'
															)}>
															Support
														</a>
													)}
												</Menu.Item>
											</div>
											<div tw="p-1.5">
												<Menu.Item>
													{({ active }) => (
														<a
															onClick={signOut}
															className={classNames(
																active ? 'bg-zinc-800/80 text-zinc-50' : 'text-zinc-300',
																'rounded-md block px-2.5 py-2 cursor-pointer'
															)}>
															Sign out
														</a>
													)}
												</Menu.Item>
											</div>
										</Menu.Items>
									</Transition>
								</Menu>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div className="xl:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-zinc-900 px-4 shadow-sm sm:px-6 lg:px-8">
				<button type="button" className="-m-2.5 p-2.5 text-white xl:hidden" onClick={() => setSidebarOpen(true)}>
					<span className="sr-only">Open sidebar</span>
					<Bars3Icon className="h-5 w-5" aria-hidden="true" />
				</button>
			</div>
			<div tw="xl:pl-72">{props.element}</div>
		</PageContentBlock>
	);
};

export default Navigation;
