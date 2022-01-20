class Dom {
	constructor(selector) {
		this.$el = typeof selector === 'string'
			? document.querySelector(selector)
			: selector;
	}

	get dataset() {
		return this.$el.dataset;
	}

	html(html) {
		if (typeof html === 'string') {
			this.$el.innerHTML = html;
			return this;
		}

		return this.$el.outerHTML.trim();
	}

	clear() {
		this.html('');
		return this;
	}

	find(selector) {
		return $(this.$el.querySelector(selector));
	}

	findAll(selector) {
		const elements = this.$el.querySelectorAll(selector);
		return Array.from(elements).map($);
	}

	closest(selector) {
		return this.$el.closest(selector) || this.$el;
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