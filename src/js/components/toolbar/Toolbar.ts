import { ExcelStateComponent } from './../../core/ExcelStateComponent';
import { $, Dom } from './../../core/dom';
import { componentOptions } from "../../core/ExcelComponent";
import { createToolbar } from './toolbar.template';

export class Toolbar extends ExcelStateComponent {
	static className = 'excel__toolbar';
	public idCurrentCell: string;

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Toolbar',
			listeners: ['click'],
			subscribe: ['currentCell'],
			...options
		});
	}

	prepare() {
		//working сделать устоновку текщих значений при первом рендере(получать id текущей ячейки)
		const state = this.store.state?.cellStyles['1:1'];
		this.initState(state);
	}

	get template() {
		return createToolbar(this.state);
	}

	storeChanged(changes: any) {
		this.idCurrentCell = changes.currentCell;
		const value = this.store.state?.cellStyles[this.idCurrentCell];

		this.setState(value, false);
	}

	onClick(event: MouseEvent) {
		let $target = $(event.target as HTMLElement);

		if ($target.dataset.type === "button") {
			$target = $target.closest('.button') || $target;

			if ($target.dataset.active === "true") {
				let value = JSON.parse($target.dataset.inactivevalue);
				this.setState(value);
			} else {
				let value = JSON.parse($target.dataset.activevalue);
				this.setState(value);
			}
		}
	}

	toHTML() {
		return this.template;
	}
}