import Events from "../../core/Events";
import { ExcelComponent, componentOptions } from "../../core/ExcelComponent";
import * as actions from '../../redux/actions';
import { isEqual } from "../../core/utils";
import { Dom } from "../../core/dom";

export class Formula extends ExcelComponent {
	static className = 'excel__formula';
	private input: Dom;

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Formula',
			listeners: ['input', 'keydown'],
			subscribe: ['currentText'],
			...options
		});

	}

	toHTML() {
		return `
			<div class="info">fx</div>
			<div class="input" contenteditable spellcheck="false"></div>
		`;
	}

	storeChanged(changes: any) {
		if (!isEqual(this.input.$el.innerText, changes.currentText)) {
			this.input.text(changes.currentText);
		}
	}

	init() {
		super.init();
		this.input = this.$root.find('.input');
		this.setInitialState();
	}

	setInitialState() {
		const contentFirstCell = this.store.state.cellState && (this.store.state.cellState['1:1']?.content || '');
		this.input.text(contentFirstCell);
	}

	onInput(event: Event) {
		const input = event.target as HTMLElement;
		this.$dispatch(Events.Formula.INPUT, input.innerText);
		setTimeout(() => this.updateStore(actions.input({ value: input.innerText })), 0);
	}

	onDestroy(event: string) {
		console.log('destroyed', this);
	}

	fillInput(text: string) {
		this.input.text(text);
	}

	onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.$dispatch(Events.Formula.PRESS_ENTER);
		}
	}
}