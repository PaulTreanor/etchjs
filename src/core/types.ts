export type Point = {
	x: number;
	y: number;
};

export type TileGenerator = (density: number) => string;

// Names a registry must implement. Extend this union as patterns land.
export type FillType = "stipple";

export type GeneratorRegistry = Partial<Record<FillType, TileGenerator>>;
