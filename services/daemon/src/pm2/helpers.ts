import pm2 from 'pm2';
import log from '../logger';

const bytesToSize = (bytes, precision) => {
	var kilobyte = 1024;
	var megabyte = kilobyte * 1024;
	var gigabyte = megabyte * 1024;
	var terabyte = gigabyte * 1024;

	if (bytes >= 0 && bytes < kilobyte) {
		return bytes + 'b';
	} else if (bytes >= kilobyte && bytes < megabyte) {
		return (bytes / kilobyte).toFixed(precision) + 'kb';
	} else if (bytes >= megabyte && bytes < gigabyte) {
		return (bytes / megabyte).toFixed(precision) + 'mb';
	} else if (bytes >= gigabyte && bytes < terabyte) {
		return (bytes / gigabyte).toFixed(precision) + 'gb';
	} else if (bytes >= terabyte) {
		return (bytes / terabyte).toFixed(precision) + 'tb';
	} else {
		return bytes + 'b';
	}
};

const timeSince = (date) => {
	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = Math.floor(seconds / 31536000);

	if (interval > 1) {
		return interval + ' yrs';
	}
	interval = Math.floor(seconds / 2592000);
	if (interval > 1) {
		return interval + ' months';
	}
	interval = Math.floor(seconds / 86400);
	if (interval > 1) {
		return interval + ' days';
	}
	interval = Math.floor(seconds / 3600);
	if (interval > 1) {
		return interval + ' hrs';
	}
	interval = Math.floor(seconds / 60);
	if (interval > 1) {
		return interval + ' minutes';
	}
	return Math.floor(seconds) + ' seconds';
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
