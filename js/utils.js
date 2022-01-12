export const createSVGElement = (el) => {
	const element = document.createElementNS("http://www.w3.org/2000/svg", el);
	return element;
}

export const setAttributes = (el, attrs) => {
	for (let key in attrs) {
		el.setAttribute(key, attrs[key]);
	}
}

export const addTextContent = (el, content) => {
	el.textContent = content;
}

export const removeClassFromNodeCollection = (nodeCollection, classToRemove) => {
	nodeCollection.forEach((node) => {
		if (node.classList.contains(classToRemove)) {
			node.classList.remove(classToRemove);
		}
	});
}
