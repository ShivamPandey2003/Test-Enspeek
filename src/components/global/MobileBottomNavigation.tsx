import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { resetStudyInfo } from "../../store/CrosstabStudySlice";
import { cn } from "../../utils";
import { getVisibleStudyNavigationItems } from "../../config/studyNavigation";

export default function MobileBottomNavigation() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { studyID, hasQuestionnaire, launch } = useSelector(
    (state: RootState) => state.study
  );

  const visibleItems = getVisibleStudyNavigationItems({
    studyID,
    hasQuestionnaire,
    launch,
  });

  return (
    <nav
      aria-label="Primary mobile navigation"
      className="home-surface fixed inset-x-0 bottom-0 z-[70] border-t home-border pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <div
        className="grid h-16 items-center px-2"
        style={{ gridTemplateColumns: `repeat(${visibleItems.length}, minmax(0, 1fr))` }}
      >
        {visibleItems.map(({ path, title, icon: Icon }) => {
          const isActive =
            path === "/"
              ? pathname === "/"
              : pathname === path || pathname.startsWith(`${path}/`);
          return (
            <button
              key={path}
              type="button"
              aria-label={title}
              title={title}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "mx-auto inline-flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--color-questionnaire-sidebar-icon)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-login-primary",
                isActive &&
                  "bg-gradient-to-b from-[var(--color-questionnaire-sidebar-active-start)] to-[var(--color-questionnaire-sidebar-active-end)] text-white shadow-[0_8px_20px_var(--color-questionnaire-sidebar-active-shadow)]"
              )}
              onClick={() => {
                if (path === "/") {
                  dispatch(resetStudyInfo());
                  navigate("/");
                  return;
                }

                navigate(path, { state: { studyID } });
              }}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
    </nav>
  );
}
