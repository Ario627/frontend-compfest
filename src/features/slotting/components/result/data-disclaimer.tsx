import { Info } from "lucide-react";
import "./data-disclaimer.css";

export function DataDisclaimer() {
  return (
    <div className="disclaimer" role="note">
      <Info size={16} strokeWidth={2} aria-hidden="true" />
      <p className="disclaimer__text">
        Data gudang bersifat sintetis untuk keperluan demonstrasi.
        Granularitas penempatan berdasarkan kategori produk, bukan denah gudang fisik riil.
      </p>
    </div>
  );
}
