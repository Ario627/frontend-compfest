import { Database, AlertCircle, RefreshCw, Check } from 'lucide-react'
import type { DatasetItem } from "../../types/slotting.types";
import './dataset-selector.css';

interface DatasetSelectorProps {
  readonly datasets: DatasetItem[];
  readonly selectedId: string | null;
  readonly onSelect: (id: string) => void;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly onRetry?: () => void;
}

function getDatasetMeta(id: string): { size: string; items: string; description: string } {
  if (id.includes('small')) return { size: 'Kecil', items: '~50 items', description: 'Cocok untuk testing cepat dan demo awal' };
  if (id.includes('medium')) return { size: 'Sedang', items: '~200 items', description: 'Skenario gudang skala menengah yang realistis' };
  if (id.includes('large')) return { size: 'Besar', items: '~500+ items', description: 'Simulasi gudang skala penuh dengan kompleksitas tinggi' };
  return { size: 'Custom', items: 'Bervariasi', description: 'Dataset khusus untuk analisis' };
}

export function DatasetSelector({
  datasets,
  selectedId,
  onSelect,
  isLoading,
  isError,
  onRetry,
}: DatasetSelectorProps) {
  if (isLoading) {
    return (
      <div className="ds-container" aria-busy="true">
        <div className="ds-header">
          <Database size={18} strokeWidth={2} className="ds-header__icon" />
          <h3 className="ds-header__title">Dataset Demo</h3>
        </div>
        <div className="ds-loading">
          <div className="ds-loading__spinner" />
          <p className="ds-loading__text">Memuat daftar dataset...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="ds-container ds-container--error" role="alert">
        <div className="ds-header">
          <Database size={18} strokeWidth={2} className="ds-header__icon" />
          <h3 className="ds-header__title">Dataset Demo</h3>
        </div>
        <div className="ds-error">
          <AlertCircle size={20} strokeWidth={2} className="ds-error__icon" />
          <p className="ds-error__text">Gagal memuat daftar dataset. Periksa koneksi dan coba lagi.</p>
          {onRetry && (
            <button
              type="button"
              className="ds-error__retry"
              onClick={onRetry}
            >
              <RefreshCw size={14} strokeWidth={2} />
              Muat Ulang
            </button>
          )}
        </div>
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="ds-container">
        <div className="ds-header">
          <Database size={18} strokeWidth={2} className="ds-header__icon" />
          <h3 className="ds-header__title">Dataset Demo</h3>
        </div>
        <p className="ds-empty">Tidak ada dataset demo tersedia saat ini.</p>
      </div>
    );
  }

  return (
    <fieldset className="ds-container" aria-label="Pilih dataset demo">
      
      <ul className="ds-list">
        {datasets.map((dataset) => {
          const isSelected = selectedId === dataset.id;
          const meta = getDatasetMeta(dataset.id);
          return (
            <li key={dataset.id} className="ds-item">
              <label
                className={`ds-card ${isSelected ? 'ds-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="dataset"
                  value={dataset.id}
                  checked={isSelected}
                  onChange={() => onSelect(dataset.id)}
                  className="ds-card__radio"
                />
                <div className="ds-card__indicator">
                  {isSelected ? <Check size={14} strokeWidth={3} /> : null}
                </div>
                <div className="ds-card__body">
                  <div className="ds-card__top">
                    <span className="ds-card__name">{dataset.name}</span>
                    <span className={`ds-card__badge ds-card__badge--${meta.size.toLowerCase()}`}>
                      {meta.size}
                    </span>
                  </div>
                  <p className="ds-card__desc">{meta.description}</p>
                  <span className="ds-card__meta">{meta.items}</span>
                </div>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}