import { ExcelComponent } from "../../core/ExcelComponent";
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
				case 'row':
					this.resizeRow(event);
					break;
				case 'col':
					this.resizeCol(event);
			}

		}
	}

	resizeCol(event) {

	}

	resizeRow(event) {
		const el = event.target;
		var positionHeight = el.getBoundingClientRect().bottom;
		const row = el.closest('.row');
		const table = el.closest('.excel__table');
		var heightRow = row.offsetHeight;
		var minHeightRow = 24;

		const calcNewHeight = (event) => {
			var newHeight = event.pageY - positionHeight;

			if (newHeight < 0 && heightRow - Math.abs(newHeight) <= minHeightRow) {
				el.style.top = minHeightRow + 'px';
				return;
			}

			newHeight += heightRow - 4;
			el.style.top = newHeight + 'px';
			el.style.opacity = 1;
			el.style.zIndex = 1;
		};

		const remove = () => {
			table.removeEventListener('mousemove', calcNewHeight);
			table.removeEventListener('mouseup', remove);
			row.style.height = el.style.top ? (el.style.top.replace(/[^0-9]/g, '') >= 24 ? el.style.top : row.style.height) : row.style.height;
			el.style.top = null;
			el.style.opacity = null;
			el.style.zIndex = null;
		};
		table.addEventListener('mousemove', calcNewHeight);
		table.addEventListener('mouseup', remove);
	}
}