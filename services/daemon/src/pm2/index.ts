import { bytesToSize, timeSince, actions } from './helpers';

const list = async (hono) => {
	const services = await actions.execute('list');

	return hono.json(
		services.map((service) => ({
			name: service.name,
			status: service.pm2_env.status,
			cpu: service.monit.cpu,
			log_stdout: service.pm2_env.pm_out_log_path,
			memory: bytesToSize(service.monit.memory),
			uptime: timeSince(service.pm2_env.pm_uptime),
			pm_id: service.pm_id,
		}))
	);
};

const raw = async (id) => {
	const services = await actions.cmd('describe', id);
	return Array.isArray(services) && services.length > 0 ? actions.info(services[0]) : null;
};

const info = async (hono) => {
	const id = hono.req.param('id');
	const services = await actions.cmd('describe', id);
	return Array.isArray(services) && services.length > 0 ? hono.json(actions.info(services[0])) : hono.json({ error: 404 }, 404);
};

const action = async (hono) => {
	const cmd = hono.req.param('cmd');
	const id = hono.req.param('id');
	return ['reload', 'stop', 'restart', 'delete'].includes(cmd)
		? actions.execute(cmd, id).then((data) => hono.json(data))
		: hono.json({ error: 404 }, 404);
};

export { default as logs } from './logs';
export default { list, info, action, raw };
