import { $, Dom } from "@/js/core/dom";
import * as actions from '@/js/redux/actions';

export class TableSelection {
	static selected = 'selected';
	static groupSelected = {
		left: 'leftBorder',
		right: 'rightBorder',
		top: 'topBorder',
		bottom: 'bottomBorder',
		middle: 'middleBorder',
		last: 'lastCell'
	};

	constructor($tableRoot, tableComponent) {
		this.group = [];
		this.$allCells = null;
		this.currentSelectedCell = null;
		//excel__table instanceof DOM
		this.$tableRoot = $tableRoot;
		//Table component
		this.tableComponent = tableComponent;
	}

	prepare() {
		//div.table === HTMLElement
		this.table = this.tableComponent.$root.$el.querySelector('.table');
	}

	// $el instanceof DOM === true
	async select($el) {
		if (!$el instanceof Dom) throw new Error(`${$el} is not an instance of Dom`);

		this.tableComponent.updateStore(actions.selectCell({ value: $el.$el.innerText }));

		if (this.currentSelectedCell && $el.$el.isEqualNode(this.currentSelectedCell.$el)) {
			return;
		}
		this.clear();
		const $closestCell = $($el.closest('.cell'));
		this.group.push($closestCell);
		this.currentSelectedCell = $closestCell;
		$closestCell.addClass(TableSelection.selected);
		$closestCell.addClass(TableSelection.groupSelected.last);

		// first click on cell will find all cells in the table
		if (!this.$allCells) {
			this.$allCells = this.$tableRoot.findAll('.cell');
			this.table.focus();
		}
	}

	clear() {
		this.group.forEach($cell => {
			$cell.removeAllClassBesides('cell');
		});
		this.table.focus();
		this.group = [];
	}

	focusCell($cell) {
		const textContainer = $cell.find('.text').$el;
		$cell.click();
		$cell.setCursorAtEndElem(textContainer);
		$cell.addClass('focused');
	}

	/**
	 * 
	 * @param {*} $el element typeof dom
	 * @param {*} selectorMoving boolean - is selecting happening by mousemove
	 * @param {*} shiftKey boolean - is selecting happening by click with shiftKey
	 */
	selectGroup($el, selectorMoving = false, shiftKey = false) {
		$el = $($el.closest('.cell'));

		var currentSelected = this.currentSelectedCell;
		var eventCoordsElem = $el.id;
		var eventRowIndex = +eventCoordsElem[0];
		var eventColIndex = +eventCoordsElem[1];

		if (this.group.length > 1 && !shiftKey) {
			eventCoordsElem = currentSelected.id;
			eventRowIndex = +eventCoordsElem[0];
			eventColIndex = +eventCoordsElem[1];
		}

		const selectingHandler = (mouseMove = false) => {
			var newGroup = [this.group[0]];
			this.group.forEach(cell => cell.removeAllClassBesides('cell', 'selected'));

			// Use for instead of forEach because we want to have opportunity to return when current
			// cells selected and unselected(what were selected before) that save out memory(increase performance)
			for (let i = 1; i < this.$allCells.length; i += 1) {
				var cell = this.$allCells[i];
				const coords = cell.id;
				const rowIndex = +coords[0];
				const colIndex = +coords[1];

				const eventRowIndex = +eventCoordsElem[0];
				const eventColIndex = +eventCoordsElem[1];

				const selectedCoords = currentSelected.id;
				const selectedRowIndex = +selectedCoords[0];
				const selectedColIndex = +selectedCoords[1];

				// Condition for selecting current cell. Compare coord current cell, started(selected) cell and last picked cell(eventCell) 
				const condition1 = (colIndex >= selectedColIndex && rowIndex > selectedRowIndex);
				const condition2 = (colIndex > selectedColIndex && rowIndex >= selectedRowIndex);
				const generalCondition = (colIndex <= eventColIndex && rowIndex <= eventRowIndex);
				const condition = generalCondition && (condition1 || condition2);

				// Add special class dependencies condition(where is current cell setted)
				if (condition) {
					newGroup.push(cell);
					cell.removeAllClassBesides('cell');
					if (colIndex === selectedColIndex) {
						cell.addClass(TableSelection.groupSelected.left);
					}
					if (rowIndex === selectedRowIndex) {
						cell.addClass(TableSelection.groupSelected.top);
					}
					if (colIndex === eventColIndex) {
						cell.addClass(TableSelection.groupSelected.right);
					}
					if (rowIndex === eventRowIndex) {
						cell.addClass(TableSelection.groupSelected.bottom);
					}
					if (condition1 && condition2) {
						cell.addClass(TableSelection.groupSelected.middle);
					}
					if (mouseMove && colIndex === eventColIndex && rowIndex === eventRowIndex) {
						// dynamic refresh this.group by every event
						// it allows don't check all another cells and save memory(good optimization practice)
						this.group = [...newGroup];
						return;
					}
				}
				this.group = [...newGroup];
			}
		};

		if (selectorMoving) {
			const startMoving = (event) => {
				// eventCoordsElem = this.currentSelectedCell.dataset.id.split(':');
				// Check if new cell under moving mouse has large coordinates then last coords
				const cellUnderMouse = event.target.closest('.cell') || event.target;
				// Check if mouse is out of bounds
				if (!cellUnderMouse.dataset.cell) {
					return;
				}

				var cellCoords = $(cellUnderMouse).id;
				var cellRowIndex = +cellCoords[0];
				var cellColIndex = +cellCoords[1];

				const condition1 = (cellRowIndex >= eventRowIndex && cellColIndex >= eventColIndex);
				// If new cell coords large than last, then set current coords as a new and run selectingHandler
				if (condition1) {
					eventCoordsElem = cellCoords;
					selectingHandler(true);
				}
			};
			// Don't forget to remove listeners
			const endMoving = (event) => {
				this.$tableRoot.off('mousemove', startMoving);
				this.$tableRoot.off('mouseup', endMoving);
				this.group[this.group.length - 1].addClass(TableSelection.groupSelected.last);
				this.table.focus();
			};

			this.$tableRoot.on('mousemove', startMoving);
			this.$tableRoot.on('mouseup', endMoving);
		} else {
			selectingHandler();
			this.group[this.group.length - 1].addClass(TableSelection.groupSelected.last);
		}
	}

	keypress(key, isSpecialKey, event) {
		const idCurrentCell = this.currentSelectedCell.id;
		const rowIndexCurrentCell = +idCurrentCell[0];
		const colIndexCurrentCell = +idCurrentCell[1];

		const { rows, cols } = this.tableComponent.tableSize;

		const isLastCell = colIndexCurrentCell === cols;
		const isLastRow = rowIndexCurrentCell === rows;
		const isFirstRow = rowIndexCurrentCell === 0;
		const isFirstCol = colIndexCurrentCell === 0;

		const isSelectedCellFocused = () => {
			const idActiveElement = document.activeElement?.dataset?.id?.split(':');
			if (!idActiveElement) return false;
			const rowActiveElement = +idActiveElement[0];
			const colActiveElement = +idActiveElement[1];
			return rowActiveElement === rowIndexCurrentCell && colActiveElement === colIndexCurrentCell;
		};

		var nextCell, text;
		nextCell = this.tableComponent.findCell(rowIndexCurrentCell, colIndexCurrentCell);
		var textContainer = nextCell.find('.text');

		const dispatchInput = () => {
			const id = idCurrentCell.join(':');
			// use timeout to execute dispatch after input event 
			setTimeout(() => this.tableComponent.updateStore(actions.input({ value: textContainer.$el.innerText, id })), 0);
		};

		if (isSelectedCellFocused() && key !== 'Enter') {
			dispatchInput();
			return;
		}

		if (!isSpecialKey && key.length === 1) {
			nextCell.textCell('');
			this.focusCell(nextCell);
			dispatchInput();
			return;
		}

		if (isSpecialKey) {
			event.preventDefault();
			switch (key) {
				case 'Enter':
					if (isSelectedCellFocused()) {
						if (isLastRow) return;
						nextCell = this.tableComponent.findCell(rowIndexCurrentCell + 1, colIndexCurrentCell);
						this.select(nextCell);
					} else {
						nextCell = this.tableComponent.findCell(rowIndexCurrentCell, colIndexCurrentCell);
						this.focusCell(nextCell);
					}
					break;
				case 'Tab':
				case 'ArrowRight':
					if (isLastCell) {
						if (isLastRow) return;
						nextCell = this.tableComponent.findCell(rowIndexCurrentCell + 1, 0);
					} else {
						nextCell = this.tableComponent.findCell(rowIndexCurrentCell, colIndexCurrentCell + 1);
					}
					this.select(nextCell);
					break;
				case 'ArrowDown':
					if (isLastRow) return;
					nextCell = this.tableComponent.findCell(rowIndexCurrentCell + 1, colIndexCurrentCell);
					this.select(nextCell);
					break;
				case 'ArrowUp':
					if (isFirstRow) return;
					nextCell = this.tableComponent.findCell(rowIndexCurrentCell - 1, colIndexCurrentCell);
					this.select(nextCell);
					break;
				case 'ArrowLeft':
					if (isFirstCol) {
						if (!isFirstRow) {
							nextCell = this.tableComponent.findCell(rowIndexCurrentCell - 1, colsInTable);
						}
					} else {
						nextCell = this.tableComponent.findCell(rowIndexCurrentCell, colIndexCurrentCell - 1);
					}
					this.select(nextCell);
					break;
				case 'Delete':
				case 'Backspace':
					if (!isSelectedCellFocused()) {
						nextCell.textCell('');
						nextCell.click();
						dispatchInput();
					}
					break;
				default:
					throw new Error(`condition for ${key} not found!`);
			}
		}
	}

}