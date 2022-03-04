export function capitalize(string: string) {
	if (typeof string !== 'string') {
		throw new Error('argument in function capitalize isn\'t a string!');
	}
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function storage(key: string, data: any = null) {
	if (!data) {
		return JSON.parse(localStorage.getItem(key));
	}
	localStorage.setItem(key, JSON.stringify(data));
}

export function isEqual(a: any, b: any) {
	return JSON.stringify(a) === JSON.stringify(b);
}

export function copyDeep(obj: any) {
	return JSON.parse(JSON.stringify(obj));
}

export function deepMerge(target: Object, ...sources: any): any {
	if (!sources.length) return target;
	const source = sources.shift();

	if (typeof target === 'object' && typeof source === 'object') {
		for (const key in source) {
			if (typeof source[key] === 'object') {
				if (!target[key]) target[key] = {};
				deepMerge(target[key], source[key]);
			} else {
				target[key] = source[key];
			}
		}
	}

	return deepMerge(target, ...sources);
}

export function convertStyles(style: string) {
	return style.split(/(?=[A-Z])/).join('-').toLowerCase();
}

export function parseStyles(styles: Object): string {
	return Object.entries(styles).reduce((result, arrStyles) => {
		result += `${arrStyles.join(':')}; `;
		return result;
	}, '');
}
