import { types } from "./types";

interface data {
	id?: number | string;
	value?: string;
	resizeElement?: string;
}

export interface action {
	type: string;
	data: data;
}

export function tableResize(data: data): action {
	return {
		type: types.TABLE_RESIZE,
		data
	};
}

export function input(data: data): action {
	return {
		type: types.INPUT,
		data
	};
}

export function selectCell(data: data): action {
	return {
		type: types.SELECT_CELL,
		data
	};
}