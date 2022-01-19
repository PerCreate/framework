import { ExcelComponent } from "../../core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";
import { TableSelection } from '@/components/table/TableSelection';
import { $ } from "../../core/dom";

export class Table extends ExcelComponent {
	static className = 'excel__table';

	constructor($root) {
		super($root, {
			listeners: ['mousedown']
		});
	}

	toHTML() {
		const tableContent = createTable(150);
		const table = `
			<div class="table">
				${tableContent}
			</div>
		`;
		return table;
	}

	prepare() {
		this.selection = new TableSelection(this.$root);
	}

	init() {
		super.init();

		const $cell = this.$root.find('[data-id="0:0"]');
		this.selection.select($cell);
	}

	onMousedown(event) {
		var el = event.target;
		const shiftKey = event.shiftKey;

		if (el.dataset.resize) {
			switch (el.dataset.resize) {
				case 'col':
					tableResize(event, 'col');
					break;
				case 'row':
					tableResize(event, 'row');
					break;
			}
		}

		if (el.dataset.cell) {
			if (el.dataset.cell === 'selector') {
				this.selection.selectGroup($(el), true);
			}

			const $el = $(el).closest('.cell');

			if (shiftKey) {
				this.selection.selectGroup($el);
			} else {
				this.selection.select($el);
			}
		}
	}
}