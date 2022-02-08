
export class Dom {
	public $el: HTMLElement;



	constructor(selector: string | HTMLElement) {
		this.$el = typeof selector === 'string'
			? document.querySelector(selector)
			: selector;
	}

	get dataset() {
		return this.$el.dataset;
	}

	get id() {
		return this.$el.dataset.id?.split(':') || null;
	}

	html(html: string) {
		if (typeof html === 'string') {
			this.$el.innerHTML = html;
			return this;
		}

		return this.$el.outerHTML.trim();
	}

	textCell(text: string) {
		const textContainer = this.$el.querySelector('.text') as HTMLElement;
		textContainer.innerText = text;
	}

	text(text: string) {
		this.$el.innerText = text;
	}

	clear() {
		this.html('');
		return this;
	}

	click() {
		const isCurrentElemActive = document.activeElement.isEqualNode(this.$el);
		!isCurrentElemActive && this.$el.focus();
	}

	setCursorAtEndElem($el: HTMLElement) {
		const selection = window.getSelection();
		const range = document.createRange();
		selection.removeAllRanges();
		range.selectNodeContents($el);
		range.collapse(false);
		selection.addRange(range);
		$el.focus();
	}

	find(selector: string) {
		return $(this.$el.querySelector(selector) as HTMLElement);
	}

	findAll(selector: string) {
		const elements = this.$el.querySelectorAll(selector);
		return Array.from(elements).map((elem: HTMLElement) => $(elem));
	}

	closest(selector: string) {
		const searchElement = this.$el.closest(selector) as HTMLElement;
		return $(searchElement);
	}

	css(styles: { [prop: string]: string; }) {
		for (const style of Object.keys(styles)) {
			this.$el.style[style] = styles[style];
		}
	}

	addClass(className: string) {
		this.$el.classList.add(className);
	}

	removeClass(className: string) {
		this.$el.classList.remove(className);
	}

	removeAllClassBesides(...classes: string[]) {
		if (classes.length) {
			var newClasses: string[] = [];

			classes.forEach(className => {
				if (this.$el.classList.contains(className)) {
					newClasses.push(className);
				}
			});

			const classList = this.$el.classList.value.split(' ');
			for (const className of classList) {
				!newClasses.includes(className) && this.$el.classList.remove(className);
			}
			return;
		}
		for (const className in this.$el.classList) {
			this.$el.classList.remove(className);
		}
	}

	on(eventType: string, callback: any) {
		this.$el.addEventListener(eventType, callback);
	}

	off(eventType: string, callback: any) {
		this.$el.removeEventListener(eventType, callback);
	}
	/**
	 * Кастомный append!
	 */
	append(node: Dom | Node) {
		if (node instanceof Dom) {
			node = node.$el;
		}
		if (Element.prototype.append) {
			this.$el.append(node);
		} else {
			this.$el.appendChild(node);
		}

		return this;
	}
}

export function $(selector: string | HTMLElement) {
	return new Dom(selector);
}

$.create = (tagName: string, classes = ''): Dom => {
	const el = document.createElement(tagName);
	if (classes) {
		el.classList.add(classes);
	}
	return $(el);
};