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
		this.$listen('cellKeypress', event => this.fillInput(event));
	}

	onInput(event) {
		console.log(event, 'input');

		this.$dispatch('formulaInput', event.target.innerText);
	}

	onDestroy(event) {
		console.log('destroyed', this);
	}

	fillInput(text) {
		console.log(text);
	}

	onKeydown(event) {
		console.log(document.activeElement);
		if (event.key === 'Enter') {
			event.preventDefault();
			this.$dispatch('focusSelectedCell');
		}
	}
}