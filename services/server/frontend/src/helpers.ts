import md5 from 'md5';

const classNames = (...classes: Array<any>) => classes.filter(Boolean).join(' ');

const toPascalCase = (str: string) => (str.match(/[a-zA-Z0-9]+/g) || []).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

const humanNumber = (a: number, b = Math, c = b.log, d = 1e3, e = (c(a) / c(d)) | 0) =>
	(a / b.pow(d, e)).toFixed(1).replace(/\.0+$/, '') + (e ? 'KMBT'[--e] + '' : '');

const onPage = (path: string) => {
	return location.pathname.endsWith(path.split('?')[0]);
};

const getGravatar = (email: string | undefined) => {
	if (!email) return '';
	const emailHash = md5(email);
	return `https://www.gravatar.com/avatar/${emailHash}`;
};

export { classNames, toPascalCase, humanNumber, onPage, getGravatar };
