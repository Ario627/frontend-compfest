import type { ProgressStep } from "../types/slotting.types";

export const PROGRESS_STEPS: readonly string[] = [
  "Memvalidasi data batch",
  "Menghitung matriks afinitas antar-kategori",
  "Menjalankan algoritma optimasi slotting",
  "Menghitung rute picking optimal",
  "Menyusun perbandingan skenario",
] as const;

export const PROGRESS_INTERVAL_MS = 3_000;

export function getProgressSteps(currentStep: number): ProgressStep[] {
  return PROGRESS_STEPS.map((label, index) => ({
    label,
    status:
      index < currentStep
        ? "completed"
        : index === currentStep
          ? "active"
          : "pending",
  }));
}