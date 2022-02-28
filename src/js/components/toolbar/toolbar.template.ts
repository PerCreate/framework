type button = {
	icon: string;
	active: boolean;
	value: { [style: string]: string; };
};

function toButton(button: button) {
	const value = `data-value=${JSON.stringify(button.value)}`;

	const meta: string = `
		data-type="button"
		data-active=${button.active}
		${value}
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
			value: { textAlign: 'left' }
		},
		{
			icon: 'format_align_center',
			active: state.textAlign === 'center',
			value: { textAlign: 'center' }
		},
		{
			icon: 'format_align_right',
			active: state.textAlign === 'right',
			value: { textAlign: 'right' }
		},
		{
			icon: 'format_bold',
			active: state.fontWeight === 'bold',
			value: { fontWeight: 'bold' }
		},
		{
			icon: 'format_italic',
			active: state.fontStyle === 'italic',
			value: { fontStyle: 'italic' }
		},
		{
			icon: 'format_underline',
			active: state.textDecoration === 'underline',
			value: { textDecoration: 'underline' }
		},
	];

	return buttons.map(toButton).join('');
}