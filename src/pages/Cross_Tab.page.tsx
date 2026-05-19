import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CrosstabHeader from "../components/common/Crosstab/CrosstabHeader";
import type { RootState } from "../store/store";
import { setBanners } from "../store/CrossTabDataSlice";
import Crosstab from "../components/common/Crosstab/crosstab";

const Cross_Tab_Page = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );

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
      <CrosstabHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <Crosstab/>
    </div>
  );
};

export default Cross_Tab_Page;
