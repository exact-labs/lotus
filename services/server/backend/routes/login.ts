import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

/* read from config.toml */
const secret = 'it-is-very-secret';

const login = async (hono: Context) => {
	const prisma = new PrismaClient({
		// read from config, use dockerfile to run mongodb
		datasources: { db: { url: 'file:./dev.db' } },
	});

	const { username, password } = await hono.req.json();
	const user = await prisma.users.findUnique({ where: { username } });
	const expires = new Date(new Date().setDate(new Date().getDate() + 7));

	if (!user || !(await Bun.password.verify(password, user.hash))) {
		return hono.json({ error: !user ? 'invalid username' : 'invalid password' }, 401);
	}

	const token = await sign({ id: user.id, username }, secret);

	hono.header('Access-Control-Allow-Credentials', 'true');
	hono.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	hono.header('Access-Control-Allow-Headers', '*');
	// hono.header('Access-Control-Allow-Origin', hono.env.CLIENT_ORIGIN_URL);

	setCookie(hono, 'token', token, {
		expires,
		secure: true,
		sameSite: 'None',
		httpOnly: true,
	});

	delete user.hash;
	return hono.json({ user, token, expires });
};

export default login;
