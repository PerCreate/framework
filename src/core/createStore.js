export class Store {
	constructor(rootReducer, initialState = {}) {
		this.state = rootReducer({ ...initialState }, { type: '__INIT__' });
		this.listeners = [];
		this.rootReducer = rootReducer;
	}

	subscribe(fn) {
		this.listeners.push(fn);
		return {
			unsubscribe() {
				listeners = listeners.filter(listener => listener !== fn);
			}
		};
	}
	updateStore(action) {
		this.state = this.rootReducer(this.state, action);
		this.listeners.forEach(listener => listener(this.state));
	}

	getState() {
		return this.state;
	}
}