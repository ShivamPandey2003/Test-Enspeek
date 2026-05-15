import { useEffect, type DragEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { MdArrowForwardIos } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuBotMessageSquare, LuCircleCheckBig, LuPlus, LuSparkles, LuWandSparkles } from "react-icons/lu";
import type { AppDispatch, RootState } from "../../../store/store";
import { cn, getTimeGreeting, normalizeDisplayName } from "../../../utils";
import { setEditingQuestion } from "../../../store/QuestionSlice";
import { setIsAddingQuestion } from "../../../store/TriggerSlice";
import { setHasQuestionnaire } from "../../../store/CrosstabStudySlice";
import QuestionnaireForm from "./QuestionnaireForm";
import DataList from "./DataList";
import PageSubheader from "../../ui/PageSubheader";
import Button from "../../ui/Button";
import useAiChat from "../../../api-network/global/ai-chat";
import { useHydrateQuestionnaireSubmitItems } from "../../../api-network/questionnaire/mutation";
import { useQuestionnaireList, useQuestionnaireQuestionTypes, useQuestionnaireStudyInfo } from "../../../api-network/questionnaire/query";

export default function QuestionList() {
  const navigate = useNavigate();
  const location = useLocation();
  const studyID = location.state?.studyID;
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const { isAddingQuestion } = useSelector((state: RootState) => state.trigger);
  const { submitItems } = useSelector((state: RootState) => state.question);
  const { hasQuestionnaire, launch, output } = useSelector((state: RootState) => state.study);
  const isDragDisabled = launch === 1 && output === 1;
  const firstName = user.firstName || "there";
  const normalizedFirstName = normalizeDisplayName(firstName);
  const greeting = getTimeGreeting();
  const { openChat, openChatWithMessage } = useAiChat();

  const emptyStatePrompts = [
    {
      title: "Generate screening questions",
      text: "Generate 5 screening questions for this study",
      icon: <LuWandSparkles className="h-4 w-4" />,
    },
    {
      title: "Create your first question",
      text: "Create a single select question for this study",
      icon: <LuPlus className="h-4 w-4" />,
    },
  ];

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const { isStudyInfoLoading } = useQuestionnaireStudyInfo(studyID);
  useQuestionnaireQuestionTypes(studyID);
  const {
    questionnaireList,
    isQuestionnaireListLoading,
    isQuestionnaireListRefetching,
  } = useQuestionnaireList(studyID);

  useHydrateQuestionnaireSubmitItems(studyID, questionnaireList?.qList);

  useEffect(() => {
    if (!studyID) {
      navigate("/");
      toast.warning("Invalid access route detected. Redirecting you to the homepage for a better experience.");
    }
  }, [navigate, studyID]);

  useEffect(() => {
    if (submitItems.length > 0 && Number(hasQuestionnaire) === 0) {
      dispatch(setHasQuestionnaire(1));
    }
  }, [dispatch, hasQuestionnaire, submitItems.length]);

  const isInitialQuestionnaireLoading =
    isStudyInfoLoading || (isQuestionnaireListLoading && submitItems.length === 0);

  if (isInitialQuestionnaireLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <AiOutlineLoading3Quarters
          size={34}
          className={cn("animate-spin text-action")}
        />
      </div>
    );
  }

  return (
    <div className="questionnaire-page-bg relative flex h-full min-h-0 flex-col overflow-hidden">
      <PageSubheader
        left={
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="questionnaire-heading text-[18px] font-semibold leading-none md:text-[22px]">
              Questionnaire
            </h1>
          </div>
        }
        right={
          submitItems.length > 0 ? (
            <>
              <div className="questionnaire-question-count inline-flex min-h-[34px] items-center gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="questionnaire-question-count-value text-sm font-semibold md:text-base">
                    {submitItems.length}
                  </span>
                  <span className="questionnaire-question-count-label text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Questions
                  </span>
                </div>
              </div>
              <Button
                data-test-id="NEXTTOSURVEY"
                varinat="theme"
                onClick={() => {
                  navigate("/publish-survey", {
                    state: { studyID },
                  });
                }}
              >
                Next <MdArrowForwardIos />
              </Button>
            </>
          ) : null
        }
        rightClassName="justify-between gap-4 md:justify-end md:gap-5"
      />
      <div className="flex flex-1 min-h-0">
        <div
          className="relative flex h-full min-h-0 flex-1 items-start justify-center overflow-y-auto overflow-x-hidden"
          onDragOver={isDragDisabled ? undefined : handleDragOver}
          onDrop={isDragDisabled ? undefined : handleDrop}
        >
          {isQuestionnaireListRefetching && submitItems.length > 0 && (
            <div className="pointer-events-none absolute right-4 top-4 z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-login-primary/20 bg-white/95 px-3 py-1.5 text-sm font-semibold text-login-primary shadow-sm">
                <AiOutlineLoading3Quarters className="h-4 w-4 animate-spin" />
                Updating
              </div>
            </div>
          )}
          {isAddingQuestion ? (
            <QuestionnaireForm
              onClose={() => {
                dispatch(setIsAddingQuestion(false));
                dispatch(setEditingQuestion(null));
                openChat();
              }}
            />
          ) : submitItems.length === 0 ? (
            <div className="flex min-h-full w-full items-center justify-center px-5 py-4 md:px-6 md:py-5">
              <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.16fr)_minmax(280px,0.84fr)] xl:items-stretch">
                  <div className="questionnaire-card questionnaire-border overflow-hidden rounded-[30px] border shadow-[0_18px_44px_rgba(79,86,230,0.08)]">
                    <div className="bg-[radial-gradient(circle_at_top_left,_rgba(109,99,255,0.18),_transparent_36%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.12),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.96)_0%,_rgba(251,250,255,0.98)_100%)] px-5 py-5 md:px-6 md:py-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="home-panel-soft-bg home-highlight inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]">
                          <LuSparkles className="h-3.5 w-3.5" />
                          AI-assisted questionnaire
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-3">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-[18px] bg-gradient-to-br from-login-primary to-action shadow-lg">
                          <LuBotMessageSquare className="h-6 w-6 text-white" />
                          <LuSparkles className="absolute -right-2 -top-2 h-4 w-4 text-amber-400" />
                        </div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold questionnaire-heading shadow-sm">
                          {`${greeting}, ${normalizedFirstName}`}
                        </div>
                      </div>

                      <h2 className="questionnaire-heading mt-4 max-w-3xl text-[clamp(1.9rem,3vw,2.65rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                        Start building your questionnaire
                      </h2>
                      <p className="home-highlight mt-2.5 max-w-2xl text-[14px] leading-6 md:text-[16px] md:leading-6">
                        Tell Enspeek what your study is about and it can generate
                        your first set of questions in plain language.
                      </p>

                      <Button
                        type="button"
                        varinat="outline"
                        size="sm"
                        onClick={() =>
                          openChatWithMessage("Generate 5 questions about my study.")
                        }
                        className="mt-4 rounded-full home-muted shadow-sm hover:border-login-primary/30 hover:bg-login-primary/5"
                      >
                        Try:
                        <span className="font-semibold text-login-primary">
                          "Generate 5 questions about my study."
                        </span>
                      </Button>

                      <div className="mt-3.5 grid gap-3 md:grid-cols-2">
                        {emptyStatePrompts.map((prompt) => (
                          <Button
                            key={prompt.title}
                            type="button"
                            varinat="outline"
                            onClick={() => openChatWithMessage(prompt.text)}
                            className="home-panel-soft-bg questionnaire-border group h-auto w-full items-start justify-start whitespace-normal rounded-[20px] px-4 py-3 text-left leading-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                          >
                            <span className="home-dropdown-icon-wrap flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
                              {prompt.icon}
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="questionnaire-heading block break-words text-sm font-semibold leading-5">
                                {prompt.title}
                              </span>
                              <span className="questionnaire-muted mt-0.5 block break-words text-sm leading-5">
                                {prompt.text}
                              </span>
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="questionnaire-card questionnaire-border h-full rounded-[28px] border px-5 py-5 shadow-[0_14px_36px_rgba(79,86,230,0.07)]">
                    <div className="flex h-full flex-col">
                      <div className="flex items-center gap-3">
                        <div className="home-panel-soft-bg flex h-10 w-10 items-center justify-center rounded-2xl">
                          <LuCircleCheckBig className="h-5 w-5 text-login-primary" />
                        </div>
                        <div>
                          <p className="questionnaire-heading text-[17px] font-semibold">
                            What happens next
                          </p>
                          <p className="questionnaire-muted mt-0.5 text-sm leading-5">
                            A simple path from first question to final survey.
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-1 flex-col gap-2">
                        {[
                          {
                            title: "Describe your topic in simple words",
                            body: "Tell Enspeek what the study is about and let it draft the first questions for you.",
                          },
                          {
                            title: "Review and edit the generated questions",
                            body: "Refine wording, reorder items, or create your own question when you need more control.",
                          },
                          {
                            title: "Move to publish survey when ready",
                            body: "When the questionnaire looks right, continue to publish and activate the study.",
                          },
                        ].map((item, index) => (
                          <div
                            key={item.title}
                            className="home-panel-soft-bg flex flex-1 items-center rounded-[20px] border questionnaire-border px-4 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white">
                                {index + 1}
                              </div>
                              <div>
                                <p className="questionnaire-heading text-sm font-semibold leading-5.5">
                                  {item.title}
                                </p>
                                <p className="questionnaire-muted mt-1 text-sm leading-5">
                                  {item.body}
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
          ) : (
            <DataList />
          )}
        </div>
      </div>
    </div>
  );
}
