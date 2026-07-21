import type { JSX } from 'react'
import { Upload, Cpu, Map } from 'lucide-react'
import './how-it-works.css'

interface Step {
  readonly number: number
  readonly icon: typeof Upload
  readonly title: string
  readonly description: string
}

const STEPS: readonly Step[] = [
  {
    number: 1,
    icon: Upload,
    title: 'Pilih batch pesanan',
    description: 'Unggah data sendiri atau gunakan dataset demo yang tersedia',
  },
  {
    number: 2,
    icon: Cpu,
    title: 'Sistem menganalisis',
    description: 'Menghitung afinitas antar-kategori produk untuk optimasi penempatan',
  },
  {
    number: 3,
    icon: Map,
    title: 'Dapatkan rekomendasi',
    description: 'Peta slotting optimal dan rute picking efisien untuk gudang Anda',
  },
] as const

export function HowItWorks(): JSX.Element {
  return (
    <section className="hiw" aria-labelledby="how-it-works-title">
      <div className="hiw__header">
        <h2 id="how-it-works-title" className="hiw__title">
          Cara Kerja
        </h2>
        <p className="hiw__subtitle">
          Tiga langkah sederhana untuk mengoptimalkan gudang Anda
        </p>
      </div>
      <div className="hiw__steps">
        {STEPS.map((step, index) => (
          <div key={step.number} className="hiw__step">
            <div className="hiw__step-icon">
              <step.icon size={22} strokeWidth={1.5} />
            </div>
            {index < STEPS.length - 1 && (
              <div className="hiw__step-connector" aria-hidden="true" />
            )}
            <div className="hiw__step-content">
              <span className="hiw__step-number">Langkah {step.number}</span>
              <h3 className="hiw__step-title">{step.title}</h3>
              <p className="hiw__step-description">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}