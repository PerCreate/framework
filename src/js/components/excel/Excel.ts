import { $ } from './../../core/dom';
import { StoreSubscriber } from './../../core/StoreSubscriber';
import { componentOptions } from './../../core/ExcelComponent';
import { Emitter } from './../../core/Emitter';
import { Store } from "./../../core/createStore";

export class Excel {
	private $el: HTMLElement;
	private components: any[];
	private store: Store;
	private emitter: Emitter;
	private subscriber: StoreSubscriber;

	constructor(selector: string, options: componentOptions) {

		this.$el = document.querySelector(selector);
		this.components = options.components || [];
		this.store = options.store;
		this.emitter = new Emitter();
		this.subscriber = new StoreSubscriber(this.store);
	}

	getRoot() {
		const $root = $.create('div', 'excel');

		const componentOptions = {
			emitter: this.emitter,
			store: this.store
		};

		this.components = this.components.map(Component => {
			const $el = $.create('div', Component.className);
			const component = new Component($el, componentOptions);
			$el.html(component.toHTML());
			$root.append($el);
			return component;
		});

		return $root.$el;
	}

	render() {
		this.$el.append(this.getRoot());

		this.subscriber.subscribeComponents(this.components);
		this.components.forEach(Component => Component.init());
	}

	destroy() {
		this.subscriber.unsubscribeFromStore();
		this.components.forEach(component => component.destroy());
	}
}