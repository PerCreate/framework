import { isEqual } from "./utils";

export class StoreSubscriber {
	constructor(store) {
		this.store = store;
		this.sub = null;
		this.prevState = {};
	}

	subscribeComponents(components) {
		this.prevState = this.store.getState();
		this.sub = this.store.subscribe(state => {
			Object.keys(state).forEach(key => {
				if (!isEqual(this.prevState[key], state[key])) {
					var changes = { [key]: state[key] };
					components.forEach(component => {
						if (component.isWatching(key)) {
							component.storeChanged(changes);
						}
					});
					this.prevState = { ...this.prevState, ...changes };
				}
			});
		});
	}

	unsubscribeFromStore() {
		this.sub.unsubscribe();
	}
}