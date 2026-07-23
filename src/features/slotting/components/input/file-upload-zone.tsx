import type { JSX } from 'react'
import { Upload } from 'lucide-react'
import './file-upload-zone.css'

interface FileUploadZoneProps {
  readonly disabled?: boolean
}

export function FileUploadZone({ disabled = false }: FileUploadZoneProps): JSX.Element {
  return (
    <div className="fuz-container" aria-label="Area unggah file">
      <div className="fuz-header">
        <h3 className="fuz-header__title">Upload Data Sendiri</h3>
      </div>
      
      <div className="fuz-dropzone" aria-disabled={disabled}>
        <div className="fuz-dropzone__icon">
          <Upload size={32} strokeWidth={1.5} />
        </div>
        <div className="fuz-dropzone__text">
          <p className="fuz-dropzone__title">
            {disabled ? 'Segera hadir' : 'Drag & drop file di sini'}
          </p>
          <p className="fuz-dropzone__subtitle">
            {disabled 
              ? 'Fitur upload akan tersedia segera'
              : 'atau klik untuk memilih file'}
          </p>
        </div>
        <p className="fuz-dropzone__format">Format: CSV, JSON (maks. 10MB)</p>
      </div>

      <div className="fuz-info">
        <p className="fuz-info__text">
          Gunakan dataset demo di samping untuk mencoba fitur optimasi tanpa perlu upload file.
        </p>
      </div>
    </div>
  )
}