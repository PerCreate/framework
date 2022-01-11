export function capitalize(string) {
	if (typeof string !== 'string') {
		throw new Error('argument in function capitalize isn\'t a string!');
	}
	return string.charAt(0).toUpperCase() + string.slice(1);
}