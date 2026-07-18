import { describe, it, expect } from "vitest";
import { getDisplayMessage } from "../../src/features/slotting/utils/error-messages";
import type { ApiError } from "../../src/shared/api/api-client";

function makeError(overrides: Partial<ApiError> = {}): ApiError {
  return { code: "UNKNOWN", message: "Unknown error", status: 0, ...overrides };
}

describe("getDisplayMessage", () => {
  it("returns mapped message for VALIDATION_ERROR", () => {
    expect(getDisplayMessage(makeError({ code: "VALIDATION_ERROR" }))).toBe(
      "Beberapa data tidak valid. Periksa kembali format berkas yang diunggah.",
    );
  });

  it("returns mapped message for DATASET_NOT_FOUND", () => {
    expect(getDisplayMessage(makeError({ code: "DATASET_NOT_FOUND" }))).toBe(
      "Dataset yang dipilih tidak ditemukan. Pilih dataset lain atau muat ulang halaman.",
    );
  });

  it("returns mapped message for NETWORK_ERROR", () => {
    expect(getDisplayMessage(makeError({ code: "NETWORK_ERROR" }))).toBe(
      "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
    );
  });

  it("returns mapped message for TIMEOUT", () => {
    expect(getDisplayMessage(makeError({ code: "TIMEOUT" }))).toBe(
      "Proses memakan waktu lebih lama dari biasanya. Coba gunakan dataset yang lebih kecil.",
    );
  });

  it("returns mapped message for SERVICE_UNAVAILABLE", () => {
    expect(getDisplayMessage(makeError({ code: "SERVICE_UNAVAILABLE" }))).toBe(
      "Layanan rekomendasi sedang sibuk. Coba lagi dalam beberapa saat.",
    );
  });

  it("returns mapped message for RATE_LIMITED", () => {
    expect(getDisplayMessage(makeError({ code: "RATE_LIMITED" }))).toBe(
      "Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi.",
    );
  });

  it("falls back to HTTP 500 mapping", () => {
    expect(getDisplayMessage(makeError({ code: "UNKNOWN", status: 500 }))).toBe(
      "Terjadi kesalahan di server. Tim teknis sedang menanganinya.",
    );
  });

  it("falls back to HTTP 422 mapping", () => {
    expect(getDisplayMessage(makeError({ code: "UNKNOWN", status: 422 }))).toBe(
      "Data yang dikirim tidak sesuai format. Gunakan dataset demo yang tersedia.",
    );
  });

  it("falls back to HTTP 404 mapping", () => {
    expect(getDisplayMessage(makeError({ code: "UNKNOWN", status: 404 }))).toBe(
      "Dataset tidak ditemukan. Pilih dataset lain.",
    );
  });

  it("falls back to error.message when no mapping exists", () => {
    expect(
      getDisplayMessage(makeError({ code: "CUSTOM", message: "Custom msg" })),
    ).toBe("Custom msg");
  });

  it("returns generic message when nothing matches", () => {
    expect(
      getDisplayMessage(makeError({ code: "", message: "", status: 0 })),
    ).toBe("Terjadi kesalahan tak terduga. Silakan coba lagi.");
  });
});