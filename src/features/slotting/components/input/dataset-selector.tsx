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
      <div className="dataset-selector" aria-busy="true">
        <p className="dataset-selector__status">Memuat daftar dataset...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="dataset-selector dataset-selector--error" role="alert">
        <p className="dataset-selector__status">
          Gagal memuat daftar dataset. Periksa koneksi dan coba lagi.
        </p>
        {onRetry && (
          <button
            type="button"
            className="dataset-selector__retry"
            onClick={onRetry}
          >
            Muat Ulang
          </button>
        )}
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="dataset-selector">
        <p className="dataset-selector__status">
          Tidak ada dataset demo tersedia saat ini.
        </p>
      </div>
    );
  }

  return (
    <fieldset className="dataset-selector" aria-label="Pilih dataset demo">
      <legend className="dataset-selector__title">Dataset Demo</legend>
      <ul className="dataset-selector__list">
        {datasets.map((dataset) => {
          const isSelected = selectedId === dataset.id;
          return (
            <li key={dataset.id} className="dataset-selector__item">
              <label
                className={[
                  'dataset-selector__card',
                  isSelected ? 'dataset-selector__card--selected' : '',
                ].join(' ')}
              >
                <input
                  type="radio"
                  name="dataset"
                  value={dataset.id}
                  checked={isSelected}
                  onChange={() => onSelect(dataset.id)}
                  className="dataset-selector__radio"
                />
                <span className="dataset-selector__card-content">
                  <span className="dataset-selector__card-name">
                    {dataset.name}
                  </span>
                  <span className="dataset-selector__card-id">
                    {dataset.id}
                  </span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
    </fieldset>
  );
}
