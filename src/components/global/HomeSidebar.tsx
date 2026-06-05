import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { StudyCard } from "./card";
import { cn } from "../../utils";
import { setFilterStudys } from "../../store/CrosstabStudySlice";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { HiSearch } from "react-icons/hi";
import { LuX } from "react-icons/lu";
import DeleteModel from "../common/list/DeleteModel";
import ListingCopyModel from "./ListingCopyModal";
import ArchiveModel from "../common/list/ArchiveModel";
import {
  REFRESH_STUDY_LIST_EVENT,
  type RefreshStudyListEventDetail,
  type StudyListSelection
} from "../../utils/studyListRefresh";
import { useStudyList } from "../../api-network/homepage/query";
import { filterStudiesBySearch, type StudyListItem } from "../../utils/studyListing";

const StudyCardSkeleton = () => (
  <div className="home-surface w-full rounded-[16px] border home-border-soft px-3 py-3 shadow-sm">
    <div className="flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <div className="h-4 w-4/5 animate-pulse rounded-full bg-[var(--color-home-panel-soft)]" />
        <div className="mt-2 h-5 w-24 animate-pulse rounded-full bg-[var(--color-home-panel-soft)]" />
      </div>
      <div className="h-8 w-8 animate-pulse rounded-full bg-[var(--color-home-panel-soft)]" />
    </div>
    <div className="mt-3 h-3 w-3/5 animate-pulse rounded-full bg-[var(--color-home-panel-soft)]" />
  </div>
);

const getStudyString = (study: StudyListItem, key: string) => {
  const value = study[key];
  return value === undefined || value === null ? "" : String(value);
};

const getStudyNumber = (study: StudyListItem, key: string) => {
  const value = Number(study[key]);
  return Number.isFinite(value) ? value : 0;
};

const HomeSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"myactive" | "allactive" | "isarchived">("myactive");
  const { Studys, FilterStudys } = useSelector((state: RootState) => state.study);
  const studies = useMemo(
    () => (Array.isArray(Studys) ? (Studys as StudyListItem[]) : []),
    [Studys]
  );
  const filteredStudies = useMemo(
    () => (Array.isArray(FilterStudys) ? (FilterStudys as StudyListItem[]) : []),
    [FilterStudys]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [page, setPage] = useState<number>(1);
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
        setIsSearchOpen(false);
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

  const { studyList, isListLoading } = useStudyList(activeTab, page);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      dispatch(setFilterStudys(filterStudiesBySearch(studies, searchTerm)));
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, studies, dispatch]);

  useEffect(() => {
    setPage(1);
    setPageInput("1");
  }, [activeTab]);

  useEffect(() => {
    setPageInput(String(page));
  }, [page]);

  const currentItems = filteredStudies ?? [];
  const backendCurrentPage = Number(studyList?.current_page);
  const backendMaxPage = Number(studyList?.max_page);
  const totalPages = Number.isFinite(backendMaxPage) && backendMaxPage > 0
    ? backendMaxPage
    : 1;
  const hasResults = filteredStudies?.length > 0;
  const activeCount = studyList?.count?.active ?? studies.filter((study) => !getStudyNumber(study, "isarchived")).length;
  const archivedCount = studyList?.count?.archived ?? studies.filter((study) => getStudyNumber(study, "isarchived")).length;
  const allCount = studyList?.count?.all ?? (
    studyList?.count
      ? (studyList.count.active || 0) + (studyList.count.archived || 0) + (studyList.count.shared || 0)
      : studies.length
  );

  useEffect(() => {
    if (!Number.isFinite(backendCurrentPage) || backendCurrentPage <= 0) return;
    if (backendCurrentPage === page) return;

    setPage(backendCurrentPage);
    setPageInput(String(backendCurrentPage));
  }, [backendCurrentPage, page]);

  const handleGoToPage = () => {
    const parsedPage = Number(pageInput);
    if (!parsedPage) {
      setPage(1);
      setPageInput("1");
      return;
    }
    const nextPage = Math.min(Math.max(parsedPage, 1), totalPages);
    setPage(nextPage);
    setPageInput(String(nextPage));
  };

  const getEmptyStateText = () => {
    if (searchTerm.trim()) {
      return "No studies match your search.";
    }

    if (activeTab === "isarchived") {
      return "No archived studies yet.";
    }

    if (activeTab === "myactive") {
      return "No active studies yet.";
    }

    return "No studies yet.";
  };

  return (
    <div className="home-surface flex h-full w-full shrink-0 flex-col border-r home-border md:w-[340px]">
      <div className="border-b home-border-soft px-3 py-3">
        <div className="flex h-8 items-center gap-1.5">
          {isSearchOpen ? (
            <>
              <div className="home-search-bg flex h-8 min-w-0 flex-1 items-center rounded-[14px] px-2.5">
                <HiSearch className="home-muted h-4 w-4" />
                <Input
                  placeholder="Search studies..."
                  className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Close study search"
                className="h-8 w-8 border-transparent bg-transparent shadow-none"
                onClick={() => {
                  setSearchTerm("");
                  setIsSearchOpen(false);
                }}
                title="Close search"
              >
                <LuX className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <div className="grid min-w-0 flex-1 grid-cols-3 gap-1 text-sm">
                <Button
                  variant={activeTab === "myactive" ? "theme" : "secondary"}
                  className={cn(
                    "h-8 min-w-0 px-2 text-center text-[12px] leading-none",
                    activeTab === "myactive"
                      ? "shadow-sm hover:bg-login-primary-hover"
                      : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent hover:text-[var(--color-text-strong)]"
                  )}
                  onClick={() => setActiveTab("myactive")}
                >
                  {`Active (${activeCount})`}
                </Button>
                <Button
                  variant={activeTab === "allactive" ? "theme" : "secondary"}
                  className={cn(
                    "h-8 min-w-0 px-2 text-center text-[12px] leading-none",
                    activeTab === "allactive"
                      ? "shadow-sm hover:bg-login-primary-hover"
                      : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent hover:text-[var(--color-text-strong)]"
                  )}
                  onClick={() => setActiveTab("allactive")}
                >
                  {`All (${allCount})`}
                </Button>
                <Button
                  variant={activeTab === "isarchived" ? "theme" : "secondary"}
                  className={cn(
                    "h-8 min-w-0 px-2 text-center text-[12px] leading-none",
                    activeTab === "isarchived"
                      ? "shadow-sm hover:bg-login-primary-hover"
                      : "home-muted border-transparent bg-transparent shadow-none hover:border-transparent hover:bg-transparent hover:text-[var(--color-text-strong)]"
                  )}
                  onClick={() => setActiveTab("isarchived")}
                >
                  {`Archive (${archivedCount})`}
                </Button>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                aria-label="Search studies"
                className="h-8 w-8 border-transparent bg-transparent shadow-none"
                onClick={() => setIsSearchOpen(true)}
                title="Search studies"
              >
                <HiSearch className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="flex w-full flex-col items-center gap-2.5">
          {isListLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <StudyCardSkeleton key={index} />
            ))
          ) : hasResults ? (
            currentItems.map((item) => (
              <StudyCard
                key={getStudyString(item, "studyid")}
                id={getStudyString(item, "studyid")}
                name={getStudyString(item, "studyname")}
                status={getStudyString(item, "studystate")}
                owner={
                  getStudyString(item, "createdbyname") ||
                  getStudyString(item, "createdByName") ||
                  getStudyString(item, "name") ||
                  getStudyString(item, "email")
                }
                createAt={getStudyString(item, "createdon")}
                share={getStudyNumber(item, "isOwner")}
                isArchived={getStudyNumber(item, "isarchived")}
                launch={getStudyNumber(item, "launch")}
                studystate={getStudyString(item, "studystate")}
                activeTab={activeTab}
              />
            ))
          ) : (
            <div className="home-surface mt-2 w-full rounded-[16px] border home-border-soft px-4 py-6 text-center shadow-sm">
              <h4 className="home-heading text-[15px] font-semibold">
                {getEmptyStateText()}
              </h4>
              <p className="home-muted mt-2 text-sm">
                {searchTerm.trim()
                  ? "Clear the search or try another term."
                  : "Use the chat prompt to create a new study."}
              </p>
            </div>
          )}
        </div>
      </div>
      {totalPages > 1 && (
        <div className="mx-3 mb-3 mt-1 border-t home-border-soft pt-2">
          <div className="flex items-center justify-center gap-1.5">
            <span className="home-muted text-xs font-medium">{`Page`}</span>
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
              className="home-text h-8 w-14 rounded-lg border home-border bg-white px-2 text-center text-xs focus:outline-none"
              placeholder="1"
            />
            <span className="home-muted text-xs font-medium">{`of ${totalPages}`}</span>
            <Button type="button" variant="theme" size="xs" onClick={handleGoToPage}>
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
