import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProgressRing } from "../shared/progress-ring";
import { getProgressSteps, PROGRESS_INTERVAL_MS } from "../../utils/progress-messages";
import type { ProgressStep } from "../../types/slotting.types";
import "./loading-state.css";

interface LoadingStateProps {
  readonly currentStep: number;
  readonly onTick: (step: number) => void;
  readonly onCancel: () => void;
}

export function LoadingState({
  currentStep,
  onTick,
  onCancel,
}: LoadingStateProps) {
  const steps: ProgressStep[] = getProgressSteps(currentStep);
  const activeStep = steps.find((s) => s.status === "active");

  useEffect(() => {
    if (currentStep >= steps.length - 1) return;

    const intervalId = setInterval(() => {
      onTick(currentStep + 1);
    }, PROGRESS_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [currentStep, steps.length, onTick]);

  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-state__content">
        <div className="loading-state__hero">
          <div className="loading-state__ring">
            <ProgressRing size={120} strokeWidth={6} />
          </div>
          <div className="loading-state__icon-center">
            <Loader2 size={32} strokeWidth={2} className="loading-state__spinner" />
          </div>
        </div>

        <div className="loading-state__status">
          <h2 className="loading-state__title">Memproses Optimasi</h2>
          <p className="loading-state__message">
            {activeStep?.label ?? "Memproses..."}
          </p>
        </div>

        <ul className="loading-state__steps">
          {steps.map((step, index) => (
            <li
              key={index}
              className={`ls-step ls-step--${step.status}`}
            >
              <div className="ls-step__indicator">
                {step.status === "completed" && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ls-step__check">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {step.status === "active" && (
                  <div className="ls-step__pulse" />
                )}
                {step.status === "pending" && (
                  <div className="ls-step__dot" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`ls-step__connector ${step.status === "completed" ? "ls-step__connector--done" : ""}`} />
              )}
              <span className="ls-step__label">{step.label}</span>
            </li>
          ))}
        </ul>

        <div className="loading-state__info">
          <p className="loading-state__estimate">
            <span className="loading-state__estimate-icon">⏱</span>
            Estimasi: 5-15 detik
          </p>
        </div>

        <button
          type="button"
          className="loading-state__cancel"
          onClick={onCancel}
        >
          Batalkan Proses
        </button>
      </div>
    </div>
  );
}