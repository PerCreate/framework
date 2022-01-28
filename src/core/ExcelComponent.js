import { DomListener } from "./DomListener";

export class ExcelComponent extends DomListener {
	constructor($root, options = {}) {
		super($root, options.listeners);
		this.name = options.name;
		this.store = options.store;
		this.emitter = options.emitter;
		this.subscribe = options.subscribe || [];
		this.unSubscribers = [];

		this.prepare();
	}

	prepare() { }

	// Возвращает шаблон компонента
	toHTML() {
		return '';
	}

	$listen(event, fn) {
		const unSub = this.emitter.listen(event, fn);
		this.unSubscribers.push(unSub);
	}

	$dispatch(event, ...args) {
		this.emitter.dispatch(event, ...args);
	}

	// Redux
	updateStore(action) {
		this.store.updateStore(action);
	}
	storeChanged() { }

	isWatching(key) {
		return this.subscribe.includes(key);
	}

	init() {
		this.initDomListeners();
	}

	destroy() {
		this.removeDomListeners();
		this.unSubscribers.forEach(unSub => unSub());
	}
}