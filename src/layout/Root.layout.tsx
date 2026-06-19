import { Outlet, useLocation } from "react-router";
import Header from "../components/global/Header";
import Sidebar from "../components/global/sidebar";
import ChatWindow from "../components/common/chat-window/chat";
import ChatTextArea from "../components/global/chattextares";
import HomeSidebar from "../components/global/HomeSidebar";
import { cn } from "../utils";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import ChatHistoryContextResetter from "../components/global/ChatHistoryContextResetter";
import MobileFloatingChat from "../components/global/MobileFloatingChat";
import MobileBottomNavigation from "../components/global/MobileBottomNavigation";

const Root_layout = () => {
  const location = useLocation();
  const isHome = location.pathname == "/";
  const isQuestionnaire = location.pathname.startsWith("/questionnaire");
  const isPublishSurvey = location.pathname.startsWith("/publish-survey");
  const isReport = location.pathname.startsWith("/report");
  const isCrosstab = location.pathname.startsWith("/crosstab");
  const isAdminPanel = location.pathname.startsWith("/user-management");
  const isProfilePage = location.pathname.startsWith("/profile");
  const isFullWidthPage = isAdminPanel || isProfilePage;
  const { hasQuestionnaire } = useSelector((state: RootState) => state.study);
  const { isAddingQuestion } = useSelector((state: RootState) => state.trigger);
  const { submitItems } = useSelector((state: RootState) => state.question);
  const forceShowChatRoutes = [
    "/report",
    "/crosstab",
    "/publish-survey"
  ];

  const isForceShowChat = forceShowChatRoutes.some(route => location.pathname.startsWith(route)
  );

  const showRightChat = !isFullWidthPage && ((!isHome && isQuestionnaire) || (!isHome && hasQuestionnaire) || (!isHome && isAddingQuestion) || (!isHome && isForceShowChat));
  const usePanelChatLayout = isQuestionnaire || isPublishSurvey || isReport || isCrosstab;
  return (
    <div className="h-screen flex flex-col">
      <ChatHistoryContextResetter />
      <Header />
      <div
        className={cn(
          "relative flex flex-1 flex-col items-stretch overflow-hidden md:flex-row md:pb-0",
          isHome
            ? "pb-0"
            : "pb-[calc(4rem+env(safe-area-inset-bottom))]"
        )}
      >
        {!isHome && !isFullWidthPage ? <Sidebar /> : isHome ? <HomeSidebar /> : null}
        <div className={cn("h-full min-h-0 min-w-0 flex-1 overflow-hidden transition-all duration-300", isFullWidthPage || isHome ? "w-full" : "md:w-0")}>
          <Outlet />
          {(!isHome && !isFullWidthPage && (submitItems.length > 0 || isForceShowChat) && !usePanelChatLayout) && <ChatTextArea />}
        </div>
        {showRightChat && (
          <div className={cn("home-surface hidden shrink-0 border-l home-border md:block md:h-full md:w-[clamp(260px,32vw,420px)]", !usePanelChatLayout && "md:w-[clamp(250px,30vw,400px)]")} id="otherChat">
            {usePanelChatLayout ? (
              <div className="flex h-full min-h-0 flex-col overflow-hidden">
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden">
                  <ChatWindow surface="card" scrollMode="external" />
                </div>
                <ChatTextArea placement="panel" />
              </div>
            ) : (
              <ChatWindow />
            )}
          </div>
        )}
      </div>
      <MobileFloatingChat />
      {!isHome ? <MobileBottomNavigation /> : null}
    </div>
  );
};

export default Root_layout;
