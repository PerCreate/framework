import { Store } from "./createStore";
import { Dom } from "./dom";
import { DomListener } from "./DomListener";
import { Emitter } from './Emitter';
import { action } from '../redux/actions';

export interface componentOptions {
	components: Array<ExcelComponent>;
	listeners: string[];
	name: string;
	store: Store;
	emitter: Emitter;
	subscribe: string[];
}

export class ExcelComponent extends DomListener {
	public store: Store;
	public emitter: Emitter;
	public subscribe: string[];
	public unSubscribers: Array<ReturnType<Store['subscribe']>> = [];

	constructor($root: Dom, options: componentOptions) {
		super($root, options.listeners);
		this.name = options.name;
		this.store = options.store;
		this.emitter = options.emitter;
		this.subscribe = options.subscribe || [];
		this.unSubscribers = [];

		this.prepare();
	};

	prepare() { }

	// Возвращает шаблон компонента
	toHTML() {
		return '';
	}

	$listen(event: string, fn: (...args: any) => void) {
		const unSub: any = this.emitter.listen(event, fn);
		this.unSubscribers.push(unSub);
	}

	$dispatch(event: string, ...args: any) {
		this.emitter.dispatch(event, ...args);
	}

	// Redux
	updateStore(action: action) {
		this.store.updateStore(action);
	}
	storeChanged(changes: any) { }

	isWatching(key: string) {
		return this.subscribe.includes(key);
	}

	init() {
		this.initDomListeners();
	}

	destroy() {
		this.removeDomListeners();
		this.unSubscribers.forEach(unSub => unSub.unsubscribe());
	}
}