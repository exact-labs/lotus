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

const app = new Hono();

/* read from config.toml */
const secret = 'it-is-very-secret';
const port = 9002;

app.use('*', logger());
app.use('/api/daemon/*', await jwt({ cookie: 'token', secret }));
app.use('/api/refresh', await jwt({ cookie: 'token', secret }));

/* spa */
app.use('/assets/*', serveStatic({ root: '../frontend/dist' }));
app.use('/*', serveStatic({ root: '../frontend/dist', path: 'index.html' }));

/* auth */
app.post('/api/login', (hono) => routes.login(hono));
app.post('/api/logout', (hono) => routes.logout(hono));
app.get('/api/refresh', (hono) => routes.refresh(hono));

/* daemon */
app.get('/api/daemon/:server/overview', (hono) => hono.text('overview'));
app.get('/api/daemon/:server/info/:id', (hono) => hono.text('info'));
app.post('/api/daemon/:server/logs', (hono) => hono.text('logs'));
app.post('/api/daemon/:server/action', (hono) => hono.text('action'));

app.post('/api/setup', async (hono): Promise<Response> => {
	const prisma = new PrismaClient({
		datasources: { db: { url: 'file:./dev.db' } },
	});

	const existingUser = await prisma.users.findFirst();

	if (existingUser) {
		return hono.json({ message: 'Setup is already complete. A user exists.' });
	}

	const { username, password } = await hono.req.json();
	const hash = await Bun.password.hash(password);

	const user = await prisma.users.create({
		data: {
			username,
			hash,
		},
	});

	return hono.json({ data: user });
});

app.onError((err, hono) => {
	hono.status(500);

	return hono.json({
		success: false,
		message: err.message,
		data: null,
	});
});

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
