export function rootReducer(state, action) {
	switch (action.type) {
		case 'TABLE_RESIZE':
			const data = action.data;
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
		default:
			return state;
	}
}