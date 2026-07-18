import { useState, useRef, useCallback, useMemo } from "react";
import { Maximize2 } from "lucide-react";
import { Stage, Layer, Text as KonvaText, Rect } from "react-konva";
import type { SlottingItem, GridDimensions } from "../../types/slotting.types";
import { GridCell } from "./grid-cell";
import { PickingRouteLine } from "./picking-route-line";
import { parseLocation, getCellPosition } from "../../utils/grid-layout";
import { getCategoryColor } from "../../utils/color-mapper";
import "./warehouse-grid.css";

interface WarehouseGridProps {
  slotting: SlottingItem[];
  pickingRoute: string[];
  dimensions: GridDimensions;
  positionIndex: Map<string, number>;
  highlightedProduct: string | null;
  onCellHover: (productName: string | null) => void;
  onCellClick: (productName: string) => void;
}

interface TooltipData {
  product: string;
  location: string;
  x: number;
  y: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;

export function WarehouseGrid({
  slotting,
  pickingRoute,
  dimensions,
  positionIndex,
  highlightedProduct,
  onCellHover,
  onCellClick,
}: WarehouseGridProps) {
  const [stageScale, setStageScale] = useState(1);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);

  const routeSet = useMemo(() => new Set(pickingRoute), [pickingRoute]);

  const routeIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    pickingRoute.forEach((product, index) => {
      if (product !== "START" && product !== "EXIT") {
        map.set(product, index);
      }
    });
    return map;
  }, [pickingRoute]);

  const handleWheel = useCallback((e: any) => {
    e.evt.preventDefault();
    const stage = stageRef.current;
    if (!stage) return;

    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * 1.1 : oldScale / 1.1;
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

    setStageScale(clampedScale);
    setStagePos({
      x: pointer.x - mousePointTo.x * clampedScale,
      y: pointer.y - mousePointTo.y * clampedScale,
    });
  }, []);

  const handleDragEnd = useCallback((e: any) => {
    setStagePos({ x: e.target.x(), y: e.target.y() });
  }, []);

  const slottingMap = useMemo(
    () => new Map(slotting.map((s) => [s.product, s])),
    [slotting]
  );

  const handleCellHover = useCallback(
    (productName: string | null) => {
      onCellHover(productName);
      if (productName) {
        const item = slottingMap.get(productName);
        if (item && containerRef.current) {
          const pos = getCellPosition(item.location, dimensions, positionIndex);
          setTooltip({
            product: item.product,
            location: item.location,
            x: (pos.x + dimensions.cellWidth / 2) * stageScale + stagePos.x,
            y: pos.y * stageScale + stagePos.y - 8,
          });
        }
      } else {
        setTooltip(null);
      }
    },
    [slottingMap, dimensions, positionIndex, stageScale, stagePos, onCellHover]
  );

  const handleDragStart = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleResetView = useCallback(() => {
    setStageScale(1);
    setStagePos({ x: 0, y: 0 });
  }, []);

  const aisles = useMemo(() => {
    const nums = new Set<number>();
    slotting.forEach((item) => nums.add(parseLocation(item.location).aisle));
    return [...nums].sort((a, b) => a - b);
  }, [slotting]);

  const legendItems = useMemo(() => {
    const seen = new Set<string>();
    const items: { product: string; color: string }[] = [];
    for (const item of slotting) {
      if (!seen.has(item.product)) {
        seen.add(item.product);
        items.push({ product: item.product, color: getCategoryColor(item.product) });
      }
    }
    return items;
  }, [slotting]);

  return (
    <div className="wg-container" ref={containerRef}>
      <div className="wg-legend">
        {legendItems.slice(0, 12).map((li) => (
          <span key={li.product} className="wg-legend__item">
            <span
              className="wg-legend__swatch"
              style={{ backgroundColor: li.color }}
            />
            <span className="wg-legend__label">{li.product}</span>
          </span>
        ))}
      </div>

      <div className="wg-canvas-wrapper">
        <button
          type="button"
          className="btn btn-secondary wg-reset-btn"
          onClick={handleResetView}
          aria-label="Reset zoom dan posisi grid"
        >
          <Maximize2 size={14} strokeWidth={2} aria-hidden="true" />
          Reset
        </button>
        <Stage
          ref={stageRef}
          width={dimensions.canvasWidth}
          height={dimensions.canvasHeight}
          scaleX={stageScale}
          scaleY={stageScale}
          x={stagePos.x}
          y={stagePos.y}
          draggable
          onWheel={handleWheel}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <Layer>
            <Rect
              x={0}
              y={0}
              width={dimensions.canvasWidth}
              height={dimensions.canvasHeight}
              fill="#0D1C2B"
            />

            {aisles.map((aisle, i) => (
              <KonvaText
                key={`aisle-${aisle}`}
                x={2}
                y={
                  dimensions.aisleGap +
                  (aisle - 1) * (dimensions.cellHeight + dimensions.aisleGap) +
                  dimensions.cellHeight / 2 - 5
                }
                width={8}
                text={`L${aisle}`}
                fontSize={9}
                fontFamily="'IBM Plex Mono', monospace"
                fill="#5A7188"
              />
            ))}

            {slotting.map((item) => {
              const pos = getCellPosition(item.location, dimensions, positionIndex);
              return (
                <GridCell
                  key={item.product}
                  item={item}
                  x={pos.x}
                  y={pos.y}
                  dimensions={dimensions}
                  isHighlighted={highlightedProduct === item.product}
                  isInRoute={routeSet.has(item.product)}
                  routeIndex={routeIndexMap.get(item.product) ?? null}
                  onHover={handleCellHover}
                  onClick={onCellClick}
                />
              );
            })}

            <PickingRouteLine
              route={pickingRoute}
              slotting={slotting}
              dimensions={dimensions}
              positionIndex={positionIndex}
            />
          </Layer>
        </Stage>

        {tooltip && (
          <div
            className="wg-tooltip"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="wg-tooltip__product">{tooltip.product}</div>
            <div className="wg-tooltip__location">{tooltip.location}</div>
          </div>
        )}
      </div>

      <div className="sr-only" aria-live="polite">
        <table>
          <caption>Data grid gudang</caption>
          <thead>
            <tr>
              <th>Produk</th>
              <th>Lorong</th>
              <th>Posisi</th>
            </tr>
          </thead>
          <tbody>
            {slotting.map((item) => {
              const { aisle, position } = parseLocation(item.location);
              return (
                <tr key={item.product}>
                  <td>{item.product}</td>
                  <td>{aisle}</td>
                  <td>{position}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}