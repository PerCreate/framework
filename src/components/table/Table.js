import { ExcelComponent } from "../../core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
	static className = 'excel__table';

	constructor($root) {
		super($root, {
			listeners: ['mousedown']
		});
	}

	toHTML() {
		return createTable();
	}

	onMousedown(event) {
		const el = event.target;

		if (el.dataset.resize) {
			switch (el.dataset.resize) {
				case 'col':
					tableResize(event, 'col');
					break;
				case 'row':
					tableResize(event, 'row');
			}
		}
	}
}