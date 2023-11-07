import log from './logger';
import { Context } from 'hono';
import { PrismaClient } from '@prisma/client';

// import from a global db file, with schema setup on startup
// use await prisma.$disconnect(); and await prisma.$connect();
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./dev.db' } } });

const list = async (hono: Context) => {
	const servers = await prisma.server.findMany();
	const returnData = [];

	for (const server of servers) {
		try {
			const response = await fetch(`${server.address}/metrics`, {
				method: 'GET',
				headers: { Authorization: `Bearer ${server.token}` },
			});

			if (response.status >= 200 && response.status < 300) {
				server.status = 'online';
			} else {
				server.status = 'error';
			}

			returnData.push(server);
		} catch (error) {
			log.debug(error);
			server.status = 'offline';
			returnData.push(server);
		}
	}

	return hono.json(returnData);
};

const services = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const { server } = hono.req.param();

	const data = await prisma.server.findUnique({ where: { id: parseInt(server), usersId: payload.id } });
	const response = await fetch(`${data.address}/list`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${data.token}` },
	});

	const list = await response.json();
	return hono.json(list);
};

const logs = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const { server } = hono.req.param();
	const { id, type, page } = await hono.req.json();

	const data = await prisma.server.findUnique({ where: { id: parseInt(server), usersId: payload.id } });
	const response = await fetch(`${data.address}/logs/${id}?type=${type}&page=${page}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${data.token}` },
	});

	const logs = await response.json();
	return hono.json({ logs });
};

const info = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const { server, id } = hono.req.param();

	const data = await prisma.server.findUnique({ where: { id: parseInt(server), usersId: payload.id } });
	const response = await fetch(`${data.address}/info/${id}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${data.token}` },
	});

	const info = await response.json();
	const uptime = info.uptime.formatted.split(' ');
	const memory = info.memory.formatted.split(' ');

	const stats = [
		{ name: 'Status', value: info.status },
		{ name: 'Uptime', value: uptime[0].trim(), unit: uptime[1].trim() },
		{ name: 'Memory', value: memory[0].trim(), unit: memory[1].trim() },
		{ name: 'CPU', value: info.cpu, unit: '%' },
	];

	return hono.json({
		stats,
		server: {
			id: data.id,
			name: data.name,
		},
		info: {
			name: info.name,
			uuid: info.pm2.uuid,
		},
		git: info.git,
	});
};

const action = async (hono: Context) => {
	const payload = hono.get('jwtPayload');
	const extra = hono.req.query('extra');
	const { server } = hono.req.param();
	const { id, action } = await hono.req.json();

	const data = await prisma.server.findUnique({ where: { id: parseInt(server), usersId: payload.id } });
	const response = await fetch(`${data.address}/action/${action}/${id}?extra=${extra}`, {
		method: 'GET',
		headers: { Authorization: `Bearer ${data.token}` },
	});

	return hono.json({ [action]: true });
};

export default { logs, services, list, info, action };
