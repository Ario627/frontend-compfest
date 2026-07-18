import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "../../src/features/slotting/components/error/error-state";
import { renderWithProviders } from "../test-utils";
import type { AppError } from "../../src/features/slotting/types/slotting.types";

const mockError: AppError = {
  code: "DATASET_NOT_FOUND",
  message:
    "Dataset yang dipilih tidak ditemukan. Pilih dataset lain atau muat ulang halaman.",
  statusCode: 404,
  technicalDetail: "Dataset not found",
};

describe("ErrorState", () => {
  it("renders error message", () => {
    renderWithProviders(
      <ErrorState error={mockError} onRetry={() => {}} onReset={() => {}} />,
    );
    expect(screen.getByText(/tidak dapat memproses/i)).toBeInTheDocument();
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    renderWithProviders(
      <ErrorState error={mockError} onRetry={onRetry} onReset={() => {}} />,
    );
    await user.click(screen.getByRole("button", { name: /coba lagi/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("calls onReset when back button is clicked", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    renderWithProviders(
      <ErrorState error={mockError} onRetry={() => {}} onReset={onReset} />,
    );
    await user.click(
      screen.getByRole("button", { name: /kembali ke input/i }),
    );
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("displays technical detail in collapsible section", () => {
    renderWithProviders(
      <ErrorState error={mockError} onRetry={() => {}} onReset={() => {}} />,
    );
    expect(screen.getByText(/detail teknis/i)).toBeInTheDocument();
  });
});