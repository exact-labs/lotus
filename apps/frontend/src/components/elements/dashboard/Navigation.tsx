import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, XMarkIcon as XIconMini, CheckIcon } from '@heroicons/react/20/solid';
import { ChartBarSquareIcon, Cog6ToothIcon, FireIcon, ServerIcon, SignalIcon, XMarkIcon } from '@heroicons/react/24/outline';

import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';
import { PageContentBlock } from '@/components/elements/generic';

const navigation = [
	{ name: 'Services', href: '#', icon: ServerIcon, current: true },
	{ name: 'Deployments', href: '#', icon: FireIcon, current: false },
	{ name: 'Metrics', href: '#', icon: ChartBarSquareIcon, current: false },
	{ name: 'Settings', href: '#', icon: Cog6ToothIcon, current: false },
];

const servers = [
	{ id: 1, name: 'oracle ampere', href: '#', online: true },
	{ id: 2, name: 'oracle 155', href: '#', online: true },
	{ id: 3, name: 'gcloud', href: '#', online: false },
];

const Navigation = (props: { title: string; element: any }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
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
						<div tw="fixed inset-0 bg-gray-900/80" />
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
								<div tw="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
									<div tw="flex h-16 shrink-0 items-center">
										<img tw="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
									</div>
									<nav tw="flex flex-1 flex-col">
										<ul role="list" tw="flex flex-1 flex-col gap-y-7">
											<li>
												<ul role="list" tw="-mx-2 space-y-1">
													{navigation.map((item) => (
														<li key={item.name}>
															<a
																href={item.href}
																className={classNames(
																	item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
																	'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
																)}>
																<item.icon tw="h-6 w-6 shrink-0" aria-hidden="true" />
																{item.name}
															</a>
														</li>
													))}
												</ul>
											</li>
											<li>
												<div tw="text-xs font-semibold leading-6 text-gray-400">Your servers</div>
												<ul role="list" tw="-mx-2 mt-2 space-y-1">
													{servers.map((server) => (
														<li key={server.id}>
															<a
																href={server.href}
																css={[
																	server.online ? tw`text-gray-400` : tw`text-gray-600`,
																	tw`hover:bg-gray-800 flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold`,
																]}>
																<span
																	css={[
																		server.online ? tw`text-green-400 border-green-800 bg-gray-800` : tw`text-red-300 border-red-600 bg-red-900`,
																		tw`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium`,
																	]}>
																	{server.online ? (
																		<CheckIcon tw="h-3 w-3 shrink-0" aria-hidden="true" />
																	) : (
																		<XIconMini tw="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
																	)}
																</span>
																<span tw="truncate">{server.name}</span>
															</a>
														</li>
													))}
												</ul>
											</li>
											<li tw="-mx-6 mt-auto">
												<a href="#" tw="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
													<img
														tw="h-8 w-8 rounded-full bg-gray-800"
														src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
														alt=""
													/>
													<span tw="sr-only">Your profile</span>
													<span aria-hidden="true">Tom Cook</span>
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
				{/* Sidebar component, swap this element with another sidebar if you like */}
				<div tw="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
					<div tw="flex h-16 shrink-0 items-center">
						<img tw="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
					</div>
					<nav tw="flex flex-1 flex-col">
						<ul role="list" tw="flex flex-1 flex-col gap-y-7">
							<li>
								<ul role="list" tw="-mx-2 space-y-1">
									{navigation.map((item) => (
										<li key={item.name}>
											<a
												href={item.href}
												className={classNames(
													item.current ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
													'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
												)}>
												<item.icon tw="h-6 w-6 shrink-0" aria-hidden="true" />
												{item.name}
											</a>
										</li>
									))}
								</ul>
							</li>
							<li>
								<div tw="text-xs font-semibold leading-6 text-gray-400">Your servers</div>
								<ul role="list" tw="-mx-2 mt-1">
									{servers.map((server) => (
										<li key={server.id}>
											<a
												href={server.href}
												css={[
													server.online ? tw`text-gray-400` : tw`text-gray-600`,
													tw`hover:bg-gray-800 flex gap-x-2 rounded-md p-1.5 text-sm leading-6 font-semibold`,
												]}>
												<span
													css={[
														server.online ? tw`text-green-400 border-green-800 bg-gray-800` : tw`text-red-300 border-red-600 bg-red-900`,
														tw`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium`,
													]}>
													{server.online ? (
														<CheckIcon tw="h-3 w-3 shrink-0" aria-hidden="true" />
													) : (
														<XIconMini tw="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
													)}
												</span>
												<span tw="truncate">{server.name}</span>
											</a>
										</li>
									))}
								</ul>
							</li>
							<li tw="-mx-6 mt-auto">
								<a href="#" tw="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
									<img tw="h-8 w-8 rounded-full bg-gray-800" src="https://avatars.githubusercontent.com/u/32078755?v=4" alt="" />
									<span tw="sr-only">Your profile</span>
									<span aria-hidden="true">theMackabu</span>
								</a>
							</li>
						</ul>
					</nav>
				</div>
			</div>
			<div className="xl:hidden sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
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
