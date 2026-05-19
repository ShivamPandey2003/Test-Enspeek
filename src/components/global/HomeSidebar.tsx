import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { StudyCard } from "./card";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { cn } from "../../utils";
import { setFilterStudys } from "../../store/CrosstabStudySlice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { HiSearch } from "react-icons/hi";
import DeleteModel from "../common/list/DeleteModel";
import ListingCopyModel from "./ListingCopyModal";
import ArchiveModel from "../common/list/ArchiveModel";
import {
  REFRESH_STUDY_LIST_EVENT,
  type RefreshStudyListEventDetail,
  type StudyListSelection
} from "../../utils/studyListRefresh";
import { useStudyList } from "../../api-network/homepage/query";

const HomeSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"myactive" | "allactive" | "isarchived">("myactive");
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const { Studys, FilterStudys } = useSelector((state: RootState) => state.study);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [pageInput, setPageInput] = useState<string>("1");
  const activeTabRef = useRef<StudyListSelection>("myactive");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  useEffect(() => {
    const handleRefreshStudyList = (event: Event) => {
      const customEvent = event as CustomEvent<RefreshStudyListEventDetail>;
      const detail = customEvent.detail;

      if (!detail) return;

      if (detail.selection && detail.selection !== activeTabRef.current) {
        setActiveTab(detail.selection);
      }

      if (detail.resetSearch) {
        setSearchTerm("");
      }

      setPage(1);
      setPageInput("1");
      detail.resolve?.();
    };

    window.addEventListener(
      REFRESH_STUDY_LIST_EVENT,
      handleRefreshStudyList as EventListener
    );

    return () => {
      window.removeEventListener(
        REFRESH_STUDY_LIST_EVENT,
        handleRefreshStudyList as EventListener
      );
    };
  }, []);

  const { studyList, isListLoading } = useStudyList(activeTab);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const filtered = searchTerm.trim()
        ? Studys.filter((banner) =>
          banner.studyname.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : Studys;

      dispatch(setFilterStudys(filtered));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, Studys, dispatch]);

  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [activeTab, searchTerm]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  useEffect(() => {
    const calculateLimit = () => {
      if (!sidebarRef.current) return;

      const sidebarHeight = sidebarRef.current.offsetHeight;

      const headerHeight = 120; // title + search
      const paginationHeight = 60;
      const availableHeight = sidebarHeight - headerHeight - paginationHeight;

      const singleCardHeight = 90; // approx height of StudyCard

      const newLimit = Math.max(
        1,
        Math.floor(availableHeight / singleCardHeight)
      );

      setLimit(newLimit);
    };

    calculateLimit();

    window.addEventListener("resize", calculateLimit);

    return () => window.removeEventListener("resize", calculateLimit);
  }, []);

  const start = (page - 1) * limit;
  const currentItems = FilterStudys?.slice(start, start + limit) ?? [];

  const totalPages = FilterStudys ? Math.ceil(FilterStudys.length / limit) : 0;
  const hasResults = FilterStudys?.length > 0;
  const sidebarTitle = activeTab === "myactive" ? "My Studies" : activeTab === "allactive" ? "All Studies" : "Archive Studies";
  const activeCount = studyList?.count?.active ?? Studys.filter((s: any) => !Boolean(s.isarchived)).length;
  const archivedCount = studyList?.count?.archived ?? Studys.filter((s: any) => Boolean(s.isarchived)).length;
  const allCount = studyList?.count ? (studyList.count.active || 0) + (studyList.count.archived || 0) + (studyList.count.shared || 0) : Studys.length;

  const handleGoToPage = () => {
    const parsedPage = Number(pageInput);
    if (!parsedPage) return;
    const nextPage = Math.min(Math.max(parsedPage, 1), totalPages);
    setPage(nextPage);
    setPageInput(String(nextPage));
  };

  return (
    <div className="home-surface flex h-full w-full shrink-0 flex-col border-r home-border md:w-[340px]" ref={sidebarRef}>
      <div className="border-b home-border-soft px-4 py-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <p className="home-heading text-[18px] font-semibold">{sidebarTitle}</p>
        </div>
        <div className="home-panel-bg grid grid-cols-3 gap-1 rounded-full p-1 text-sm">
          <Button
            varinat={activeTab === "myactive" ? "theme" : "secondary"}
            className={cn(
              "px-2 text-center text-[13px] leading-none",
              activeTab === "myactive"
                ? "shadow-sm hover:bg-login-primary-hover"
                : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-[var(--color-home-panel-soft)] hover:text-[var(--color-text-strong)]"
            )}
            onClick={() => setActiveTab("myactive")}
          >
            {`Active (${activeCount})`}
          </Button>
          <Button
            varinat={activeTab === "allactive" ? "theme" : "secondary"}
            className={cn(
              "px-2 text-center text-[13px] leading-none",
              activeTab === "allactive"
                ? "shadow-sm hover:bg-login-primary-hover"
                : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-[var(--color-home-panel-soft)] hover:text-[var(--color-text-strong)]"
            )}
            onClick={() => setActiveTab("allactive")}
          >
            {`All (${allCount})`}
          </Button>
          <Button
            varinat={activeTab === "isarchived" ? "theme" : "secondary"}
            className={cn(
              "px-2 text-center text-[13px] leading-none",
              activeTab === "isarchived"
                ? "shadow-sm hover:bg-login-primary-hover"
                : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-[var(--color-home-panel-soft)] hover:text-[var(--color-text-strong)]"
            )}
            onClick={() => setActiveTab("isarchived")}
          >
            {`Archive (${archivedCount})`}
          </Button>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="home-search-bg flex h-10 items-center rounded-[18px] px-3">
          <HiSearch className="home-muted h-4 w-4" />
          <Input
            placeholder="Search studies..."
            className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
        <div className="flex w-full flex-col items-center gap-3">
          {isListLoading ? (
            <div className="flex items-center justify-center w-full h-full">
              <AiOutlineLoading3Quarters
                size={24}
                className={cn("animate-spin text-action")}
              />
            </div>
          ) : hasResults ? (
            currentItems.map((item: any) => (
              <StudyCard
                key={item.studyid}
                id={item.studyid}
                name={item.studyname}
                status={item.studystate}
                owner={item.createdbyname}
                createAt={item.createdon}
                share={item?.isOwner ? item.isOwner : 0}
                isArchived={item.isarchived}
                launch={item.launch}
                studystate={item.studystate}
                activeTab={activeTab}
              />
            ))
          ) : (
            <div className="home-panel-soft-bg mt-8 w-full rounded-[20px] border home-border-soft px-4 py-8 text-center">
              <h4 className="home-heading text-[16px] font-semibold">No study found</h4>
              <p className="home-muted mt-2 text-sm">
                Try another search term or switch the study tab.
              </p>
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mx-4 mb-4 mt-2 border-t home-border-soft pt-4">
          <div className="flex items-center justify-center gap-2">
            <span className="home-muted text-sm font-medium">{`Page`}</span>
            <Input
              value={pageInput}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "");
                if (rawValue === "") {
                  setPageInput("");
                  return;
                }
                const parsedValue = Number(rawValue);
                const clampedValue = Math.min(
                  Math.max(parsedValue, 1),
                  totalPages
                );
                setPageInput(String(clampedValue));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleGoToPage();
                }
              }}
              onBlur={handleGoToPage}
              type="number"
              min={1}
              max={totalPages}
              className="home-text h-10 w-20 rounded-xl border home-border bg-white px-3 text-center text-sm focus:outline-none"
              placeholder="1"
            />
            <span className="home-muted text-sm font-medium">{`of ${totalPages}`}</span>
            <Button type="button" varinat="theme" size="sm" onClick={handleGoToPage}>
              Go
            </Button>
          </div>
        </div>
      )}
      <DeleteModel />
      <ArchiveModel />
      <ListingCopyModel />
    </div>
  );
};

export default HomeSidebar;
