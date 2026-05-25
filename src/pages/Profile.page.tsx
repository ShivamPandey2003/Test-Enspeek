import { useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  LuBadgeCheck,
  LuCreditCard,
  LuMail,
  LuMessageSquareText,
  LuSend,
  LuUserRound,
} from "react-icons/lu";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModalScaffold from "../components/ui/modal/ModalScaffold";
import PageContentShell from "../components/ui/PageContentShell";
import Textarea from "../components/ui/Textarea";
import type { RootState } from "../store/store";
import { cn, getFullName } from "../utils";

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const toPositiveInteger = (value: string) => {
  if (!/^\d+$/.test(value.trim())) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) && parsedValue > 0 ? parsedValue : null;
};

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [studyLimitAddition, setStudyLimitAddition] = useState("");
  const [promptLimitAddition, setPromptLimitAddition] = useState("");
  const [questionLimitAddition, setQuestionLimitAddition] = useState("");
  const [confirmationText, setConfirmationText] = useState("");
  const [note, setNote] = useState("");
  const fullName = getFullName(user.firstName, user.lastName) || "Client User";
  const planType = Number(user.planType);
  const isPaidUser = planType === 1;
  const planLabel = isPaidUser ? "Premium" : "Free";
  const parsedStudyLimitAddition = toPositiveInteger(studyLimitAddition);
  const parsedPromptLimitAddition = toPositiveInteger(promptLimitAddition);
  const parsedQuestionLimitAddition = toPositiveInteger(questionLimitAddition);
  const isConfirmationValid = confirmationText.trim().toLowerCase() === "confirm";

  const submitRequest = () => {
    setConfirmationText("");

    if (!isPaidUser) {
      setIsReviewModalOpen(true);
      return;
    }

    if (
      !studyLimitAddition.trim() &&
      !promptLimitAddition.trim() &&
      !questionLimitAddition.trim()
    ) {
      toast.warning("Please enter at least one limit addition.");
      return;
    }

    if (
      (studyLimitAddition.trim() && parsedStudyLimitAddition === null) ||
      (promptLimitAddition.trim() && parsedPromptLimitAddition === null) ||
      (questionLimitAddition.trim() && parsedQuestionLimitAddition === null)
    ) {
      toast.warning("Limit additions must be positive whole numbers.");
      return;
    }

    setIsReviewModalOpen(true);
  };

  const confirmRequest = () => {
    if (confirmationText.trim().toLowerCase() !== "confirm") {
      toast.warning('Please type "confirm" to submit this request.');
      return;
    }

    toast.success("Your request is ready for admin review.");
    setStudyLimitAddition("");
    setPromptLimitAddition("");
    setQuestionLimitAddition("");
    setConfirmationText("");
    setNote("");
    setIsReviewModalOpen(false);
  };

  return (
    <div className="home-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <PageContentShell className="pb-6">
        <div className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-[minmax(0,1fr)_390px]">
          <section className="questionnaire-card questionnaire-border overflow-hidden rounded-xl border bg-white">
            <div className="border-b questionnaire-border bg-[var(--color-brand-primary-softest)]/45 px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-login-primary text-2xl font-bold text-white">
                    {fullName
                      .split(/\s+/)
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-[24px] font-bold text-login-primary">
                      {fullName}
                    </h2>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)]">
                      <LuMail className="h-4 w-4" />
                      <span className="truncate">{user.email || "-"}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "inline-flex rounded-full px-4 py-2 text-sm font-bold",
                    isPaidUser
                      ? "bg-[var(--color-study-activated)]/10 text-[var(--color-study-activated)]"
                      : "bg-[var(--color-brand-primary-softest)] text-login-primary"
                  )}
                >
                  {planLabel}
                </span>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-2">
              <ProfileField icon={<LuUserRound />} label="First Name" value={user.firstName} />
              <ProfileField icon={<LuUserRound />} label="Last Name" value={user.lastName} />
              <ProfileField icon={<LuMail />} label="Email" value={user.email} />
              <ProfileField
                icon={<LuBadgeCheck />}
                label="Account Status"
                value={user.isActive ? "Active" : "Inactive"}
              />
            </div>
          </section>

          <section className="questionnaire-card questionnaire-border rounded-xl border bg-white p-6">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-primary-softest)] text-login-primary">
                <LuCreditCard className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-[18px] font-bold text-login-primary">
                  Subscription Usage
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Current plan limits from your profile.
                </p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <UsageRow
                label="Studies"
                used={user.createdStudies}
                allowed={user.allowedStudies}
              />
              <UsageRow
                label="Prompts"
                used={user.usedPrompt}
                allowed={user.allowedPrompt}
              />
              <UsageRow
                label="Questions"
                used={user.createdQuestions}
                allowed={user.allowedQuestions}
              />
            </div>
          </section>
        </div>

        <section className="mx-auto mt-4 max-w-6xl rounded-xl border questionnaire-border bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand-primary-softest)] text-login-primary">
                  <LuMessageSquareText className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-[20px] font-bold text-login-primary">
                    Subscription Change Request
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                    Ask an admin to review a plan or limit change for your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {!isPaidUser ? (
              <div className="rounded-xl border border-[color:var(--color-brand-primary)]/16 bg-[var(--color-brand-primary-softest)]/45 p-4">
                <h3 className="text-sm font-bold text-login-primary">
                  Request premium access
                </h3>
                <p className="mt-1 text-sm leading-5 text-[var(--color-text-muted)]">
                  Ask an admin to review your account and upgrade it to premium access.
                </p>
              </div>
            ) : null}

            {isPaidUser ? (
              <LimitRequestTable
                rows={[
                  {
                    title: "Study Creation Limit",
                    currentLimit: user.allowedStudies,
                    value: studyLimitAddition,
                    onChange: setStudyLimitAddition,
                    placeholder: "e.g. 100",
                  },
                  {
                    title: "Prompt Subscription Limit",
                    currentLimit: user.allowedPrompt,
                    value: promptLimitAddition,
                    onChange: setPromptLimitAddition,
                    placeholder: "e.g. 100",
                  },
                  {
                    title: "Question Addition Limit",
                    currentLimit: user.allowedQuestions,
                    value: questionLimitAddition,
                    onChange: setQuestionLimitAddition,
                    placeholder: "e.g. 100",
                  },
                ]}
              />
            ) : null}
          </div>

          <div className="mt-4">
            <ProfileFormField label="Additional Notes">
              <Textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Add any context that will help the admin review this request."
                className="min-h-[120px] resize-y"
              />
            </ProfileFormField>
          </div>

          <div className="mt-5 flex justify-end">
            <Button type="button" variant="theme" onClick={submitRequest}>
              <LuSend className="h-4 w-4" />
              Submit Request
            </Button>
          </div>
        </section>
      </PageContentShell>
      <ModalScaffold
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setConfirmationText("");
        }}
        title="Review Subscription Request"
        icon={<LuMessageSquareText className="h-5 w-5" />}
        className="max-w-4xl"
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            onClick={() => {
              setIsReviewModalOpen(false);
              setConfirmationText("");
            }}
          >
            Cancel
          </Button>
        }
        footerRight={
          <Button
            type="button"
            variant="theme"
            onClick={confirmRequest}
            disabled={!isConfirmationValid}
          >
            Confirm Request
          </Button>
        }
      >
        <div className="space-y-4">
          {!isPaidUser ? (
            <div className="rounded-lg border border-[color:var(--color-brand-primary)]/16 bg-[var(--color-brand-primary-softest)]/45 p-4">
              <h3 className="text-base font-bold text-login-primary">
                Premium access request
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--color-text-strong)]">
                This request will ask an admin to review your account for premium access.
              </p>
            </div>
          ) : (
            <LimitReviewTable
              rows={[
                {
                  title: "Study Creation Limit",
                  currentLimit: user.allowedStudies,
                  addition: parsedStudyLimitAddition,
                },
                {
                  title: "Prompt Subscription Limit",
                  currentLimit: user.allowedPrompt,
                  addition: parsedPromptLimitAddition,
                },
                {
                  title: "Question Addition Limit",
                  currentLimit: user.allowedQuestions,
                  addition: parsedQuestionLimitAddition,
                },
              ]}
            />
          )}
          {note.trim() ? (
            <div className="rounded-lg border questionnaire-border bg-white p-4">
              <p className="text-sm font-bold text-[var(--color-text-strong)]">
                Additional Notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[var(--color-text-muted)]">
                {note}
              </p>
            </div>
          ) : null}
          <div className="rounded-lg border questionnaire-border bg-white p-4">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-[var(--color-text-strong)]">
                Type{" "}
                <span className="font-extrabold text-login-primary">"confirm"</span>
                {" "}to submit this request
              </span>
              <Input
                variant="modal"
                value={confirmationText}
                onChange={(event) => setConfirmationText(event.target.value)}
                placeholder="Confirm"
                className="h-[46px]"
              />
            </label>
          </div>
        </div>
      </ModalScaffold>
    </div>
  );
}

const ProfileField = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string;
}) => (
  <div className="rounded-lg border questionnaire-border bg-[var(--color-surface-soft)] px-4 py-3">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-text-muted)]">
      <span className="text-login-primary [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      {label}
    </div>
    <p className="mt-2 truncate text-sm font-bold text-[var(--color-text-strong)]" title={value}>
      {value || "-"}
    </p>
  </div>
);

const ProfileFormField = ({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-[var(--color-text-strong)]">
      {label}
    </span>
    {children}
  </label>
);

type LimitRequestRow = {
  title: string;
  currentLimit?: number;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const LimitRequestTable = ({ rows }: { rows: LimitRequestRow[] }) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-[var(--color-brand-primary-softest)]/45">
          <tr className="text-xs font-bold uppercase tracking-[0.08em] text-login-primary">
            <th className="px-4 py-3">Limit Type</th>
            <th className="px-4 py-3 text-center">Current Limit</th>
            <th className="px-4 py-3 text-center">Additional Limit Requested</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row) => (
            <tr key={row.title} className="align-middle">
              <td className="px-4 py-4 text-sm font-bold text-login-primary">
                {row.title}
              </td>
              <td className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-strong)]">
                {formatNumber(row.currentLimit)}
              </td>
              <td className="px-4 py-4 text-center">
                <Input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={row.value}
                  onChange={(event) =>
                    row.onChange(event.target.value.replace(/\D/g, ""))
                  }
                  placeholder={row.placeholder}
                  className="mx-auto h-[40px] w-[140px] border-gray-200 px-3 text-center"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

type LimitReviewRow = {
  title: string;
  currentLimit?: number;
  addition: number | null;
};

const LimitReviewTable = ({ rows }: { rows: LimitReviewRow[] }) => {
  const requestedRows = rows.filter((row) => row.addition);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-[var(--color-brand-primary-softest)]/45">
            <tr className="text-xs font-bold uppercase tracking-[0.08em] text-login-primary">
              <th className="px-4 py-3">Limit Type</th>
              <th className="px-4 py-3 text-center">Current Limit</th>
              <th className="px-4 py-3 text-center">Additional Limit Requested</th>
              <th className="px-4 py-3 text-center">Updated Limit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {requestedRows.map((row) => {
              const currentLimit = Number(row.currentLimit ?? 0);
              const addition = Number(row.addition ?? 0);
              const updatedLimit = currentLimit + addition;

              return (
                <tr key={row.title} className="align-middle">
                  <td className="px-4 py-4 text-sm font-bold text-login-primary">
                    {row.title}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-strong)]">
                    {formatNumber(currentLimit)}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-semibold text-[var(--color-text-strong)]">
                    + {formatNumber(addition)}
                  </td>
                  <td className="px-4 py-4 text-center text-sm font-bold text-login-primary">
                    {formatNumber(updatedLimit)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UsageRow = ({
  label,
  used,
  allowed,
}: {
  label: string;
  used?: number;
  allowed?: number;
}) => {
  const safeAllowed = Number(allowed ?? 0);
  const safeUsed = Number(used ?? 0);
  const percent = safeAllowed > 0 ? Math.min((safeUsed / safeAllowed) * 100, 100) : 0;

  return (
    <div className="rounded-lg border questionnaire-border bg-[var(--color-surface-soft)] p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-bold text-[var(--color-text-strong)]">{label}</p>
        <p className="text-sm font-bold text-login-primary">
          {formatNumber(safeUsed)} / {formatNumber(safeAllowed)}
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-login-primary"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};
