import TableList from "./TableList";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsEditModal,
  setIsModalOpen,
  setIsBannerSettingsOpen,
  setIsHistoryModalOpen,
} from "../../../store/CrosstabSlice";
import type { RootState } from "../../../store/store";
import AddCustomTableModal from "../table-List/AddTableModal";
import EditTableModal from "./EditTable";
import { useLocation } from "react-router";
import HistoryModal from "../Report/HistoryModal";
import Error from "../../global/Error";
import { useTableList } from "../../../api-network/crosstab/tablelist/query";
import QuestionsList from "../Crosstab/QuestionTable";
import BannerSettings from "../Crosstab/BannerSettings";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../../utils";

const CrossTabTable = () => {
  const { state } = useLocation();

  if (!state) {
    return <Error showHome />;
  }

  const dispatch = useDispatch();
  const {
    isEditModal,
    isModalOpen,
    isBannerSettingsOpen,
    isHistoryModalOpen,
    selectedQid,
    selectedTable,
  } = useSelector((state: RootState) => state.crosstab);

  return (
    <div>
      <SuspenseContent
        studyID={state.studyID}
        bannerID={state.bannerID}
        dispatch={dispatch}
        selectedQid={selectedQid}
        selectedTable={selectedTable}
        isEditModal={isEditModal}
        isModalOpen={isModalOpen}
        isBannerSettingsOpen={isBannerSettingsOpen}
        isHistoryModalOpen={isHistoryModalOpen}
      />
    </div>
  );
};

const SuspenseContent = ({
  bannerID,
  studyID,
  dispatch,
  selectedQid,
  selectedTable,
  isEditModal,
  isModalOpen,
  isBannerSettingsOpen,
  isHistoryModalOpen,
}: any) => {
  const { tableListData, isPending } = useTableList(bannerID, studyID);

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-[78vh]">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }

  if (!tableListData || !Array.isArray(tableListData)) {
    return <QuestionsList />;
  }

  return (
    <>
      {tableListData.map((Data: any) => (
        <TableList
          key={Data.tableID}
          qID={Data.qID}
          Title={Data.title}
          Description={Data.description}
          Id={Data.tableID}
          tableIDList={Data.tableIDList}
          tableID={Data.tableID}
        />
      ))}
      <EditTableModal
        qid={selectedQid}
        tid={selectedTable}
        open={isEditModal}
        onOpenChange={(open) => dispatch(setIsEditModal(open))}
      />
      <AddCustomTableModal
        open={isModalOpen}
        onOpenChange={(open) => dispatch(setIsModalOpen(open))}
      />
      <BannerSettings
        Id={bannerID}
        isOpen={isBannerSettingsOpen}
        onClose={() => dispatch(setIsBannerSettingsOpen(false))}
      />
      <HistoryModal
        open={isHistoryModalOpen}
        onOpenChange={() => {
          dispatch(setIsHistoryModalOpen(false));
        }}
      />
    </>
  );
};

export default CrossTabTable;
