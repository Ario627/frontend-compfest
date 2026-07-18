import { useMemo, useEffect, useState, useCallback } from "react";
import type { SlottingItem, GridDimensions } from "../types/slotting.types";
import { computeGridDimensions, buildPositionIndex } from "../utils/grid-layout";

const DEBOUNCE_MS = 150;


export function useGridDimensions(slotting: SlottingItem[]): {
    dimensions: GridDimensions;
    positionIndex: Map<string, number>;
} {
    const [resizeKey, setResizeKey] = useState(0);

    const handleResize = useCallback(() => {
        setResizeKey((k) => k + 1);
    }, []);


    useEffect(() => {
        let timeoutId: ReturnType<typeof setTimeout>;
        const debounced = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(handleResize, DEBOUNCE_MS);
        }

        window.addEventListener("resize", debounced);
        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener("resize", debounced);
        }
    }, [handleResize]);

    const dimensions = useMemo(() => computeGridDimensions(slotting), [slotting, resizeKey]);
    const positionIndex = useMemo(() => buildPositionIndex(slotting), [slotting]);

    return { dimensions, positionIndex };
}