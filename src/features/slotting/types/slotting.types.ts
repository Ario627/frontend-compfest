export interface RecommendSummary {
  readonly warehouse: string;
  readonly total_orders: number;
  readonly total_items: number;
}

export interface SlottingItem {
  readonly product: string;
  readonly location: string;
}

export interface SlottingOptimization {
  readonly before: SlottingItem[];
  readonly after: SlottingItem[];
}

export interface DistanceMetrics {
  readonly before: number;
  readonly after: number;
  readonly saved: number;
  readonly saving_percentage: number;
}

export interface RecommendationData {
  readonly summary: RecommendSummary;
  readonly slotting: SlottingOptimization;
  readonly picking_route: string[];
  readonly distance: DistanceMetrics;
}

export interface RecommendResponse {
  readonly success: true;
  readonly message: string;
  readonly data: RecommendationData;
}

export interface RecommendRequest {
  readonly dataset: string;
}

export interface DatasetItem {
  readonly id: string;
  readonly name: string;
}

export interface DatasetsResponse {
  readonly datasets: DatasetItem[];
}

export interface GridDimensions {
  readonly aisleCount: number;
  readonly positionsPerAisle: number;
  readonly cellWidth: number;
  readonly cellHeight: number;
  readonly aisleGap: number;
  readonly canvasWidth: number;
  readonly canvasHeight: number;
}

export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly technicalDetail?: string;
  readonly statusCode?: number;
}

export type AppState =
  | { readonly status: "idle"; readonly selectedDatasetId: string | null }
  | {
      readonly status: "loading";
      readonly datasetId: string;
      readonly progressStep: number;
    }
  | { readonly status: "success"; readonly data: RecommendationData }
  | {
      readonly status: "error";
      readonly error: AppError;
      readonly lastDatasetId?: string;
    };

export type AppAction =
  | { type: "SELECT_DATASET"; id: string }
  | { type: "DESELECT_DATASET" }
  | { type: "START_PROCESSING"; datasetId: string }
  | { type: "PROGRESS_TICK"; step: number }
  | { type: "PROCESSING_SUCCESS"; data: RecommendationData }
  | { type: "PROCESSING_ERROR"; error: AppError }
  | { type: "RESET" };

export interface ProgressStep {
  readonly label: string;
  readonly status: "completed" | "active" | "pending";
}
