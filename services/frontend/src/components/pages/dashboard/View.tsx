import { useEffect, useState, Fragment } from 'react';
import tw, { css } from 'twin.macro';
import { classNames } from '@/helpers';
import { useParams } from 'react-router-dom';
import { PageContentBlock } from '@/components/elements/generic';

import {
	CheckIcon,
	BriefcaseIcon,
	CalendarIcon,
	ChevronDownIcon,
	ChevronRightIcon,
	CurrencyDollarIcon,
	LinkIcon,
	MapPinIcon,
	PencilIcon,
} from '@heroicons/react/20/solid';

import Downshift from 'downshift';
import { matchSorter } from 'match-sorter';
import daemon from '@/daemon';

const stats = [
	{ name: 'Status', value: 'online' },
	{ name: 'Uptime', value: '25', unit: 'hours' },
	{ name: 'Memory', value: '37', unit: 'mb' },
	{ name: 'CPU', value: '0.3', unit: '%' },
];

const logs = [
	"15:53:14.409 [INFO ] Copying the repository's data: RepositoryEntry{id=9dd45702-6fa8-11e8-99db-fa163e67f194, projectId=76bade28-2ce8-11e8-bb6e-fa163ee88118, name='non-root-uf', url='https://gecgithub01.walmart.com/ms-tf-logsearch/mls-splunk-uf.git', branch='master', commitId='null', path='null', secretId=28c1842a-67c0-11e8-94f9-fa163e67f194, secretName='mls-uf-pass_1', hasWebHook=true, secretStoreType=null}",
	"15:53:15.719 [INFO ] Storing policy 'concord-system' data",
	'15:53:15.768 [INFO ] Using entry point: default',
	'15:53:16.449 [INFO ] Applying policies...',
	'15:53:19.026 [INFO ] Acquired by: Concord-Agent: id=2fe38959-6d20-56a7-8e49-2bfbbc206741 (10.227.246.95)',
	'15:53:20.609 [INFO ] Process status: RUNNING',
	'Agent ID: 2fe38959-6d20-56a7-8e49-2bfbbc206741',
	'15:53:20.399 [INFO ] Checking the dependency policy',
	'Dependencies:',
	'mvn://com.walmartlabs.concord.plugins.basic:concord-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:slack-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:http-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:ansible-tasks:0.73.0',
	'mvn://com.walmartlabs.concord.plugins:oneops-tasks:0.38.0',
	'mvn://org.codehaus.groovy:groovy-all:2.4.12',
	'mvn://org.python:jython-standalone:2.7.1',
	'15:52:34.668 [INFO ] c.walmartlabs.concord.common.IOUtils - Using /tmp/concord as TMP',
	'15:52:34.688 [INFO ] c.w.concord.runner.ApiClientProvider - Using the API address: https://concord.prod.walmart.com',
	'15:52:34.735 [INFO ] com.walmartlabs.concord.runner.Main - run -> working directory: /tmp/concord/prefork5922007485562481227/payload',
	"15:53:20.635 [INFO ] c.w.concord.runner.ProcessHeartbeat - start ['d62e5717-deac-460b-8b41-5611f7084478'] -> running every 10000ms",
	'15:53:21.503 [INFO ] c.w.concord.plugins.log.LoggingTask - Done!',
	'Process finished with: 0',
	'15:53:22.637 [INFO ] Process status: SUSPENDED',
	'15:53:26.167 [INFO ] Acquired by: Concord-Agent: id=ebc293b8-b7a6-5243-8cd8-43f5d53b32d6 (10.227.177.129)',
	'15:53:27.777 [INFO ] Process status: RUNNING',
	'Agent ID: ebc293b8-b7a6-5243-8cd8-43f5d53b32d6',
	'15:53:27.571 [INFO ] Checking the dependency policy',
	'Dependencies:',
	'mvn://com.walmartlabs.concord.plugins.basic:concord-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:slack-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:http-tasks:0.78.1',
	'mvn://com.walmartlabs.concord.plugins.basic:ansible-tasks:0.73.0',
	'mvn://com.walmartlabs.concord.plugins:oneops-tasks:0.38.0',
	'mvn://org.codehaus.groovy:groovy-all:2.4.12',
	'mvn://org.python:jython-standalone:2.7.1',
	'15:52:42.254 [INFO ] c.walmartlabs.concord.common.IOUtils - Using /tmp/concord as TMP',
	'15:52:42.280 [INFO ] c.w.concord.runner.ApiClientProvider - Using the API address: https://concord.prod.walmart.com',
	'15:52:42.339 [INFO ] com.walmartlabs.concord.runner.Main - run -> working directory: /tmp/concord/prefork2927482960680256606/payload',
	"15:53:27.805 [INFO ] c.w.concord.runner.ProcessHeartbeat - start ['d62e5717-deac-460b-8b41-5611f7084478'] -> running every 10000ms",
	"15:53:39.198 [INFO ] c.w.c.plugins.slack.SlackClient - message ['mls_concord_deploy', '{as_user=true, channel=mls_concord_deploy, text=On-boarding task initiated for, Organization:bogrccc, Assembly:FSPT, Platform:MasterData}'] -> Response{ok=true, error='null'}",
	"15:53:39.199 [INFO ] c.w.concord.plugins.slack.SlackTask - Slack message sent into 'mls_concord_deploy' channel",
	'15:53:39.227 [INFO ] c.w.c.p.oneops.OneOpsClientTask - Getting IPs of FSPT/stg/MasterData/compute...',
	'15:53:40.693 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - Using a playbook: roles/Nonroot_splunk/tasks/install_nonroot.yml',
	'15:53:40.696 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - Using an inline inventory',
	'15:53:40.713 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - Using the private key: .tmp/private7201195688067236220.key',
	'15:53:42.278 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: Log filter is enabled...',
	'15:53:42.278 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: Ansible event recording started...',
	'15:53:42.278 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE:',
	'15:53:42.278 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: PLAY [all] *********************************************************************',
	"15:53:42.292 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: play strategy 'concord_linear'",
	'15:53:42.293 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: Loading policy from /tmp/concord/prefork2927482960680256606/payload/.concord/policy.json',
	'15:53:42.293 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Gathering Facts ] *************************************************************************',
	'15:53:43.075 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.133.177]',
	'15:53:43.138 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.129.167]',
	'15:53:43.413 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.68.65]',
	'15:53:43.442 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.74.166]',
	'15:53:43.467 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ include_vars ] *************************************************************************',
	'15:53:43.573 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE:  [WARNING]: While constructing a mapping from /tmp/concord/prefork2927482960680',
	'15:53:43.573 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: 256606/payload/roles/Nonroot_splunk/tasks/../../../vars/conf/oneops/bogrccc/FSP',
	'15:53:43.573 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: T/MasterData/stg/settings.yml, line 1, column 1, found a duplicate dict key',
	'15:53:43.573 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: (date). Using last defined value only.',
	'15:53:43.585 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.68.65]',
	'15:53:43.587 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE:  [WARNING]: While constructing a mapping from /tmp/concord/prefork2927482960680',
	'15:53:43.587 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: 256606/payload/roles/Nonroot_splunk/tasks/../../../vars/conf/oneops/bogrccc/FSP',
	'15:53:43.587 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: T/MasterData/stg/settings.yml, line 1, column 1, found a duplicate dict key',
	'15:53:43.587 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: (date). Using last defined value only.',
	'15:53:43.599 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.74.166]',
	'15:53:43.622 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE:  [WARNING]: While constructing a mapping from /tmp/concord/prefork2927482960680',
	'15:53:43.622 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: 256606/payload/roles/Nonroot_splunk/tasks/../../../vars/conf/oneops/bogrccc/FSP',
	'15:53:43.622 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: T/MasterData/stg/settings.yml, line 1, column 1, found a duplicate dict key',
	'15:53:43.622 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: (date). Using last defined value only.',
	'15:53:43.623 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE:  [WARNING]: While constructing a mapping from /tmp/concord/prefork2927482960680',
	'15:53:43.624 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: 256606/payload/roles/Nonroot_splunk/tasks/../../../vars/conf/oneops/bogrccc/FSP',
	'15:53:43.624 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: T/MasterData/stg/settings.yml, line 1, column 1, found a duplicate dict key',
	'15:53:43.624 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: (date). Using last defined value only.',
	'15:53:43.628 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.129.167]',
	'15:53:43.643 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.133.177]',
	'15:53:43.664 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Check if the user is already there ] *************************************************************************',
	'15:53:44.078 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.133.177]',
	'15:53:44.090 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.129.167]',
	'15:53:44.171 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.68.65]',
	'15:53:44.189 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.74.166]',
	'15:53:44.208 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Remove old splunk forwarder if present ] *************************************************************************',
	'15:53:44.245 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.68.65]',
	'15:53:44.262 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.74.166]',
	'15:53:44.263 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.133.177]',
	'15:53:44.283 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.129.167]',
	'15:53:44.292 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Check if UF is already running ] *************************************************************************',
	'15:53:44.571 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.133.177]',
	'15:53:44.591 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.38.129.167]',
	'15:53:44.640 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.68.65]',
	'15:53:44.654 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.74.166]',
	'15:53:44.678 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Create "app" group ] *************************************************************************',
	'15:53:44.708 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.68.65]',
	'15:53:44.729 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.74.166]',
	'15:53:44.729 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.133.177]',
	'15:53:44.737 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.129.167]',
	"15:53:44.751 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Create 'splunkuser' service user ] *************************************************************************",
	'15:53:44.772 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.68.65]',
	'15:53:44.807 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.118.74.166]',
	'15:53:44.811 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.133.177]',
	'15:53:44.822 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: skipping: [10.38.129.167]',
	'15:53:44.836 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Add "splunkuser" to "app" group ] *************************************************************************',
	'15:53:45.110 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: changed: [10.38.133.177]',
	'15:53:45.165 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: changed: [10.38.129.167]',
	'15:53:45.178 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: changed: [10.118.68.65]',
	'15:53:45.202 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: changed: [10.118.74.166]',
	'15:53:45.218 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: TASK [ Download splunk archive ] *************************************************************************',
	'15:53:46.915 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: [DEPRECATION WARNING]: Using tests as filters is deprecated. Instead of using',
	'15:53:46.915 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: `result|success` instead use `result is success`. This feature will be removed',
	'15:53:46.915 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: in version 2.9. Deprecation warnings can be disabled by setting',
	'15:53:46.915 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: deprecation_warnings=False in ansible.cfg.',
	'15:53:46.921 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.68.65]',
	'15:53:47.055 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: [DEPRECATION WARNING]: Using tests as filters is deprecated. Instead of using',
	'15:53:47.055 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: `result|success` instead use `result is success`. This feature will be removed',
	'15:53:47.055 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: in version 2.9. Deprecation warnings can be disabled by setting',
	'15:53:47.055 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: deprecation_warnings=False in ansible.cfg.',
	'15:53:47.060 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: ok: [10.118.74.166]',
	'15:53:47.233 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: [DEPRECATION WARNING]: Using tests as filters is deprecated. Instead of using',
	'15:53:47.233 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: `result|success` instead use `result is success`. This feature will be removed',
	'15:53:47.233 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: in version 2.9. Deprecation warnings can be disabled by setting',
	'15:53:47.233 [INFO ] c.w.c.p.ansible.RunPlaybookTask2 - ANSIBLE: deprecation_warnings=False in ansible.cfg.',
];

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
					<span key={index} tw=" text-gray-200">
						{chunk}
					</span>
				)
			)}
		</div>
	);
};

const LogViewer = () => {
	const [searchQuery, setSearchQuery] = useState('');
	const [searchOpen, setSearchOpen] = useState(false);
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

	return (
		<div>
			{searchOpen && (
				<div tw="z-50 fixed top-56 right-5 w-96 flex bg-gray-800 px-3 py-1 rounded-lg border border-gray-700 shadow">
					<input
						tw="grow bg-gray-800 p-2 border-0 text-white focus:ring-0 sm:text-sm"
						autoFocus
						placeholder="Filter logs..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<span tw="grow-0 text-gray-400 font-medium mt-1.5">{searchQuery && filtered.length + ' matches'}</span>
				</div>
			)}
			<div tw="p-5 break-words overflow-y-scroll font-mono" style={componentStyle}>
				{filtered.map((log, index) => (
					<LogRow key={index} match={searchQuery}>
						{log}
					</LogRow>
				))}
			</div>
		</div>
	);
};

const View = () => {
	const { id } = useParams();

	useEffect(() => {
		daemon.logs.out().then((data) => console.log(data));
	}, []);

	return (
		<Fragment>
			{/* Heading */}
			<div tw="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
				<div>
					<div tw="flex items-center gap-x-3">
						<h1 tw="flex gap-x-1 text-base leading-7">
							<a href="#" tw="font-semibold text-gray-400">
								oracle 155
							</a>
							<span tw="text-gray-600">/</span>
							<span tw="font-semibold text-white cursor-default">gamespeed api</span>
						</h1>
						<div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
							<div className="h-2 w-2 rounded-full bg-current" />
						</div>
						<div tw="order-first flex-none rounded-full bg-indigo-400/10 px-2 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-400/30 sm:order-none">
							develop:0ba12f1
						</div>
					</div>
					<p tw="text-xs leading-6 text-gray-400">9e2d1fba-c337-44a4-8fa2-451286f8128c-{id}</p>
				</div>
				<div tw="mt-5 flex lg:ml-4 lg:mt-0">
					<span>
						<button
							type="button"
							tw="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 saturate-[110%] border-gray-700 focus:ring-gray-500 bg-gray-800 text-gray-50 hover:bg-gray-700 px-3 py-1.5 text-sm font-semibold rounded-lg">
							Reload
						</button>
					</span>
					<span tw="ml-3">
						<button
							type="button"
							tw="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 saturate-[110%] border-amber-700/75 focus:ring-amber-600 bg-amber-600 text-white hover:bg-amber-700 hover:border-amber-700 px-3 py-1.5 text-sm font-semibold rounded-lg">
							Restart
						</button>
					</span>
					<span tw="sm:ml-3">
						<button
							type="button"
							tw="disabled:opacity-50 transition inline-flex items-center justify-center space-x-1.5 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:z-10 shrink-0 saturate-[110%] border-red-700/75 focus:ring-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 px-3 py-1.5 text-sm font-bold rounded-lg">
							Stop
						</button>
					</span>
				</div>
			</div>

			{/* Stats */}
			<div tw="grid grid-cols-1 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
				{stats.map((stat, statIdx) => (
					<div
						key={stat.name}
						className={classNames(
							statIdx % 2 === 1 ? 'sm:border-l' : statIdx === 2 ? 'lg:border-l' : '',
							'border-t border-white/5 py-6 px-4 sm:px-6 lg:px-8'
						)}>
						<p tw="text-sm font-medium leading-6 text-gray-400">{stat.name}</p>
						<p tw="mt-2 flex items-baseline gap-x-2">
							<span tw="text-4xl font-semibold tracking-tight text-white">{stat.value}</span>
							{stat.unit ? <span tw="text-sm text-gray-400">{stat.unit}</span> : null}
						</p>
					</div>
				))}
			</div>

			<LogViewer />
		</Fragment>
	);
};

export default View;
