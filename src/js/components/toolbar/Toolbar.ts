import { Dom } from './../../core/dom';
import { ExcelComponent, componentOptions } from "../../core/ExcelComponent";

export class Toolbar extends ExcelComponent {
	static className = 'excel__toolbar';

	constructor($root: Dom, options: componentOptions) {
		super($root, {
			name: 'Toolbar',
			...options
		});
	}

	toHTML() {
		return `
			<div class="button">
				<div class="material-icons">format_align_left</div>
				</div>
			<div class="button">
				<div class="material-icons">format_align_center</div>
			</div>
			<div class="button">
				<div class="material-icons">format_align_right</div>
			</div>
			<div class="button">
				<div class="material-icons">format_bold</div>
			</div>
			<div class="button">
				<div class="material-icons">format_italic</div>
			</div>
			<div class="button">
				<div class="material-icons">format_underline</div>
			</div>
		`;
	}
}