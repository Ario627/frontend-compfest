import { Info } from "lucide-react";
import "./data-disclaimer.css";

export function DataDisclaimer() {
  return (
    <div className="dd-container" role="note">
      <div className="dd-icon">
        <Info size={16} strokeWidth={2} />
      </div>
      <p className="dd-text">
        <strong>Catatan:</strong> Visualisasi ini menggunakan data sintetis untuk demonstrasi.
        Tata letak grid dan rute picking bersifat ilustratif dan mewakili hasil algoritma optimasi.
      </p>
    </div>
  );
}