import type { DatasetItem, RecommendResponse } from "../types/slotting.types";

export const MOCK_RECOMMEND_RESPONSE: RecommendResponse = {
  success: true,
  message: "Recommendation generated successfully (MOCK)",
  data: {
    summary: {
      warehouse: "Warehouse Alpha (Medium Mock)",
      total_orders: 200,
      total_items: 540,
    },
    slotting: {
      before: [
        { product: "Mie Instan", location: "Aisle 3, Shelf A" },
        { product: "Minyak Goreng", location: "Aisle 1, Shelf B" },
        { product: "Beras 5kg", location: "Aisle 4, Shelf C" },
        { product: "Gula Pasir", location: "Aisle 2, Shelf A" },
        { product: "Kopi Sachet", location: "Aisle 3, Shelf B" },
        { product: "Teh Celup", location: "Aisle 1, Shelf A" },
        { product: "Susu UHT", location: "Aisle 2, Shelf C" },
        { product: "Roti Tawar", location: "Aisle 4, Shelf A" },
      ],
      after: [
        { product: "Mie Instan", location: "Aisle 1, Shelf A" },
        { product: "Teh Celup", location: "Aisle 1, Shelf B" },
        { product: "Minyak Goreng", location: "Aisle 1, Shelf C" },
        { product: "Kopi Sachet", location: "Aisle 2, Shelf A" },
        { product: "Gula Pasir", location: "Aisle 2, Shelf B" },
        { product: "Susu UHT", location: "Aisle 3, Shelf A" },
        { product: "Roti Tawar", location: "Aisle 3, Shelf B" },
        { product: "Beras 5kg", location: "Aisle 4, Shelf A" },
      ],
    },
    picking_route: [
      "START",
      "Mie Instan",
      "Teh Celup",
      "Minyak Goreng",
      "Kopi Sachet",
      "Gula Pasir",
      "Susu UHT",
      "Roti Tawar",
      "Beras 5kg",
      "EXIT",
    ],
    distance: {
      before: 1450.0,
      after: 920.0,
      saved: 530.0,
      saving_percentage: 36.55,
    },
  },
};

export const MOCK_DATASETS: DatasetItem[] = [
  { id: "small", name: "Batch Kecil - 50 pesanan, ~120 item" },
  { id: "medium", name: "Batch Menengah - 200 pesanan, ~540 item" },
  { id: "large", name: "Batch Besar - 500 pesanan, ~1.250 item" },
];