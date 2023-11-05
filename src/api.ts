import { Hono } from 'hono';
import pm2, { logs } from './pm2';

const port = 9001;
const app = new Hono();

app.get('/', (c) => c.text('healthy'));
app.get('/list', (c) => pm2.list().then((json) => c.json(json)));
app.get('/info/:id', (c) => pm2.info(c.req.param('id')).then((json) => c.json(json)));
app.get('/logs/:id', (c) => pm2.info(c.req.param('id')).then((json) => logs(json.pm2.log.out).then((data) => c.json(data))));
app.get('/action/:name/:id', (c) => pm2.action(c.req.param('name'), c.req.param('id')).then((json) => c.json(json)));

console.log('started on port', port);

export default {
	port: port,
	fetch: app.fetch,
};
