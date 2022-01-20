import { ExcelComponent } from "../../core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";
import { TableSelection } from '@/components/table/TableSelection';
import { $ } from "../../core/dom";

export class Table extends ExcelComponent {
	static className = 'excel__table';
	static listKeys = ['Enter', 'Tab', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'];

	constructor($root) {
		super($root, {
			listeners: ['mousedown', 'keydown', 'dblclick']
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
		this.selection = new TableSelection(this.$root, this);
	}

	init() {
		super.init();

		const $cell = this.$root.find('[data-id="0:0"]');
		this.selection.select($cell);
		const rows = this.$root.findAll('.row');
		const cols = rows[1].findAll('.cell');
		// we will use this numbers for index, so subtract 1, first row hasn't index(col with letters)
		// so rows - 2
		this.tableSize = { rows: rows.length - 2, cols: cols.length - 1 };
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
		} else if (el.dataset.cell) {
			if (el.dataset.cell === 'selector') {
				this.selection.selectGroup($(el), true);
				return;
			}

			const $el = $($(el).closest('.cell'));

			if (shiftKey) {
				this.selection.selectGroup($el, false, true);
			} else {
				event.preventDefault();
				this.selection.select($el);
			}
		}
	}

	onDblclick(event) {
		const closestCell = $(event.target.closest('.cell') || event.target);
		closestCell.click();
	}

	onKeydown(event) {
		const key = event.key;
		const isSpecialKey = Table.listKeys.includes(key);

		this.selection.keypress(key, isSpecialKey, event);
	}
}