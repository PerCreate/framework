import { ExcelStateComponent } from './../../core/ExcelStateComponent';
import { $, Dom } from './../../core/dom';
import { componentOptions } from "../../core/ExcelComponent";
import { createToolbar } from './toolbar.template';

export class Toolbar extends ExcelStateComponent {
	static className = 'excel__toolbar';

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Toolbar',
			listeners: ['click'],
			...options
		});
	}

	prepare() {
		this.initState({});
	}

	get template() {
		return createToolbar(this.state);
	}

	onClick(event: MouseEvent) {
		let $target = $(event.target as HTMLElement);

		if ($target.dataset.type === "button") {
			$target = $target.closest('.button') || $target;
			let value = JSON.parse($target.dataset.value);
			if ($target.dataset.active === "true") {
				value[Object.keys(value)[0]] = 'none';
				this.setState(value);
			} else {
				this.setState(value);
			}
		}
	}

	toHTML() {
		return this.template;
	}
}