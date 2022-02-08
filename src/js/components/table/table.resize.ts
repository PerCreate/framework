import { Table } from './Table';
import { $ } from "../../core/dom";

/**
	 * 
	 * @param {*} currentPosition position for calculating new value 
	 * @param {*} currentValue 
	 * @param {*} minValue 
	 * @param {*} event 
	 * @param {*} resizeElement 'col' or 'row'
	 */
export default (event: Event, resizeElement: string, tableComponent: Table) => {
	return new Promise(resolve => {
		const el = event.target as HTMLElement;
		const row = el.closest('.row') as HTMLElement;
		const col = el.closest('.column') as HTMLElement;
		var currentPosition: number, currentValue: number, minValue: number;

		switch (el.dataset.resize) {
			case 'col':
				currentPosition = el.getBoundingClientRect().right;
				currentValue = col.offsetWidth;
				minValue = 120;
				break;
			case 'row':
				currentPosition = el.getBoundingClientRect().bottom;
				currentValue = row.offsetHeight;
				minValue = 24;
		}

		const isNeedNewValue = (prop: string, minValue: number) => {
			if (!prop) return false;
			return +prop.replace(/[^0-9]/g, '') >= minValue;
		};

		const setValue = (element: string, value: number | string, show = false) => {
			switch (element) {
				case 'col':
					el.style.left = value + 'px';
					break;
				case 'row':
					el.style.top = value + 'px';
					break;
			}
			if (show) {
				el.style.opacity = '1';
				el.style.zIndex = '1';
			}
		};

		const startMoving = (event: MouseEvent) => {
			var newValue;

			switch (resizeElement) {
				case 'col':
					newValue = event.clientX - currentPosition;
					break;
				case 'row':
					newValue = event.clientY - currentPosition;
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
			document.removeEventListener('mousemove', startMoving);
			document.removeEventListener('mouseup', endMoving);

			var value: string, indexColumn, indexRow;
			switch (resizeElement) {
				case 'row':
					value = isNeedNewValue(el.style.top, minValue) ? el.style.top : row.style.height;
					$(row).css({ height: value });
					indexRow = +$(row).dataset.row;
					break;
				case 'col':
					value = isNeedNewValue(el.style.left, minValue) ? el.style.left : col.style.width;

					indexColumn = +$(col).dataset.col;
					const cellsToResize = tableComponent.findAllCells(null, indexColumn);

					$(col).css({ width: value });
					cellsToResize.forEach(cell => {
						cell.css({ width: value });
					});
					break;
			}

			el.removeAttribute('style');
			resolve({
				resizeElement,
				value,
				id: resizeElement === 'col' ? indexColumn : indexRow
			});

		};

		document.addEventListener('mousemove', startMoving);
		document.addEventListener('mouseup', endMoving);
	});

};