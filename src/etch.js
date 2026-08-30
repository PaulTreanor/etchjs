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

const LAYER_ATTR = "data-etch-layer";

// mask-image affects an element's whole painted output (content included), not
// just its background, so the fill can't live directly on a content-bearing
// element. It gets its own layer, behind the content, instead.
function getOrCreateFillLayer(el) {
	let layer = el.querySelector(`:scope > [${LAYER_ATTR}]`);
	if (layer) return layer;

	if (getComputedStyle(el).position === "static") {
		el.style.position = "relative";
	}
	// Without a real stacking context, the layer's negative z-index escapes past
	// el entirely and sinks behind the whole page instead of just behind el's content.
	el.style.isolation = "isolate";

	layer = document.createElement("div");
	layer.setAttribute(LAYER_ATTR, "");
	layer.setAttribute("aria-hidden", "true");
	layer.style.position = "absolute";
	layer.style.inset = "0";
	layer.style.zIndex = "-1";
	layer.style.pointerEvents = "none";
	layer.style.borderRadius = "inherit";
	el.prepend(layer);
	return layer;
}

function applyFill(el) {
	const fillType = el.dataset.fill;
	if (!fillType || !generators[fillType]) return;

	const density = Number(el.dataset.fillDensity) || 50;
	const uri = getTileDataUri(fillType, density);
	if (!uri) return;

	const layer = getOrCreateFillLayer(el);

	const mask = `url("${uri}")`;
	layer.style.maskImage = mask;
	layer.style.webkitMaskImage = mask;
	layer.style.maskRepeat = "repeat";
	layer.style.webkitMaskRepeat = "repeat";
	layer.style.maskPosition = "0 0";
	layer.style.webkitMaskPosition = "0 0";
	layer.style.backgroundColor = el.dataset.fillColor || "currentColor";
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
