import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CrosstabHeader from "../components/common/Crosstab/CrosstabHeader";
import type { RootState } from "../store/store";
import { setBanners } from "../store/CrossTabDataSlice";
import Crosstab from "../components/common/Crosstab/crosstab";
import { useLocation } from "react-router";
import { useCrosstabStudyInfo } from "../api-network/crosstab/query";
import ChatHistoryLoader from "../components/global/ChatHistoryLoader";

const Cross_Tab_Page = () => {
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const { BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const studyID = state?.studyID;
  useCrosstabStudyInfo(studyID);

  useEffect(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filtered = normalizedSearchTerm
      ? BannersAll.filter((banner) =>
          banner.title?.trim().toLowerCase().includes(normalizedSearchTerm)
        )
      : BannersAll;

    dispatch(setBanners(filtered));
  }, [searchTerm, BannersAll, dispatch]);

  return (
    <div className="crosstab-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <ChatHistoryLoader enabled={!!studyID} />
      <CrosstabHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Crosstab/>
    </div>
  );
};

export default Cross_Tab_Page;
