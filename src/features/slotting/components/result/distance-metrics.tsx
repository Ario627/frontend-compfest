import type { DistanceMetrics as DistanceMetricsType } from "../../types/slotting.types";
import './distance-metrics.css';

interface DistanceMetricsProps {
  distance: DistanceMetricsType;
}

export function DistanceMetrics({ distance }: DistanceMetricsProps) {
  const maxDistance = Math.max(distance.before, distance.after, 1);
  const beforeWidth = (distance.before / maxDistance) * 100;
  const afterWidth = (distance.after / maxDistance) * 100;
  const randomWidth = 100;
  const abcWidth = (distance.before > 0 ? 78 : 100);

  return (
    <div className="dm-container">
      <h3 className="dm-title">Penghematan Jarak</h3>

      <div className="dm-hero">
        <span className="dm-hero__value">{distance.saving_percentage.toFixed(1)}%</span>
        <span className="dm-hero__label">penghematan</span>
      </div>

      <div className="dm-stats">
        <div className="dm-stat">
          <span className="dm-stat__label">Sebelum</span>
          <span className="dm-stat__value">{distance.before.toLocaleString("id-ID")} m</span>
        </div>
        <div className="dm-stat">
          <span className="dm-stat__label">Sesudah</span>
          <span className="dm-stat__value dm-stat__value--after">{distance.after.toLocaleString("id-ID")} m</span>
        </div>
        <div className="dm-stat">
          <span className="dm-stat__label">Hemat</span>
          <span className="dm-stat__value dm-stat__value--saved">{distance.saved.toLocaleString("id-ID")} m</span>
        </div>
      </div>

      <div className="dm-comparison">
        <h4 className="dm-comparison__title">Perbandingan Skenario</h4>

        <div className="dm-bar">
          <span className="dm-bar__label">Acak</span>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--random"
              style={{ width: `${randomWidth}%` }}
            />
          </div>
          <span className="dm-bar__value">{distance.before.toLocaleString("id-ID")} m</span>
        </div>

        <div className="dm-bar">
          <span className="dm-bar__label">ABC</span>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--abc"
              style={{ width: `${abcWidth}%` }}
            />
          </div>
          <span className="dm-bar__value">
            {Math.round(distance.before * (abcWidth / 100)).toLocaleString("id-ID")} m
          </span>
        </div>

        <div className="dm-bar">
          <span className="dm-bar__label">Sistem</span>
          <div className="dm-bar__track">
            <div
              className="dm-bar__fill dm-bar__fill--system"
              style={{ width: `${afterWidth}%` }}
            />
          </div>
          <span className="dm-bar__value">{distance.after.toLocaleString("id-ID")} m</span>
        </div>
      </div>
    </div>
  );
}