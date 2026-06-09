import React from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { useNavigate } from "react-router";
import NewDropdown from "./NewDropDown";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";
import {
  setArchiveAction,
  setArchiveModel,
  setCopyModel,
  setDeleteModel,
  setSelectedId,
  setSelectedStudyName,
} from "../../store/TriggerSlice";
import { cn, normalizeDisplayName } from "../../utils";
import {
  LuArchive,
  LuChartColumn,
  LuClipboardList,
  LuCopy,
  LuTable2,
  LuTrash2,
} from "react-icons/lu";
import { getStudyStateTheme } from "../../utils/studyStateTheme";
import { formatStudyDate } from "../../utils/studyListing";
import AvatarInitials from "../ui/AvatarInitials";

type StudyCardProps = {
  id: string;
  name: string;
  status: string;
  owner: string;
  createAt: string;
  share: number;
  isArchived: number;
  launch: number;
  studystate: string;
  activeTab: "myactive" | "allactive" | "isarchived";
};

const getOwnerInitials = (owner?: string) => {
  const value = (owner || "").trim();

  if (!value) return "U";
  if (value.includes("@")) return value[0]?.toUpperCase() || "U";

  const parts = value.split(/\s+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "U";

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
};

export const StudyCard: React.FC<StudyCardProps> = ({
  id,
  name,
  status,
  owner,
  createAt,
  share,
  isArchived,
  launch,
  studystate,
  activeTab,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cleanStatus = (status || "").replace(/\|\s*\d+\s*questions?/i, "").trim();
  const stateTheme = getStudyStateTheme(studystate || cleanStatus);
  const displayOwnerName = normalizeDisplayName(owner, "Study Owner");
  const isOwner = share !== 0;
  const canOpenQuestionnaire = activeTab !== "isarchived";
  const displayState = studystate || cleanStatus || "Draft";
  const createdDate = formatStudyDate(createAt);

  const baseDropdownItems = [
    {
      id: "questionnaire",
      label: "Questionnaire",
      icon: <LuClipboardList className="h-4 w-4" />,
      onClick: () => navigate("/questionnaire", { state: { studyID: id } }),
    },
    {
      id: "copy",
      label: "Copy",
      icon: <LuCopy className="h-4 w-4" />,
      onClick: () => {
        dispatch(setSelectedId(id));
        dispatch(setSelectedStudyName(name));
        dispatch(setCopyModel(true));
      },
    },
    isArchived !== 0
      ? {
          id: "active",
          label: "Restore",
          icon: <LuArchive className="h-4 w-4" />,
          onClick: () => {
            dispatch(setSelectedId(id));
            dispatch(setSelectedStudyName(name));
            dispatch(setArchiveAction("unarchive"));
            dispatch(setArchiveModel(true));
          },
          disabled: !isOwner,
        }
      : {
          id: "archived",
          label: "Archive",
          icon: <LuArchive className="h-4 w-4" />,
          onClick: () => {
            dispatch(setSelectedId(id));
            dispatch(setSelectedStudyName(name));
            dispatch(setArchiveAction("archive"));
            dispatch(setArchiveModel(true));
          },
          disabled: !isOwner,
        },
    {
      id: "delete",
      label: "Delete",
      icon: <LuTrash2 className="h-4 w-4" />,
      onClick: () => {
        dispatch(setSelectedId(id));
        dispatch(setSelectedStudyName(name));
        dispatch(setDeleteModel(true));
      },
      disabled: !isOwner,
    },
    {
      id: "output",
      label: "View Report",
      icon: <LuChartColumn className="h-4 w-4" />,
      onClick: () => navigate("/report", { state: { studyID: id } }),
      disabled: launch === 0,
    },
    {
      id: "crosstab",
      label: "Crosstab",
      icon: <LuTable2 className="h-4 w-4" />,
      onClick: () => navigate("/crosstab", { state: { studyID: id } }),
      disabled: launch === 0,
    },
  ];

  const dropdownItem = baseDropdownItems.filter((item) => {
    if (activeTab === "isarchived") {
      return ["copy", "active", "delete"].includes(item.id);
    }

    if (activeTab === "allactive" && !isOwner) {
      return !["archived", "delete"].includes(item.id);
    }

    return true;
  });

  const showMenu = !(activeTab === "isarchived" && !isOwner) && dropdownItem.length > 0;

  return (
    <>
      <div className="home-surface group relative w-full cursor-default overflow-visible rounded-[16px] border home-border-soft px-3 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md">
        <div className={cn("absolute bottom-2.5 left-0 top-2.5 w-[3px] rounded-r-full opacity-0 transition-opacity duration-200 group-hover:opacity-100", stateTheme.accentClass)} />
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <AvatarInitials
              label={displayOwnerName}
              title={displayOwnerName}
              initials={getOwnerInitials(owner)}
              className={cn("mt-0.5 h-7 w-7 text-[11px]", stateTheme.avatarClass)}
            />
            <div className="min-w-0 flex-1">
              <h3
                data-test-id={name}
                title={name}
                className={cn(
                  "home-heading line-clamp-2 pr-1 text-[14px] font-semibold leading-5",
                  canOpenQuestionnaire ? "cursor-pointer" : "cursor-default"
                )}
                onClick={() => {
                  if (!canOpenQuestionnaire) return;
                  navigate("/questionnaire", { state: { studyID: id } });
                }}
              >
                {name}
              </h3>
            <div className="mt-2 flex min-w-0 items-center gap-1.5 overflow-hidden whitespace-nowrap text-[12px] leading-4">
              <span
                className={cn(
                  "shrink-0 text-[12px] font-semibold leading-4",
                  stateTheme.textClass
                )}
                title={displayState}
              >
                {displayState}
              </span>
              {createdDate && (
                <>
                  <span className="home-muted shrink-0">&bull;</span>
                  <span className="home-subtle shrink-0 whitespace-nowrap">
                    {createdDate}
                  </span>
                </>
              )}
            </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {showMenu && (
              <NewDropdown
                className="-mr-1"
                trigger={
                  <div
                    data-test-id={`${name}_CLICK`}
                    className="home-muted hover:bg-home-panel flex h-8 w-8 cursor-pointer items-center justify-center rounded-full transition-colors"
                  >
                    <HiOutlineDotsVertical className="h-5 w-5" />
                  </div>
                }
                items={dropdownItem}
                position="bottom-right"
                searchable={false}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};
