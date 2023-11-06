import logs from './logs';

export default {
	logs: {
		out: (page: number = 1) => logs('out', page),
		error: (page: number = 1) => logs('error', page),
	},
};
