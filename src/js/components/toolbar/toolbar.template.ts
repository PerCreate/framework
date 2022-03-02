type button = {
	icon: string;
	active: boolean;
	activeValue: { [style: string]: string; };
	inactiveValue: { [style: string]: string; };
};

function toButton(button: button) {
	const activeValue = `data-activevalue=${JSON.stringify(button.activeValue)}`;
	const inactiveValue = `data-inactivevalue=${JSON.stringify(button.inactiveValue)}`;

	const meta: string = `
		data-type="button"
		data-active=${button.active}
		${activeValue}
		${inactiveValue}
		`;

	return `<div class="button ${button.active ? 'active' : ''}"
				${meta}
			>
				<div class="material-icons"
					${meta}
				>${button.icon}</div>
			</div>`;
}

export function createToolbar(state: any) {
	const buttons: button[] = [
		{
			icon: 'format_align_left',
			active: state.textAlign === 'left',
			activeValue: { textAlign: 'left' },
			inactiveValue: { textAlign: 'unset' },
		},
		{
			icon: 'format_align_center',
			active: state.textAlign === 'center',
			activeValue: { textAlign: 'center' },
			inactiveValue: { textAlign: 'unset' },
		},
		{
			icon: 'format_align_right',
			active: state.textAlign === 'right',
			activeValue: { textAlign: 'right' },
			inactiveValue: { textAlign: 'unset' },
		},
		{
			icon: 'format_bold',
			active: state.fontWeight === 'bold',
			activeValue: { fontWeight: 'bold' },
			inactiveValue: { fontWeight: 'normal' },
		},
		{
			icon: 'format_italic',
			active: state.fontStyle === 'italic',
			activeValue: { fontStyle: 'italic' },
			inactiveValue: { fontStyle: 'normal' },
		},
		{
			icon: 'format_underline',
			active: state.textDecoration === 'underline',
			activeValue: { textDecoration: 'underline' },
			inactiveValue: { textDecoration: 'none' },
		},
	];

	return buttons.map(toButton).join('');
}