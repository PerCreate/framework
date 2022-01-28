const CODES = {
	A: 65,
	Z: 90
};

function getStyles(state, index) {
	var styles = '';
	if (state[index]) {
		for (const style in state[index]) {
			styles += `${style}:${state[index][style]}`;
		}
	}
	return styles;
}

function createCell(rowIndex, colState = {}) {
	rowIndex += 1;

	return (cell, index) => {
		index += 1;
		var cellStyles = getStyles(colState, index);

		return `<div
			class="cell" 
			contenteditable
			data-cell=${index}
			data-id=${rowIndex}:${index}
			style="${cellStyles}"
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


function createCol(index, col, colState = {}) {
	var colStyles = getStyles(colState, index);

	return `
			<div
				class="column"
				data-col=${index}
				style="${colStyles}"
				unselectable="on"
				onselectstart="return false;"
				onmousedown="return false;"
				>
				${col}
				<div class="col-resize" data-resize="col"></div>
			</div>
	`;
}

function createRow(index, content, rowState = {}) {
	const resize = index ? `<div class="row-resize" data-resize="row"></div>` : '';
	var rowStyles = getStyles(rowState, index);

	return `
		<div class="row" data-row=${index || 0} style="${rowStyles}">
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
/**
 * 
 * @param {*} rowsCount 
 * @param {*} colState state from store for cols and cell
 * @param {*} rowState state from store for rows
 * @returns HTML Table element
 */
export function createTable(rowsCount = 15, colState, rowState) {
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

		rows.push(createRow(row + 1, cells, rowState));
	}

	return rows.join('');
}