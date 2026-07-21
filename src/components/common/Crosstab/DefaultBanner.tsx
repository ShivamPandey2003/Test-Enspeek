import { useMemo, useRef, useState, type ElementType } from "react";
import {
  LuCopy,
  LuDownload,
  LuEllipsisVertical,
  LuPencilLine,
  LuSettings2,
  LuTable2,
  LuTrash2,
} from "react-icons/lu";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { useDeleteBanner, useReplicateBanner } from "../../../api-network/crosstab/mutation";
import { useBannerPointerList } from "../../../api-network/crosstab/query";
import { useDownloadtable } from "../../../api-network/crosstab/tablelist/mutation";
import { useReportProcessDownload } from "../../../api-network/report/mutation";
import { setBannerName } from "../../../store/CrosstabSlice";
import type { AppDispatch } from "../../../store/store";
import { BANNER_CARD_ACTION_PRIORITY } from "../../../utils/crosstabResponsive";
import { useOverflowMenu } from "../../../utils/useOverflowMenu";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import ConfirmKeywordModal from "../../global/modals/ConfirmKeywordModal";
import NameCopyModal from "../../global/modals/NameCopyModal";
import Button from "../../ui/Button";
import IconActionButton from "../../ui/IconActionButton";
import OverflowActionsMenu, {
  type OverflowActionMenuItem,
} from "../../ui/OverflowActionsMenu";
import BannerSettings from "./BannerSettings";

interface DefaultBannerProps {
  Id: string;
  Title: string;
  description: string;
  OwnerName: string;
  tableIDList: string[];
}

type BannerActionId = (typeof BANNER_CARD_ACTION_PRIORITY)[number];

type BannerAction = {
  id: BannerActionId;
  label: string;
  Icon: ElementType;
  onSelect: () => void;
  tone?: "neutral" | "primary" | "info" | "success" | "warning" | "danger";
  testId?: string;
};

export default function DefaultBanner({
  Id,
  Title,
  description,
  OwnerName,
  tableIDList,
}: DefaultBannerProps) {
  const { state } = useLocation();
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copyTitle, setCopyTitle] = useState(`${Title} (COPY)`);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const allVisibleFixedControlsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { bannerPointerListData } = useBannerPointerList(Id, state.studyID);
  const hasPointers =
    Array.isArray(bannerPointerListData) && bannerPointerListData.length > 0;
  const actionIds = useMemo<readonly BannerActionId[]>(
    () =>
      hasPointers
        ? BANNER_CARD_ACTION_PRIORITY
        : BANNER_CARD_ACTION_PRIORITY.filter(
            (actionId) => actionId === "edit" || actionId === "delete"
          ),
    [hasPointers]
  );
  const {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  } = useProgressiveOverflow(actionIds, { allVisibleFixedControlsRef });
  const { processDownload } = useReportProcessDownload();
  const { downloadTableMutate } = useDownloadtable({
    studyID: state.studyID,
    cb: ({ studyID, pid }: { studyID?: string; pid?: string }) => {
      if (studyID && pid) processDownload({ studyID, pid });
    },
  });
  const { replicateBannerMutate, isRelicateBannerPending } = useReplicateBanner({
    studyID: state.studyID,
    cb: () => {
      setIsCopyModalOpen(false);
      setCopyTitle(`${Title} (COPY)`);
    },
  });
  const { deleteBannerMutation, isDeleteBannerPending } = useDeleteBanner({
    studyID: state.studyID,
    cb: () => setIsDeleteModalOpen(false),
  });

  const openTableList = () => {
    dispatch(setBannerName(Title));
    navigate("/crosstab/table-list", {
      state: { studyID: state.studyID, bannerID: Id },
    });
  };
  const editBanner = () => {
    dispatch(setBannerName(Title));
    navigate("/crosstab/edit-banner", {
      state: { studyID: state.studyID, bannerID: Id },
    });
  };
  const actions: readonly BannerAction[] = [
    { id: "view", label: "View", Icon: LuTable2, onSelect: openTableList },
    {
      id: "edit",
      label: "Edit",
      Icon: LuPencilLine,
      onSelect: editBanner,
      tone: "primary",
    },
    {
      id: "copy",
      label: "Copy",
      Icon: LuCopy,
      onSelect: () => setIsCopyModalOpen(true),
      tone: "info",
      testId: `${Title}_COPY`,
    },
    {
      id: "settings",
      label: "Settings",
      Icon: LuSettings2,
      onSelect: () => setIsSettingsOpen(true),
      tone: "success",
      testId: `${Title}_SETTING`,
    },
    {
      id: "download",
      label: "Download",
      Icon: LuDownload,
      onSelect: () => downloadTableMutate({ bannerID: Id, tableID: tableIDList }),
      tone: "warning",
    },
    {
      id: "delete",
      label: "Delete",
      Icon: LuTrash2,
      onSelect: () => setIsDeleteModalOpen(true),
      tone: "danger",
      testId: `${Title}_DELETE`,
    },
  ];
  const actionsById = new Map(actions.map((action) => [action.id, action]));
  const overflowItems: readonly OverflowActionMenuItem[] = actionIds
    .filter((actionId) => !visibleIds.has(actionId))
    .map((actionId) => {
      const action = actionsById.get(actionId)!;
      return {
        id: action.id,
        label: action.label,
        Icon: action.Icon,
        onSelect: action.onSelect,
        tone: action.tone === "danger" ? "danger" : undefined,
      };
    });
  const overflowMenu = useOverflowMenu(overflowItems.length > 0);

  return (
    <>
      <div className="report-card mt-3" data-test-id={Title}>
        <div className="flex items-start gap-3 px-4 py-4">
          <div className="min-w-0 shrink basis-auto">
            <h2
              className={`crosstab-title break-words text-xl font-semibold ${hasPointers ? "cursor-pointer" : "cursor-default"}`}
              onClick={() => {
                if (hasPointers) openTableList();
              }}
            >
              {Title}
            </h2>
            <p className="crosstab-muted mt-1 break-words text-sm">{description}</p>
          </div>

          <div
            ref={overflowMenu.boundaryRef}
            className="relative ml-auto min-w-0 flex-1"
            style={{ minWidth: minimumWidth || undefined }}
          >
            <div
              ref={containerRef}
              className="flex min-h-8 min-w-0 w-full flex-nowrap items-center justify-end gap-3"
            >
              {actionIds.map((actionId) => {
                if (!visibleIds.has(actionId)) return null;
                const action = actionsById.get(actionId);
                if (!action) return null;
                const Icon = action.Icon;
                return (
                  <div
                    key={action.id}
                    ref={getItemRef(action.id)}
                    className="shrink-0"
                  >
                    <IconActionButton
                      data-test-id={action.testId}
                      tone={action.tone}
                      aria-label={action.label}
                      tooltip={action.label}
                      onClick={action.onSelect}
                    >
                      <Icon size={18} />
                    </IconActionButton>
                  </div>
                );
              })}

              <div ref={fixedControlsRef} className="flex shrink-0 items-center">
                <div
                  ref={allVisibleFixedControlsRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute h-0 w-0"
                />
                {overflowItems.length > 0 ? (
                  <div className="relative">
                    <Button
                      ref={overflowMenu.triggerRef}
                      type="button"
                      size="default"
                      tooltip="More banner actions"
                      aria-label="More banner actions"
                      aria-haspopup="menu"
                      aria-expanded={overflowMenu.isOpen}
                      className="h-8 w-8 rounded-full border-transparent bg-transparent p-0 text-[var(--color-text-muted)] shadow-none hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary"
                      onClick={() =>
                        overflowMenu.setIsOpen((current) => !current)
                      }
                    >
                      <LuEllipsisVertical className="h-5 w-5" />
                    </Button>
                    {overflowMenu.isOpen ? (
                      <OverflowActionsMenu
                        anchorRef={overflowMenu.triggerRef}
                        ariaLabel={`${Title} banner actions`}
                        items={overflowItems}
                        onClose={overflowMenu.close}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {hasPointers ? (
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
          <p className="crosstab-muted text-sm italic">Modified By: {OwnerName}</p>
        </div>
      </div>

      <NameCopyModal
        isOpen={isCopyModalOpen}
        onClose={() => {
          if (!isRelicateBannerPending) setIsCopyModalOpen(false);
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
          if (!isDeleteBannerPending) setIsDeleteModalOpen(false);
        }}
        onConfirm={() => deleteBannerMutation(Id)}
        titleKey="deleteBanner"
        targetLabel={Title || "this banner"}
        isPending={isDeleteBannerPending}
        testId="BANNER_DELETE"
      />
      {isSettingsOpen ? (
        <BannerSettings
          Id={Id}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      ) : null}
    </>
  );
}
