import { http, HttpResponse, delay } from "msw";
import {
  MOCK_RECOMMEND_RESPONSE,
  MOCK_DATASETS,
} from "../../src/features/slotting/mocs/mock-recommend-response";

const API_BASE = "http://localhost:8000";

export const handlers = [
  http.get(`${API_BASE}/api/v1/demo/list`, () => {
    return HttpResponse.json({ datasets: MOCK_DATASETS });
  }),

  http.post(`${API_BASE}/api/v1/recommend`, async ({ request }) => {
    await delay(200);
    const body = (await request.json()) as { dataset?: string };

    if (!body.dataset) {
      return HttpResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: [
            {
              loc: ["body", "dataset"],
              msg: "field required",
              type: "value_error.missing",
            },
          ],
        },
        { status: 422 },
      );
    }

    const validIds = MOCK_DATASETS.map((d) => d.id);
    if (!validIds.includes(body.dataset)) {
      return HttpResponse.json(
        { success: false, message: "Dataset not found" },
        { status: 404 },
      );
    }

    return HttpResponse.json(MOCK_RECOMMEND_RESPONSE);
  }),

  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({ status: "ok" });
  }),
];

export const errorHandlers = {
  serverError: [
    http.get(`${API_BASE}/api/v1/demo/list`, () => {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }),
    http.post(`${API_BASE}/api/v1/recommend`, () => {
      return HttpResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }),
  ],

  networkError: [
    http.get(`${API_BASE}/api/v1/demo/list`, () => {
      return HttpResponse.error();
    }),
    http.post(`${API_BASE}/api/v1/recommend`, () => {
      return HttpResponse.error();
    }),
  ],

  timeout: [
    http.post(`${API_BASE}/api/v1/recommend`, async () => {
      await delay(35_000);
      return HttpResponse.json(MOCK_RECOMMEND_RESPONSE);
    }),
  ],
};
