import { createElement, useEffect, useMemo, useState } from "react";
import { getTileDataUri } from "../core/generate.js";

// Generation only runs client-side, after mount. Never during SSR or initial 
// hydration render. Server and initial client render will both produce a solid
// background color. Pattern appears once effect fires.
const FillLayer = ({ type, density, color }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const mask = useMemo(() => {
		if (!mounted) return null;
		const uri = getTileDataUri(type, density);
		return uri ? `url("${uri}")` : null;
	}, [mounted, type, density]);

	return createElement("div", {
		"aria-hidden": "true",
		style: {
			position: "absolute",
			inset: 0,
			zIndex: -1,
			pointerEvents: "none",
			borderRadius: "inherit",
			backgroundColor: color || "currentColor",
			maskImage: mask || undefined,
			WebkitMaskImage: mask || undefined,
			maskRepeat: "repeat",
			WebkitMaskRepeat: "repeat",
			maskPosition: "0 0",
			WebkitMaskPosition: "0 0",
		},
	});
}

const EtchFill = ({
	as = "div",
	type = "stipple",
	density = 50,
	color,
	style,
	children,
	...rest
}) => {
	return createElement(
		as,
		{
			...rest,
			// A real stacking context so the layer's negative z-index sinks behind
			// this element's own content, not behind the whole page.
			style: { ...style, position: "relative", isolation: "isolate" },
		},
		createElement(FillLayer, { type, density, color }),
		children,
	);
}

export { EtchFill };