import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import { RotateCcw } from "lucide-react";
import type { RecommendationData, SlottingItem } from "../../types/slotting.types";
import { useGridDimensions } from "../../hooks/use-grid-dimensions";
import { ResultSummary } from "./result-summary";
import { BeforeAfterToggle } from "./before-after-toggle";
import { PickingSequence } from "./picking-sequence";
import { DistanceMetrics } from "./distance-metrics";
import { DataDisclaimer } from "./data-disclaimer";
import "./result-page.css"


const WarehouseGrid = lazy(() =>
  import("./warehouse-grid").then((m) => ({ default: m.WarehouseGrid }))
);

type ViewMode = "before" | "after";

interface ResultPageProps {
  data: RecommendationData;
  onNewBatch: () => void;
}

function GridSkeleton() {
  return (
    <div className="rp-grid-skeleton" aria-label="Memuat grid gudang">
      <div className="rp-grid-skeleton__shimmer" />
    </div>
  );
}

export function ResultPage({ data, onNewBatch }: ResultPageProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("after");
  const [highlightedProduct, setHighlightedProduct] = useState<string | null>(null);

  const currentSlotting: SlottingItem[] =
    viewMode === "before" ? data.slotting.before : data.slotting.after;

  const { dimensions, positionIndex } = useGridDimensions(currentSlotting);

  const handleCellHover = useCallback((productName: string | null) => {
    setHighlightedProduct(productName);
  }, []);

  const handleCellClick = useCallback((productName: string) => {
    setHighlightedProduct((prev) => (prev === productName ? null : productName));
  }, []);

  const handleItemHover = useCallback((productName: string | null) => {
    setHighlightedProduct(productName);
  }, []);

  const handleToggleChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, []);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="rp-container scale-in" aria-live="polite">
      <div className="rp-header">
        <ResultSummary summary={data.summary} />
        <div className="rp-header__actions">
          <BeforeAfterToggle mode={viewMode} onChange={handleToggleChange} />
        </div>
      </div>

      <h1 ref={headingRef} tabIndex={-1} className="sr-only">
        Hasil rekomendasi: {data.summary.warehouse}
      </h1>

      <section className="rp-grid-section" aria-label="Grid gudang">
        <Suspense fallback={<GridSkeleton />}>
          <WarehouseGrid
            slotting={currentSlotting}
            pickingRoute={data.picking_route}
            dimensions={dimensions}
            positionIndex={positionIndex}
            highlightedProduct={highlightedProduct}
            onCellHover={handleCellHover}
            onCellClick={handleCellClick}
          />
        </Suspense>
      </section>

      <section className="rp-details" aria-label="Detail hasil">
        <div className="rp-details__left">
          <PickingSequence
            route={data.picking_route}
            slotting={currentSlotting}
            highlightedItem={highlightedProduct}
            onItemHover={handleItemHover}
          />
        </div>
        <div className="rp-details__right">
          <DistanceMetrics distance={data.distance} />
        </div>
      </section>

      <DataDisclaimer />

      <div className="rp-actions">
        <button
          type="button"
          className="btn btn-primary btn-lg btn-full"
          onClick={onNewBatch}
        >
          <RotateCcw size={18} strokeWidth={2} aria-hidden="true" />
          Proses Batch Baru
        </button>
      </div>
    </main>
  );
}