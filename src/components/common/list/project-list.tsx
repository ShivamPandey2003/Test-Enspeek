import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { resetQuestionGroup } from "../../../store/QuestionSlice";
import Error from "../../global/Error";
import { cn, getTimeGreeting, normalizeDisplayName } from "../../../utils";
import { promptCatalog } from "../../../utils/promptCatalog";
import ChatWindow from "../chat-window/chat";
import ChatTextArea from "../../global/chattextares";
import Button from "../../ui/Button";
import { useHomepageUserInfo } from "../../../api-network/homepage/query";
import useAiChat from "../../../api-network/global/ai-chat";
import { focusChatInput } from "../../../utils/modalFocus";
import PlatformHero from "../../ui/PlatformHero";
import ChatHistoryLoader from "../../global/ChatHistoryLoader";
import { useChatHistoryContextStatus } from "../../../utils/useChatHistoryContextStatus";

export default function ProjectListing() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetQuestionGroup());
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user);
  const { isUserInfoLoading, userInfoError } = useHomepageUserInfo();
  const { openChatWithMessage } = useAiChat();

  const { hasLoadedHistory, isHistoryLoading, messages } = useSelector((state: RootState) => state.chat);
  const { isCurrentHistoryContext } = useChatHistoryContextStatus();
  const visibleMessageCount = isCurrentHistoryContext ? messages.length : 0;
  const firstName = user.firstName || "there";
  const normalizedFirstName = normalizeDisplayName(firstName);
  const greeting = getTimeGreeting();

  const starterPrompts = promptCatalog.filter((prompt) =>
    ["create [study name]"].includes(prompt.id)
  );

  if (userInfoError) {
    return <Error />;
  }

  return (
    <div className="relative flex h-full min-h-0 w-full justify-center overflow-hidden">
      <ChatHistoryLoader enabled={!isUserInfoLoading && !userInfoError} />
      {!isCurrentHistoryContext || !hasLoadedHistory || isHistoryLoading || visibleMessageCount > 0 ? (
        <div className="h-full min-h-0 w-full">
          <ChatWindow surface="page" />
          <div className="platform-page-fade pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[164px]" />
        </div>
      ) : (
        <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden pb-28 md:pb-32">
          <div
            className={cn(
              "mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center gap-3 px-4 py-4 transition-all duration-300 ease-in-out md:gap-4 md:px-6 md:py-6"
            )}
          >
            <div className="grid gap-4 xl:items-stretch">
              <div className="h-full overflow-hidden rounded-[30px]">
                <PlatformHero
                  greeting={`${greeting}, ${normalizedFirstName}`}
                  title="Build research by simply describing it."
                  description="Tell Enspeek what you want in plain language and it helps you create studies, generate questions, and move toward launch."
                  actions={
                    <>
                      {starterPrompts.map((prompt) => (
                        <Button
                          key={prompt.id}
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (prompt.id === "activate study") {
                              openChatWithMessage("Activate Study [Study Name]");
                            } else if (prompt.message) {
                              openChatWithMessage(prompt.message);
                            }
                            focusChatInput();
                          }}
                          className="home-panel-soft-bg home-border-soft group h-10 w-auto items-center justify-center rounded-full px-4 py-2 text-left leading-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                        >
                          <span className="home-dropdown-icon-wrap flex h-7 w-7 shrink-0 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4">
                            {prompt.icon}
                          </span>
                          <span className="home-heading whitespace-nowrap text-sm font-semibold">
                            {prompt.label}
                          </span>
                        </Button>
                      ))}
                    </>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea />
    </div>
  );
}
