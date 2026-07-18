import { Line, Arrow } from "react-konva";
import type { SlottingItem, GridDimensions } from "../../types/slotting.types";
import { getCellPosition } from "../../utils/grid-layout";


interface PickingRouteLineProps {
  route: string[];
  slotting: SlottingItem[];
  dimensions: GridDimensions;
  positionIndex: Map<string, number>;
}

export function PickingRouteLine({
  route,
  slotting,
  dimensions,
  positionIndex,
}: PickingRouteLineProps) {
  if (route.length < 2) return null;

  const slottingMap = new Map(slotting.map((item) => [item.product, item]));

  const points: number[] = [];

  for (const product of route) {
    if (product === "START") {
      points.push(dimensions.canvasWidth / 2, 0);
      continue;
    }
    if (product === "EXIT") {
      points.push(dimensions.canvasWidth / 2, dimensions.canvasHeight);
      continue;
    }

    const item = slottingMap.get(product);
    if (!item) continue;

    const pos = getCellPosition(item.location, dimensions, positionIndex);
    points.push(
      pos.x + dimensions.cellWidth / 2,
      pos.y + dimensions.cellHeight / 2
    );
  }

  if (points.length < 4) return null;

  return (
    <>
      <Line
        points={points}
        stroke="rgba(242, 183, 5, 0.8)"
        strokeWidth={2}
        dash={[8, 4]}
        lineCap="round"
        lineJoin="round"
        tension={0.3}
      />
      {points.length >= 4 && (
        <Arrow
          points={[
            points[points.length - 4],
            points[points.length - 3],
            points[points.length - 2],
            points[points.length - 1],
          ]}
          stroke="rgba(242, 183, 5, 0.8)"
          strokeWidth={2}
          fill="rgba(242, 183, 5, 0.8)"
          pointerLength={8}
          pointerWidth={6}
        />
      )}
    </>
  );
}