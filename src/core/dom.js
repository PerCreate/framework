export class Dom {
	constructor(selector) {
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

	html(html) {
		if (typeof html === 'string') {
			this.$el.innerHTML = html;
			return this;
		}

		return this.$el.outerHTML.trim();
	}

	textCell(text) {
		const textContainer = this.$el.querySelector('.text');
		textContainer.innerText = text;
	}

	text(text) {
		this.$el.innerText = text;
	}

	clear() {
		this.html('');
		return this;
	}

	click(event) {
		const isCurrentElemActive = document.activeElement.isEqualNode(this.$el);
		!isCurrentElemActive && this.$el.focus();
	}

	setCursorAtEndElem($el) {
		const selection = window.getSelection();
		const range = document.createRange();
		selection.removeAllRanges();
		range.selectNodeContents($el);
		range.collapse(false);
		selection.addRange(range);
		$el.focus();
	}

	find(selector) {
		return $(this.$el.querySelector(selector));
	}

	findAll(selector) {
		const elements = this.$el.querySelectorAll(selector);
		return Array.from(elements).map($);
	}

	closest(selector) {
		return (this.$el.closest(selector)) || this.$el;
	}

	addClass(className) {
		this.$el.classList.add(className);
	}

	removeClass(className) {
		this.$el.classList.remove(className);
	}

	removeAllClassBesides(...classes) {
		if (classes.length) {
			var newClasses = [];

			classes.forEach(className => {
				if (this.$el.classList.contains(className)) {
					newClasses.push(className);
				}
			});

			this.$el.classList.remove(...this.$el.classList);

			newClasses.forEach(className => {
				this.$el.classList.add(className);

			});
			return;
		}
		this.$el.classList.remove(...this.$el.classList);
	}

	on(eventType, callback) {
		this.$el.addEventListener(eventType, callback);
	}

	off(eventType, callback) {
		this.$el.removeEventListener(eventType, callback);
	}
	/**
	 * Кастомный append!
	 */
	append(node) {
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

export function $(selector) {
	return new Dom(selector);
}

$.create = (tagName, classes = '') => {
	const el = document.createElement(tagName);
	if (classes) {
		el.classList.add(classes);
	}
	return $(el);
};