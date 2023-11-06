import log from './logger';

const getPath = (request: Request): string => {
	const match = request.url.match(/^https?:\/\/[^/]+(\/[^?]*)/);
	return match ? match[1] : '';
};

const humanize = (times: string[]) => {
	const [delimiter, separator] = [',', '.'];
	const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + delimiter));
	return orderTimes.join(separator);
};

const time = (start: number) => {
	const delta = Date.now() - start;
	return humanize([delta < 1000 ? delta + 'ms' : Math.round(delta / 1000) + 's']);
};

const colorStatus = (status: number) => {
	const out: { [key: string]: string } = {
		7: `\x1b[35m${status}\x1b[0m`,
		5: `\x1b[31m${status}\x1b[0m`,
		4: `\x1b[33m${status}\x1b[0m`,
		3: `\x1b[36m${status}\x1b[0m`,
		2: `\x1b[32m${status}\x1b[0m`,
		1: `\x1b[32m${status}\x1b[0m`,
		0: `\x1b[33m${status}\x1b[0m`,
	};

	const calculateStatus = (status / 100) | 0;
	return out[calculateStatus];
};

export const logger = () => {
	return async (c, next) => {
		const { method } = c.req;
		const path = getPath(c.req.raw);
		const start = Date.now();

		await next();
		const status = c.res.status == 500 ? 'error' : c.res.status == 404 ? 'warn' : 'info';
		log.g('http')[status](method, path, c.res.status, time(start));
	};
};
