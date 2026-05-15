import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import {
  LuClipboardList,
  LuHouse,
  LuListTodo,
  LuSettings2,
  LuTable2,
} from "react-icons/lu";
import type { AppDispatch, RootState } from "../../store/store";
import { cn } from "../../utils";
import { resetStudyInfo } from "../../store/CrosstabStudySlice";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname, state } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const study = useSelector((state: RootState) => state.study);

  const icons = [
    { path: "/", icon: <LuHouse className="h-5 w-5" />, title: "Home" },
  ];

  if (study.studyID) {
    icons.push({
      path: "/questionnaire",
      icon: <LuListTodo className="h-5 w-5" />,
      title: "Questionnaire",
    });

    if (Number(study.hasQuestionnaire) === 1) {
      icons.push({
        path: "/publish-survey",
        icon: <LuSettings2 className="h-5 w-5" />,
        title: "Publish Survey",
      });
    }

    if (Number(study.launch) === 1) {
      icons.push({
        path: "/report",
        icon: <LuClipboardList className="h-5 w-5" />,
        title: "Report",
      });
      icons.push({
        path: "/crosstab",
        icon: <LuTable2 className="h-5 w-5" />,
        title: "Crosstab",
      });
    }
  }

  return (
    <aside className="questionnaire-sidebar-rail">
      <div className="questionnaire-sidebar-stack">
        {icons.map(({ path, icon, title }) => {
          const isActive =
            path === "/"
              ? pathname === "/"
              : pathname === path || pathname.startsWith(path + "/");
          return (
            <button
              key={path}
              type="button"
              title={title}
              data-test-id={title}
              className={cn(
                "questionnaire-sidebar-item",
                isActive && "questionnaire-sidebar-item-active"
              )}
              onClick={() => {
                if (path == "/") {
                  dispatch(resetStudyInfo());
                }
                navigate(path, {
                  state: path !== "/" ? { studyID: state?.studyID } : null,
                });
              }}
            >
              {icon}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
