export default async (filePath, pageNumber = 1, linesPerPage = 50) => {
	if (!filePath || linesPerPage < 1 || isNaN(linesPerPage) || pageNumber < 1) {
		return { lines: [], nextPage: null, linesPerPage };
	}

	const file = Bun.file(filePath, 'utf-8');
	const data = await file.text();
	const lines = data.trim().split('\n').reverse();

	const startIndex = (pageNumber - 1) * linesPerPage;
	const endIndex = startIndex + linesPerPage;
	const pageLines = lines.slice(startIndex, endIndex);

	return { lines: pageLines, nextPage: pageLines.length >= linesPerPage ? pageNumber + 1 : null, linesPerPage };
};
