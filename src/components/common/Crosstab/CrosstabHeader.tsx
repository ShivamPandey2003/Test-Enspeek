import { useMemo, useRef, useState } from "react";
import { LuDownload, LuEllipsis, LuPlus, LuSearch, LuX } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { setIsAddBannerModalOpen } from "../../../store/CrosstabSlice";
import { CROSSTAB_HEADER_ACTION_PRIORITY } from "../../../utils/crosstabResponsive";
import { useOverflowMenu } from "../../../utils/useOverflowMenu";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import OverflowActionsMenu, {
  type OverflowActionMenuItem,
} from "../../ui/OverflowActionsMenu";
import PageSubheader from "../../ui/PageSubheader";
import HistoryModal from "../Report/HistoryModal";

interface CrosstabHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

type HeaderActionId = (typeof CROSSTAB_HEADER_ACTION_PRIORITY)[number];

export default function CrosstabHeader({
  searchTerm,
  setSearchTerm,
}: CrosstabHeaderProps) {
  const dispatch = useDispatch();
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const actionIds = useMemo<readonly HeaderActionId[]>(
    () => CROSSTAB_HEADER_ACTION_PRIORITY,
    []
  );
  const allVisibleFixedControlsRef = useRef<HTMLDivElement>(null);
  const {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  } = useProgressiveOverflow(actionIds, { allVisibleFixedControlsRef });
  const overflowItems: readonly OverflowActionMenuItem[] = [
    ...(!visibleIds.has("create")
      ? [
          {
            id: "create",
            label: "Create Banner",
            Icon: LuPlus,
            onSelect: () => dispatch(setIsAddBannerModalOpen(true)),
          },
        ]
      : []),
    ...(!visibleIds.has("history")
      ? [
          {
            id: "history",
            label: "Download History",
            Icon: LuDownload,
            onSelect: () => setIsDownloadModalOpen(true),
          },
        ]
      : []),
  ];
  const showOverflowButton = overflowItems.length > 0;
  const overflowMenu = useOverflowMenu(showOverflowButton);
  const rightStyle = useMemo(
    () => ({ minWidth: minimumWidth || undefined }),
    [minimumWidth]
  );
  const isCompactSearchOpen = isSearchOpen && !visibleIds.has("search");

  return (
    <>
      <PageSubheader
        contentClassName="flex-row items-center justify-between gap-2"
        leftClassName={isCompactSearchOpen ? "hidden" : "flex min-h-8 min-w-0 shrink items-center overflow-hidden"}
        rightClassName="min-w-0 flex-1 flex-nowrap"
        rightStyle={rightStyle}
        left={
          <h1 className="questionnaire-heading block w-full min-w-0 truncate text-[16px] font-semibold leading-none">
            Banner List
          </h1>
        }
        right={isCompactSearchOpen ? (
          <div className="flex h-8 w-full min-w-0 items-center justify-end gap-1.5">
            <div className="home-search-bg flex h-8 min-w-0 w-full max-w-[18rem] items-center rounded-[14px] px-2.5">
              <LuSearch className="home-muted h-4 w-4" />
              <Input
                autoFocus
                aria-label="Search banners"
                placeholder="Search banner..."
                className="home-text h-full border-0 bg-transparent px-2 text-sm focus:outline-none focus-visible:ring-0"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              tooltip="Close search"
              aria-label="Close banner search"
              className="h-8 w-8 border-transparent bg-transparent shadow-none"
              onClick={() => {
                setSearchTerm("");
                setIsSearchOpen(false);
              }}
            >
              <LuX className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div ref={overflowMenu.boundaryRef} className="relative min-w-0 w-full">
            <div
              ref={containerRef}
              className="flex min-h-8 min-w-0 w-full flex-nowrap items-center justify-end gap-2"
            >
              {visibleIds.has("create") ? (
                <div ref={getItemRef("create")} className="shrink-0">
                  <Button
                    data-test-id="CREATE_BANNER"
                    variant="theme"
                    size="default"
                    onClick={() => dispatch(setIsAddBannerModalOpen(true))}
                  >
                    <LuPlus /> Banner
                  </Button>
                </div>
              ) : null}

              {visibleIds.has("history") ? (
                <div ref={getItemRef("history")} className="shrink-0">
                  <Button
                    type="button"
                    variant="secondary"
                    size="default"
                    tooltip="Download history"
                    aria-label="Download history"
                    className="report-toolbar-btn home-border-soft text-[var(--color-brand-info)] hover:bg-[var(--color-brand-primary-softest)]"
                    onClick={() => setIsDownloadModalOpen(true)}
                  >
                    <LuDownload />
                  </Button>
                </div>
              ) : null}

              {visibleIds.has("search") ? (
                <div
                  ref={getItemRef("search")}
                  className="home-search-bg flex h-8 w-64 max-w-[18rem] shrink-0 items-center rounded-[14px] px-2.5"
                >
                  <LuSearch className="home-muted h-4 w-4" />
                  <Input
                    aria-label="Search banners"
                    placeholder="Search banner..."
                    className="home-text h-full border-0 bg-transparent px-2 text-sm focus:outline-none focus-visible:ring-0"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
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

                {!visibleIds.has("search") ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    tooltip="Search banners"
                    aria-label="Search banners"
                    className="h-8 w-8 border-transparent bg-transparent shadow-none"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <LuSearch className="h-4 w-4" />
                  </Button>
                ) : null}

                {showOverflowButton ? (
                  <div className="relative">
                    <Button
                      ref={overflowMenu.triggerRef}
                      type="button"
                      size="default"
                      data-test-id="CROSSTAB_MORE_ACTIONS"
                      tooltip="More banner actions"
                      aria-haspopup="menu"
                      aria-expanded={overflowMenu.isOpen}
                      className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:bg-[var(--color-questionnaire-multi)] hover:text-white hover:opacity-90"
                      onClick={() =>
                        overflowMenu.setIsOpen((current) => !current)
                      }
                    >
                      <LuEllipsis />
                    </Button>
                    {overflowMenu.isOpen ? (
                      <OverflowActionsMenu
                        anchorRef={overflowMenu.triggerRef}
                        ariaLabel="Banner List actions"
                        items={overflowItems}
                        onClose={overflowMenu.close}
                      />
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
      />

      <HistoryModal
        open={isDownloadModalOpen}
        onOpenChange={setIsDownloadModalOpen}
      />
    </>
  );
}
