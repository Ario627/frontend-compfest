import { memo } from "react";
import { Group, Rect, Text } from "react-konva";
import type { SlottingItem, GridDimensions } from "../../types/slotting.types";
import { getCategoryColor } from "../../utils/color-mapper";

interface GridCellProps {
  item: SlottingItem;
  x: number;
  y: number;
  dimensions: GridDimensions;
  isHighlighted: boolean;
  isInRoute: boolean;
  routeIndex: number | null;
  onHover: (productName: string | null) => void;
  onClick: (productName: string) => void;
}

function GridCellInner({
  item,
  x,
  y,
  dimensions,
  isHighlighted,
  isInRoute,
  routeIndex,
  onHover,
  onClick,
}: GridCellProps) {
  const baseColor = getCategoryColor(item.product);
  const fillColor = isHighlighted ? "#F2B705" : baseColor;
  const strokeColor = isHighlighted
    ? "#D9A404"
    : isInRoute
      ? "#F2B705"
      : "rgba(232, 237, 242, 0.15)";
  const strokeWidth = isHighlighted ? 2 : isInRoute ? 1.5 : 1;

  const label = item.product.length > 10 ? item.product.slice(0, 9) + "…" : item.product;

  return (
    <Group
      onMouseEnter={() => onHover(item.product)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick(item.product)}
      onTap={() => onClick(item.product)}
    >
      <Rect
        x={x}
        y={y}
        width={dimensions.cellWidth}
        height={dimensions.cellHeight}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        cornerRadius={2}
        shadowEnabled={isHighlighted}
        shadowColor="#F2B705"
        shadowBlur={8}
        shadowOpacity={0.4}
      />
      <Text
        x={x + 2}
        y={y + dimensions.cellHeight / 2 - 6}
        width={dimensions.cellWidth - 4}
        text={label}
        fontSize={Math.min(11, dimensions.cellWidth / 6)}
        fontFamily="'IBM Plex Sans', sans-serif"
        fill={isHighlighted ? "#12263A" : "#E8EDF2"}
        align="center"
        ellipsis
        wrap="none"
      />
      {routeIndex !== null && isInRoute && (
        <Text
          x={x + 2}
          y={y + 2}
          width={dimensions.cellWidth - 4}
          text={String(routeIndex)}
          fontSize={9}
          fontFamily="'IBM Plex Mono', monospace"
          fill={isHighlighted ? "#12263A" : "#F2B705"}
          align="right"
          wrap="none"
        />
      )}
    </Group>
  );
}

export const GridCell = memo(GridCellInner, (prev, next) => {
  return (
    prev.isHighlighted === next.isHighlighted &&
    prev.isInRoute === next.isInRoute &&
    prev.routeIndex === next.routeIndex &&
    prev.x === next.x &&
    prev.y === next.y &&
    prev.item.product === next.item.product
  );
});
