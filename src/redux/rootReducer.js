import * as types from '@/redux/types';

export function rootReducer(state, action) {
	const data = action.data;
	switch (action.type) {
		case types.TABLE_RESIZE:
			switch (data.resizeElement) {
				case 'col':
					var colState = state.colState || {};
					colState[data.id] = { ...colState[data.id], width: data.value };
					return { ...state, colState };
				case 'row':
					var rowState = state.rowState || {};
					rowState[data.id] = { ...rowState[data.id], height: data.value };
					return { ...state, rowState };
				default:
					return { ...state };
			}
			break;
		case types.INPUT:
			var cellState = state.cellState || {};
			state = { ...state, currentText: data.value };
			if (!data.id) {
				return { ...state };
			}
			cellState[data.id] = { ...cellState[data.id], content: data.value };
			return { ...state, cellState, currentText: data.value };
			break;
		case types.SELECT_CELL:
			return { ...state, currentText: data.value };
			break;
		default:
			return state;
	}
}