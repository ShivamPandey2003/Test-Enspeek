import {
  LuClipboardList,
  LuHouse,
  LuListTodo,
  LuSettings2,
  LuTable2,
} from "react-icons/lu";

export const STUDY_NAVIGATION_ITEMS = [
  { path: "/", title: "Home", icon: LuHouse },
  { path: "/questionnaire", title: "Questionnaire", icon: LuListTodo },
  { path: "/publish-survey", title: "Publish Survey", icon: LuSettings2 },
  { path: "/report", title: "Report", icon: LuClipboardList },
  { path: "/crosstab", title: "Crosstab", icon: LuTable2 },
] as const;

type StudyNavigationState = {
  studyID?: string | null;
  hasQuestionnaire?: number | string | null;
  launch?: number | string | null;
};

export const getVisibleStudyNavigationItems = ({
  studyID,
  hasQuestionnaire,
  launch,
}: StudyNavigationState) =>
  STUDY_NAVIGATION_ITEMS.filter(({ path }) => {
    if (path === "/") return true;
    if (!studyID) return false;
    if (path === "/questionnaire") return true;
    if (path === "/publish-survey") return Number(hasQuestionnaire) === 1;
    return Number(launch) === 1;
  });
