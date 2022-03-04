import Events from "../../core/Events";
import { ExcelComponent, componentOptions } from "../../core/ExcelComponent";
import * as actions from '../../redux/actions';
import { isEqual } from "../../core/utils";
import { Dom } from "../../core/dom";
import { CustomError } from "../Error/CustomError";

export class Formula extends ExcelComponent {
	static className = 'excel__formula';
	private input: Dom;
	private currentText: string;
	//working сделать запоминание ошибки парсера для конкретной ячейки.(в самой ячейки пишем ERROR, но строка формула должна запоминать выражение, и если оно есть, отображать его вместо теста ячейки)
	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Formula',
			listeners: ['input', 'keydown'],
			subscribe: ['currentText'],
			...options
		});
	}

	toHTML(error?: string) {
		return `
			<div class="info ${error ? 'error' : ''}">fx</div>
			<div class="input-block">
				<div class="input" contenteditable spellcheck="false">${this.currentText}</div>
				${error || ''}
			</div>
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
		if (this.store.state.cellState) {
			var contentFirstCell = this.store.state.cellState['1:1']?.content;
		}
		this.input.text(contentFirstCell || '');
		this.currentText = contentFirstCell || '';
	}

	onInput(event: Event) {
		const input = event.target as HTMLElement;
		this.currentText = input.innerText;
		this.setNewValue(input.innerText);
	}

	setNewValue(value: string) {
		this.$dispatch(Events.Formula.INPUT, value);
		setTimeout(() => this.updateStore(actions.input({ value: value })), 0);
	}

	onDestroy(event: string) {
		console.log('destroyed', this);
	}

	fillInput(text: string) {
		this.input.text(text);
	}
	//working сдлать парсер отдельным классом
	parse(str: string) {
		var expression: string = "return ";
		var valueToReplace = /[\s=]+/gi;

		if (!str.length) return new Function('return ""');
		if (!str.startsWith('=')) return new Function(`return ${str}`);

		const numbers = '0123456789';
		const allowedSymbols: string = '*-+/()';

		str = str.replaceAll(valueToReplace, '');

		for (let i = 0; i < str.length; i += 1) {
			if (numbers.includes(str[i])) {
				expression += str[i];
			} else if (allowedSymbols.includes(str[i])) {
				expression += " " + str[i];
			}
		}

		return new Function(expression);
	}

	onKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			try {
				var result: string = this.currentText;
				if (this.currentText.startsWith('=')) {
					var func: Function = this.parse(this.currentText);
					result = func.call(this);
				}
				this.setNewValue(result);
				this.$dispatch(Events.Formula.PRESS_ENTER);
			} catch (err) {
				const message = "Can't parse this expression.";
				const errorMessage = new CustomError(message).error;
				this.onError(errorMessage);
				throw new Error(err);
			}
		}
	}

	onError(errorMessage: string) {
		this.destroy();
		this.$root.html(this.toHTML(errorMessage));
		this.init();
		setTimeout(() => {
			this.destroy();
			this.$root.html(this.toHTML());
			this.init();
		}, 3000);
		this.setNewValue('#ERROR!');
	}
}