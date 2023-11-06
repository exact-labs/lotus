import log from './logger';
import { Hono } from 'hono';
import pm2, { logs } from './pm2';
import { logger } from './middleware';
import { bearerAuth } from 'hono/bearer-auth';

const app = new Hono();

/* read from config.toml */
const token = 'test_token';
const port = 9001;

app.use('/d/*', bearerAuth({ token }));
app.use('*', logger());

/* routes */
app.get('/', (ctx) => ctx.redirect('/health'));
app.get('/health', (ctx) => ctx.json({ healthly: true }));
app.get('/d/list', (hono) => pm2.list(hono));
app.get('/d/info/:id', (hono) => pm2.info(hono));
app.get('/d/action/:cmd/:id', (hono) => pm2.action(hono));

app.get('/d/logs/:id', (hono) => {
	const id = hono.req.param('id');
	const type = hono.req.query('type');

	return pm2.raw(id).then((json) => {
		return logs(type == 'error' ? json.pm2.log.err : json.pm2.log.out).then((data) => hono.json(data));
	});
});

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
