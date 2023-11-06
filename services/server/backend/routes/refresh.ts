import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';
import { setCookie } from 'hono/cookie';
import { sign } from 'hono/jwt';

/* read from config.toml */
const secret = 'it-is-very-secret';

const refresh = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const token = await sign({ id: payload.id, username: payload.username }, secret);

	hono.header('Access-Control-Allow-Credentials', 'true');
	hono.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
	hono.header('Access-Control-Allow-Headers', '*');
	// hono.header('Access-Control-Allow-Origin', hono.env.CLIENT_ORIGIN_URL);

	setCookie(hono, 'token', token, {
		expires: new Date(new Date().setDate(new Date().getDate() + 7)),
		secure: true,
		sameSite: 'None',
		httpOnly: true,
	});

	return hono.json({ token });
};

export default refresh;
