import { Store, State } from "./createStore";
import { copyDeep, isEqual } from "./utils";

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
				if (key === 'cellStyles') {
					console.log('prev:', this.prevState[key]);
					console.log('current', state[key]);
				}
				if (!isEqual(this.prevState[key], state[key])) {
					var changes = { [key]: state[key] };
					components.forEach((component: any) => {

						if (component.isWatching(key)) {
							component.storeChanged(changes);
						}
					});
					// working сделать глубокое копирование
					this.prevState = { ...this.prevState, ...changes };
				}
			});
		});
	}

	unsubscribeFromStore() {
		this.sub.unsubscribe();
	}
}