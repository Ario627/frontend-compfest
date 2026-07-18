import type { JSX } from 'react'
import { useDemoDatasets } from '../../hooks/use-demo-datasets'
import { DatasetSelector } from './dataset-selector'
import { FileUploadZone } from './file-upload-zone'
import { HowItWorks } from './how-it-works'
import './input-page.css'

interface InputPageProps {
  readonly selectedDatasetId: string | null
  readonly onSelectDataset: (id: string) => void
  readonly onSubmit: () => void
}

export function InputPage({
  selectedDatasetId,
  onSelectDataset,
  onSubmit,
}: InputPageProps): JSX.Element {
  const { data: datasets = [], isLoading, isError, refetch } = useDemoDatasets()

  const canSubmit = selectedDatasetId !== null && !isLoading && !isError

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit()
    }
  }

  return (
    <main className="input-page" aria-labelledby="input-page-title">
      <header className="input-page__header">
        <h1 id="input-page-title" className="input-page__title">
          Warehouse Slotting Optimizer
        </h1>
        <p className="input-page__subtitle">
          Optimalkan penempatan produk dan rute picking gudang Anda dengan analisis AI
        </p>
      </header>

      <div className="input-page__panels">
        <div className="input-page__panel">
          <FileUploadZone disabled={true} />
        </div>

        <div className="input-page__panel">
          <DatasetSelector
            datasets={datasets}
            selectedId={selectedDatasetId}
            onSelect={onSelectDataset}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </div>
      </div>

      <div className="input-page__action">
        <button
          type="button"
          className="input-page__submit-button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          aria-describedby={!canSubmit ? 'submit-hint' : undefined}
        >
          Proses Batch Ini
        </button>
        {!canSubmit && (
          <p id="submit-hint" className="input-page__hint">
            {isLoading
              ? 'Memuat daftar dataset...'
              : isError
                ? 'Gagal memuat dataset. Coba muat ulang.'
                : 'Pilih dataset demo untuk memulai'}
          </p>
        )}
      </div>

      <HowItWorks />

      <footer className="input-page__footer">
        <p className="input-page__disclaimer">
          <strong>Catatan:</strong> Data gudang bersifat sintetis untuk keperluan demo. 
          Granularitas analisis pada level kategori produk, bukan SKU individual.
        </p>
      </footer>
    </main>
  )
}
