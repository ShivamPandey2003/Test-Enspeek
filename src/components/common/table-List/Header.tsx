import { useEffect, useMemo, useRef, useState, type ElementType } from "react";
import {
  LuArrowRight,
  LuDownload,
  LuEllipsis,
  LuSave,
  LuSettings2,
  LuShuffle,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { useTableListAdd } from "../../../api-network/crosstab/mutation";
import {
  setIsBannerSettingsOpen,
  setSelectedQuestions,
} from "../../../store/CrosstabSlice";
import type { RootState } from "../../../store/store";
import { TABLE_HEADER_ACTION_PRIORITY } from "../../../utils/crosstabResponsive";
import { useOverflowMenu } from "../../../utils/useOverflowMenu";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import NewDropdown from "../../global/NewDropDown";
import Button from "../../ui/Button";
import OverflowActionsMenu, {
  type OverflowActionMenuItem,
} from "../../ui/OverflowActionsMenu";
import PageBreadcrumbs from "../../ui/PageBreadcrumbs";
import PageSubheader from "../../ui/PageSubheader";
import Select from "../../ui/Select";

interface CrosstabHeaderProps {
  dropDownData: Array<{
    Title: string;
    Icon?: ElementType;
    checked?: boolean;
    onClick?: () => void;
  }>;
}

type HeaderActionId = (typeof TABLE_HEADER_ACTION_PRIORITY)[number];

export default function Header({ dropDownData }: CrosstabHeaderProps) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedBanner, setSelectedBanner] = useState("");
  const allVisibleFixedControlsRef = useRef<HTMLDivElement>(null);
  const downloadButtonRef = useRef<HTMLButtonElement>(null);
  const { tableListAddMutate, isTableListAddPending } = useTableListAdd(
    location.state?.bannerID,
    location.state.studyID
  );
  const { bannerName, selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { tableData, BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const hasTableData = tableData.length > 0;
  const actionIds = useMemo<readonly HeaderActionId[]>(
    () => (hasTableData ? TABLE_HEADER_ACTION_PRIORITY : []),
    [hasTableData]
  );
  const {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  } = useProgressiveOverflow(actionIds, { allVisibleFixedControlsRef });
  const downloadMenu = useOverflowMenu(hasTableData);
  const overflowItems: readonly OverflowActionMenuItem[] = hasTableData
    ? [
        ...(!visibleIds.has("download")
          ? [
              {
                id: "download",
                label: "Download",
                Icon: LuDownload,
                onSelect: () => downloadMenu.setIsOpen(true),
              },
            ]
          : []),
        ...(!visibleIds.has("settings")
          ? [
              {
                id: "settings",
                label: "Settings",
                Icon: LuSettings2,
                onSelect: () => dispatch(setIsBannerSettingsOpen(true)),
              },
            ]
          : []),
      ]
    : [];
  const mainMenu = useOverflowMenu(overflowItems.length > 0);
  const showCompactSwitcher = hasTableData && !visibleIds.has("banner-selector");
  const rightStyle = useMemo(
    () => ({ minWidth: minimumWidth || undefined }),
    [minimumWidth]
  );
  const downloadItems: readonly OverflowActionMenuItem[] = dropDownData.map(
    (item, index) => ({
      id: `download-${index}-${item.Title}`,
      label: item.Title,
      Icon: item.Icon ?? LuDownload,
      checked: item.checked,
      onSelect: item.onClick ?? (() => {}),
    })
  );
  const downloadAnchorRef = visibleIds.has("download")
    ? downloadButtonRef
    : mainMenu.triggerRef;

  useEffect(() => {
    setSelectedBanner(location.state?.bannerID ?? "");
  }, [location.state?.bannerID]);

  const goToSelectedBanner = (close?: () => void) => {
    if (!selectedBanner) return;
    navigate("/crosstab/table-list", {
      state: {
        studyID: location.state.studyID,
        bannerID: selectedBanner,
      },
    });
    close?.();
  };

  const saveQuestions = () => {
    if (selectedQuestions.length === 0) {
      toast.error("Please select at least one question before saving.");
      return;
    }
    tableListAddMutate(undefined);
    dispatch(setSelectedQuestions(selectedQuestions));
  };

  const bannerSelector = (compactClose?: () => void) => (
    <div className="crosstab-soft-panel flex h-8 min-w-0 items-center rounded-full pl-2.5">
      <Select
        variant="bare"
        aria-label="Select banner"
        value={selectedBanner}
        onChange={(event) => setSelectedBanner(event.target.value)}
        className="home-text h-full min-w-0 pr-2 text-sm leading-none"
      >
        {BannersAll.map((banner) => (
          <option key={banner.bannerid} value={banner.bannerid}>
            {banner.title}
          </option>
        ))}
      </Select>
      <Button
        type="button"
        variant="theme"
        size="default"
        onClick={() => goToSelectedBanner(compactClose)}
      >
        Go <LuArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );

  return (
    <PageSubheader
      contentClassName="flex-row items-center justify-between gap-2"
      leftClassName="min-w-0 flex-1 overflow-hidden"
      rightClassName="min-w-0 flex-1 flex-nowrap"
      rightStyle={rightStyle}
      left={
        <PageBreadcrumbs
          prefix={`${bannerName} :`}
          items={[
            {
              label: "Banner List",
              to: "/crosstab",
              state: { studyID: location.state.studyID },
            },
            {
              label: "Design Banner",
              to: "/crosstab/edit-banner",
              state: {
                studyID: location.state.studyID,
                bannerID: location.state?.bannerID,
              },
            },
            {
              label: "Crosstab",
              to: "/crosstab/table-list",
              state: {
                studyID: location.state.studyID,
                bannerID: location.state?.bannerID,
              },
              active: true,
            },
          ]}
        />
      }
      right={
        <div ref={mainMenu.boundaryRef} className="relative min-w-0 w-full">
          <div ref={downloadMenu.boundaryRef} className="relative min-w-0 w-full">
            <div
              ref={containerRef}
              className="flex min-h-8 min-w-0 w-full flex-nowrap items-center justify-end gap-2"
            >
              {hasTableData && visibleIds.has("banner-selector") ? (
                <div
                  ref={getItemRef("banner-selector")}
                  className="min-w-0 shrink-0"
                >
                  {bannerSelector()}
                </div>
              ) : null}

              {hasTableData && visibleIds.has("download") ? (
                <div ref={getItemRef("download")} className="shrink-0">
                  <Button
                    ref={downloadButtonRef}
                    type="button"
                    variant="theme"
                    tooltip="Download"
                    aria-label="Download"
                    aria-haspopup="menu"
                    aria-expanded={downloadMenu.isOpen}
                    className="report-toolbar-btn bg-[var(--color-study-progress)] text-white hover:opacity-90"
                    onClick={() =>
                      downloadMenu.setIsOpen((current) => !current)
                    }
                  >
                    <LuDownload />
                  </Button>
                </div>
              ) : null}

              {hasTableData && visibleIds.has("settings") ? (
                <div ref={getItemRef("settings")} className="shrink-0">
                  <Button
                    type="button"
                    variant="theme"
                    tooltip="Settings"
                    aria-label="Settings"
                    className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:opacity-90"
                    onClick={() => dispatch(setIsBannerSettingsOpen(true))}
                  >
                    <LuSettings2 />
                  </Button>
                </div>
              ) : null}

              <div
                ref={fixedControlsRef}
                className="flex shrink-0 items-center gap-2"
              >
                <div
                  ref={allVisibleFixedControlsRef}
                  aria-hidden="true"
                  className="pointer-events-none absolute h-0 w-0"
                />

                {!hasTableData ? (
                  <Button
                    data-test-id="SAVE_QUESTION"
                    variant="theme"
                    onClick={saveQuestions}
                    disabled={isTableListAddPending}
                  >
                    {isTableListAddPending ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <LuSave /> Save Question
                      </>
                    )}
                  </Button>
                ) : null}

                {showCompactSwitcher ? (
                  <NewDropdown
                    position="bottom-right"
                    contentAriaLabel="Switch banner"
                    renderTrigger={({ isOpen, toggle }) => (
                      <Button
                        type="button"
                        variant="secondary"
                        size="default"
                        tooltip="Switch banner"
                        aria-label="Switch banner"
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                        className="report-toolbar-btn home-border-soft"
                        onClick={toggle}
                      >
                        <LuShuffle />
                      </Button>
                    )}
                    renderContent={({ close }) => (
                      <div className="p-3">
                        <div className="questionnaire-heading mb-2 text-sm font-semibold">
                          Switch Banner
                        </div>
                        {bannerSelector(close)}
                      </div>
                    )}
                  />
                ) : null}

                {overflowItems.length > 0 ? (
                  <div className="relative">
                    <Button
                      ref={mainMenu.triggerRef}
                      type="button"
                      size="default"
                      tooltip="More Crosstab actions"
                      aria-haspopup="menu"
                      aria-expanded={mainMenu.isOpen}
                      className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:bg-[var(--color-questionnaire-multi)] hover:text-white hover:opacity-90"
                      onClick={() => {
                        downloadMenu.setIsOpen(false);
                        mainMenu.setIsOpen((current) => !current);
                      }}
                    >
                      <LuEllipsis />
                    </Button>
                    {mainMenu.isOpen ? (
                      <OverflowActionsMenu
                        anchorRef={mainMenu.triggerRef}
                        ariaLabel="Crosstab actions"
                        items={overflowItems}
                        onClose={mainMenu.close}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>

              {downloadMenu.isOpen ? (
                <OverflowActionsMenu
                  anchorRef={downloadAnchorRef}
                  ariaLabel="Crosstab downloads"
                  items={downloadItems}
                  onClose={downloadMenu.close}
                />
              ) : null}
            </div>
          </div>
        </div>
      }
    />
  );
}
