import { generateStippleTile } from "./patterns/stipple.js";

const generators = {
	stipple: generateStippleTile,
};

const tileCache = new Map(); // `${fillType}:${density}` -> data URI

const toDataUri = (svg) => {
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const getTileDataUri = (fillType, density) => {
	const key = `${fillType}:${density}`;
	const cachedTileUri = tileCache.get(key);
	if (cachedTileUri) return cachedTileUri;

	const generate = generators[fillType];
	if (!generate) return null;

	const tileUri = toDataUri(generate(density));
	tileCache.set(key, tileUri);
	return tileUri;
}

export { getTileDataUri }