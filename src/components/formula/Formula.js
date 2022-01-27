import Events from "../../core/Events";
import { ExcelComponent } from "../../core/ExcelComponent";

export class Formula extends ExcelComponent {
	static className = 'excel__formula';

	constructor($root, options) {
		super($root, {
			name: 'Formula',
			listeners: ['input', 'keydown'],
			...options
		});

	}

	toHTML() {
		return `
			<div class="info">fx</div>
			<div class="input" contenteditable spellcheck="false"></div>
		`;
	}

	init() {
		super.init();
		this.input = this.$root.find('.input');
		this.$listen(Events.Table.INPUT, event => this.fillInput(event));
		this.$listen(Events.Table.SELECTING_CELL, event => this.fillInput(event));
	}

	onInput(event) {
		this.$dispatch(Events.Formula.INPUT, event.target.innerText);
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