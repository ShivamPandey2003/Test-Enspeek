import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { resetQuestionGroup } from "../../../store/QuestionSlice";
import Error from "../../global/Error";
import { cn, getTimeGreeting, normalizeDisplayName } from "../../../utils";
import { promptCatalog } from "../../../utils/promptCatalog";
import ChatWindow from "../chat-window/chat";
import ChatTextArea from "../../global/chattextares";
import { LuBotMessageSquare, LuCircleCheckBig, LuSparkles } from "react-icons/lu";
import Button from "../../ui/Button";
import { useHomepageUserInfo } from "../../../api-network/homepage/query";
import useAiChat from "../../../api-network/global/ai-chat";

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
    ["create [study name]", "activate study"].includes(prompt.id)
  );

  const steps = [
    {
      title: "Tell Enspeek what you want",
      body: "Describe your topic in simple words. No survey experience needed.",
    },
    {
      title: "Review and refine",
      body: "Edit, reorder, or ask AI to improve the generated questions.",
    },
    {
      title: "Launch with confidence",
      body: "Activate, collect responses, and move into reports and crosstab.",
    },
  ];

  if (userInfoError) {
    return <Error />;
  }

  return (
    <div className="home-page-bg relative flex h-full min-h-0 w-full justify-center overflow-hidden">
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
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] xl:items-stretch">
              <div className="platform-card-shadow-strong home-surface home-border-soft h-full overflow-hidden rounded-[30px] border">
                <div className="platform-hero-surface flex h-full flex-col px-5 py-5 md:px-6 md:py-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                      <LuSparkles className="h-3.5 w-3.5" />
                      Chat-first survey design
                    </span>
                  </div>

                  <div className="mt-4 max-w-3xl">
                    <p className="home-title text-[clamp(1.9rem,3.2vw,3.25rem)] font-semibold leading-[1.02] tracking-[-0.05em]">
                      Build a survey by simply describing it.
                    </p>
                    <p className="home-text mt-2 max-w-2xl text-[14px] leading-5.5 md:text-[15px] md:leading-6">
                      Tell Enspeek what you want in plain language and it helps
                      you create studies, generate questions, and move toward
                      launch.
                    </p>
                  </div>

                  <div className="mt-3.5 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm font-semibold home-heading shadow-sm">
                      <LuBotMessageSquare className="h-4 w-4 text-login-primary" />
                      {greeting}, {normalizedFirstName}
                    </div>
                    <Button
                      type="button"
                      varinat="outline"
                      size="sm"
                      onClick={() => openChatWithMessage("count of in progress studies")}
                      className="max-w-full rounded-full home-muted shadow-sm hover:border-login-primary/30 hover:bg-login-primary/5"
                    >
                      Try:
                      <span className="truncate font-semibold text-login-primary">
                        In Progress Count
                      </span>
                    </Button>
                  </div>

                  <div className="mt-3.5 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-2.5">
                    {starterPrompts.map((prompt) => (
                      <Button
                        key={prompt.id}
                        type="button"
                        varinat="outline"
                        onClick={() => {
                          if (prompt.id === "activate study") {
                            openChatWithMessage("Activate Study [Study Name]");
                          } else if (prompt.message) {
                            openChatWithMessage(prompt.message);
                          }
                        }}
                        className="home-panel-soft-bg home-border-soft group h-full min-h-[108px] w-full items-center justify-start rounded-[20px] px-4 py-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <span className="home-dropdown-icon-wrap flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl">
                          {prompt.icon}
                        </span>
                        <span className="min-w-0 flex-1 self-center">
                          <span className="home-heading block text-sm font-semibold">
                            {prompt.label}
                          </span>
                          <span className="home-muted mt-0.5 line-clamp-2 block text-sm leading-5">
                            {prompt.description}
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="platform-card-shadow-medium home-surface home-border-soft h-full rounded-[28px] border px-5 py-5 md:px-6">
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-3">
                    <div className="home-panel-soft-bg flex h-10 w-10 items-center justify-center rounded-2xl">
                      <LuCircleCheckBig className="h-5 w-5 text-login-primary" />
                    </div>
                    <div>
                      <p className="home-heading text-[17px] font-semibold">
                        How it works
                      </p>
                      <p className="home-muted mt-0.5 text-sm leading-5">
                        Three simple steps from idea to launch.
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-1 flex-col gap-2">
                    {steps.map((step, index) => (
                      <div
                        key={step.title}
                        className="home-panel-soft-bg flex flex-1 items-center rounded-[20px] border home-border-soft px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white">
                            {index + 1}
                          </div>
                          <div>
                            <p className="home-heading text-[15px] font-semibold">
                              {step.title}
                            </p>
                            <p className="home-muted mt-0.5 text-sm leading-[1.35rem]">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>
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
