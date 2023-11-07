import log from './logger';

const timeoutMs = 2000;
const synchronousExecutionTimeMs = 1500;

const ignoreAfterTimeout = (timeout) => {
	return new Promise((resolve, reject) => {
		setTimeout(() => resolve(''), timeout);
	});
};

const promiseRace = (...promises) => {
	return new Promise((resolve, reject) => {
		for (const promise of promises) promise.then(resolve, reject);
	});
};

const git = async (args, cwd) => {
	const promise = new Promise(async (resolve, reject) => {
		const proc = Bun.spawn(['git'].concat(args.split(' ')), { cwd });
		const text = await await new Response(proc.stdout).text();
		resolve(text.trim());
	});

	return Promise.race([ignoreAfterTimeout(timeoutMs), promise]);
};

export default git;
