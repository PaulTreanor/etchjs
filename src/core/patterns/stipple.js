const generateToroidalPoissonDisk = (tileSize, minDist, maxConsecutiveFailures = 2000) => {
	const points = [];
	let failures = 0;
	while (failures < maxConsecutiveFailures) {
		const candidate = { x: Math.random() * tileSize, y: Math.random() * tileSize };
		let valid = true;
		for (const point of points) {
			let distanceX = Math.abs(candidate.x - point.x);
			distanceX = Math.min(distanceX, tileSize - distanceX);
			let distanceY = Math.abs(candidate.y - point.y);
			distanceY = Math.min(distanceY, tileSize - distanceY);
			if (distanceX * distanceX + distanceY * distanceY < minDist * minDist) {
				valid = false;
				break;
			}
		}
		if (valid) {
			points.push(candidate);
			failures = 0;
		} else {
			failures++;
		}
	}
	return points;
}

const renderSeamlessSVG = (points, tileSize, dotRadius) => {
	const circles = [];
	const offsets = [-tileSize, 0, tileSize];
	for (const point of points) {
		for (const offsetX of offsets) {
			for (const offsetY of offsets) {
				const x = point.x + offsetX;
				const y = point.y + offsetY;
				if (x < -dotRadius || x > tileSize + dotRadius) continue;
				if (y < -dotRadius || y > tileSize + dotRadius) continue;
				circles.push(`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${dotRadius}" fill="white"/>`);
			}
		}
	}
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${tileSize}" height="${tileSize}" viewBox="0 0 ${tileSize} ${tileSize}">${circles.join("")}</svg>`;
}

const MIN_DIST_AT_MAX_DENSITY = 6;
const MIN_DIST_AT_MIN_DENSITY = 40;
const RADIUS_RATIO = 0.28;

const generateStippleTile = (density = 50) => {
	const clamped = Math.min(100, Math.max(1, density));
	const minDist =
		MIN_DIST_AT_MIN_DENSITY -
		((clamped - 1) / 99) * (MIN_DIST_AT_MIN_DENSITY - MIN_DIST_AT_MAX_DENSITY);
	const tileSize = Math.min(256, Math.max(64, minDist * 8));
	const dotRadius = minDist * RADIUS_RATIO;

	const points = generateToroidalPoissonDisk(tileSize, minDist);
	return renderSeamlessSVG(points, tileSize, dotRadius);
}

export { generateStippleTile }