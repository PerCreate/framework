import { ExcelComponent } from "@/js/core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";
import { TableSelection } from '@/js/components/table/TableSelection';
import { $ } from "@/js/core/dom";
import Events from "@/js/core/Events";
import * as actions from '@/js/redux/actions';
import { isEqual } from "@/js/core/utils";

export class Table extends ExcelComponent {
	static className = 'excel__table';
	static listKeys = ['Enter', 'Tab', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Backspace', 'Delete'];

	constructor($root, options) {
		super($root, {
			name: 'Table',
			listeners: ['mousedown', 'keydown', 'dblclick'],
			...options
		});
	}

	toHTML() {
		const state = this.store.state;
		const tableContent = createTable(150, state);
		const table = `
			<div class="table" tabindex="1">
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
		const $cell = this.$root.find('[data-id="1:1"]');
		this.selection.prepare();
		this.selection.select($cell);
		const rows = this.$root.findAll('.row');
		const cols = rows[1].findAll('.cell');
		// we will use this numbers for index, so subtract 1, first row hasn't index(col with letters)
		// so rows - 2
		this.tableSize = { rows: rows.length - 2, cols: cols.length - 1 };
		this.$listen(Events.Formula.INPUT, text => this.fillCurrentCell(text));
		this.$listen(Events.Formula.PRESS_ENTER, () => this.selectCell());
	}

	fillCurrentCell(text) {
		this.selection.currentSelectedCell.textCell(text);
		const id = this.selection.currentSelectedCell.id.join(':');
		this.updateStore(actions.input({ value: text, id }));
	}

	findCell(rowIndexCurrentCell, colIndexCurrentCell) {
		return this.$root.find(`[data-id="${rowIndexCurrentCell}:${colIndexCurrentCell}"]`);
	};

	findAllCells(rowIndexCurrentCell = null, colIndexCurrentCell) {
		if (rowIndexCurrentCell !== null) {
			return this.$root.findAll(`[data-id="${rowIndexCurrentCell}:${colIndexCurrentCell}"]`);
		} else {
			return this.$root.findAll(`[data-cell="${colIndexCurrentCell}"]`);
		}

	};

	selectCell() {
		// set cursor at the end of textContainer
		const textContainer = this.selection.currentSelectedCell.find('.text').$el;
		this.selection.currentSelectedCell.setCursorAtEndElem(textContainer);
	}

	async resizeTable(event, resizeElement) {
		try {
			const data = await tableResize(event, resizeElement, this);
			this.updateStore(actions.tableResize(data));
		} catch (err) {
			console.warn('Resize error', err.message);
		}
	}

	onMousedown(event) {
		var el = event.target;
		const shiftKey = event.shiftKey;
		// That mouse click could change cursor position in the input 
		if (el.isEqualNode(document.activeElement)) {
			return;
		}

		if (el.dataset.resize) {
			switch (el.dataset.resize) {
				case 'col':
					this.resizeTable(event, 'col');
					break;
				case 'row':
					this.resizeTable(event, 'row');
					break;
			}
		} else if (el.dataset.cell) {
			if (el.dataset.cell === 'selector') {
				this.selection.selectGroup($(el), true);
				return;
			}

			const $el = $($(el).closest('.cell'));
			event.preventDefault();
			if (shiftKey) {
				this.selection.selectGroup($el, false, true);
			} else {
				this.selection.select($el);
			}
		}
	}

	onDblclick(event) {
		const closestCell = $(event.target.closest('.cell') || event.target);
		this.selection.focusCell(closestCell);
	}

	onKeydown(event) {
		const key = event.key;
		const isSpecialKey = Table.listKeys.includes(key);
		this.selection.keypress(key, isSpecialKey, event);
	}
}