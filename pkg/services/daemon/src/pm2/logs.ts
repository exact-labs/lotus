import fs from 'node:fs';

export default async (filePath, endBytes = null, linesPerRequest = 100) => {
	endBytes = parseInt(endBytes);
	linesPerRequest = parseInt(linesPerRequest);

	if (!filePath || linesPerRequest < 1 || isNaN(linesPerRequest) || endBytes === 0) {
		console.error('Input params error:', { filePath, linesPerRequest, endBytes });
		return Promise.resolve({ lines: [], nextKey: -1, linesPerRequest });
	}

	const fileSize = fs.statSync(filePath).size;
	const end = endBytes && endBytes >= 0 ? endBytes : fileSize;
	const dataSize = linesPerRequest * 200;
	const start = Math.max(0, end - dataSize);
	const file = Bun.file(filePath, 'utf-8').slice(start, end);

	return file.text().then((data) => {
		const nextKey = end - file.size;
		const lines = data.split('\n');
		lines.pop();

		return { lines, nextKey, linesPerRequest };
	});
};
