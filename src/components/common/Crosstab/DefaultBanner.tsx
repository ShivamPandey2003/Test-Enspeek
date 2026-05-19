import { useState } from "react";
import { LuDownload, LuCopy, LuPencilLine, LuSettings2, LuTable2, LuTrash2 } from "react-icons/lu";
import BannerSettings from "./BannerSettings";
import { useLocation, useNavigate } from "react-router";
import {
  useDeleteBanner,
  useReplicateBanner,
} from "../../../api-network/crosstab/mutation";
import { useBannerPointerList } from "../../../api-network/crosstab/query";
import { useDownloadtable } from "../../../api-network/crosstab/tablelist/mutation";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { setBannerName } from "../../../store/CrosstabSlice";
import IconActionButton from "../../ui/IconActionButton";
import { useReportProcessDownload } from "../../../api-network/report/mutation";
import NameCopyModal from "../../global/modals/NameCopyModal";
import ConfirmKeywordModal from "../../global/modals/ConfirmKeywordModal";

interface DefaultBannerProps {
  Id: string;
  Title: string;
  description: string;
  OwnerName: string;
  tableIDList: string[];
}

export default function DefaultBanner({ Id, Title, description, OwnerName, tableIDList }: DefaultBannerProps) {
  const { state } = useLocation();
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copyTitle, setCopyTitle] = useState<string>(`${Title} (COPY)`);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleCb = () => {
    setIsCopyModalOpen(false);
    setCopyTitle(`${Title} (COPY)`);
  };
  const { replicateBannerMutate, isRelicateBannerPending } = useReplicateBanner(
    {
      studyID: state.studyID,
      cb: handleCb,
    }
  );

  const { deleteBannerMutation, isDeleteBannerPending } = useDeleteBanner({
    studyID: state.studyID,
    cb: () => setIsDeleteModalOpen(false),
  });
  const { bannerPointerListData } = useBannerPointerList(Id, state.studyID);
  const { processDownload } = useReportProcessDownload();
  const { downloadTableMutate } = useDownloadtable({
    studyID: state.studyID,
    cb: ({ studyID, pid }: { studyID?: string; pid?: string }) => {
      if (studyID && pid) {
        processDownload({ studyID, pid });
      }
    },
  });

  return (
    <>
      <div
        className="report-card mt-3"
        data-test-id={Title}
      >
        <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2
              className={`crosstab-title text-xl font-semibold ${Array.isArray(bannerPointerListData) &&
                bannerPointerListData.length > 0
                ? "cursor-pointer"
                : "cursor-default"
                }`}
              onClick={() => {
                if (
                  Array.isArray(bannerPointerListData) &&
                  bannerPointerListData.length > 0
                ) {
                  dispatch(setBannerName(Title));
                  navigate("/crosstab/table-list", {
                    state: { studyID: state.studyID, bannerID: Id },
                  });
                }
              }}
            >
              {Title}
            </h2>
            <p className="crosstab-muted mt-1 text-sm">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {Array.isArray(bannerPointerListData) &&
              bannerPointerListData.length > 0 && (
                <>
                  <IconActionButton
                    aria-label="Grid View"
                    tooltip="View"
                    onClick={() => {
                      dispatch(setBannerName(Title));
                      navigate("/crosstab/table-list", {
                        state: { studyID: state.studyID, bannerID: Id },
                      });
                    }}
                  >
                    <LuTable2 size={18} />
                  </IconActionButton>
                  <IconActionButton
                    data-test-id={`${Title}_COPY`}
                    tone="info"
                    aria-label="Copy"
                    tooltip="Copy"
                    onClick={() => setIsCopyModalOpen(true)}
                  >
                    <LuCopy size={18} />
                  </IconActionButton>
                  <IconActionButton
                    data-test-id={`${Title}_SETTING`}
                    tone="success"
                    aria-label="Settings"
                    tooltip="Banner Settings"
                    onClick={() => setIsSettingsOpen(true)}
                  >
                    <LuSettings2 size={18} />
                  </IconActionButton>
                  <IconActionButton
                    tone="warning"
                    aria-label="Download"
                    tooltip="Download"
                    onClick={() => {
                      downloadTableMutate({
                        bannerID: Id,
                        tableID: tableIDList,
                      });
                    }}
                  >
                    <LuDownload size={18} />
                  </IconActionButton>
                </>
              )}
            <IconActionButton
              tone="primary"
              aria-label="Edit"
              tooltip="Edit"
              onClick={() => {
                dispatch(setBannerName(Title));
                navigate("/crosstab/edit-banner", {
                  state: { studyID: state.studyID, bannerID: Id },
                });
              }}
            >
              <LuPencilLine size={18} />
            </IconActionButton>
            <IconActionButton
              data-test-id={`${Title}_DELETE`}
              tone="danger"
              aria-label="Delete"
              tooltip="Delete"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <LuTrash2 size={18} />
            </IconActionButton>
          </div>
        </div>

        <div className="px-4 py-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {Array.isArray(bannerPointerListData) &&
              bannerPointerListData.length ? (
              bannerPointerListData.map((info) => (
                <div
                  key={info.pointID}
                  className="crosstab-soft-panel crosstab-title w-full px-3 py-2 text-sm font-medium"
                >
                  {info.title}
                </div>
              ))
            ) : (
              <div className="crosstab-muted p-2">No banner point added.</div>
            )}
          </div>
        </div>
        <div className="px-6 py-4">
          <p className="crosstab-muted text-sm italic">
            {`Modified By: ${OwnerName}`}
          </p>
        </div>
      </div>
      <NameCopyModal
        isOpen={isCopyModalOpen}
        onClose={() => {
          if (!isRelicateBannerPending) {
            setIsCopyModalOpen(false);
          }
        }}
        onConfirm={(nextValue) =>
          replicateBannerMutate({ bannerID: Id, title: nextValue })
        }
        titleKey="copyBanner"
        sourceLabel={Title || "this banner"}
        fieldLabel="New Banner Name"
        placeholder="Default Banner (copy)"
        defaultValue={copyTitle}
        copyText="Copy Banner"
        isPending={isRelicateBannerPending}
      />
      <ConfirmKeywordModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          if (!isDeleteBannerPending) {
            setIsDeleteModalOpen(false);
          }
        }}
        onConfirm={() => deleteBannerMutation(Id)}
        titleKey="deleteBanner"
        targetLabel={Title || "this banner"}
        isPending={isDeleteBannerPending}
        testId="BANNER_DELETE"
      />
      {isSettingsOpen && (
        <BannerSettings
          Id={Id}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
}
