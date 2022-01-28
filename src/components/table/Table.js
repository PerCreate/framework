import { ExcelComponent } from "../../core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";
import { TableSelection } from '@/components/table/TableSelection';
import { $ } from "../../core/dom";
import Events from "../../core/Events";
import * as actions from '@/redux/actions';

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
		const { colState, rowState } = this.store.state;
		const tableContent = createTable(150, colState, rowState);
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
		this.$listen(Events.Formula.INPUT, text => this.selection.currentSelectedCell.textCell(text));
		this.$listen(Events.Formula.PRESS_ENTER, () => this.selectCell());
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
		const textContainer = closestCell.find('.text').$el;
		closestCell.click();
		closestCell.setCursorAtEndElem(textContainer);
	}

	onKeydown(event) {
		const key = event.key;
		const isSpecialKey = Table.listKeys.includes(key);
		this.selection.keypress(key, isSpecialKey, event);
	}
}