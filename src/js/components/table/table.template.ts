import { State } from "../../core/createStore";
import { convertStyles, parseStyles } from "../../core/utils";

const CODES = {
	A: 65,
	Z: 90
};

function getStyles(state: State['colState'] | State['rowState'], index: number) {
	var styles = '';
	if (state[index]) {
		for (const style in state[index]) {
			styles += `${style}:${state[index][style]}; `;
		}
	}
	return styles;
}

function getContent(state: State['cellState'], index: string) {
	if (state[index]) {
		return state[index].content;
	}
	return '';
}

function getCellState(state: State['cellState'], index: string) {
	if (state[index] && Object.keys(state[index]).length) {
		if (Object.keys(state[index]).length === 1) {
			if (Object.keys(state[index])[0] === 'content') {
				return '';
			}
		}

		var styles = {};

		for (const style in state[index]) {
			if (style === 'content') continue;

			const newFormatStyle = convertStyles(style);
			styles[newFormatStyle] = state[index][style];
		}
		return parseStyles(styles);
	}
	return '';
}

function createCell(rowIndex: number, colState = {}, cellState = {}, cellStyles = {}) {
	rowIndex += 1;

	return (cell: any, index: number) => {
		index += 1;
		var id = `${rowIndex}:${index}`;
		var cellStyle = getStyles(colState, index);
		var content = getContent(cellState, id);
		var currentCellState = getCellState(cellStyles, id);

		return `<div
			class="cell" 
			contenteditable
			data-cell=${index}
			data-id=${id}
			style="${cellStyle} ${currentCellState}"
			>
			${cell}
			<div class="text" data-cell="text">${content}</div>
			<div class="cell-selector" data-cell="selector" contenteditable="false">
				<div class="selector" data-cell="selector"></div>
			</div>
		</div>
	`;
	};
};


function createCol(index: number, col: any, colState = {}) {
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

function createRow(index: number, content: any, rowState = {}) {
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
export function createTable(rowsCount = 15, state: State) {
	const { rowState, colState, cellState, cellStyles } = state;
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
			.map(createCell(row, colState, cellState, cellStyles))
			.join('');

		rows.push(createRow(row + 1, cells, rowState));
	}

	return rows.join('');
}