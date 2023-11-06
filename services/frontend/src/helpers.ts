const classNames = (...classes: Array<any>) => classes.filter(Boolean).join(' ');

const toPascalCase = (str: string) => (str.match(/[a-zA-Z0-9]+/g) || []).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');

const humanNumber = (a: number, b = Math, c = b.log, d = 1e3, e = (c(a) / c(d)) | 0) =>
	(a / b.pow(d, e)).toFixed(1).replace(/\.0+$/, '') + (e ? 'KMBT'[--e] + '' : '');

export { classNames, toPascalCase, humanNumber };
