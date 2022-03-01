import { Store, State } from "./createStore";
import { deepMerge, isEqual } from "./utils";

export class StoreSubscriber {
	private store: Store;
	private sub: ReturnType<Store['subscribe']>;
	private prevState: State;

	constructor(store: Store) {
		this.store = store;
		this.sub = null;
	}

	subscribeComponents(components: any) {
		this.prevState = this.store.getState();
		this.sub = this.store.subscribe((state: State) => {
			Object.keys(state).forEach((key: keyof State) => {
				if (!isEqual(this.prevState[key], state[key])) {
					var changes = { [key]: state[key] };
					components.forEach((component: any) => {

						if (component.isWatching(key)) {
							component.storeChanged(changes);
						}
					});
					this.prevState = deepMerge(this.prevState, changes);
				}
			});
		});
	}

	unsubscribeFromStore() {
		this.sub.unsubscribe();
	}
}