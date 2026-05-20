import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HiSearch } from "react-icons/hi";
import {
  LuBadgeCheck,
  LuShieldCheck,
  LuUsersRound,
} from "react-icons/lu";
import {
  type AdminPanelUser,
  useAdminPanelUsers,
} from "../api-network/admin-panel/query";
import {
  type AdminPanelUpdateUserPayload,
  useUpdateAdminPanelUserMutation,
} from "../api-network/admin-panel/mutation";
import adminPanelKeys from "../api-network/admin-panel/keys";
import {
  modalDefinitions,
  renderModalIcon,
} from "../config/modalDefinitions";
import UserDisplay from "../components/common/UserManagement/UserDisplay";
import type { AdminPanelActionType } from "../components/common/UserManagement/UserCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModalField from "../components/ui/modal/ModalField";
import ModalInfoBlock from "../components/ui/modal/ModalInfoBlock";
import ModalScaffold from "../components/ui/modal/ModalScaffold";
import PageContentShell from "../components/ui/PageContentShell";
import PageSubheader from "../components/ui/PageSubheader";
import { cn, handleKeyPress } from "../utils";

type ActionModalState = {
  user: AdminPanelUser;
  action: AdminPanelActionType;
} | null;

type SubscriptionFormState = {
  allowedPrompt: string;
  allowedStudies: string;
  allowedQuestions: string;
};

const toPositiveInteger = (value: string) => {
  if (!/^\d+$/.test(value.trim())) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
};

const normalizeNumericInput = (value: string) => value.replace(/\D/g, "");

const blockedNumericKeys = new Set(["e", "E", "-", "+", "."]);

const getUserActionDefinitionKey = (
  action: AdminPanelActionType,
  user: AdminPanelUser
): keyof typeof modalDefinitions => {
  if (action === "status") {
    return user.status === "active" ? "deactivateUser" : "activateUser";
  }

  if (action === "plan") {
    return user.plan === "free" ? "changeToPaidUser" : "changeToFreeUser";
  }

  if (action === "verification") {
    return "verifyUser";
  }

  return "updateUserSubscription";
};

export default function AdminPanelPage() {
  const [search, setSearch] = useState("");
  const [actionModal, setActionModal] = useState<ActionModalState>(null);
  const [keywordValue, setKeywordValue] = useState("");
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionFormState>({
    allowedPrompt: "",
    allowedStudies: "",
    allowedQuestions: "",
  });
  const queryClient = useQueryClient();
  const { users, isLoading } = useAdminPanelUsers();
  const updateUserMutation = useUpdateAdminPanelUserMutation();

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [user.name, user.email, user.plan, user.status, user.isApproved ? "approved" : "not approved"].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search, users]);

  const openActionModal = (
    user: AdminPanelUser,
    action: AdminPanelActionType
  ) => {
    setActionModal({ user, action });
    setKeywordValue("");
    setSubscriptionForm({
      allowedPrompt: String(user.allowedPrompt),
      allowedStudies: String(user.allowedStudies),
      allowedQuestions: String(user.allowedQuestions),
    });
  };

  const closeActionModal = () => {
    if (updateUserMutation.isPending) return;

    setActionModal(null);
    setKeywordValue("");
  };

  const updateCachedUser = (updatedUser: AdminPanelUser) => {
    queryClient.setQueryData<AdminPanelUser[]>(
      adminPanelKeys.users(),
      (existingUsers = []) =>
        existingUsers.map((user) =>
          user.email === updatedUser.email ? updatedUser : user
        )
    );
  };

  const submitUpdate = (
    payload: AdminPanelUpdateUserPayload,
    updatedUser: AdminPanelUser
  ) => {
    updateUserMutation.mutate(payload, {
      onSuccess: () => {
        updateCachedUser(updatedUser);
        toast.success(`${updatedUser.name} updated successfully.`);
        setActionModal(null);
        setKeywordValue("");
      },
    });
  };

  const handleStatusSubmit = (user: AdminPanelUser) => {
    const nextStatus = user.status === "active" ? "inactive" : "active";
    const definition = modalDefinitions[getUserActionDefinitionKey("status", user)];
    const keyword = definition.confirmationKeyword ?? "";

    if (keywordValue.trim().toLowerCase() !== keyword) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    submitUpdate(
      {
        email: user.email,
        is_active: nextStatus === "active",
      },
      {
        ...user,
        status: nextStatus,
      }
    );
  };

  const handlePlanSubmit = (user: AdminPanelUser) => {
    const nextPlan = user.plan === "free" ? "paid" : "free";
    const definition = modalDefinitions[getUserActionDefinitionKey("plan", user)];
    const keyword = definition.confirmationKeyword ?? nextPlan;

    if (keywordValue.trim().toLowerCase() !== keyword) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    submitUpdate(
      {
        email: user.email,
        user_type: nextPlan === "paid" ? 1 : 0,
      },
      {
        ...user,
        plan: nextPlan,
      }
    );
  };

  const handleVerificationSubmit = (user: AdminPanelUser) => {
    const definition = modalDefinitions[getUserActionDefinitionKey("verification", user)];
    const keyword = definition.confirmationKeyword ?? "";

    if (keywordValue.trim().toLowerCase() !== keyword) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    submitUpdate(
      {
        email: user.email,
        is_approved: 1,
      },
      {
        ...user,
        isApproved: true,
      }
    );
  };

  const handleSubscriptionSubmit = (user: AdminPanelUser) => {
    const allowedPrompt = toPositiveInteger(subscriptionForm.allowedPrompt);
    const allowedStudies = toPositiveInteger(subscriptionForm.allowedStudies);
    const allowedQuestions = toPositiveInteger(subscriptionForm.allowedQuestions);

    if (
      allowedPrompt === null ||
      allowedStudies === null ||
      allowedQuestions === null
    ) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.wholeNumbers ??
          "Updated limits must be whole numbers."
      );
      return;
    }

    if (allowedPrompt <= user.usedPrompt) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.promptGreaterThanUsed ??
          "Updated prompt limit must be greater than prompts already used."
      );
      return;
    }

    if (allowedStudies <= user.createdStudies) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.studiesGreaterThanUsed ??
          "Updated study creation limit must be greater than studies already created."
      );
      return;
    }

    if (allowedQuestions <= user.createdQuestions) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.questionsGreaterThanUsed ??
          "Updated question generation limit must be greater than questions already generated."
      );
      return;
    }

    if (
      allowedPrompt === user.allowedPrompt &&
      allowedStudies === user.allowedStudies &&
      allowedQuestions === user.allowedQuestions
    ) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.changeAtLeastOneLimit ??
          "Please change at least one subscription limit."
      );
      return;
    }

    const payload: AdminPanelUpdateUserPayload = {
      email: user.email,
    };
    const updatedUser: AdminPanelUser = {
      ...user,
    };

    if (allowedPrompt !== user.allowedPrompt) {
      payload.allowed_prompt = allowedPrompt;
      updatedUser.allowedPrompt = allowedPrompt;
    }

    if (allowedStudies !== user.allowedStudies) {
      payload.allowedstudies = allowedStudies;
      updatedUser.allowedStudies = allowedStudies;
    }

    if (allowedQuestions !== user.allowedQuestions) {
      payload.allowed_question = allowedQuestions;
      updatedUser.allowedQuestions = allowedQuestions;
    }

    submitUpdate(payload, updatedUser);
  };

  const handleSubmit = () => {
    if (!actionModal) return;

    const { user, action } = actionModal;

    if (action === "status") {
      handleStatusSubmit(user);
      return;
    }

    if (action === "plan") {
      handlePlanSubmit(user);
      return;
    }

    if (action === "verification") {
      handleVerificationSubmit(user);
      return;
    }

    handleSubscriptionSubmit(user);
  };

  const selectedAction = actionModal?.action;
  const selectedUser = actionModal?.user;
  const selectedDefinition =
    selectedAction && selectedUser
      ? modalDefinitions[getUserActionDefinitionKey(selectedAction, selectedUser)]
      : undefined;
  const confirmKeyword = selectedDefinition?.confirmationKeyword ?? "";
  const isConfirmationValid =
    selectedAction === "subscription" ||
    keywordValue.trim().toLowerCase() === confirmKeyword;
  const subscriptionPromptLimit = toPositiveInteger(subscriptionForm.allowedPrompt);
  const subscriptionStudyLimit = toPositiveInteger(subscriptionForm.allowedStudies);
  const subscriptionQuestionLimit = toPositiveInteger(subscriptionForm.allowedQuestions);
  const isSubscriptionFormValid =
    selectedAction !== "subscription" ||
    Boolean(
      selectedUser &&
      subscriptionPromptLimit !== null &&
      subscriptionStudyLimit !== null &&
      subscriptionQuestionLimit !== null &&
      subscriptionPromptLimit > selectedUser.usedPrompt &&
      subscriptionStudyLimit > selectedUser.createdStudies &&
      subscriptionQuestionLimit > selectedUser.createdQuestions &&
      (
        subscriptionPromptLimit !== selectedUser.allowedPrompt ||
        subscriptionStudyLimit !== selectedUser.allowedStudies ||
        subscriptionQuestionLimit !== selectedUser.allowedQuestions
      )
    );
  const isSubmitDisabled =
    updateUserMutation.isPending ||
    (selectedAction === "subscription" && !isSubscriptionFormValid) ||
    (selectedAction !== "subscription" && !isConfirmationValid);
  const modalTitle = selectedDefinition?.title ?? "";
  const modalIcon = renderModalIcon(selectedDefinition?.icon);

  return (
    <div className="home-page-bg flex h-full min-h-0 flex-col overflow-hidden">
      <PageSubheader
        left={
          <div className="flex min-w-0 items-center gap-3">
            <span className="home-panel-soft-bg flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
              <LuShieldCheck className="h-5 w-5 text-login-primary" />
            </span>
            <div className="min-w-0">
              <h1 className="home-heading truncate text-[18px] font-semibold">
                User Management
              </h1>
            </div>
          </div>
        }
        right={
          <div className="home-search-bg flex h-10 w-full items-center rounded-[18px] px-3 sm:w-72">
            <HiSearch className="home-muted h-4 w-4" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users..."
              className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
            />
          </div>
        }
        className="shrink-0"
      />

      <PageContentShell>
        {isLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="home-muted text-sm font-semibold">Loading users...</div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <UserDisplay userData={filteredUsers} onAction={openActionModal} />
        ) : (
          <div className="home-surface home-border-soft platform-card-shadow-medium flex min-h-[260px] flex-col items-center justify-center rounded-md border px-6 text-center">
            <LuUsersRound className="h-9 w-9 text-login-primary" />
            <p className="home-heading mt-3 text-[16px] font-semibold">
              No users found
            </p>
            <p className="home-muted mt-1 max-w-md text-sm">
              Try another search term.
            </p>
          </div>
        )}
      </PageContentShell>

      <ModalScaffold
        isOpen={Boolean(actionModal)}
        onClose={closeActionModal}
        className={selectedDefinition?.maxWidthClass ?? "max-w-lg"}
        title={modalTitle}
        icon={modalIcon}
        description={
          selectedAction === "subscription"
            ? selectedDefinition?.description
            : undefined
        }
        closeDisabled={updateUserMutation.isPending}
        footerLeft={
          <Button
            type="button"
            varinat="cancel"
            onClick={closeActionModal}
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
        }
        footerRight={
          <Button
            type="button"
            varinat="theme"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
          >
            {updateUserMutation.isPending ? (
              <>
                <span className="modal-spinner" />
                {selectedDefinition?.submittingLabel ?? "Submitting..."}
              </>
            ) : selectedAction === "subscription" ? (
              selectedDefinition?.submitLabel ?? "Update Subscription"
            ) : (
              selectedDefinition?.submitLabel ?? "Submit"
            )}
          </Button>
        }
      >
        {selectedUser && selectedAction ? (
          selectedAction === "subscription" ? (
            <SubscriptionModalBody
              user={selectedUser}
              values={subscriptionForm}
              onChange={(field, value) =>
                setSubscriptionForm((currentValues) => ({
                  ...currentValues,
                  [field]: value,
                }))
              }
              onSubmit={handleSubmit}
            />
          ) : (
            <ConfirmationModalBody
              user={selectedUser}
              action={selectedAction}
              keyword={confirmKeyword}
              onValueChange={setKeywordValue}
              value={keywordValue}
              onSubmit={handleSubmit}
            />
          )
        ) : null}
      </ModalScaffold>
    </div>
  );
}

const ConfirmationModalBody = ({
  user,
  action,
  keyword,
  value,
  onValueChange,
  onSubmit,
}: {
  user: AdminPanelUser;
  action: Exclude<AdminPanelActionType, "subscription">;
  keyword: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  const definition = modalDefinitions[getUserActionDefinitionKey(action, user)];
  const actionText = definition.confirmationAction ?? definition.title.toLowerCase();

  return (
    <div className="space-y-4">
      <p className="theme-text-default text-[15px] leading-6">
        Are you sure you want to {actionText}{" "}
        <span className="font-semibold text-login-primary">{user.name}</span>?
      </p>
      <ModalInfoBlock icon={<LuBadgeCheck className="h-4 w-4 text-login-primary" />}>
        Type <span className="font-semibold text-login-primary">{keyword}</span>{" "}
        to confirm this action.
      </ModalInfoBlock>
      <ModalField label="Confirmation" required>
        <Input
          variant="modal"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => handleKeyPress(event, onSubmit)}
          placeholder={`Type '${keyword}' here...`}
        />
      </ModalField>
    </div>
  );
};

const SubscriptionModalBody = ({
  user,
  values,
  onChange,
  onSubmit,
}: {
  user: AdminPanelUser;
  values: SubscriptionFormState;
  onChange: (field: keyof SubscriptionFormState, value: string) => void;
  onSubmit: () => void;
}) => (
  <div>
    <div className="flex flex-col gap-5">
      <SubscriptionLimitField
        label="Prompt Limit"
        usedLabel="Prompts Used"
        currentLabel="Current Allowed Prompts"
        updatedLabel="Updated Allowed Prompts"
        used={user.usedPrompt}
        currentAllowed={user.allowedPrompt}
        value={values.allowedPrompt}
        onChange={(value) => onChange("allowedPrompt", value)}
        onSubmit={onSubmit}
      />
      <SubscriptionLimitField
        label="Study Creation Limit"
        usedLabel="Studies Created"
        currentLabel="Current Allowed Studies"
        updatedLabel="Updated Allowed Studies"
        used={user.createdStudies}
        currentAllowed={user.allowedStudies}
        value={values.allowedStudies}
        onChange={(value) => onChange("allowedStudies", value)}
        onSubmit={onSubmit}
        showDivider
      />
      <SubscriptionLimitField
        label="Question Generation Limit"
        usedLabel="Questions Created"
        currentLabel="Current Allowed Questions"
        updatedLabel="Updated Allowed Questions"
        used={user.createdQuestions}
        currentAllowed={user.allowedQuestions}
        value={values.allowedQuestions}
        onChange={(value) => onChange("allowedQuestions", value)}
        onSubmit={onSubmit}
        showDivider
      />
    </div>
  </div>
);

const SubscriptionLimitField = ({
  label,
  usedLabel,
  currentLabel,
  updatedLabel,
  used,
  currentAllowed,
  value,
  onChange,
  onSubmit,
  showDivider = false,
}: {
  label: string;
  usedLabel: string;
  currentLabel: string;
  updatedLabel: string;
  used: number;
  currentAllowed: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  showDivider?: boolean;
}) => (
  <div className={cn("bg-white", showDivider && "border-t border-black/35 pt-5")}>
    <p className="text-[17px] font-bold text-login-primary">{label}</p>
    <div className="mt-3 grid items-start gap-4 md:grid-cols-3">
      <ReadOnlyLimit label={usedLabel} value={used} />
      <ReadOnlyLimit label={currentLabel} value={currentAllowed} />
      <ModalField
        label={updatedLabel}
        required
        className="flex min-w-0 flex-col gap-2 space-y-0"
      >
        <Input
          variant="modal"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          className="h-[46px]"
          onChange={(event) => onChange(normalizeNumericInput(event.target.value))}
          onPaste={(event) => {
            event.preventDefault();
            onChange(normalizeNumericInput(event.clipboardData.getData("text")));
          }}
          onKeyDown={(event) => {
            if (blockedNumericKeys.has(event.key)) {
              event.preventDefault();
              return;
            }

            handleKeyPress(event, onSubmit);
          }}
          placeholder={`Greater than ${used}`}
        />
      </ModalField>
    </div>
  </div>
);

const ReadOnlyLimit = ({ label, value }: { label: string; value: number }) => (
  <div className="flex min-w-0 flex-col gap-2">
    <span className="modal-label block">
      {label}
    </span>
    <span className="flex h-[46px] w-full items-center rounded-md border border-[var(--color-border-default)] bg-[var(--color-surface-soft)] px-3 text-sm font-bold text-[var(--color-text-strong)] opacity-90">
      {value}
    </span>
  </div>
);
