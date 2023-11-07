import { Context } from 'hono';
import { setCookie } from 'hono/cookie';

const logout = async (hono: Context) => {
	setCookie(hono, 'token', '', {
		expires: new Date(0),
		path: '/',
		secure: true,
		sameSite: 'None',
		httpOnly: true,
	});

	return hono.json({ message: 'logged out successfully' });
};

export default logout;
