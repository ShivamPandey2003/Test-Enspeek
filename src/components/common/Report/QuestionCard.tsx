import React from "react";
import { LuDownload } from "react-icons/lu";
import { useLocation } from "react-router";
import Button from "../../ui/Button";
import {
  useReportPptDownload,
  useReportProcessDownload,
} from "../../../api-network/report/mutation";
import {
  SurfaceCard,
  SurfaceCardContent,
  SurfaceCardHeader,
  SurfaceCardTitle,
} from "../../ui/SurfaceCard";

interface QuestionCardProps {
  title: string;
  children: React.ReactNode;
  qId: string;
  studyID?: string;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ title, children, qId, studyID }) => {
  const { state } = useLocation();
  const { processDownload } = useReportProcessDownload();
  const { downloadPpt } = useReportPptDownload({
     studyID: studyID ? studyID : state?.studyID,
    cb: ({ studyID, pid }) => {
      processDownload({ studyID, pid });
    },
  });
  return (
    <SurfaceCard data-test-id={`${qId}_REPORTCARD`} className="w-full h-auto overflow-hidden">
      <SurfaceCardHeader>
        <SurfaceCardTitle>{title}</SurfaceCardTitle>
        <Button
          className="report-toolbar-btn bg-[var(--color-brand-primary-softest)] text-login-primary hover:bg-[var(--color-brand-primary-soft)] hover:text-white"
          onClick={() => {
            downloadPpt(qId);
          }}
        >
          <LuDownload />
        </Button>
      </SurfaceCardHeader>
      <SurfaceCardContent>{children}</SurfaceCardContent>
    </SurfaceCard>
  );
};

export default QuestionCard;
