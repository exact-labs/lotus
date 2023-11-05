import pm2 from 'pm2';
import { bytesToSize, timeSince } from './helpers';

const actions = {
	cmd: (name, ...args) => new Promise((resolve, reject) => pm2[name](...args, (err, result) => (err ? reject(err) : resolve(result)))),
	execute: async (operation, ...args) => {
		await actions.cmd('connect');
		const result = await actions.cmd(operation, ...args);
		await actions.cmd('disconnect');

		return result;
	},
};

const list = async () => {
	const services = await actions.execute('list');

	return services.map((service) => ({
		name: service.name,
		status: service.pm2_env.status,
		cpu: service.monit.cpu,
		log_stdout: service.pm2_env.pm_out_log_path,
		memory: bytesToSize(service.monit.memory),
		uptime: timeSince(service.pm2_env.pm_uptime),
		pm_id: service.pm_id,
	}));
};

const info = async (id) => {
	const services = await actions.cmd('describe', id);

	if (Array.isArray(services) && services.length > 0) {
		const service = {
			name: services[0].name,
			status: services[0].pm2_env.status,
			cpu: services[0].monit.cpu,
			memory: {
				raw: services[0].monit.memory,
				formatted: bytesToSize(services[0].monit.memory),
			},
			uptime: {
				raw: services[0].pm2_env.pm_uptime,
				formatted: timeSince(services[0].pm2_env.pm_uptime),
			},
			pm2: {
				id: services[0].pm_id,
				cwd: services[0].pm2_env.pm_cwd,
				log: {
					out: services[0].pm2_env.pm_out_log_path,
					err: services[0].pm2_env.pm_err_log_path,
				},
			},
		};
		return service;
	}
	return { error: 404 };
};

const action = async (command, id) => {
	if (command == 'reload' || 'stop' || 'restart' || 'delete') {
		return await actions.execute(command, id);
	} else {
		return { error: 404 };
	}
};

export { default as logs } from './logs';
export default { list, info, action };
