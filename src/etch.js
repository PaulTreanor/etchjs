import { generateStippleTile } from "./patterns/stipple.js";

const generators = {
	stipple: generateStippleTile,
};

const tileCache = new Map(); // `${fillType}:${density}` -> data URI

function toDataUri(svg) {
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getTileDataUri(fillType, density) {
	const key = `${fillType}:${density}`;
	let uri = tileCache.get(key);
	if (uri) return uri;

	const generate = generators[fillType];
	if (!generate) return null;

	uri = toDataUri(generate(density));
	tileCache.set(key, uri);
	return uri;
} 

function applyFill(el) {
	const fillType = el.dataset.fill;
	if (!fillType || !generators[fillType]) return;

	const density = Number(el.dataset.fillDensity) || 50;
	const uri = getTileDataUri(fillType, density);
	if (!uri) return;

	const mask = `url("${uri}")`;
	el.style.maskImage = mask;
	el.style.webkitMaskImage = mask;
	el.style.maskRepeat = "repeat";
	el.style.webkitMaskRepeat = "repeat";
	el.style.maskPosition = "0 0";
	el.style.webkitMaskPosition = "0 0";

	if (el.dataset.fillColor) {
		el.style.backgroundColor = el.dataset.fillColor;
	}
}

function scan(root = document) {
	root.querySelectorAll("[data-fill]").forEach(applyFill);
}

function observe() {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.target.hasAttribute("data-fill")) {
				applyFill(mutation.target);
			}
			for (const node of mutation.addedNodes) {
				if (node.nodeType !== 1) continue;
				if (node.hasAttribute("data-fill")) applyFill(node);
				node.querySelectorAll?.("[data-fill]").forEach(applyFill);
			}
		}
	});

	observer.observe(document.documentElement, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: ["data-fill", "data-fill-density", "data-fill-color"],
	});

	return observer;
}

function init() {
	scan();
	observe();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}

export { applyFill, scan };
