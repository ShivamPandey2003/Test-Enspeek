import { useMemo } from "react";
import { FaChartBar, FaExpandArrowsAlt, FaTable } from "react-icons/fa";
import Button from "../../../ui/Button";
import IconActionButton from "../../../ui/IconActionButton";
import type { ChatMessage, SurveyTab } from "../types";
import { buildSurveyView } from "../utils/surveyView";
import SurveyChart from "./SurveyChart";
import SurveyTable from "./SurveyTable";

type SurveyRendererProps = {
  msg: ChatMessage;
  // May be undefined before the tab-reset effect runs; kept faithful to the
  // original so the first paint matches (undefined => table branch, no expand).
  activeTab: SurveyTab | undefined;
  onSelectTab: (tab: SurveyTab) => void;
  onExpand: (tab: SurveyTab) => void;
};

/**
 * Renders a `surveydata` message: a chart/table toggle with an expand action,
 * and the active view. Owns none of the parsing — that lives in
 * `buildSurveyView` and is memoized by the caller (ChatMessage).
 *
 * Returns `null` for non-survey / unparseable messages, exactly like the
 * original inline guard.
 */
const SurveyRenderer = ({
  msg,
  activeTab,
  onSelectTab,
  onExpand,
}: SurveyRendererProps) => {
  // Parsing the survey payload is the most expensive per-message work; memoize
  // it so toggling chart/table or unrelated re-renders don't re-parse.
  const view = useMemo(() => buildSurveyView(msg), [msg]);
  if (!view) return null;

  const isChart = activeTab === "chart";
  const isTable = activeTab === "table";
  const canShowTable = !view.isExternalImage;

  return (
    <div className="w-full mt-3">
      <div className="flex justify-between items-center mb-2">
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={isChart ? "theme" : "outline"}
            size="default"
            className={`rounded-md ${isChart ? "text-white" : "theme-text-default"}`}
            onClick={() => onSelectTab("chart")}
          >
            <FaChartBar />
          </Button>
          {canShowTable && (
            <Button
              type="button"
              variant={isTable ? "theme" : "outline"}
              size="default"
              className={`rounded-md ${isTable ? "text-white" : "theme-text-default"}`}
              onClick={() => onSelectTab("table")}
            >
              <FaTable />
            </Button>
          )}
        </div>

        {(isChart || isTable) && (
          <IconActionButton
            onClick={() => onExpand(isChart ? "chart" : "table")}
            tone="neutral"
            className="text-xl theme-text-muted"
          >
            <FaExpandArrowsAlt />
          </IconActionButton>
        )}
      </div>

      {isChart ? (
        <SurveyChart view={view} studyID={msg.studyID} />
      ) : (
        <SurveyTable view={view} studyID={msg.studyID} />
      )}
    </div>
  );
};

export default SurveyRenderer;
