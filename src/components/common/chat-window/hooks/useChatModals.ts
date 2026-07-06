import { useCallback, useEffect, useState } from "react";
import type { ChatMessage, SurveyTab } from "../types";

/**
 * Owns the chart/table/crosstab modal state and the per-message survey tab
 * selection (chart vs table).
 *
 * `activeTab` is reset so every message defaults to "chart" whenever the
 * visible message list changes — identical to the original effect in
 * ChatWindow. Keeping this centralized (rather than per-message local state)
 * preserves the existing reset-on-new-message behaviour exactly.
 */
export const useChatModals = (visibleMessages: ChatMessage[]) => {
  const [selectedChart, setSelectedChart] = useState<number | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<{ [key: number]: SurveyTab }>({});
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedCrosstab, setSelectedCrosstab] = useState<number | null>(null);
  const [isCrosstabModalOpen, setIsCrosstabModalOpen] = useState(false);

  useEffect(() => {
    const defaultTabs: { [key: number]: SurveyTab } = {};
    visibleMessages.forEach((_, i) => {
      defaultTabs[i] = "chart";
    });
    setActiveTab(defaultTabs);
  }, [visibleMessages]);

  const selectTab = useCallback((index: number, tab: SurveyTab) => {
    setActiveTab((prev) => ({
      ...prev,
      [index]: tab,
    }));
  }, []);

  const openChartModal = useCallback((index: number) => {
    setSelectedChart(index);
    setIsChartModalOpen(true);
  }, []);

  const closeChartModal = useCallback(() => {
    setIsChartModalOpen(false);
    setSelectedChart(null);
  }, []);

  const openTableModal = useCallback((index: number) => {
    setSelectedTable(index);
    setIsTableModalOpen(true);
  }, []);

  const closeTableModal = useCallback(() => {
    setIsTableModalOpen(false);
    setSelectedTable(null);
  }, []);

  const closeCrosstabModal = useCallback(() => {
    setIsCrosstabModalOpen(false);
    setSelectedCrosstab(null);
  }, []);

  return {
    activeTab,
    selectTab,
    selectedChart,
    isChartModalOpen,
    openChartModal,
    closeChartModal,
    selectedTable,
    isTableModalOpen,
    openTableModal,
    closeTableModal,
    selectedCrosstab,
    isCrosstabModalOpen,
    setSelectedCrosstab,
    setIsCrosstabModalOpen,
    closeCrosstabModal,
  };
};

export default useChatModals;
