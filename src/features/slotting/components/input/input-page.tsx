import type { JSX } from 'react'
import { Warehouse, Sparkles, BarChart3, ArrowRight, Package, Layers, Zap } from 'lucide-react'
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

const FEATURES = [
  {
    icon: Layers,
    title: 'Optimasi Slotting',
    description: 'Penempatan produk cerdas berdasarkan analisis afinitas kategori.',
  },
  {
    icon: Package,
    title: 'Rute Picking Efisien',
    description: 'Rute terpendek untuk mengurangi waktu dan biaya operasional.',
  },
  {
    icon: Zap,
    title: 'Hasil Instan',
    description: 'Dapatkan rekomendasi dalam hitungan detik dengan algoritma kami.',
  },
] as const

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
      <section className="input-hero">
        
        <h1 id="input-page-title" className="input-hero__title">
          Warehouse Slotting
          <span className="input-hero__title-accent">Optimizer</span>
        </h1>
        <p className="input-hero__subtitle">
          Optimalkan tata letak gudang dan rute picking Anda. Kurangi jarak tempuh
          hingga <strong>40%</strong>
        </p>
        <div className="input-hero__stats">
          <div className="input-hero__stat">
            <span className="input-hero__stat-value">~40%</span>
            <span className="input-hero__stat-label">Penghematan Jarak</span>
          </div>
          <div className="input-hero__divider" />
          <div className="input-hero__stat">
            <span className="input-hero__stat-value">3x</span>
            <span className="input-hero__stat-label">Skenario Analisis</span>
          </div>
          <div className="input-hero__divider" />
          <div className="input-hero__stat">
            <span className="input-hero__stat-value">15dtk</span>
            <span className="input-hero__stat-label">Waktu Proses</span>
          </div>
        </div>
      </section>

      <section className="input-features">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="input-feature-card">
            <div className="input-feature-card__icon">
              <feature.icon size={20} strokeWidth={2} />
            </div>
            <div className="input-feature-card__content">
              <h3 className="input-feature-card__title">{feature.title}</h3>
              <p className="input-feature-card__desc">{feature.description}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="input-config" aria-label="Konfigurasi data">
        <div className="input-config__header">
          <h2 className="input-config__title">Mulai Optimasi</h2>
          
        </div>

        <div className="input-config__panels">
          <div className="input-config__panel input-config__panel--upload">
            <FileUploadZone disabled={true} />
          </div>

          <div className="input-config__panel input-config__panel--dataset">
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

        <div className="input-config__action">
          <button
            type="button"
            className="input-config__submit"
            disabled={!canSubmit}
            onClick={handleSubmit}
            aria-describedby={!canSubmit ? 'submit-hint' : undefined}
          >
            <span>Proses Batch Ini</span>
            <ArrowRight size={18} strokeWidth={2.5} aria-hidden="true" />
          </button>
          {!canSubmit && (
            <p id="submit-hint" className="input-config__hint">
              {isLoading
                ? 'Memuat daftar dataset...'
                : isError
                  ? 'Gagal memuat dataset. Coba muat ulang.'
                  : 'Pilih dataset demo untuk memulai optimasi'}
            </p>
          )}
        </div>
      </section>

      <HowItWorks />

      <footer className="input-footer">
        <p className="input-footer__text">
          <strong>Catatan:</strong> Data gudang bersifat sintetis untuk demonstrasi.
          Integrasi data real tersedia melalui API upload.
        </p>
      </footer>
    </main>
  )
}