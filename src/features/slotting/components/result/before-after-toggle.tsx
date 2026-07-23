import { Eye, EyeOff } from "lucide-react";
import "./before-after-toggle.css";

type ViewMode = "before" | "after";

interface BeforeAfterToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function BeforeAfterToggle({ mode, onChange }: BeforeAfterToggleProps) {
  return (
    <div className="bat-container" role="radiogroup" aria-label="Pilih tampilan slotting">
      <button
        type="button"
        role="radio"
        aria-checked={mode === "before"}
        className={`bat-btn ${mode === "before" ? "bat-btn--active" : ""}`}
        onClick={() => onChange("before")}
      >
        <EyeOff size={16} strokeWidth={2} />
        <span className="bat-btn__label">Sebelum</span>
        <span className="bat-btn__badge">Baseline</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "after"}
        className={`bat-btn ${mode === "after" ? "bat-btn--active bat-btn--active-success" : ""}`}
        onClick={() => onChange("after")}
      >
        <Eye size={16} strokeWidth={2} />
        <span className="bat-btn__label">Sesudah</span>
        <span className="bat-btn__badge bat-btn__badge--success">Optimized</span>
      </button>
    </div>
  );
}