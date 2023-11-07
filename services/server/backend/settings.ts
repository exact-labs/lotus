import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';

// import from a global db file, with schema setup on startup
// use await prisma.$disconnect(); and await prisma.$connect();
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });

const add = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const { name, address, token } = await hono.req.json();

	const user = await prisma.users.findUnique({ where: { id: payload.id } });
	// add error handler
	const server = await prisma.server.create({
		data: {
			name,
			address,
			token,
			usersId: payload.id,
		},
	});

	return hono.json({ created: true, data: server });
};

export default { add };
