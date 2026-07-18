import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import type { AppError } from "../../types/slotting.types";
import "./error-state.css";

interface ErrorStateProps {
  readonly error: AppError;
  readonly onRetry: () => void;
  readonly onReset: () => void;
}

export function ErrorState({ error, onRetry, onReset }: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="error-state" role="alert" aria-live="assertive">
      <div className="error-state__icon">
        <AlertTriangle size={48} strokeWidth={1.5} />
      </div>

      <h2 className="error-state__title">Tidak dapat memproses batch ini</h2>

      <p className="error-state__message">{error.message}</p>

      <div className="error-state__actions">
        <button
          type="button"
          className="error-state__button error-state__button--primary"
          onClick={onRetry}
        >
          Coba Lagi
        </button>
        <button
          type="button"
          className="error-state__button error-state__button--secondary"
          onClick={onReset}
        >
          Kembali ke Input
        </button>
      </div>

      <div className="error-state__details">
        <button
          type="button"
          className="error-state__details-toggle"
          onClick={() => setShowDetails(!showDetails)}
          aria-expanded={showDetails}
        >
          <span>Detail teknis</span>
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDetails && (
          <div className="error-state__details-content">
            <dl className="error-state__details-list">
              <div className="error-state__details-item">
                <dt>Error code:</dt>
                <dd>{error.code}</dd>
              </div>
              {error.statusCode && (
                <div className="error-state__details-item">
                  <dt>Status:</dt>
                  <dd>{error.statusCode}</dd>
                </div>
              )}
              {error.technicalDetail && (
                <div className="error-state__details-item">
                  <dt>Detail:</dt>
                  <dd>{error.technicalDetail}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}