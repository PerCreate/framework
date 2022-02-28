import { clickToolbarButton } from "../redux/actions";
import { Dom } from "./dom";
import { componentOptions, ExcelComponent } from "./ExcelComponent";

export class ExcelStateComponent extends ExcelComponent {
	protected state: any;
	public $root: Dom;

	constructor($root: Dom, componentOptions: componentOptions) {
		super($root, componentOptions);
		this.$root = $root;
	}

	get template() {
		return JSON.stringify(this.state, null, 2);
	}

	initState(initialState = {}) {
		this.state = { ...initialState };
	}

	setState(newState: any) {
		this.state = { ...this.state, ...newState };
		this.$root.html(this.template);
		this.updateStore(clickToolbarButton({ cellStyles: { ...this.state } }));
	}
}