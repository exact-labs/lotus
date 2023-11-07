import log from './logger';
import { Hono, Context } from 'hono';
import { serveStatic } from 'hono/bun';
import { cors } from 'hono/cors';
import { PrismaClient } from '@prisma/client';
import pm2, { logs } from './pm2';
// migrate to library
import { logger } from './middleware';
import { jwt } from 'hono/jwt';

import routes from './routes';
import daemon from './daemon';
import settings from './settings';

const app = new Hono();

/* read from config.toml */
const secret = 'it-is-very-secret';
const port = 9002;

app.use('*', cors());
app.use('/api/*', logger());

/* jwt */
app.use('/api/settings/*', await jwt({ cookie: 'token', secret }));
app.use('/api/daemon/*', await jwt({ cookie: 'token', secret }));
app.use('/api/refresh', await jwt({ cookie: 'token', secret }));
app.use('/api/metrics', await jwt({ cookie: 'token', secret }));

/* auth */
app.post('/api/login', (hono) => routes.login(hono));
app.post('/api/logout', (hono) => routes.logout(hono));
app.get('/api/refresh', (hono) => routes.refresh(hono));

/* settings */
app.post('/api/settings/daemon/add', (hono) => settings.add(hono));
app.post('/api/settings/daemon/rename', (hono) => hono.text('rename'));
app.post('/api/settings/daemon/remove', (hono) => hono.text('remove'));

/* daemon */
app.get('/api/daemon/list', (hono) => daemon.list(hono));
app.get('/api/daemon/:server/services', (hono) => daemon.services(hono));
app.get('/api/daemon/:server/overview', (hono) => daemon.overview(hono));
app.get('/api/daemon/:server/info/:id', (hono) => daemon.info(hono));
app.post('/api/daemon/:server/logs', (hono) => daemon.logs(hono));
app.post('/api/daemon/:server/action', (hono) => daemon.action(hono));

/* general api */
app.get('/api/metrics', (hono) => hono.text('metrics'));
app.post('/api/setup', async (hono): Promise<Response> => {
	const prisma = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });
	const existingUser = await prisma.users.findFirst();

	if (existingUser) {
		return hono.json({ success: false, message: 'Setup is already complete.' }, 403);
	}

	const { email, username, password } = await hono.req.json();
	const hash = await Bun.password.hash(password);
	const user = await prisma.users.create({ data: { email, username, hash } });

	return hono.json({ success: true });
});

/* spa */
app.use('/assets/*', serveStatic({ root: '../frontend/dist' }));
app.use('/*', serveStatic({ root: '../frontend/dist', path: 'index.html' }));

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
