import { Dom } from "./dom";
import { capitalize } from "./utils";

export class DomListener {
	public $root: Dom;
	public listeners: string[];
	public name: string;

	constructor($root: Dom, listeners: string[] = []) {
		if (!$root) {
			throw new Error('no $root provided for DomListener!');
		}
		this.$root = $root;
		this.listeners = listeners;
	}

	initDomListeners() {
		this.listeners.forEach(listener => {
			const method = getMethodName(listener);
			if (!this[method]) {
				const name = this.name || '';
				throw new Error(`This method - ${method} isn't implemented in ${name} Component`);
			}
			this[method] = this[method].bind(this);
			this.$root.on(listener, this[method]);
		});
	}

	removeDomListeners() {
		this.listeners.forEach(listener => {
			const method = getMethodName(listener);
			this.$root.off(listener, this[method]);
		});
	}
}

function getMethodName(eventName: string) {
	return 'on' + capitalize(eventName);
}