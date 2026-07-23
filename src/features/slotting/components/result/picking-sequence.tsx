import { useMemo } from "react";
import { MapPin, Route } from "lucide-react";
import type { SlottingItem } from "../../types/slotting.types";
import "./picking-sequence.css";

interface PickingSequenceProps {
  route: string[];
  slotting: SlottingItem[];
  highlightedItem: string | null;
  onItemHover: (productName: string | null) => void;
}

export function PickingSequence({
  route,
  slotting,
  highlightedItem,
  onItemHover,
}: PickingSequenceProps) {
  const slottingMap = useMemo(
    () => new Map(slotting.map((item) => [item.product, item])),
    [slotting]
  );

  const filteredRoute = useMemo(
    () => route.filter((p) => p !== "START" && p !== "EXIT"),
    [route]
  );

  if (filteredRoute.length === 0) {
    return (
      <div className="ps-container">
        <div className="ps-header">
          
          <h3 className="ps-header__title">Urutan Picking</h3>
        </div>
        <p className="ps-empty">Rute picking tidak tersedia</p>
      </div>
    );
  }

  return (
    <div className="ps-container">
      <div className="ps-header">
        
        <div className="ps-header__text">
          <h3 className="ps-header__title">Urutan Picking</h3>
          <span className="ps-header__count">{filteredRoute.length} stops</span>
        </div>
      </div>
      <ol className="ps-list">
        {filteredRoute.map((product, index) => {
          const item = slottingMap.get(product);
          const isHighlighted = highlightedItem === product;

          return (
            <li
              key={product}
              className={`ps-item ${isHighlighted ? "ps-item--highlighted" : ""}`}
              onMouseEnter={() => onItemHover(product)}
              onMouseLeave={() => onItemHover(null)}
              onFocus={() => onItemHover(product)}
              onBlur={() => onItemHover(null)}
              tabIndex={0}
              role="listitem"
              aria-label={`Urutan ${index + 1}: ${product} di ${item?.location ?? "lokasi tidak diketahui"}`}
            >
              <span className="ps-item__number">{index + 1}</span>
              <div className="ps-item__info">
                <span className="ps-item__product">{product}</span>
                {item && (
                  <span className="ps-item__location">
                    <MapPin size={11} strokeWidth={2} aria-hidden="true" />
                    {item.location}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}