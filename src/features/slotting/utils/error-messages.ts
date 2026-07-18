import type { ApiError } from "../../../shared/api/api-client";

const ERROR_MESSAGES: Record<string, string> = {
  VALIDATION_ERROR:
    "Beberapa data tidak valid. Periksa kembali format berkas yang diunggah.",
  DATASET_NOT_FOUND:
    "Dataset yang dipilih tidak ditemukan. Pilih dataset lain atau muat ulang halaman.",
  SERVICE_UNAVAILABLE:
    "Layanan rekomendasi sedang sibuk. Coba lagi dalam beberapa saat.",
  RATE_LIMITED:
    "Terlalu banyak permintaan. Tunggu sebentar sebelum mencoba lagi.",
  NETWORK_ERROR:
    "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
  TIMEOUT:
    "Proses memakan waktu lebih lama dari biasanya. Coba gunakan dataset yang lebih kecil.",
  HTTP_500: "Terjadi kesalahan di server. Tim teknis sedang menanganinya.",
  HTTP_422:
    "Data yang dikirim tidak sesuai format. Gunakan dataset demo yang tersedia.",
  HTTP_404: "Dataset tidak ditemukan. Pilih dataset lain.",
};

export function getDisplayMessage(error: ApiError): string {
  if (error.code && ERROR_MESSAGES[error.code]) {
    return ERROR_MESSAGES[error.code];
  }
  const httpKey = `HTTP_${error.status}`;
  if (ERROR_MESSAGES[httpKey]) {
    return ERROR_MESSAGES[httpKey];
  }
  return error.message || "Terjadi kesalahan tak terduga. Silakan coba lagi.";
}
