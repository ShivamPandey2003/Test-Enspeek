import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { AdminPanelTabId } from "../../config/userAccess";

/**
 * Owns the admin-panel subheader's responsive search layout: whether the search
 * box is expanded, whether it must collapse to a compact icon when the tabs +
 * search no longer fit, and the refs used to measure that.
 *
 * Extracted verbatim from admin-panel.tsx (same state, refs, effect and
 * dependency array) so the page component can shrink toward orchestration.
 */
export const useAdminPanelSearchLayout = (
  visibleTabs: readonly AdminPanelTabId[]
) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCompactSearch, setIsCompactSearch] = useState(false);
  const subheaderContentRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const searchWidthRef = useRef<HTMLDivElement>(null);

  const measureSearchLayout = useCallback(() => {
    const container = subheaderContentRef.current;
    const tabs = tabsRef.current;
    const searchMeasurement = searchWidthRef.current;
    if (!container || !tabs || !searchMeasurement) return;

    const styles = window.getComputedStyle(container);
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
    const requiredWidth = tabs.scrollWidth + searchMeasurement.offsetWidth + gap;
    const shouldCompact = requiredWidth > container.clientWidth;
    setIsCompactSearch((current) =>
      current === shouldCompact ? current : shouldCompact
    );
  }, []);

  useLayoutEffect(() => {
    if (isSearchOpen) return;

    measureSearchLayout();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measureSearchLayout);
      return () => window.removeEventListener("resize", measureSearchLayout);
    }

    const observer = new ResizeObserver(measureSearchLayout);
    if (subheaderContentRef.current) observer.observe(subheaderContentRef.current);
    if (tabsRef.current) observer.observe(tabsRef.current);
    if (searchWidthRef.current) observer.observe(searchWidthRef.current);
    return () => observer.disconnect();
  }, [isSearchOpen, measureSearchLayout, visibleTabs]);

  return {
    isSearchOpen,
    setIsSearchOpen,
    isCompactSearch,
    subheaderContentRef,
    tabsRef,
    searchWidthRef,
  };
};

export default useAdminPanelSearchLayout;
