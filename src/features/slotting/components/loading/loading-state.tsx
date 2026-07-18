import { useEffect } from "react";
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
      <div className="loading-state__ring">
        <ProgressRing size={72} strokeWidth={4} />
      </div>

      <p className="loading-state__message">
        {activeStep?.label ?? "Memproses..."}
      </p>

      <ul className="loading-state__steps">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`loading-state__step loading-state__step--${step.status}`}
          >
            <span className="loading-state__step-indicator">
              {step.status === "completed" && "✓"}
              {step.status === "active" && "◌"}
              {step.status === "pending" && "○"}
            </span>
            <span className="loading-state__step-label">{step.label}</span>
          </li>
        ))}
      </ul>

      <p className="loading-state__estimate">Estimasi: 5-15 detik</p>

      <button
        type="button"
        className="loading-state__cancel"
        onClick={onCancel}
      >
        Batalkan
      </button>
    </div>
  );
}