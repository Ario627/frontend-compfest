import type { JSX } from 'react'
import './how-it-works.css'

interface Step {
  readonly number: number
  readonly title: string
  readonly description: string
}

const STEPS: readonly Step[] = [
  {
    number: 1,
    title: 'Pilih batch pesanan',
    description: 'Unggah data sendiri atau gunakan dataset demo yang tersedia',
  },
  {
    number: 2,
    title: 'Sistem menganalisis',
    description: 'Menghitung afinitas antar-kategori produk untuk optimasi penempatan',
  },
  {
    number: 3,
    title: 'Dapatkan rekomendasi',
    description: 'Peta slotting optimal dan rute picking efisien untuk gudang Anda',
  },
] as const

export function HowItWorks(): JSX.Element {
  return (
    <section className="how-it-works" aria-labelledby="how-it-works-title">
      <h2 id="how-it-works-title" className="how-it-works__title">
        Cara Kerja
      </h2>
      <ol className="how-it-works__steps">
        {STEPS.map((step) => (
          <li key={step.number} className="how-it-works__step">
            <div className="how-it-works__step-number" aria-hidden="true">
              {step.number}
            </div>
            <div className="how-it-works__step-content">
              <h3 className="how-it-works__step-title">{step.title}</h3>
              <p className="how-it-works__step-description">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
