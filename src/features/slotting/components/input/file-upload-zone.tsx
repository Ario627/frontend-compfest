import type { JSX } from "react";
import './file-upload-zone.css'

interface FileUploadZoneProps {
  readonly disabled?: boolean
  readonly onFileSelect?: (file: File) => void
}

export function FileUploadZone({ disabled = true }: FileUploadZoneProps): JSX.Element {
  return (
    <div className="file-upload-zone" aria-label="Zona unggah data pesanan">
      <div className="file-upload-zone__header">
        <h3 className="file-upload-zone__title">Unggah Data</h3>
        <span className="file-upload-zone__badge">Coming Soon</span>
      </div>
      <div className="file-upload-zone__dropzone" aria-disabled={disabled}>
        <svg 
          className="file-upload-zone__icon" 
          width="48" 
          height="48" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <p className="file-upload-zone__text">
          Drag & drop file CSV atau JSON
        </p>
        <p className="file-upload-zone__hint">
          Maksimal 5MB
        </p>
      </div>
      <button 
        type="button"
        className="file-upload-zone__button"
        disabled={disabled}
      >
        Pilih File
      </button>
      {disabled && (
        <p className="file-upload-zone__notice">
          Fitur unggah file belum tersedia. Gunakan dataset demo untuk mencoba sistem.
        </p>
      )}
    </div>
  )
}