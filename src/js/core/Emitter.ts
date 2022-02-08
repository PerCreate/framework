export class Emitter {
	private listeners: {
		[listener: string]: { (...args: any): void; }[];
	};


	constructor() {
		this.listeners = {};
	}

	dispatch(event: string, ...args: any) {
		if (!Array.isArray(this.listeners[event])) {
			return false;
		}

		this.listeners[event].forEach((listener: Function) => {
			listener(...args);
		});
		return true;
	}

	listen(event: string, fn: { (...args: any): void; }) {
		this.listeners[event] = this.listeners[event] || [];
		this.listeners[event].push(fn);
		return () => {
			this.listeners[event] = this.listeners[event].filter(listener => listener !== fn);
		};
	}
}