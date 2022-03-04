import { convertStyles, parseStyles } from "../../core/utils";

interface options {
	left?: string;
	top?: string;
}

export class CustomError {
	public errorMessage: string;
	public options: options = {};

	constructor(error: string, options: options = {}) {
		this.errorMessage = error;
		this.options.left = options.left && options.left;
		this.options.top = options.top && options.top;
	}

	toHTML() {
		var styles = {};
		for (const style in this.options) {

			const newFormatStyle = convertStyles(style);
			styles[newFormatStyle] = this.options[style];
		}

		return `
			<div class="error-block" style="${parseStyles(styles)}">${this.errorMessage}</div>
		`;
	}

	get error() {
		return this.toHTML();
	}
}