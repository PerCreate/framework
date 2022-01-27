const CODES = {
	A: 65,
	Z: 90
};
function createCell(rowIndex, colState) {

	return (cell, index) => {
		index += 1;
		rowIndex += 1;

		const style = colState[index];

		return `<div
			class="cell" 
			contenteditable
			data-cell=${index}
			data-id=${rowIndex}:${index}
			>
			${cell}
			<div class="text" data-cell="text"></div>
			<div class="cell-selector" data-cell="selector" contenteditable="false">
				<div class="selector" data-cell="selector"></div>
			</div>
		</div>
	`;
	};
};


function createCol(index, col) {
	return `
			<div
				class="column"
				data-col=${index}
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
export function createTable(rowsCount = 15, colState) {
	const colsCount = CODES.Z - CODES.A + 1;
	const rows = [];

	const cols = new Array(colsCount)
		.fill('')
		.map((el, index) => {
			return String.fromCharCode(CODES.A + index);
		})
		.map((el, index) => createCol(index + 1, el, colState))
		.join('');

	rows.push(createRow(null, cols));

	for (let row = 0; row < rowsCount; row += 1) {
		const cells = new Array(colsCount)
			.fill('')
			.map(createCell(row, colState))
			.join('');

		rows.push(createRow(row + 1, cells));
	}

	return rows.join('');
}