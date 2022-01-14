const CODES = {
	A: 65,
	Z: 90
};

function createCell(cell) {
	return `
		<div class="cell"  contenteditable>${cell}</div>
	`;
}

function createCol(col) {
	return `
			<div
				class="column"
				unselectable="on"
				onselectstart="return false;"
				onmousedown="return false;"
				>
				${col}
				<div class="col-resize" data-resize="col"></div>
			</div>
	`;
}

function createRow(index, content) {
	const resize = index ? `<div class="row-resize" data-resize="row"></div>` : '';

	return `
		<div class="row">
			<div
				class="row-info"
				unselectable="on"
				onselectstart="return false;"
				onmousedown="return false;"
				>
				${index ? index : ''}
				${resize}
			</div>
			<div class="row-data">${content}</div>
		</div>
	`;
}
export function createTable(rowsCount = 150) {
	const colsCount = CODES.Z - CODES.A + 1;
	const rows = [];

	const cols = new Array(colsCount)
		.fill('')
		.map((el, index) => {
			return String.fromCharCode(CODES.A + index);
		})
		.map(createCol)
		.join('');

	rows.push(createRow(null, cols));

	for (let i = 0; i < rowsCount; i += 1) {
		const cells = new Array(colsCount)
			.fill('')
			.map(createCell)
			.join('');

		rows.push(createRow(i + 1, cells));
	}

	return rows.join('');
}