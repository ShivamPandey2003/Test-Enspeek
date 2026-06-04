import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { resetQuestionGroup } from "../../../store/QuestionSlice";
import Error from "../../global/Error";
import { cn, getTimeGreeting, normalizeDisplayName } from "../../../utils";
import { promptCatalog } from "../../../utils/promptCatalog";
import ChatWindow from "../chat-window/chat";
import ChatTextArea from "../../global/chattextares";
import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";
import Button from "../../ui/Button";
import { useHomepageUserInfo } from "../../../api-network/homepage/query";
import useAiChat from "../../../api-network/global/ai-chat";
import { focusChatInput } from "../../../utils/modalFocus";

export default function ProjectListing() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(resetQuestionGroup());
  }, [dispatch]);

  const user = useSelector((state: RootState) => state.user);
  const { userInfoError } = useHomepageUserInfo();
  const { openChatWithMessage } = useAiChat();

  const { messages } = useSelector((state: RootState) => state.chat);
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
    <div className="home-surface relative flex h-full min-h-0 w-full justify-center overflow-hidden">
      {messages.length > 0 ? (
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
              <div className="platform-card-shadow-strong home-surface home-border-soft h-full overflow-hidden rounded-[30px] border">
                <div className="platform-hero-surface flex h-full flex-col px-5 py-5 md:px-6 md:py-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold home-heading shadow-sm">
                      <LuBotMessageSquare className="h-4 w-4 text-login-primary" />
                      {greeting}, {normalizedFirstName}
                    </div>
                    <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      <LuSparkles className="h-3.5 w-3.5" />
                      Chat-first research design
                    </span>
                  </div>

                  <div className="mx-auto mt-6 max-w-full text-center">
                    <p className="home-title text-[clamp(1.9rem,3.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.05em] lg:whitespace-nowrap">
                      Build research by simply describing it.
                    </p>
                    <p className="home-text mx-auto mt-3 max-w-full text-[14px] leading-5.5 md:text-[15px] md:leading-6 xl:whitespace-nowrap">
                      Tell Enspeek what you want in plain language and it helps
                      you create studies, generate questions, and move toward
                      launch.
                    </p>
                  </div>

                  <div className="mt-6 flex justify-center">
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <ChatTextArea />
    </div>
  );
}
