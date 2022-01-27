export function rootReducer(state, action) {
	switch (action.type) {
		case 'TABLE_RESIZE':
			const colState = state.colState || {};
			colState[action.data.id] = action.data.value;
			console.log({ ...state, colState });
			return { ...state, colState };
		default:
			return state;
	}
}