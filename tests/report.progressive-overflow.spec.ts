import { expect, test } from "@playwright/test";
import { getVisibleItemCount } from "../src/utils/useProgressiveOverflow";

test.describe("report progressive overflow", () => {
  const fixedWidth = 100;
  const gap = 8;
  const actionWidths = [80, 40, 40, 40, 40];

  test("keeps every action inline when the row fits exactly", () => {
    expect(
      getVisibleItemCount(380, fixedWidth, gap, actionWidths)
    ).toBe(5);
  });

  test("moves lowest-priority actions one by one as space decreases", () => {
    expect(
      getVisibleItemCount(291, fixedWidth, gap, actionWidths)
    ).toBe(3);
    expect(
      getVisibleItemCount(243, fixedWidth, gap, actionWidths)
    ).toBe(2);
    expect(
      getVisibleItemCount(195, fixedWidth, gap, actionWidths)
    ).toBe(1);
  });

  test("keeps all optional actions in overflow when fixed controls consume the row", () => {
    expect(
      getVisibleItemCount(fixedWidth, fixedWidth, gap, actionWidths)
    ).toBe(0);
  });
});
