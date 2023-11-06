import log from './logger';
import { Hono, Context } from 'hono';
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
app.use('*', cors());
app.use('/api/*', jwt({ secret }));

/* routes */
app.post('/login', (hono) => routes.login(hono));
app.get('/api/:server/overview', (hono) => hono.text('overview'));
app.get('/api/:server/info/:id', (hono) => hono.text('info'));
app.post('/api/:server/logs', (hono) => hono.text('logs'));
app.post('/api/:server/action', (hono) => hono.text('action'));

app.post('/setup', async (hono): Promise<Response> => {
	const prisma = new PrismaClient({
		datasources: { db: { url: 'file:./dev.db' } },
	});

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

log.g('startup').success('running on port:', port);
export default {
	port: port,
	fetch: app.fetch,
};
