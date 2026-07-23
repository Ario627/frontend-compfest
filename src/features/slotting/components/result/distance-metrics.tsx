import { TrendingDown, ArrowRight, Percent, Ruler } from "lucide-react";
import type { DistanceMetrics as DistanceMetricsType } from "../../types/slotting.types";
import './distance-metrics.css';

interface DistanceMetricsProps {
  distance: DistanceMetricsType;
}

export function DistanceMetrics({ distance }: DistanceMetricsProps) {
  const maxDistance = Math.max(distance.before, distance.after, 1);
  const afterWidth = (distance.after / maxDistance) * 100;
  const randomWidth = 100;
  const abcWidth = (distance.before > 0 ? 78 : 100);

  return (
    <div className="dm-container">
      <div className="dm-header">
        
        <div className="dm-header__text">
          <h3 className="dm-header__title">Analisis Penghematan</h3>
          <p className="dm-header__subtitle">Perbandingan jarak tempuh antar skenario</p>
        </div>
      </div>

      <div className="dm-hero">
        <div className="dm-hero__ring">
          <svg className="dm-hero__svg" viewBox="0 0 120 120">
            <circle className="dm-hero__track" cx="60" cy="60" r="52" />
            <circle 
              className="dm-hero__progress" 
              cx="60" 
              cy="60" 
              r="52" 
              strokeDasharray={`${2 * Math.PI * 52}`}
              strokeDashoffset={`${2 * Math.PI * 52 * (1 - distance.saving_percentage / 100)}`}
            />
          </svg>
          <div className="dm-hero__center">
            <Percent size={16} strokeWidth={2} className="dm-hero__icon" />
            <span className="dm-hero__value">{distance.saving_percentage.toFixed(1)}</span>
            <span className="dm-hero__unit">%</span>
          </div>
        </div>
        <div className="dm-hero__info">
          <span className="dm-hero__label">Penghematan Jarak</span>
          <span className="dm-hero__desc">
            Rute optimized lebih pendek <strong>{distance.saved.toLocaleString("id-ID")} m</strong> dari baseline
          </span>
        </div>
      </div>

      <div className="dm-stats">
        <div className="dm-stat dm-stat--before">
          <div className="dm-stat__icon">
            <Ruler size={16} strokeWidth={2} />
          </div>
          <span className="dm-stat__label">Sebelum</span>
          <span className="dm-stat__value">{distance.before.toLocaleString("id-ID")}</span>
          <span className="dm-stat__unit">meter</span>
        </div>
        <div className="dm-stat__arrow">
          <ArrowRight size={20} strokeWidth={2} />
        </div>
        <div className="dm-stat dm-stat--after">
          <div className="dm-stat__icon dm-stat__icon--after">
            <Ruler size={16} strokeWidth={2} />
          </div>
          <span className="dm-stat__label">Sesudah</span>
          <span className="dm-stat__value dm-stat__value--after">{distance.after.toLocaleString("id-ID")}</span>
          <span className="dm-stat__unit">meter</span>
        </div>
      </div>

      <div className="dm-comparison">
        <h4 className="dm-comparison__title">Perbandingan Skenario</h4>

        <div className="dm-bar">
          <div className="dm-bar__header">
            <span className="dm-bar__label">Acak (Baseline)</span>
            <span className="dm-bar__value">{distance.before.toLocaleString("id-ID")} m</span>
          </div>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--random"
              style={{ width: `${randomWidth}%` }}
            />
          </div>
        </div>

        <div className="dm-bar">
          <div className="dm-bar__header">
            <span className="dm-bar__label">ABC Analysis</span>
            <span className="dm-bar__value">
              {Math.round(distance.before * (abcWidth / 100)).toLocaleString("id-ID")} m
            </span>
          </div>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--abc"
              style={{ width: `${abcWidth}%` }}
            />
          </div>
        </div>

        <div className="dm-bar dm-bar--highlighted">
          <div className="dm-bar__header">
            <span className="dm-bar__label">Sistem Optimasi</span>
            <span className="dm-bar__value dm-bar__value--highlight">{distance.after.toLocaleString("id-ID")} m</span>
          </div>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--system"
              style={{ width: `${afterWidth}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}