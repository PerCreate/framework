import { DomListener } from "./DomListener";

export class ExcelComponent extends DomListener {
	constructor($root, options = {}) {
		super($root, options.listeners);
		this.name = options.name;
		this.emitter = options.emitter;
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

	init() {
		this.initDomListeners();
	}

	destroy() {
		this.removeDomListeners();
		this.unSubscribers.forEach(unSub => unSub());
	}
}