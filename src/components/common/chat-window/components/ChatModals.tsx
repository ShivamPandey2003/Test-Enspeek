import TableAndChartModal from "../../Report/TableAndChartModal";
import TableModal from "../../Crosstab/TableModal";
import type { ChatMessage } from "../types";

type ChatModalsProps = {
  messages: ChatMessage[];
  selectedChart: number | null;
  isChartModalOpen: boolean;
  onCloseChart: () => void;
  selectedTable: number | null;
  isTableModalOpen: boolean;
  onCloseTable: () => void;
  selectedCrosstab: number | null;
  isCrosstabModalOpen: boolean;
  onCloseCrosstab: () => void;
};

/**
 * Hosts the expand-to-modal views for chart, table, and crosstab. Behaviour and
 * open/close guards match the original inline modal rendering exactly.
 */
const ChatModals = ({
  messages,
  selectedChart,
  isChartModalOpen,
  onCloseChart,
  selectedTable,
  isTableModalOpen,
  onCloseTable,
  selectedCrosstab,
  isCrosstabModalOpen,
  onCloseCrosstab,
}: ChatModalsProps) => (
  <>
    {isChartModalOpen && selectedChart !== null && (
      <TableAndChartModal
        isOpen={isChartModalOpen}
        onClose={onCloseChart}
        message={messages[selectedChart]}
        type="chart"
      />
    )}

    {isTableModalOpen && selectedTable !== null && (
      <TableAndChartModal
        isOpen={isTableModalOpen}
        onClose={onCloseTable}
        message={messages[selectedTable]}
        type="table"
      />
    )}

    {isCrosstabModalOpen && selectedCrosstab !== null && (
      <TableModal
        isOpen={isCrosstabModalOpen}
        onClose={onCloseCrosstab}
        message={messages[selectedCrosstab]}
      />
    )}
  </>
);

export default ChatModals;
