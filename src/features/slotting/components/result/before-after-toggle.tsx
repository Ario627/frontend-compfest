import "./before-after-toggle.css";

type ViewMode = "before" | "after";

interface BeforeAfterToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function BeforeAfterToggle({ mode, onChange }: BeforeAfterToggleProps) {
  return (
    <div className="ba-toggle" role="group" aria-label="Mode tampilan grid">
      <button
        type="button"
        className={`ba-toggle__btn ${mode === "before" ? "ba-toggle__btn--active" : ""}`}
        onClick={() => onChange("before")}
        aria-pressed={mode === "before"}
      >
        Sebelum
      </button>
      <button
        type="button"
        className={`ba-toggle__btn ${mode === "after" ? "ba-toggle__btn--active" : ""}`}
        onClick={() => onChange("after")}
        aria-pressed={mode === "after"}
      >
        Sesudah
      </button>
    </div>
  );
}
