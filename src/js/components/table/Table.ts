import { Dom } from './../../core/dom';
import { ExcelComponent, componentOptions } from "../../core/ExcelComponent";
import tableResize from "./table.resize";
import { createTable } from "./table.template";
import { TableSelection } from './TableSelection';
import { $ } from "./../../core/dom";
import Events from "./../../core/Events";
import * as actions from './../../redux/actions';

export class Table extends ExcelComponent {
	static className = 'excel__table';
	static listKeys = ['Enter', 'Tab', 'ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Backspace', 'Delete'];
	public selection: TableSelection;
	public tableSize: {
		rows: number;
		cols: number;
	};

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Table',
			listeners: ['mousedown', 'keydown', 'dblclick'],
			subscribe: ['cellStyles'],
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
		this.tableSize = { rows: rows.length - 1, cols: cols.length };
		this.$listen(Events.Formula.INPUT, text => this.fillCurrentCell(text));
		this.$listen(Events.Formula.PRESS_ENTER, () => this.selectCell());
	}

	fillCurrentCell(text: string) {
		this.selection.currentSelectedCell.textCell(text);
		const id = this.selection.currentSelectedCell.id.join(':');
		this.updateStore(actions.input({ value: text, id }));
	}

	findCell(rowIndexCurrentCell: number | string, colIndexCurrentCell: number | string) {
		return this.$root.find(`[data-id="${rowIndexCurrentCell}:${colIndexCurrentCell}"]`);
	};

	findAllCells(rowIndexCurrentCell: number | string = null, colIndexCurrentCell: number | string) {
		if (rowIndexCurrentCell !== null) {
			return this.$root.findAll(`[data-id="${rowIndexCurrentCell}:${colIndexCurrentCell}"]`);
		} else {
			return this.$root.findAll(`[data-cell="${colIndexCurrentCell}"]`);
		}

	};

	storeChanged(changes: any) {
		const cellStyles = changes[Object.keys(changes).filter((change: any) => change === 'cellStyles')[0]];
		const idCurrentCell = this.selection.currentSelectedCell.dataset.id;

		if (cellStyles) {
			for (const key in cellStyles) {
				if (idCurrentCell === key) {
					this.selection.currentSelectedCell.css(cellStyles[key]);
				}
			}

		}
	}

	selectCell() {
		// set cursor at the end of textContainer
		const textContainer = this.selection.currentSelectedCell.find('.text').$el;
		this.selection.currentSelectedCell.setCursorAtEndElem(textContainer);
	}

	async resizeTable(event: MouseEvent, resizeElement: string) {
		try {
			const data = await tableResize(event, resizeElement, this);
			this.updateStore(actions.tableResize(data));
		} catch (err) {
			console.warn('Resize error', err.message);
		}
	}

	onMousedown(event: MouseEvent) {
		var el = event.target as HTMLElement;
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

			const $el = $(el).closest('.cell');
			event.preventDefault();
			if (shiftKey) {
				this.selection.selectGroup($el, false, true);
			} else {
				this.selection.select($el);
			}
		}
	}

	onDblclick(event: MouseEvent) {
		const element = event.target as HTMLElement;
		const closestCell = $(element.closest('.cell') as HTMLElement || element);
		this.selection.focusCell(closestCell);
	}

	onKeydown(event: KeyboardEvent) {
		const key = event.key;
		const isSpecialKey = Table.listKeys.includes(key);
		this.selection.keypress(key, isSpecialKey, event);
	}
}