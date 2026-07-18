import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeAll, afterAll } from "vitest";
import { server } from "./mocks/server";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());

Object.defineProperty(window, "innerWidth", {
  writable: true,
  configurable: true,
  value: 1440,
});

Object.defineProperty(window, "innerHeight", {
  writable: true,
  configurable: true,
  value: 900,
});

window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
