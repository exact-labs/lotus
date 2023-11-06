import pm2 from 'pm2';
import log from '../logger';

const bytesToSize = (bytes, precision) => {
	if (isNaN(bytes) || bytes === 0) return '0b';

	const sizes = ['b', 'kb', 'mb', 'gb', 'tb'];
	const kilobyte = 1024;

	const index = Math.floor(Math.log(bytes) / Math.log(kilobyte));
	const size = (bytes / Math.pow(kilobyte, index)).toFixed(precision);
	return size + sizes[index];
};

const timeSince = (date) => {
	const now = new Date();
	const elapsedMilliseconds = now - date;

	const timeUnits = [
		{ unit: 'year', seconds: 31536000 },
		{ unit: 'month', seconds: 2592000 },
		{ unit: 'day', seconds: 86400 },
		{ unit: 'hour', seconds: 3600 },
		{ unit: 'minute', seconds: 60 },
		{ unit: 'second', seconds: 1 },
	];

	for (const { unit, seconds } of timeUnits) {
		const interval = Math.floor(elapsedMilliseconds / 1000 / seconds);

		if (interval >= 1) {
			return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
		}
	}

	return 'just now';
};

const actions = {
	cmd: (name, ...args) => new Promise((resolve, reject) => pm2[name](...args, (err, result) => (err ? reject(err) : resolve(result)))),
	execute: async (operation, ...args) => {
		await actions.cmd('connect');
		log.g('pm2').trace('connected to api');

		const result = await actions.cmd(operation, ...args);
		log.g('pm2').trace(`action [${operation}] executed`);

		await actions.cmd('disconnect');
		log.g('pm2').trace('disconnected from api');

		return result;
	},
	info: (service) => {
		return {
			name: service.name,
			status: service.pm2_env.status,
			cpu: service.monit.cpu,
			memory: {
				raw: service.monit.memory,
				formatted: bytesToSize(service.monit.memory),
			},
			uptime: {
				raw: service.pm2_env.pm_uptime,
				formatted: timeSince(service.pm2_env.pm_uptime),
			},
			pm2: {
				id: service.pm_id,
				uuid: service.pm2_env.unique_id,
				cwd: service.pm2_env.pm_cwd,
				log: {
					out: service.pm2_env.pm_out_log_path,
					err: service.pm2_env.pm_err_log_path,
				},
			},
		};
	},
};

export { bytesToSize, timeSince, actions };
