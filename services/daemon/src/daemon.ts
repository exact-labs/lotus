import log from './logger';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import pm2, { logs } from './pm2';
import { logger } from './middleware';
import { bearerAuth } from 'hono/bearer-auth';

const app = new Hono();

/* read from config.toml */
const token = 'test_token';
const port = 9001;

app.use('*', bearerAuth({ token }));
app.use('*', logger());
app.use('*', cors());

/* routes */
app.get('/metrics', (ctx) => ctx.json({ online: true }));
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

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
