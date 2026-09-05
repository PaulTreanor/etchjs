import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ElementType, ReactNode } from "react";
import { getTileDataUri } from "../core/generate";
import type { FillType } from "../core/types";

interface FillLayerProps {
	type: FillType;
	density: number;
	color?: string;
}

// Generation only runs client-side, after mount. Never during SSR or initial
// hydration render. Server and initial client render will both produce a solid
// background color. Pattern appears once effect fires.
const FillLayer = ({ type, density, color }: FillLayerProps) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const mask = useMemo(() => {
		if (!mounted) return null;
		const uri = getTileDataUri(type, density);
		return uri ? `url("${uri}")` : null;
	}, [mounted, type, density]);

	return (
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				inset: 0,
				zIndex: -1,
				pointerEvents: "none",
				borderRadius: "inherit",
				backgroundColor: color || "currentColor",
				maskImage: mask ?? undefined,
				WebkitMaskImage: mask ?? undefined,
				maskRepeat: "repeat",
				WebkitMaskRepeat: "repeat",
				maskPosition: "0 0",
				WebkitMaskPosition: "0 0",
			}}
		/>
	);
};

interface EtchFillProps {
	as?: ElementType;
	type?: FillType;
	density?: number;
	color?: string;
	style?: CSSProperties;
	children?: ReactNode;
	[key: string]: unknown;
}

const EtchFill = ({
	as: Tag = "div",
	type = "stipple",
	density = 50,
	color,
	style,
	children,
	...rest
}: EtchFillProps) => {
	return (
		<Tag
			{...rest}
			// A real stacking context so the layer's negative z-index sinks behind
			// this element's own content, not behind the whole page.
			style={{ ...style, position: "relative", isolation: "isolate" }}
		>
			<FillLayer type={type} density={density} color={color} />
			{children}
		</Tag>
	);
};

export { EtchFill };
