import { generateStippleTile } from "./patterns/stipple";
import type { FillType, GeneratorRegistry } from "./types";

const generators: GeneratorRegistry = {
	stipple: generateStippleTile,
};

type TileCacheKey = `${FillType}:${number}`;

const tileCache = new Map<TileCacheKey, string>();

const toDataUri = (svg: string): string => {
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const getTileDataUri = (fillType: FillType, density: number): string | null => {
	// casting because type TileCacheKey can't literally have a number in a string
	const key = `${fillType}:${density}` as TileCacheKey;
	const cachedTileUri = tileCache.get(key);
	if (cachedTileUri) return cachedTileUri;

	const generate = generators[fillType];
	if (!generate) return null;

	const tileUri = toDataUri(generate(density));
	tileCache.set(key, tileUri);
	return tileUri;
};

export { getTileDataUri };
