import { expect, test } from "@playwright/test";
import {
  getProgressiveVisibleItemCount,
  getVisibleItemCount,
} from "../src/utils/useProgressiveOverflow";

test.describe("progressive action overflow", () => {
  const fixedWidth = 100;
  const gap = 8;
  const actionWidths = [80, 40, 40, 40, 40];

  test("keeps every action inline when the row fits exactly", () => {
    expect(getVisibleItemCount(380, fixedWidth, gap, actionWidths)).toBe(5);
  });

  test("moves lowest-priority actions one by one as space decreases", () => {
    expect(getVisibleItemCount(291, fixedWidth, gap, actionWidths)).toBe(3);
    expect(getVisibleItemCount(243, fixedWidth, gap, actionWidths)).toBe(2);
    expect(getVisibleItemCount(195, fixedWidth, gap, actionWidths)).toBe(1);
  });

  test("keeps all optional actions in overflow when fixed controls consume the row", () => {
    expect(
      getVisibleItemCount(fixedWidth, fixedWidth, gap, actionWidths)
    ).toBe(0);
  });

  test("removes the conditional trigger as soon as every action fits without it", () => {
    const widths = [96, 80, 80, 72];

    expect(
      getProgressiveVisibleItemCount(440, 120, 80, gap, widths)
    ).toBe(4);
    expect(
      getProgressiveVisibleItemCount(439, 120, 80, gap, widths)
    ).toBe(3);
  });

  test("hides an inactive action without reserving dropdown space", () => {
    expect(getVisibleItemCount(200, 0, gap, [200])).toBe(1);
    expect(getVisibleItemCount(199, 0, gap, [200])).toBe(0);
  });
});
