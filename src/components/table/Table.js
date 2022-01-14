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
				case 'col':
					const col = el.closest('.column');
					let positionRight = el.getBoundingClientRect().right;
					let widthCol = col.offsetWidth;
					let minWidthCol = 120;
					this.resize(positionRight, widthCol, minWidthCol, event, 'col');
					break;
				case 'row':
					const row = el.closest('.row');
					let positionHeight = el.getBoundingClientRect().bottom;
					let heightRow = row.offsetHeight;
					let minHeightRow = 24;
					this.resize(positionHeight, heightRow, minHeightRow, event, 'row');
			}
		}
	}

	isNeedNewValue = (prop, minValue) => {
		if (!prop) return false;
		return prop.replace(/[^0-9]/g, '') >= minValue;
	};

	/**
	 * 
	 * @param {*} currentPosition position for calculating new value 
	 * @param {*} currentValue 
	 * @param {*} minValue 
	 * @param {*} event 
	 * @param {*} resizeElement 'col' or 'row'
	 */
	resize(currentPosition, currentValue, minValue, event, resizeElement) {
		const el = event.target;
		const excel = el.closest('.excel');
		const table = el.closest('.excel__table');
		const row = el.closest('.row');
		const col = el.closest('.column');

		const setValue = (element, value, show = false) => {
			switch (element) {
				case 'col':
					el.style.left = value + 'px';
					break;
				case 'row':
					el.style.top = value + 'px';
					break;
			}
			if (show) {
				el.style.opacity = 1;
				el.style.zIndex = 1;
			}
		};

		const startMoving = (event) => {
			var newValue;

			switch (resizeElement) {
				case 'col':
					newValue = event.pageX - currentPosition;
					break;
				case 'row':
					newValue = event.pageY - currentPosition;
					break;
			}

			if (newValue < 0 && currentValue - Math.abs(newValue) <= minValue) {
				setValue(resizeElement, minValue, false);
				return;
			}

			newValue += currentValue - 4; // 4 is width and height of dash switcher
			setValue(resizeElement, newValue, true);
		};

		const endMoving = () => {
			excel.removeEventListener('mousemove', startMoving);
			excel.removeEventListener('mouseup', endMoving);

			switch (resizeElement) {
				case 'row':
					row.style.height = this.isNeedNewValue(el.style.top, minValue) ? el.style.top : row.style.height;
					break;
				case 'col':
					const arr = Array.from(table.children);
					const closestRowData = col.closest('.row-data');
					const indexColumn = Array.from(closestRowData.children).indexOf(col);

					col.style.width = this.isNeedNewValue(el.style.left, minValue) ? el.style.left : col.style.width;
					arr.forEach(row => {
						const rowDataArr = Array.from(row.querySelector('.row-data').children);
						rowDataArr[indexColumn].style.width = this.isNeedNewValue(el.style.left, minValue) ? el.style.left : col.style.width;
					});
					break;
			}
			el.style = null;
		};

		excel.addEventListener('mousemove', startMoving);
		excel.addEventListener('mouseup', endMoving);
	}

	// resizeCol(event) {
	// 	const el = event.target;
	// 	var positionRight = el.getBoundingClientRect().right;
	// 	const col = el.closest('.column');
	// 	const excel = el.closest('.excel');
	// 	const table = el.closest('.excel__table');
	// 	var widthCol = col.offsetWidth;
	// 	var minWidthCol = 120;

	// 	const calcNewWidth = (event) => {
	// 		var newWidth = event.pageX - positionRight;
	// 		console.log(newWidth, widthCol, minWidthCol);
	// 		if (newWidth < 0 && widthCol - Math.abs(newWidth) <= minWidthCol) {
	// 			el.style.left = minWidthCol + 'px';
	// 			return;
	// 		}
	// 		newWidth += widthCol - 4;
	// 		el.style.left = newWidth + 'px';
	// 		el.style.opacity = 1;
	// 		el.style.zIndex = 1;
	// 	};

	// 	const remove = () => {
	// 		excel.removeEventListener('mousemove', calcNewWidth);
	// 		excel.removeEventListener('mouseup', remove);

	// 		const arr = Array.from(table.children);
	// 		const closestRowData = col.closest('.row-data');
	// 		const indexColumn = Array.from(closestRowData.children).indexOf(col);

	// 		col.style.width = this.isNeedNewValue(el.style.left, minWidthCol) ? el.style.left : col.style.width;
	// 		arr.forEach(row => {
	// 			const rowDataArr = Array.from(row.querySelector('.row-data').children);
	// 			rowDataArr[indexColumn].style.width = this.isNeedNewValue(el.style.left, minWidthCol) ? el.style.left : col.style.width;
	// 		});
	// 		el.style = null;
	// 	};
	// 	excel.addEventListener('mousemove', calcNewWidth);
	// 	excel.addEventListener('mouseup', remove);
	// }

	// resizeRow(event) {
	// 	const el = event.target;
	// 	var positionHeight = el.getBoundingClientRect().bottom;
	// 	const row = el.closest('.row');
	// 	const table = el.closest('.excel__table');
	// 	var heightRow = row.offsetHeight;
	// 	var minHeightRow = 24;

	// 	const calcNewHeight = (event) => {
	// 		var newHeight = event.pageY - positionHeight;

	// 		if (newHeight < 0 && heightRow - Math.abs(newHeight) <= minHeightRow) {
	// 			el.style.top = minHeightRow + 'px';
	// 			return;
	// 		}

	// 		newHeight += heightRow - 4;
	// 		el.style.top = newHeight + 'px';
	// 		el.style.opacity = 1;
	// 		el.style.zIndex = 1;
	// 	};

	// 	const remove = () => {
	// 		table.removeEventListener('mousemove', calcNewHeight);
	// 		table.removeEventListener('mouseup', remove);
	// 		row.style.height = this.isNeedNewValue(el.style.top, minHeightRow) ? el.style.top : row.style.height;
	// 		el.style = null;
	// 	};
	// 	table.addEventListener('mousemove', calcNewHeight);
	// 	table.addEventListener('mouseup', remove);
	// }
}