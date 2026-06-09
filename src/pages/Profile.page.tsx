import { useRef, useState, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  LuBadgeCheck,
  LuCreditCard,
  LuInfo,
  LuMail,
  LuUserRound,
} from "react-icons/lu";
import Button from "../components/ui/Button";
import ModalScaffold from "../components/ui/modal/ModalScaffold";
import PageContentShell from "../components/ui/PageContentShell";
import Textarea from "../components/ui/Textarea";
import {
  getSupportResponseMessage,
  useSubscriptionRequestMutation,
} from "../api-network/support/mutation";
import { modalDefinitions, renderModalIcon } from "../config/modalDefinitions";
import { circleIconButtonClass, circleIconContentClass } from "../constants/uiClasses";
import type { RootState } from "../store/store";
import { cn, getFullName } from "../utils";

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(Number(value ?? 0));

const subscriptionRequestTopics = [
  { id: "studies", label: "Studies" },
  { id: "prompts", label: "Prompts" },
  { id: "questions", label: "Questions" },
];

const SUBSCRIPTION_REQUEST_MESSAGE_MAX_LENGTH = 2000;

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user);
  const subscriptionRequestMutation = useSubscriptionRequestMutation();
  const hasShownLimitToastRef = useRef(false);
  const [isSubscriptionRequestOpen, setIsSubscriptionRequestOpen] = useState(false);
  const [subscriptionRequestMessage, setSubscriptionRequestMessage] = useState("");
  const [subscriptionRequestTopicsValue, setSubscriptionRequestTopicsValue] = useState<string[]>([]);
  const fullName = getFullName(user.firstName, user.lastName) || "Client User";
  const planType = Number(user.planType);
  const isPaidUser = planType === 1;
  const planLabel = isPaidUser ? "Premium" : "Free";
  const subscriptionRequestModal = modalDefinitions.subscriptionRequest;
  const subscriptionRequestCharacterCount = subscriptionRequestMessage.length;

  const showSubscriptionRequestLimitToast = () => {
    if (hasShownLimitToastRef.current) return;

    hasShownLimitToastRef.current = true;
    toast.warning(
      `Description cannot exceed ${SUBSCRIPTION_REQUEST_MESSAGE_MAX_LENGTH} characters.`
    );

    window.setTimeout(() => {
      hasShownLimitToastRef.current = false;
    }, 1500);
  };

  const closeSubscriptionRequestModal = () => {
    if (subscriptionRequestMutation.isPending) return;

    setIsSubscriptionRequestOpen(false);
    setSubscriptionRequestMessage("");
    setSubscriptionRequestTopicsValue([]);
  };

  const toggleSubscriptionRequestTopic = (topicId: string) => {
    setSubscriptionRequestTopicsValue((currentTopics) =>
      currentTopics.includes(topicId)
        ? currentTopics.filter((currentTopic) => currentTopic !== topicId)
        : [...currentTopics, topicId]
    );
  };

  const submitSubscriptionRequest = () => {
    if (subscriptionRequestMutation.isPending) return;

    if (!subscriptionRequestMessage.trim()) {
      toast.warning("Please enter your subscription request.");
      return;
    }

    subscriptionRequestMutation.mutate(
      {
        apiToken: user.apiToken,
        request_types: subscriptionRequestTopicsValue,
        message: subscriptionRequestMessage.trim(),
      },
      {
        onSuccess: (response) => {
          toast.success(
            getSupportResponseMessage(
              response,
              "Your subscription request has been submitted."
            )
          );
          closeSubscriptionRequestModal();
        },
        onError: (error) => {
          toast.error(error.message || "Unable to submit subscription request.");
        },
      }
    );
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
                      : "bg-yellow-100 text-yellow-700"
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
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center rounded-xl bg-[var(--color-brand-primary-softest)] text-login-primary">
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
              <button
                type="button"
                className={circleIconButtonClass}
                aria-label="Open subscription request"
                title="Subscription Request"
                onClick={() => setIsSubscriptionRequestOpen(true)}
              >
                <span className={circleIconContentClass}>
                  <LuInfo className="h-[18px] w-[18px]" />
                </span>
              </button>
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
      </PageContentShell>
      <ModalScaffold
        isOpen={isSubscriptionRequestOpen}
        onClose={closeSubscriptionRequestModal}
        title={subscriptionRequestModal.title}
        icon={renderModalIcon(subscriptionRequestModal.icon)}
        className={subscriptionRequestModal.maxWidthClass}
        closeDisabled={subscriptionRequestMutation.isPending}
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            disabled={subscriptionRequestMutation.isPending}
            onClick={closeSubscriptionRequestModal}
          >
            {subscriptionRequestModal.cancelLabel ?? "Cancel"}
          </Button>
        }
        footerRight={
          <Button
            type="button"
            variant="theme"
            onClick={submitSubscriptionRequest}
            disabled={
              !subscriptionRequestMessage.trim() ||
              subscriptionRequestTopicsValue.length === 0 ||
              subscriptionRequestMutation.isPending
            }
          >
            {subscriptionRequestMutation.isPending ? (
              <>
                <span className="modal-spinner" />
                {subscriptionRequestModal.submittingLabel ?? "Submitting..."}
              </>
            ) : (
              subscriptionRequestModal.submitLabel ?? "Submit"
            )}
          </Button>
        }
      >
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-bold text-[var(--color-text-strong)]">
              Request type
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {subscriptionRequestTopics.map((topic) => (
                <label
                  key={topic.id}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border questionnaire-border bg-[var(--color-surface-soft)] px-4 py-3 text-sm font-semibold text-[var(--color-text-strong)]"
                >
                  <input
                    type="checkbox"
                    checked={subscriptionRequestTopicsValue.includes(topic.id)}
                    disabled={subscriptionRequestMutation.isPending}
                    onChange={() => toggleSubscriptionRequestTopic(topic.id)}
                    className="h-4 w-4 rounded border-gray-300 accent-[var(--color-brand-primary)]"
                  />
                  {topic.label}
                </label>
              ))}
            </div>
          </div>

          <ProfileFormField
            label={
              <span className="flex w-full items-center justify-between gap-3">
                <span>Description</span>
                <span className="text-xs font-bold text-[var(--color-text-muted)]">
                  {subscriptionRequestCharacterCount}/{SUBSCRIPTION_REQUEST_MESSAGE_MAX_LENGTH} Characters
                </span>
              </span>
            }
          >
            <Textarea
              variant="modal"
              value={subscriptionRequestMessage}
              disabled={subscriptionRequestMutation.isPending}
              onChange={(event) => {
                const nextValue = event.target.value;

                if (nextValue.length > SUBSCRIPTION_REQUEST_MESSAGE_MAX_LENGTH) {
                  setSubscriptionRequestMessage(
                    nextValue.slice(0, SUBSCRIPTION_REQUEST_MESSAGE_MAX_LENGTH)
                  );
                  showSubscriptionRequestLimitToast();
                  return;
                }

                setSubscriptionRequestMessage(nextValue);
              }}
              placeholder="Type your message here..."
              className="min-h-[180px] resize-y"
            />
          </ProfileFormField>
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
  label: ReactNode;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="mb-2 block text-sm font-bold text-[var(--color-text-strong)]">
      {label}
    </span>
    {children}
  </label>
);

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
