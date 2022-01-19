import { $ } from "../../core/dom";

export class TableSelection {
	static selected = 'selected';
	static groupSelected = {
		left: 'leftBorder',
		right: 'rightBorder',
		top: 'topBorder',
		bottom: 'bottomBorder',
		middle: 'middleBorder',
	};


	constructor($tableRoot) {
		this.group = [];
		this.$allCells = null;
		this.$tableRoot = $tableRoot;
	}

	// $el instanceof DOM === true
	select($el) {
		// first click on cell will find all cells in the table
		if (!this.$allCells) {
			this.$allCells = this.$tableRoot.findAll('.cell');
		}
		this.clear();
		const $closestCell = $($el.closest('.cell'));
		this.group.push($closestCell);
		$closestCell.addClass(TableSelection.selected);
	}

	clear() {
		this.group.forEach($cell => $cell.removeAllClassBesides('cell'));
		this.group = [];
	}

	selectGroup($el, selectorMoving = false) {
		$el = $($el.closest('.cell'));

		var currentSelected = this.group[0];
		var eventCoordsElem = $el.dataset.id.split(':');
		var eventRowIndex = +eventCoordsElem[0];
		var eventColIndex = +eventCoordsElem[1];

		const selectingHandler = (mouseMove = false) => {
			var newGroup = [this.group[0]];
			this.group.forEach(cell => cell.removeAllClassBesides('cell', 'selected'));

			for (let i = 1; i < this.$allCells.length; i += 1) {
				var cell = this.$allCells[i];
				const coords = cell.dataset.id.split(':');
				const rowIndex = +coords[0];
				const colIndex = +coords[1];

				const eventRowIndex = +eventCoordsElem[0];
				const eventColIndex = +eventCoordsElem[1];

				const selectedCoords = currentSelected.dataset.id.split(':');
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
				// Check if new cell under moving mouse has large coordinates then last coords
				const cellUnderMouse = event.target.closest('.cell') || event.target;
				// Check if mouse is out of bounds
				if (!cellUnderMouse.dataset.cell) {
					return;
				}

				var cellCoords = cellUnderMouse.dataset.id.split(':');
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
			};

			this.$tableRoot.on('mousemove', startMoving);
			this.$tableRoot.on('mouseup', endMoving);
		} else {
			selectingHandler();
		}
	}


}