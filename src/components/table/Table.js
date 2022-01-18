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
		const tableContent = createTable();
		const table = `
			<div class="table">
				${tableContent}
			</div>
		`;
		return table;
	}

	select(event) {
		const el = event.target;
		const table = el.closest('.excel__table>.table');
		const cell = el.closest('.cell');
		const allCells = table.querySelectorAll('.cell');
		allCells.forEach(cell => cell.classList.remove('selected'));
		cell.classList.add('selected');
	}

	selectGroup(event) {
		const el = event.target;
		const excel = document.querySelector('.excel');
		const allCells = excel.querySelectorAll('.cell');
		const startCoords = { x: event.clientX, y: event.clientY };

		const startGroupSelecting = (event) => {
			var xPosition = event.clientX;
			var yPosition = event.clientY;

			if (startCoords.x >= xPosition) {
				xPosition = startCoords.x;
			}
			if (startCoords.y >= yPosition) {
				yPosition = startCoords.y;
			}
			const elUnderMouse = document.elementFromPoint(xPosition, yPosition);
			const closestCell = elUnderMouse.closest('.cell');
			allCells.forEach(cell => {
				const xCell = cell.getBoundingClientRect().left;
				const yCell = cell.getBoundingClientRect().top;
				const conditionSelected = (xCell > startCoords.x && yCell > startCoords.y) && (xCell < xPosition && yCell < yPosition);
				console.log(cell, xCell, yCell, xPosition, yPosition, startCoords, conditionSelected);
				if (conditionSelected) {
					console.log(cell);
				}
			});
			closestCell && closestCell.classList.add('selected');
		};

		const remove = () => {
			excel.removeEventListener('mousemove', startGroupSelecting);
			excel.removeEventListener('mouseup', remove);
		};

		excel.addEventListener('mousemove', startGroupSelecting);
		excel.addEventListener('mouseup', remove);
	};

	onMousedown(event) {
		const el = event.target;

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
			this.select(event);
			if (el.dataset.cell === 'selector') {
				this.selectGroup(event);
			}
		}
	}
}