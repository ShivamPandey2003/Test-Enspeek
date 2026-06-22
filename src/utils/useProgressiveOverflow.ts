import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefCallback,
  type RefObject,
} from "react";

type ProgressiveOverflowResult<T extends string> = {
  containerRef: RefObject<HTMLDivElement | null>;
  fixedControlsRef: RefObject<HTMLDivElement | null>;
  getItemRef: (id: T) => RefCallback<HTMLDivElement>;
  minimumWidth: number;
  visibleIds: ReadonlySet<T>;
};

export const getVisibleItemCount = (
  availableWidth: number,
  fixedWidth: number,
  gap: number,
  itemWidths: readonly number[]
) => {
  const optionalWidth = Math.max(0, availableWidth - fixedWidth);
  let usedWidth = 0;
  let visibleCount = 0;

  for (const itemWidth of itemWidths) {
    const nextWidth = itemWidth + gap;
    if (usedWidth + nextWidth > optionalWidth) break;
    usedWidth += nextWidth;
    visibleCount += 1;
  }

  return visibleCount;
};

export function useProgressiveOverflow<T extends string>(
  itemIds: readonly T[]
): ProgressiveOverflowResult<T> {
  const containerRef = useRef<HTMLDivElement>(null);
  const fixedControlsRef = useRef<HTMLDivElement>(null);
  const itemElementsRef = useRef(new Map<T, HTMLDivElement>());
  const itemWidthsRef = useRef(new Map<T, number>());
  const itemRefCallbacks = useRef(new Map<T, RefCallback<HTMLDivElement>>());
  const frameRef = useRef<number | null>(null);
  const [minimumWidth, setMinimumWidth] = useState(0);
  const [visibleCount, setVisibleCount] = useState(itemIds.length);

  const getItemRef = useCallback((id: T) => {
    const existingCallback = itemRefCallbacks.current.get(id);
    if (existingCallback) return existingCallback;

    const callback: RefCallback<HTMLDivElement> = (element) => {
      if (element) {
        itemElementsRef.current.set(id, element);
      } else {
        itemElementsRef.current.delete(id);
      }
    };
    itemRefCallbacks.current.set(id, callback);
    return callback;
  }, []);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const fixedControls = fixedControlsRef.current;
    if (!container || !fixedControls) return;

    itemElementsRef.current.forEach((element, id) => {
      itemWidthsRef.current.set(id, element.getBoundingClientRect().width);
    });

    const hasMissingWidth = itemIds.some(
      (id) => !itemWidthsRef.current.has(id)
    );
    if (hasMissingWidth) {
      setVisibleCount(itemIds.length);
      return;
    }

    const fixedControlsWidth = fixedControls.getBoundingClientRect().width;
    setMinimumWidth((currentWidth) =>
      Math.abs(currentWidth - fixedControlsWidth) < 0.5
        ? currentWidth
        : fixedControlsWidth
    );

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const itemWidths = itemIds.map((id) => itemWidthsRef.current.get(id) ?? 0);
    const nextVisibleCount = getVisibleItemCount(
      container.getBoundingClientRect().width,
      fixedControlsWidth,
      gap,
      itemWidths
    );

    setVisibleCount((currentCount) =>
      currentCount === nextVisibleCount ? currentCount : nextVisibleCount
    );
  }, [itemIds]);

  useLayoutEffect(() => {
    measure();

    const scheduleMeasure = () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = window.requestAnimationFrame(measure);
    };

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", scheduleMeasure);
      return () => window.removeEventListener("resize", scheduleMeasure);
    }

    const observer = new ResizeObserver(scheduleMeasure);
    if (containerRef.current) observer.observe(containerRef.current);
    if (fixedControlsRef.current) observer.observe(fixedControlsRef.current);
    itemElementsRef.current.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [measure, visibleCount]);

  const visibleIds = new Set(itemIds.slice(0, visibleCount));

  return {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  };
}
