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

	const { email, password } = await hono.req.json();
	const user = await prisma.users.findUnique({ where: { email } });
	const expires = new Date(new Date().setDate(new Date().getDate() + 7));

	if (!user || !(await Bun.password.verify(password, user.hash))) {
		return hono.json({ error: !user ? 'invalid email' : 'invalid password' }, 401);
	}

	const token = await sign({ id: user.id, email }, secret);
	setCookie(hono, 'token', token, {
		expires,
		path: '/',
		secure: true,
		sameSite: 'None',
		httpOnly: true,
	});

	delete user.hash;
	return hono.json({ user, token, expires });
};

export default login;
