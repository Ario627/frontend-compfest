import type { RefObject } from "react";
import type { RecommendSummary } from "../../types/slotting.types";
import "./result-summary.css";

interface ResultSummaryProps {
  summary: RecommendSummary;
  headingRef?: RefObject<HTMLHeadingElement | null>;
}

export function ResultSummary({ summary, headingRef }: ResultSummaryProps) {
  return (
    <header className="rs-container">
      <h2 ref={headingRef} tabIndex={-1} className="rs-warehouse">{summary.warehouse}</h2>
      <div className="rs-meta">
        <span className="rs-meta__item">
          <span className="rs-meta__value">{summary.total_orders.toLocaleString("id-ID")}</span>
          <span className="rs-meta__label">pesanan</span>
        </span>
        <span className="rs-meta__separator" aria-hidden="true" />
        <span className="rs-meta__item">
          <span className="rs-meta__value">{summary.total_items.toLocaleString("id-ID")}</span>
          <span className="rs-meta__label">item</span>
        </span>
      </div>
    </header>
  );
}
