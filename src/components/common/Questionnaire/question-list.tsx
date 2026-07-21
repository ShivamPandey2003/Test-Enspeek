import { useEffect, type DragEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuArrowRight, LuPlus } from "react-icons/lu";
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
import { focusChatInput } from "../../../utils/modalFocus";
import PlatformHero from "../../ui/PlatformHero";
import ChatHistoryLoader from "../../global/ChatHistoryLoader";

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
      title: "Generate Questions",
      text: "Generate questions on [Topic]",
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
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <ChatHistoryLoader enabled={!!studyID && !isStudyInfoLoading} />
      <PageSubheader
        left={
          <div className="min-w-0">
            <h1 className="questionnaire-heading truncate text-[16px] font-semibold leading-none">
              Questionnaire
            </h1>
          </div>
        }
        right={
          submitItems.length > 0 ? (
            <>
              <div className="questionnaire-question-count min-w-0 truncate whitespace-nowrap text-sm font-semibold md:text-base">
                {`${submitItems.length} ${submitItems.length === 1 ? "Question" : "Questions"}`}
              </div>
              <Button
                data-test-id="NEXTTOSURVEY"
                variant="theme"
                size="default"
                onClick={() => {
                  navigate("/publish-survey", {
                    state: { studyID },
                  });
                }}
              >
                Next <LuArrowRight />
              </Button>
            </>
          ) : null
        }
        contentClassName="flex-row items-center justify-between gap-2"
        leftClassName="min-w-0 flex-1 overflow-hidden"
        rightClassName="min-w-0 shrink flex-nowrap justify-end gap-2 md:gap-3"
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
            <div className="flex min-h-full w-full items-center justify-center px-5 pb-24 pt-3 md:px-6 md:pb-36 md:pt-4">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                <div className="w-full">
                  <div className="overflow-hidden rounded-[24px]">
                    <PlatformHero
                      variant="questionnaire"
                      greeting={`${greeting}, ${normalizedFirstName}`}
                      title="Start building your questionnaire"
                      description="Tell Enspeek what your study is about and it can generate your first set of questions in plain language."
                      actions={
                        <>
                          {emptyStatePrompts.map((prompt) => (
                            <Button
                              key={prompt.title}
                              type="button"
                              variant="outline"
                              onClick={() => {
                                openChatWithMessage(prompt.text);
                                focusChatInput();
                              }}
                              className="home-panel-soft-bg questionnaire-border group w-auto items-center justify-center rounded-full text-center leading-normal transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                            >
                              <span className="home-dropdown-icon-wrap flex h-7 w-7 shrink-0 items-center justify-center rounded-full [&>svg]:h-4 [&>svg]:w-4">
                                {prompt.icon}
                              </span>
                              <span className="questionnaire-heading whitespace-nowrap text-sm font-semibold">
                                {prompt.title}
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
          ) : (
            <DataList />
          )}
        </div>
      </div>
    </div>
  );
}
