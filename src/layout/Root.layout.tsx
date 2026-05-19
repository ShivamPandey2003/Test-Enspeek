import { Outlet, useLocation } from "react-router";
import Header from "../components/global/Header";
import Sidebar from "../components/global/sidebar";
import ChatWindow from "../components/common/chat-window/chat";
import ChatTextArea from "../components/global/chattextares";
import HomeSidebar from "../components/global/HomeSidebar";
import { cn } from "../utils";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

const Root_layout = () => {
  const location = useLocation();
  const isHome = location.pathname == "/";
  const isQuestionnaire = location.pathname.startsWith("/questionnaire");
  const isPublishSurvey = location.pathname.startsWith("/publish-survey");
  const isReport = location.pathname.startsWith("/report");
  const isCrosstab = location.pathname.startsWith("/crosstab");
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

  const showRightChat = (!isHome && isQuestionnaire) || (!isHome && hasQuestionnaire) || (!isHome && isAddingQuestion) || (!isHome && isForceShowChat);
  const usePanelChatLayout = isQuestionnaire || isPublishSurvey || isReport || isCrosstab;
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className={cn("relative flex flex-1 overflow-hidden", isHome ? "flex-col items-stretch md:flex-row" : "flex-col items-stretch xl:flex-row")}>
        {!isHome ? <Sidebar /> : <HomeSidebar />}
        <div className={cn("min-h-0 flex-1 transition-all duration-300 overflow-hidden", isHome ? "h-full w-full" : "h-full", isHome ? "w-full" : usePanelChatLayout ? "w-full xl:w-[68%]" : Boolean(!isHome && !hasQuestionnaire) ? "w-full" : "w-full xl:w-[70%]")}>
          <Outlet />
          {(!isHome && (submitItems.length > 0 || isForceShowChat) && !usePanelChatLayout) && <ChatTextArea />}
        </div>
        {showRightChat && (
          <div className={cn("w-full border-t home-border xl:border-t-0", usePanelChatLayout ? "h-[44vh] xl:h-full xl:w-[32%] xl:border-l" : "h-[46vh] xl:h-full xl:w-[30%] xl:border-l")} id="otherChat">
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
    </div>
  );
};

export default Root_layout;
