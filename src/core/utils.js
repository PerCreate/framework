export function capitalize(string) {
	if (typeof string !== 'string') {
		throw new Error('argument in function capitalize isn\'t a string!');
	}
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function storage(key, data = null) {
	if (!data) {
		return JSON.parse(localStorage.getItem(key));
	}
	localStorage.setItem(key, JSON.stringify(data));
}