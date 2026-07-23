import { Warehouse, Package, ShoppingCart, TrendingDown } from "lucide-react";
import type { RefObject } from "react";
import type { RecommendSummary } from "../../types/slotting.types";
import "./result-summary.css";

interface ResultSummaryProps {
  summary: RecommendSummary;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}

export function ResultSummary({ summary, headingRef }: ResultSummaryProps) {
  return (
    <div className="rs-container">
      <div className="rs-header">
        
        <div className="rs-header__text">
          <span className="rs-header__label">Hasil Optimasi</span>
          <h2 ref={headingRef} tabIndex={-1} className="rs-header__warehouse">
            {summary.warehouse}
          </h2>
        </div>
      </div>
      <div className="rs-metrics">
        <div className="rs-metric">
          <div className="rs-metric__icon rs-metric__icon--orders">
            <ShoppingCart size={16} strokeWidth={2} />
          </div>
          <div className="rs-metric__data">
            <span className="rs-metric__value">
              {summary.total_orders.toLocaleString("id-ID")}
            </span>
            <span className="rs-metric__label">Pesanan</span>
          </div>
        </div>
        <div className="rs-metric__divider" />
        <div className="rs-metric">
          <div className="rs-metric__icon rs-metric__icon--items">
            <Package size={16} strokeWidth={2} />
          </div>
          <div className="rs-metric__data">
            <span className="rs-metric__value">
              {summary.total_items.toLocaleString("id-ID")}
            </span>
            <span className="rs-metric__label">Total Item</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}