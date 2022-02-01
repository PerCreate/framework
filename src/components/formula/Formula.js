import Events from "../../core/Events";
import { ExcelComponent } from "../../core/ExcelComponent";
import * as actions from '@/redux/actions';
import { isEqual } from "../../core/utils";

export class Formula extends ExcelComponent {
	static className = 'excel__formula';

	constructor($root, options) {
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

	storeChanged(changes) {
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
		const contentFirstCell = this.store.state.cellState['1:1']?.content || '';
		this.input.text(contentFirstCell);
	}

	onInput(event) {
		this.$dispatch(Events.Formula.INPUT, event.target.innerText);
		setTimeout(() => this.updateStore(actions.input({ value: event.target.innerText })), 0);
	}

	onDestroy(event) {
		console.log('destroyed', this);
	}

	fillInput(text) {
		this.input.text(text);
	}

	onKeydown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			this.$dispatch(Events.Formula.PRESS_ENTER);
		}
	}
}