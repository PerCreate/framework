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