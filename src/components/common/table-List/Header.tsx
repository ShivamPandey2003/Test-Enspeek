import React, { useState, type RefObject } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import type { RootState } from "../../../store/store";
import Button from "../../ui/Button";
import Select from "../../ui/Select";
import { LuArrowRight, LuDownload, LuSave, LuSettings2 } from "react-icons/lu";
import {
  setIsBannerSettingsOpen,
  setIsDownloadDropdownOpen,
  setSelectedQuestions,
} from "../../../store/CrosstabSlice";
import DropDown from "../../global/DropDown";
import { toast } from "sonner";
import { useTableListAdd } from "../../../api-network/crosstab/mutation";
import PageBreadcrumbs from "../../ui/PageBreadcrumbs";
import PageSubheader from "../../ui/PageSubheader";

interface CrosstabHeaderProps {
  dropdownRef: RefObject<HTMLDivElement | null>;
  dropDownData: any[];
}

const Header: React.FC<CrosstabHeaderProps> = ({
  dropDownData,
  dropdownRef,
}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedBanner, setSelectedBanner] = useState<string>("");
  const { tableListAddMutate, isTableListAddPending } = useTableListAdd(
    location.state?.bannerID,
    location.state.studyID
  );

  const { bannerName, isDownloadDropdownOpen, selectedQuestions } = useSelector(
    (state: RootState) => state.crosstab
  );
  const { tableData, BannersAll } = useSelector(
    (state: RootState) => state.crossTabData
  );

  React.useEffect(() => {
    if (!isDownloadDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        dispatch(setIsDownloadDropdownOpen(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDownloadDropdownOpen, dropdownRef, dispatch]);

  React.useEffect(() => {
    setSelectedBanner(location.state?.bannerID);
  }, [location.state?.bannerID]);

  return (
    <PageSubheader
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
              active: location.pathname === "/crosstab/edit-banner",
            },
            {
              label: "Crosstab",
              to: "/crosstab/table-list",
              state: {
                studyID: location.state.studyID,
                bannerID: location.state?.bannerID,
              },
              active: location.pathname === "/crosstab/table-list",
            },
          ]}
        />
      }
      right={
        tableData.length > 0 ? (
          <>
            <Button
              varinat="theme"
              className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] px-4 text-white hover:opacity-90"
              onClick={() => dispatch(setIsBannerSettingsOpen(true))}
            >
              <LuSettings2 />
            </Button>
            <div className="relative" ref={dropdownRef}>
              <Button
                varinat="theme"
                className="report-toolbar-btn bg-[var(--color-study-progress)] px-4 text-white hover:opacity-90"
                onClick={() =>
                  dispatch(setIsDownloadDropdownOpen(!isDownloadDropdownOpen))
                }
              >
                <LuDownload />
              </Button>
              {isDownloadDropdownOpen && (
                <div className="absolute right-0 mt-1 z-50">
                  <DropDown Data={dropDownData} />
                </div>
              )}
            </div>
            <div className="crosstab-soft-panel flex h-10 items-center rounded-[16px] px-3">
              <Select
                variant="bare"
                value={selectedBanner}
                onChange={(e) => setSelectedBanner(e.target.value)}
                className="home-text h-full pr-2 leading-none"
              >
                {BannersAll.map((banner) => (
                  <option key={banner.bannerid} value={banner.bannerid}>
                    {banner.title}
                  </option>
                ))}
              </Select>
              <Button
                type="button"
                varinat="theme"
                size="sm"
                onClick={() =>
                  navigate("/crosstab/table-list", {
                    state: {
                      studyID: location.state.studyID,
                      bannerID: selectedBanner,
                    },
                  })
                }
                className="ml-2 px-2.5 py-1.5 text-xs"
              >
                Go <LuArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        ) : (
          <Button
            data-test-id="SAVE_QUESTION"
            varinat="theme"
            className="report-toolbar-btn px-5"
            onClick={() => {
              if (selectedQuestions.length === 0) {
                toast.error(
                  "Please select at least one question before saving."
                );
                return;
              }
              tableListAddMutate(undefined);
              dispatch(setSelectedQuestions(selectedQuestions));
            }}
            disabled={isTableListAddPending}
          >
            {isTableListAddPending ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
                <span>
                  Saving
                  <span className="copying-dots ml-0.5 inline-flex w-[1.5em] justify-start">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <LuSave /> Save Question
              </>
            )}
          </Button>
        )
      }
    />
  );
};

export default Header;
