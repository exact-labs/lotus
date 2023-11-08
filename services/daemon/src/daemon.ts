import os from 'node:os';
import log from './logger';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pm2, { logs } from './pm2';
import { actions } from './pm2/helpers';
import { logger } from './middleware';
import { bearerAuth } from 'hono/bearer-auth';

const app = new Hono();
/* read from config.toml */
const token = 'test_token';
const port = 9001;

// app.use('*', bearerAuth({ token }));
app.use('*', logger());
app.use('*', cors());

/* routes */
app.get('/list', (hono) => pm2.list(hono));
app.get('/info/:id', (hono) => pm2.info(hono));
app.get('/action/:cmd/:id', (hono) => pm2.action(hono));

app.get('/logs/:id', (hono) => {
	const id = hono.req.param('id');
	const type = hono.req.query('type');
	const page = parseInt(hono.req.query('page'));

	return pm2.raw(id).then((json) => {
		return logs(type == 'error' ? json.pm2.log.err : json.pm2.log.out, page).then((data) => hono.json(data));
	});
});

/* metrics */
const dataBuffer = {
	memoryUsage: [],
	cpuUsage: [],
	loadAverage: [],
	uptime: [],
};

const getGraphData = async () => {
	/* pm2 */
	const services = await actions.executeRaw('list');

	const totals = {
		cpu: services.map((service) => service.monit.cpu).reduce((acc, value) => acc + value, 0),
		memory: services.map((service) => service.monit.memory).reduce((acc, value) => acc + value, 0),
	};

	/* system */
	const memoryUsage = process.memoryUsage().heapUsed;
	const cpuUsage = os.loadavg()[0];
	const loadAverage = os.loadavg();
	const uptime = os.uptime();

	let startUsage, endUsage;
	startUsage = process.cpuUsage();

	setTimeout(() => {
		endUsage = process.cpuUsage(startUsage);

		let totalUsage = endUsage.user + endUsage.system;
		totalUsage = totalUsage / 900;
		totalUsage = totalUsage / 900;

		let percentUsage = (totalUsage / 1) * 100;
		dataBuffer.cpuUsage.push(parseFloat((percentUsage + 1 + totals.cpu).toFixed(2)));
	}, 900);

	dataBuffer.memoryUsage.push(memoryUsage + totals.memory);
	dataBuffer.loadAverage.push(loadAverage[0]);
	dataBuffer.uptime.push(uptime);

	const bufferLength = 21;
	if (dataBuffer.memoryUsage.length > bufferLength) {
		dataBuffer.memoryUsage.shift();
		dataBuffer.cpuUsage.shift();
		dataBuffer.loadAverage.shift();
		dataBuffer.uptime.shift();
	}
};

setInterval(getGraphData, 1000);
app.get('/metrics', (hono) => hono.json({ online: true }));
app.get('/metrics/graphs', (hono) => hono.json(dataBuffer));

/* startup */
await actions.cmd('connect');
getGraphData();

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
