import React, { useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { LuCircleCheck, LuCircleX, LuClock3, LuPencilLine } from "react-icons/lu";
import IconActionButton from "../../ui/IconActionButton";
import Input from "../../ui/Input";
import { useSetQuotaMutation } from "../../../api-network/publish-survey/mutation";

interface QuotaProps {
  studyID: string;
  complete: number;
  disqualified: number;
  incomplete: number;
  totalQuota?: number;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  className: string;
}

const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon,
  className,
}) => (
  <div className={`rounded-[14px] px-3 py-2 ${className}`}>
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        {icon}
        <p className="truncate text-sm font-medium">{label}</p>
      </div>
      <p className="shrink-0 text-right text-[16px] font-bold">{value}</p>
    </div>
  </div>
);

const Quota: React.FC<QuotaProps> = ({
  studyID,
  complete,
  disqualified,
  incomplete,
  totalQuota,
}) => {
  const [isEditingTotal, setIsEditingTotal] = useState(false);
  const [editTotal, setEditTotal] = useState(totalQuota || 100);
  const { mutate: setQuota, isPending: isSetQuotaPending } = useSetQuotaMutation(studyID);

  useEffect(() => {
    if (!isEditingTotal) {
      setEditTotal(totalQuota || 0);
    }
  }, [isEditingTotal, totalQuota]);

  const handleSaveTotal = () => {
    setQuota(editTotal || 100, {
      onSuccess: () => {
        setIsEditingTotal(false);
      },
    });
  };

  const safeTotalQuota = totalQuota || 0;
  const progress = safeTotalQuota > 0 ? Math.min((complete / safeTotalQuota) * 100, 100) : 0;

  return (
    <section className="questionnaire-card w-full rounded-[18px] border home-border-soft p-4 shadow-sm">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="questionnaire-heading text-[15px] font-bold">
              Response Overview
            </h2>
          </div>
          <div className="min-w-[108px]">
            {!isEditingTotal ? (
              <div className="flex items-center justify-end gap-1.5">
                <span className="home-muted text-sm font-medium">
                  Total Quota
                </span>
                <span className="questionnaire-heading text-sm font-bold">
                  {isSetQuotaPending ? "Updating..." : safeTotalQuota}
                </span>
                <IconActionButton
                  tone="primary"
                  tooltip="Edit total quota"
                  onClick={() => setIsEditingTotal(true)}
                  className="h-8 w-8"
                >
                  <LuPencilLine size={16} />
                </IconActionButton>
              </div>
            ) : (
              <div className="flex items-center justify-end gap-1.5">
                <Input
                  variant="questionnaire"
                  type="number"
                  value={editTotal}
                  onChange={(e) => setEditTotal(Number(e.target.value))}
                  className="h-8 min-h-8 w-16 rounded-lg px-1.5 py-0 text-sm"
                />
                <IconActionButton
                  tone="success"
                  tooltip="Set total quota"
                  onClick={handleSaveTotal}
                  className="h-8 w-8"
                >
                  <AiOutlineSave size={18} />
                </IconActionButton>
                <IconActionButton
                  tone="danger"
                  tooltip="Cancel"
                  onClick={() => {
                    setEditTotal(safeTotalQuota);
                    setIsEditingTotal(false);
                  }}
                  className="h-8 w-8"
                >
                  <MdCancel size={18} />
                </IconActionButton>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <span className="questionnaire-label text-sm">Progress</span>
            <span className="questionnaire-heading text-[14px] font-bold">
              {`${complete} / ${safeTotalQuota}`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-brand-primary-softest)]">
            <div
              className="h-full rounded-full bg-login-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          <StatCard
            label="Complete"
            value={complete}
            icon={<LuCircleCheck className="h-4 w-4 shrink-0" />}
            className="bg-[var(--color-questionnaire-open-bg)] text-[var(--color-questionnaire-open)]"
          />
          <StatCard
            label="Disqualified"
            value={disqualified}
            icon={<LuCircleX className="h-4 w-4 shrink-0" />}
            className="bg-[var(--color-questionnaire-stop-bg)] text-[var(--color-questionnaire-stop)]"
          />
          <StatCard
            label="Incomplete"
            value={incomplete}
            icon={<LuClock3 className="h-4 w-4 shrink-0" />}
            className="bg-[var(--color-study-progress-bg)] text-[var(--color-study-progress)]"
          />
        </div>
      </div>
    </section>
  );
};

export default Quota;
