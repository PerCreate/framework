/**
	 * 
	 * @param {*} currentPosition position for calculating new value 
	 * @param {*} currentValue 
	 * @param {*} minValue 
	 * @param {*} event 
	 * @param {*} resizeElement 'col' or 'row'
	 */
export default (event, resizeElement) => {
	return new Promise(resolve => {
		const el = event.target;
		const table = el.closest('.excel__table>.table');
		const row = el.closest('.row');
		const col = el.closest('.column');
		var currentPosition, currentValue, minValue;

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

		const isNeedNewValue = (prop, minValue) => {
			if (!prop) return false;
			return prop.replace(/[^0-9]/g, '') >= minValue;
		};

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

			switch (resizeElement) {
				case 'row':
					row.style.height = isNeedNewValue(el.style.top, minValue) ? el.style.top : row.style.height;
					break;
				case 'col':
					const arr = Array.from(table.children);
					const closestRowData = col.closest('.row-data');
					var indexColumn = Array.from(closestRowData.children).indexOf(col);

					var value = isNeedNewValue(el.style.left, minValue) ? el.style.left : col.style.width;
					col.style.width = value;
					arr.forEach(row => {
						const rowDataArr = Array.from(row.querySelector('.row-data').children);
						rowDataArr[indexColumn].style.width = value;
					});
					break;
			}

			el.style = null;

			resolve({
				value,
				id: resizeElement === 'col' ? indexColumn : null
			});

		};

		document.addEventListener('mousemove', startMoving);
		document.addEventListener('mouseup', endMoving);
	});

};