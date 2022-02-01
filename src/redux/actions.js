import { INPUT, SELECT_CELL, TABLE_RESIZE } from "./types";

export function tableResize(data) {
	return {
		type: TABLE_RESIZE,
		data
	};
}

export function input(data) {
	return {
		type: INPUT,
		data
	};
}

export function selectCell(data) {
	return {
		type: SELECT_CELL,
		data
	};
}