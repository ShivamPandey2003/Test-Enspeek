import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { cn } from "../../utils";
import { resetStudyInfo } from "../../store/CrosstabStudySlice";
import { getVisibleStudyNavigationItems } from "../../config/studyNavigation";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const study = useSelector((state: RootState) => state.study);

  const navigationItems = getVisibleStudyNavigationItems(study);

  return (
    <aside className="questionnaire-sidebar-rail">
      <div className="questionnaire-sidebar-stack">
        {navigationItems.map(({ path, icon: Icon, title }) => {
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
                  state: path !== "/" ? { studyID: study.studyID } : null,
                });
              }}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default Sidebar;
