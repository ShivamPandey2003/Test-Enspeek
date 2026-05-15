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
import { cn, getInitials, normalizeDisplayName } from "../../utils";
import {
  LuArchive,
  LuChartColumn,
  LuClipboardList,
  LuCopy,
  LuTable2,
  LuTrash2,
} from "react-icons/lu";
import { getStudyStateTheme } from "../../utils/studyStateTheme";

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
  const questionMatch = (status || "").match(/(\d+)\s*questions?/i);
  const questionCount = questionMatch?.[1];
  const stateTheme = getStudyStateTheme(studystate || cleanStatus);
  const displayOwnerName = normalizeDisplayName(owner, "Study Owner");
  const initials = getInitials(owner, "ST");
  const isOwner = Boolean(share);
  const canOpenQuestionnaire = activeTab !== "isarchived";

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
    Boolean(isArchived)
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
      disabled: !Boolean(launch),
    },
    {
      id: "crosstab",
      label: "Crosstab",
      icon: <LuTable2 className="h-4 w-4" />,
      onClick: () => navigate("/crosstab", { state: { studyID: id } }),
      disabled: !Boolean(launch),
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
      <div className="home-surface group relative w-full cursor-default overflow-visible rounded-[22px] border home-border-soft px-4 py-4 shadow-md transition-shadow duration-200 hover:shadow-lg">
        <div className={cn("absolute bottom-3 left-0 top-3 w-[3px] rounded-r-full opacity-0 transition-opacity duration-200 group-hover:opacity-100", stateTheme.accentClass)} />
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <span
              title={displayOwnerName}
              className={cn(
                "mt-0.5 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold uppercase shadow-sm",
                stateTheme.avatarClass
              )}
            >
              {initials}
            </span>
            <div className="min-w-0 flex-1">
                <h3
                  data-test-id={name}
                  className={cn(
                    "home-heading break-words pr-1 text-[15px] font-semibold leading-5 whitespace-normal",
                    canOpenQuestionnaire ? "cursor-pointer" : "cursor-default"
                  )}
                  onClick={() => {
                    if (!canOpenQuestionnaire) return;
                    navigate("/questionnaire", { state: { studyID: id } });
                  }}
                >
                  {name}
                </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <p className={cn("font-semibold", stateTheme.textClass)}>
                  {studystate || cleanStatus || "Draft"}
                </p>
                {questionCount && (
                  <>
                    <span className="home-muted">|</span>
                    <span className="home-highlight">{`${questionCount} questions`}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          {showMenu && (
            <NewDropdown
              className="-mr-1"
              trigger={
                <div
                  data-test-id={`${name}_CLICK`}
                  className="home-muted hover:bg-home-panel flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors"
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
        <div className="pl-14">
          <p className="home-subtle text-[12px]">{createAt}</p>
        </div>
      </div>
    </>
  );
};
