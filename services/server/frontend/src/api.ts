import ky from 'ky';

const auth = {
	login: async (credentials: { email: string; password: string }) => ky.post('/api/login', { json: credentials }).json(),
	refresh: async () => ky.get('/api/refresh').json(),
	logout: async () => ky.post('/api/logout'),
};

const daemon = {
	list: async () => ky.get(`/api/daemon/list`).json(),
	services: async (server: number) => ky.get(`/api/daemon/${server}/services`).json(),
	info: async (server: number, id: number) => ky.get(`/api/daemon/${server}/info/${id}`).json(),
	logs: async (server: number, id: number, page: number, type: string) => ky.post(`/api/daemon/${server}/logs`, { json: { id, page, type } }).json(),
};

export default { auth, daemon };
