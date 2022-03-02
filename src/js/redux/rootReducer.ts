import { types } from "./types";
import { State } from '../core/createStore';
import { action } from './actions';

export function rootReducer(state: State, action: action) {
	const data = action.data;
	switch (action.type) {
		case types.TABLE_RESIZE:
			switch (data.resizeElement) {
				case 'col':
					var colState: State['colState'] = state.colState || {};
					colState[data.id] = Object.assign(colState[data.id] || {}, { width: data.value });
					return { ...state, colState };
				case 'row':
					var rowState: State['rowState'] = state.rowState || {};
					rowState[data.id] = Object.assign(rowState[data.id] || {}, { height: data.value });
					return { ...state, rowState };
				default:
					return { ...state };
			}
			break;
		case types.INPUT:
			var cellState: State['cellState'] = state.cellState || {};
			state = Object.assign(state, { currentText: data.value });
			if (!data.id) {
				return { ...state };
			}
			cellState[data.id] = Object.assign(cellState[data.id] || {}, { content: data.value });
			return { ...state, cellState, currentText: data.value };
			break;
		case types.SELECT_CELL:
			if (data.selectedCells?.length) {
				return { ...state, selectedCells: data.selectedCells };
			} else {
				state['selectedCells'] = [];
				return { ...state, currentText: data.value, currentCell: data.id };
			}
			break;
		case types.TOOLBAR_BUTTON:
			var cellStyles: State['cellStyles'] = state.cellStyles || {};

			if (state.selectedCells?.length) {
				state.selectedCells.forEach((cellId: string) => {
					cellStyles[cellId] = Object.assign(cellStyles[cellId] || {}, data.cellStyles);
				});
			} else {
				cellStyles[state.currentCell] = Object.assign(cellStyles[state.currentCell] || {}, data.cellStyles);
			}
			return { ...state, cellStyles };
			break;
		default:
			return state;
	}
}