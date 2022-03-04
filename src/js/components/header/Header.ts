import { Dom } from "../../core/dom";
import { ExcelComponent, componentOptions } from "../../core/ExcelComponent";
import { changeTableTitle } from "../../redux/actions";

export class Header extends ExcelComponent {
	static className = 'excel__header';
	public tableTitle: string;

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Header',
			listeners: ['input'],
			...options
		});

	}
	init() {
		super.init();
	}

	onInput(event: Event) {
		const target = event.target as HTMLTextAreaElement;
		this.tableTitle = target.value;
		this.updateStore(changeTableTitle({ value: target.value }));
	}

	toHTML() {
		this.tableTitle = this.store.state.tableTitle || 'New table';

		return `
			<input type="text" class="input" value="${this.tableTitle}" />

			<div>

				<div class="button">
					<i class="material-icons">delete</i>
				</div>

				<div class="button">
					<i class="material-icons">exit_to_app</i>
				</div>

			</div>
		`;
	}
}