import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { LuCheck, LuCopy, LuExternalLink } from "react-icons/lu";
import PublishSurveyHeader from "./PublishSurveyHeader";
import ActivateSurvey from "./ActivateSurvey";
import Quota from "./Quota";
import { cn, handleCopy, handleLinkClick } from "../../../utils";
import Button from "../../ui/Button";
import IconActionButton from "../../ui/IconActionButton";
import {usePublishSurveyQuotaReport, usePublishSurveyStudyInfo, usePublishSurveySubgroup } from "../../../api-network/publish-survey/query";
// usePublishSurveyQuota
import { useGenerateGlobalLinkMutation } from "../../../api-network/publish-survey/mutation";

export default function PublishSurvey() {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightActivate, setHighlightActivate] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const studyID = state?.studyID;

  useEffect(() => {
    if (!state || !studyID) {
      navigate("/");
      toast.warning(
        "Invalid access route detected. Redirecting you to the homepage for a better experience."
      );
    }
  }, [navigate, state, studyID]);

  const {
    studyInfo,
    isStudyInfoLoading,
  } = usePublishSurveyStudyInfo(studyID);
  usePublishSurveySubgroup(studyID);
  // const { quotaData } = usePublishSurveyQuota(studyID);
  const { quotaReport } = usePublishSurveyQuotaReport(studyID);
  const { mutateAsync: activateSurvey, isPending: isActivatePending } =
    useGenerateGlobalLinkMutation(studyID, studyInfo?.studyname);

  if (isStudyInfoLoading || !studyInfo) {
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
    <div className="home-surface flex h-full min-h-0 flex-col overflow-hidden">
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <div className="flex h-full min-h-0 flex-col overflow-hidden">
          <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
            <PublishSurveyHeader
              studyName={studyInfo.studyname}
              launch={studyInfo.launch}
              isSurveyActive={!!studyInfo.livelink}
              onHoverDisabledInitiate={setHighlightActivate}
            />
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 pt-2 md:px-4 md:pb-6 md:pt-2">
              <div className="flex w-full flex-col gap-3 pb-3">
                {studyInfo.livelink ? (
                  <>
                    <div className="relative overflow-hidden rounded-[18px] bg-[var(--color-questionnaire-multi)] px-4 py-3 text-white shadow-sm">
                      <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:18px_18px]" />
                      <div className="relative flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white/10 backdrop-blur-sm">
                          <LuCheck className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-[18px] font-bold leading-tight">
                            Research is Live!
                          </h2>
                          <p className="mt-0.5 text-sm text-white/90">
                            Your research is collecting responses
                          </p>
                        </div>
                      </div>
                    </div>

                    <section className="questionnaire-card rounded-[18px] border home-border-soft px-4 py-3 shadow-sm">
                      <h3 className="questionnaire-heading text-[15px] font-bold">
                        Research Link
                      </h3>
                      <div className="mt-2 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                        <p
                          data-test-id="SURVEY_LINK"
                          className="home-highlight min-w-0 break-all text-[14px] font-medium questionnaire-clickable"
                          onClick={() => handleCopy(studyInfo.livelink)}
                        >
                          {studyInfo.livelink || "Generating link..."}
                        </p>
                        <div className="flex items-center gap-1.5 self-end md:self-auto">
                          <IconActionButton
                            aria-label="Copy research link"
                            tone="primary"
                            tooltip="Copy research link"
                            onClick={() => handleCopy(studyInfo.livelink)}
                            className="home-highlight h-8 w-8"
                          >
                            <LuCopy className="h-4 w-4" />
                          </IconActionButton>
                          <IconActionButton
                            aria-label="Open research link"
                            tone="primary"
                            tooltip="Open research link"
                            onClick={() => handleLinkClick(studyInfo.livelink)}
                            className="home-highlight h-8 w-8"
                          >
                            <LuExternalLink className="h-4 w-4" />
                          </IconActionButton>
                        </div>
                      </div>
                    </section>
                  </>
                ) : (
                  <div className="relative overflow-hidden rounded-[18px] border home-border-soft bg-white px-4 py-4 text-center shadow-sm">
                    <p className="questionnaire-heading text-sm md:text-base">
                      Research is not active yet. Activate it to enable data
                      collection and generate the live link.
                    </p>
                    <div className="mt-3 flex justify-center">
                      <div className="relative inline-flex">
                        {highlightActivate && (
                          <>
                            <span className="pointer-events-none absolute inset-0 rounded-full border border-login-primary/35 animate-ping" />
                            <span
                              className="pointer-events-none absolute inset-0 rounded-full border border-login-primary/25 animate-ping"
                              style={{ animationDelay: "250ms" }}
                            />
                          </>
                        )}
                        <Button
                          data-test-id="ACTIVATE"
                          variant="theme"
                          className={cn(
                            "relative h-8",
                            highlightActivate &&
                            "platform-activate-glow"
                          )}
                          onClick={() => {
                            setIsOpen(true);
                          }}
                        >
                          Activate Study
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Quota
                  complete={quotaReport?.completes || 0}
                  // totalQuota={quotaData?.limit || 0}
                  totalQuota={0}
                  disqualified={quotaReport?.disqualified || 0}
                  incomplete={quotaReport?.incompletes || 0}
                  studyID={studyID}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActivateSurvey
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        activate={activateSurvey}
        studyInfo={studyInfo}
        isPending={isActivatePending}
      />
    </div>
  );
}
