import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

/* read from config.toml */
const secret = 'it-is-very-secret';
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });

const refresh = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const token = await sign({ id: payload.id, email: payload.email }, secret);
	const expires = new Date(new Date().setDate(new Date().getDate() + 7));
	const user = await prisma.users.findUnique({ where: { email: payload.email } });

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

export default refresh;
