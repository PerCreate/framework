
import { action } from '../redux/actions';
import { copyDeep } from './utils';

export interface State {
	cellState?: {
		[id: string]: { content?: string; };
	};
	cellStyles?: {
		[id: string]: { [style: string]: string; };
	};
	colState?: {
		[id: string]: { [style: string]: string; };
	};
	rowState?: {
		[id: string]: { [style: string]: string; };
	};
	currentText: string;
	currentCell: string;
	selectedCells: string[];
	tableTitle: string;
}

export class Store {
	public state: State;
	private listeners: { (state: State): void; }[] = [];
	private rootReducer: Function;

	constructor(rootReducer: Function, initialState = {}) {
		this.state = rootReducer({ ...initialState }, { type: '__INIT__' });
		this.rootReducer = rootReducer;
	}

	subscribe(fn: (state: State) => void): { unsubscribe: (...args: any) => void; } {
		this.listeners.push(fn);
		return {
			unsubscribe() {
				this.listeners = this.listeners.filter((listener: Function) => listener !== fn);
			}
		};
	}
	updateStore(action: action) {
		this.state = this.rootReducer(this.state, action);
		this.listeners.forEach(listener => listener(this.state));
	}

	getState() {
		return copyDeep(this.state);
	}
}