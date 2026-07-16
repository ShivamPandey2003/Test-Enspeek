import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HiSearch } from "react-icons/hi";
import { LuBadgeCheck, LuInfo, LuX } from "react-icons/lu";
import {
  type AdminPanelUser,
  useAdminPanelAdmins,
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
import type { AdminPanelActionType } from "../components/common/UserManagement/UserCard";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import ModalField from "../components/ui/modal/ModalField";
import ModalInfoBlock from "../components/ui/modal/ModalInfoBlock";
import ModalScaffold from "../components/ui/modal/ModalScaffold";
import PageContentShell from "../components/ui/PageContentShell";
import PageSubheader from "../components/ui/PageSubheader";
import { cn, handleKeyPress } from "../utils";
import {
  type SupportTicket,
  useSupportTickets,
} from "../api-network/support/query";
import {
  getSupportResponseMessage,
  useUpdateTicketStatusMutation,
} from "../api-network/support/mutation";
import supportKeys from "../api-network/support/keys";
import {
  type AdminPanelTabId,
  getUserAccessConfig,
} from "../config/userAccess";
import type { RootState } from "../store/store";
import {
  type SubscriptionFormState,
  blockedNumericKeys,
  formatStatusLabel,
  getTableEmptyMessage,
  getTicketStatusTone,
  getUserActionDefinitionKey,
  isTicketResolvedStatus,
  normalizeNumericInput,
  toOptionalUpdatedLimit,
} from "./adminPanel/adminPanelUtils";
import { useAdminPanelSearchLayout } from "./adminPanel/useAdminPanelSearchLayout";
import {
  AdminManagementTable,
  AdminPanelTabs,
  StatusPill,
  TicketManagementTable,
  UserManagementTable,
} from "./adminPanel/AdminPanelTables";

type ActionModalState = {
  user: AdminPanelUser;
  action: AdminPanelActionType;
} | null;

type AdminPanelTab = AdminPanelTabId;
type TicketModalState = {
  ticket: SupportTicket;
} | null;

type TicketStatusModalState = {
  ticket: SupportTicket;
  nextIsResolved: boolean;
} | null;

export default function AdminPanelPage() {
  const [activeTab, setActiveTab] = useState<AdminPanelTab>("users");
  const [search, setSearch] = useState("");
  const [actionModal, setActionModal] = useState<ActionModalState>(null);
  const [ticketModal, setTicketModal] = useState<TicketModalState>(null);
  const [ticketStatusModal, setTicketStatusModal] =
    useState<TicketStatusModalState>(null);
  const [ticketStatusKeywordValue, setTicketStatusKeywordValue] = useState("");
  const [keywordValue, setKeywordValue] = useState("");
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionFormState>({
    allowedPrompt: "",
    allowedStudies: "",
    allowedQuestions: "",
  });
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user);
  const userAccess = getUserAccessConfig(user.loginType, user.userType);
  const visibleTabs = userAccess.adminPanelTabs;
  const firstVisibleTab = visibleTabs[0] ?? "users";
  const effectiveActiveTab = visibleTabs.includes(activeTab)
    ? activeTab
    : firstVisibleTab;
  const canViewUsersTab = visibleTabs.includes("users");
  const canViewAdminsTab = visibleTabs.includes("admins");
  const canViewTicketsTab = visibleTabs.includes("tickets");
  const {
    isSearchOpen,
    setIsSearchOpen,
    isCompactSearch,
    subheaderContentRef,
    tabsRef,
    searchWidthRef,
  } = useAdminPanelSearchLayout(visibleTabs);
  const {
    users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useAdminPanelUsers(effectiveActiveTab === "users" && canViewUsersTab);
  const {
    admins,
    isLoading: isAdminsLoading,
    error: adminsError,
  } = useAdminPanelAdmins(effectiveActiveTab === "admins" && canViewAdminsTab);
  const {
    tickets,
    isLoading: isTicketsLoading,
    error: ticketsError,
  } = useSupportTickets(effectiveActiveTab === "tickets" && canViewTicketsTab);
  const updateUserMutation = useUpdateAdminPanelUserMutation();
  const updateTicketStatusMutation = useUpdateTicketStatusMutation();
  const isUsersTab = effectiveActiveTab === "users";
  const isAdminsTab = effectiveActiveTab === "admins";
  const activeError = isUsersTab
    ? usersError
    : isAdminsTab
      ? adminsError
      : ticketsError;
  const isActiveListLoading = isUsersTab
    ? isUsersLoading
    : isAdminsTab
      ? isAdminsLoading
      : isTicketsLoading;
  const searchPlaceholder = isUsersTab
    ? "Search users..."
    : isAdminsTab
      ? "Search admins..."
      : "Search tickets...";

  useEffect(() => {
    if (visibleTabs.length > 0 && !visibleTabs.includes(activeTab)) {
      setActiveTab(firstVisibleTab);
      setSearch("");
    }
  }, [activeTab, firstVisibleTab, visibleTabs]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return users;

    return users.filter((user) =>
      [
        user.name,
        user.email,
        user.plan,
        user.status,
        user.isApproved ? "verified" : "pending",
      ].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [search, users]);

  const filteredAdmins = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return admins;

    return admins.filter((admin) =>
      [admin.name, admin.email, admin.createdAt, admin.lastLogin].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [admins, search]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return tickets;

    return tickets.filter((ticket) =>
      [
        ticket.ticketNumber,
        ticket.name,
        ticket.email,
        ticket.status,
        ticket.assistanceTypeText,
        ticket.message,
        ticket.createdAt,
        ticket.updatedAt,
        ticket.assistanceTypes.join(" "),
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [search, tickets]);

  const openActionModal = (
    user: AdminPanelUser,
    action: AdminPanelActionType
  ) => {
    setActionModal({ user, action });
    setKeywordValue("");
    setSubscriptionForm({
      allowedPrompt: "",
      allowedStudies: "",
      allowedQuestions: "",
    });
  };

  const closeActionModal = () => {
    if (updateUserMutation.isPending) return;

    setActionModal(null);
    setKeywordValue("");
  };

  const openTicketModal = (ticket: SupportTicket) => {
    setTicketModal({ ticket });
  };

  const closeTicketModal = () => {
    setTicketModal(null);
  };

  const openTicketStatusModal = (ticket: SupportTicket) => {
    setTicketStatusModal({
      ticket,
      nextIsResolved: !isTicketResolvedStatus(ticket.status),
    });
    setTicketStatusKeywordValue("");
  };

  const closeTicketStatusModal = () => {
    if (updateTicketStatusMutation.isPending) return;

    setTicketStatusModal(null);
    setTicketStatusKeywordValue("");
  };

  const updateCachedUser = (updatedUser: AdminPanelUser) => {
    const queryKey =
      effectiveActiveTab === "users" ? adminPanelKeys.users() : adminPanelKeys.admins();

    queryClient.setQueryData<AdminPanelUser[]>(
      queryKey,
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

  const updateCachedTicket = (updatedTicket: SupportTicket) => {
    queryClient.setQueryData<SupportTicket[]>(
      supportKeys.tickets(),
      (existingTickets = []) =>
        existingTickets.map((ticket) =>
          ticket.id === updatedTicket.id ? updatedTicket : ticket
        )
    );
  };

  const handleTicketStatusSubmit = () => {
    if (!ticketStatusModal) return;

    const definition = modalDefinitions.updateTicketStatus;
    const keyword = definition.confirmationKeyword ?? "confirm";

    if (ticketStatusKeywordValue.trim().toLowerCase() !== keyword) {
      toast.warning(`Please type "${keyword}" to confirm.`);
      return;
    }

    const nextStatus = ticketStatusModal.nextIsResolved ? "resolved" : "open";

    updateTicketStatusMutation.mutate(
      {
        apiToken: user.apiToken,
        is_resolve: ticketStatusModal.nextIsResolved ? 1 : 0,
        ticket_id: ticketStatusModal.ticket.ticketNumber,
      },
      {
        onSuccess: (response) => {
          updateCachedTicket({
            ...ticketStatusModal.ticket,
            status: nextStatus,
          });
          toast.success(
            getSupportResponseMessage(
              response,
              `Ticket marked as ${formatStatusLabel(nextStatus)}.`
            )
          );
          setTicketStatusModal(null);
          setTicketStatusKeywordValue("");
        },
      }
    );
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
    const allowedPrompt = toOptionalUpdatedLimit(subscriptionForm.allowedPrompt);
    const allowedStudies = toOptionalUpdatedLimit(subscriptionForm.allowedStudies);
    const allowedQuestions = toOptionalUpdatedLimit(subscriptionForm.allowedQuestions);

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

    if (allowedPrompt !== undefined && allowedPrompt <= user.usedPrompt) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.promptGreaterThanUsed ??
          "Updated prompt limit must be greater than prompts already used."
      );
      return;
    }

    if (allowedStudies !== undefined && allowedStudies <= user.createdStudies) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.studiesGreaterThanUsed ??
          "Updated study creation limit must be greater than studies already created."
      );
      return;
    }

    if (allowedQuestions !== undefined && allowedQuestions <= user.createdQuestions) {
      toast.warning(
        modalDefinitions.updateUserSubscription.validationMessages?.questionsGreaterThanUsed ??
          "Updated question generation limit must be greater than questions already generated."
      );
      return;
    }

    if (
      (allowedPrompt === undefined || allowedPrompt === user.allowedPrompt) &&
      (allowedStudies === undefined || allowedStudies === user.allowedStudies) &&
      (allowedQuestions === undefined || allowedQuestions === user.allowedQuestions)
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

    if (allowedPrompt !== undefined && allowedPrompt !== user.allowedPrompt) {
      payload.allowed_prompt = allowedPrompt;
      updatedUser.allowedPrompt = allowedPrompt;
    }

    if (allowedStudies !== undefined && allowedStudies !== user.allowedStudies) {
      payload.allowedstudies = allowedStudies;
      updatedUser.allowedStudies = allowedStudies;
    }

    if (allowedQuestions !== undefined && allowedQuestions !== user.allowedQuestions) {
      payload.allowed_questions = allowedQuestions;
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
  const subscriptionPromptLimit = toOptionalUpdatedLimit(subscriptionForm.allowedPrompt);
  const subscriptionStudyLimit = toOptionalUpdatedLimit(subscriptionForm.allowedStudies);
  const subscriptionQuestionLimit = toOptionalUpdatedLimit(subscriptionForm.allowedQuestions);
  const isSubscriptionFormValid =
    selectedAction !== "subscription" ||
    Boolean(
      selectedUser &&
      subscriptionPromptLimit !== null &&
      subscriptionStudyLimit !== null &&
      subscriptionQuestionLimit !== null &&
      (subscriptionPromptLimit === undefined || subscriptionPromptLimit > selectedUser.usedPrompt) &&
      (subscriptionStudyLimit === undefined || subscriptionStudyLimit > selectedUser.createdStudies) &&
      (subscriptionQuestionLimit === undefined || subscriptionQuestionLimit > selectedUser.createdQuestions) &&
      (
        (subscriptionPromptLimit !== undefined && subscriptionPromptLimit !== selectedUser.allowedPrompt) ||
        (subscriptionStudyLimit !== undefined && subscriptionStudyLimit !== selectedUser.allowedStudies) ||
        (subscriptionQuestionLimit !== undefined && subscriptionQuestionLimit !== selectedUser.allowedQuestions)
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
          <div
            ref={subheaderContentRef}
            className="relative flex min-h-10 w-full min-w-0 items-center gap-2"
          >
            <div ref={searchWidthRef} aria-hidden="true" className="pointer-events-none absolute invisible h-10 w-72" />
            {isSearchOpen ? (
              <>
                <div className="home-search-bg flex h-10 min-w-0 flex-1 items-center rounded-[18px] px-3">
                  <HiSearch className="home-muted h-4 w-4" />
                  <Input
                    autoFocus
                    aria-label={searchPlaceholder}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
                  />
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  tooltip="Close search"
                  aria-label="Close search"
                  className="h-10 w-10 shrink-0 border-transparent bg-transparent shadow-none"
                  onClick={() => {
                    setSearch("");
                    setIsSearchOpen(false);
                  }}
                >
                  <LuX className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div ref={tabsRef} className="min-w-0 overflow-hidden">
                  <AdminPanelTabs
                    activeTab={effectiveActiveTab}
                    tabs={visibleTabs}
                    onChange={(tab) => {
                      setActiveTab(tab);
                      setSearch("");
                    }}
                  />
                </div>
                {isCompactSearch ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    tooltip={searchPlaceholder}
                    aria-label={searchPlaceholder}
                    className="ml-auto h-10 w-10 shrink-0 border-transparent bg-transparent shadow-none"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <HiSearch className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="home-search-bg ml-auto flex h-10 w-72 shrink-0 items-center rounded-[18px] px-3">
                    <HiSearch className="home-muted h-4 w-4" />
                    <Input
                      aria-label={searchPlaceholder}
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      placeholder={searchPlaceholder}
                      className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        }
        className="shrink-0 pb-0"
        contentClassName="flex-row"
        leftClassName="w-full min-w-0 items-end pb-3"
      />

      <PageContentShell className="overflow-hidden pb-3 pt-2 md:pb-4 md:pt-3">
        {isActiveListLoading ? (
          <div className="flex min-h-[260px] items-center justify-center">
            <div className="home-muted text-sm font-semibold">
              Loading {isUsersTab ? "users" : isAdminsTab ? "admins" : "tickets"}...
            </div>
          </div>
        ) : isUsersTab ? (
          <UserManagementTable
            users={activeError ? [] : filteredUsers}
            onAction={openActionModal}
            emptyMessage={getTableEmptyMessage(activeError, "users")}
          />
        ) : isAdminsTab ? (
          <AdminManagementTable
            admins={activeError ? [] : filteredAdmins}
            emptyMessage={getTableEmptyMessage(activeError, "admins")}
          />
        ) : (
          <TicketManagementTable
            tickets={activeError ? [] : filteredTickets}
            onView={openTicketModal}
            onStatusChange={openTicketStatusModal}
            emptyMessage={getTableEmptyMessage(activeError, "tickets")}
          />
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
            ? (
                <span className="inline-flex items-start gap-2">
                  <LuInfo className="mt-0.5 h-4 w-4 shrink-0 text-login-primary" />
                  <span>{selectedDefinition?.description}</span>
                </span>
              )
            : undefined
        }
        closeDisabled={updateUserMutation.isPending}
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            onClick={closeActionModal}
            disabled={updateUserMutation.isPending}
          >
            Cancel
          </Button>
        }
        footerRight={
          <Button
            type="button"
            variant="theme"
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

      <ModalScaffold
        isOpen={Boolean(ticketModal)}
        onClose={closeTicketModal}
        className={modalDefinitions.supportTicketDetails.maxWidthClass}
        title={
          ticketModal
            ? (
                <span>
                  {modalDefinitions.supportTicketDetails.title} -{" "}
                  {ticketModal.ticket.ticketNumber}
                </span>
              )
            : modalDefinitions.supportTicketDetails.title
        }
        icon={renderModalIcon(modalDefinitions.supportTicketDetails.icon)}
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            onClick={closeTicketModal}
          >
            Cancel
          </Button>
        }
      >
        {ticketModal ? (
          <TicketDetailModalBody
            ticket={ticketModal.ticket}
          />
        ) : null}
      </ModalScaffold>
      <ModalScaffold
        isOpen={Boolean(ticketStatusModal)}
        onClose={closeTicketStatusModal}
        className={modalDefinitions.updateTicketStatus.maxWidthClass}
        title={
          ticketStatusModal?.nextIsResolved
            ? "Resolve Support Ticket"
            : "Unresolve Support Ticket"
        }
        icon={renderModalIcon(modalDefinitions.updateTicketStatus.icon)}
        closeDisabled={updateTicketStatusMutation.isPending}
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            onClick={closeTicketStatusModal}
            disabled={updateTicketStatusMutation.isPending}
          >
            {modalDefinitions.updateTicketStatus.cancelLabel ?? "Cancel"}
          </Button>
        }
        footerRight={
          <Button
            type="button"
            variant="theme"
            onClick={handleTicketStatusSubmit}
            disabled={
              updateTicketStatusMutation.isPending ||
              ticketStatusKeywordValue.trim().toLowerCase() !==
                (modalDefinitions.updateTicketStatus.confirmationKeyword ?? "confirm")
            }
          >
            {updateTicketStatusMutation.isPending ? (
              <>
                <span className="modal-spinner" />
                {modalDefinitions.updateTicketStatus.submittingLabel ??
                  "Submitting..."}
              </>
            ) : (
              modalDefinitions.updateTicketStatus.submitLabel ?? "Submit"
            )}
          </Button>
        }
      >
        {ticketStatusModal ? (
          <TicketStatusModalBody
            ticket={ticketStatusModal.ticket}
            nextIsResolved={ticketStatusModal.nextIsResolved}
            keyword={
              modalDefinitions.updateTicketStatus.confirmationKeyword ??
              "confirm"
            }
            value={ticketStatusKeywordValue}
            onValueChange={setTicketStatusKeywordValue}
            onSubmit={handleTicketStatusSubmit}
          />
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
  const isDeactivateUserAction = definition.id === "deactivateUser";
  const isVerifyUserAction = definition.id === "verifyUser";
  const confirmationMessage =
    action === "plan"
      ? {
          targetPlan: user.plan === "free" ? "Premium" : "Free",
        }
      : null;

  return (
    <div className="space-y-4">
      <p className="theme-text-default text-[15px] leading-6">
        {confirmationMessage ? (
          <>
            Please confirm that you want to change{" "}
            <span className="font-bold text-login-primary">{user.name}'s</span>{" "}
            account to a{" "}
            <span className="font-bold text-login-primary">
              {confirmationMessage.targetPlan}
            </span>{" "}
            user.
          </>
        ) : (
          isDeactivateUserAction ? (
            <>
              Please confirm that you want to deactivate{" "}
              <span className="font-semibold text-login-primary">{user.name}</span>
              's user account.
            </>
          ) : isVerifyUserAction ? (
            <>
              Please confirm that you want to verify{" "}
              <span className="font-semibold text-login-primary">{user.name}</span>
              's user account.
            </>
          ) : (
            <>
              Are you sure you want to {actionText}{" "}
              <span className="font-semibold text-login-primary">{user.name}</span>?
            </>
          )
        )}
      </p>
      <ModalInfoBlock icon={<LuBadgeCheck className="h-4 w-4 text-login-primary" />}>
        Type <span className="font-semibold text-login-primary">"{keyword}"</span>{" "}
        to submit this request
      </ModalInfoBlock>
      <ModalField label="Confirmation" required>
        <Input
          variant="modal"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => handleKeyPress(event, onSubmit)}
          placeholder={keyword}
        />
      </ModalField>
    </div>
  );
};

const TicketDetailModalBody = ({
  ticket,
}: {
  ticket: SupportTicket;
}) => (
  <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="questionnaire-heading text-[21px] font-bold tracking-[-0.01em]">
          Requested Assistance
        </h3>
        <p className="mt-1 text-sm text-[var(--color-text-muted)]">
          Review the client request and current ticket details.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[var(--color-text-muted)]">
          Status:
        </span>
        <StatusPill tone={getTicketStatusTone(ticket.status)}>
          {formatStatusLabel(ticket.status)}
        </StatusPill>
      </div>
    </div>

    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <TicketMetaCard label="Name" value={ticket.name} />
        <TicketMetaCard label="Email" value={ticket.email} />
      </div>

      <div className="mt-4 rounded-lg border border-gray-200 bg-[var(--color-surface-soft)] p-4">
        <p className="modal-label mb-1">Type of Request</p>
        <p className="text-sm font-semibold text-[var(--color-text-strong)]">
          {ticket.assistanceTypeText || "-"}
        </p>
      </div>
    </div>

    <div>
      <h3 className="questionnaire-heading text-[18px] font-bold tracking-[-0.01em]">
        Description
      </h3>
      <div className="mt-3 max-h-[220px] overflow-y-auto rounded-xl border border-gray-200 bg-[var(--color-surface-soft)] p-4 text-sm leading-6 text-[var(--color-text-strong)]">
        {ticket.message || "No request details provided."}
      </div>
    </div>
  </div>
);

const TicketStatusModalBody = ({
  ticket,
  nextIsResolved,
  keyword,
  value,
  onValueChange,
  onSubmit,
}: {
  ticket: SupportTicket;
  nextIsResolved: boolean;
  keyword: string;
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}) => {
  const actionText = nextIsResolved ? "resolve" : "unresolve";

  return (
    <div className="space-y-4">
      <p className="theme-text-default text-[15px] leading-6">
        Please confirm that you want to {actionText} ticket{" "}
        <span className="font-semibold text-login-primary">
          {ticket.ticketNumber}
        </span>
        .
      </p>
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-brand-primary)]/16 bg-[var(--color-brand-primary-softest)]/45 px-4 py-3 text-sm leading-5 text-[var(--color-text-strong)]">
        <LuInfo className="h-4 w-4 shrink-0 text-login-primary" />
        <span>
          Type{" "}
          <span className="font-semibold text-login-primary">"{keyword}"</span>{" "}
          to submit this request
        </span>
      </div>
      <ModalField label="Confirmation" required>
        <Input
          variant="modal"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          onKeyDown={(event) => handleKeyPress(event, onSubmit)}
          placeholder={keyword}
        />
      </ModalField>
    </div>
  );
};

const TicketMetaCard = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0 rounded-lg border border-gray-200 bg-[var(--color-surface-soft)] px-4 py-3">
    <p className="modal-label mb-1">{label}</p>
    <p className="truncate text-sm font-semibold text-[var(--color-text-strong)]" title={value}>
      {value || "-"}
    </p>
  </div>
);

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
    <div className="mb-2 hidden grid-cols-[minmax(220px,1fr)_130px_160px] items-center gap-4 px-1 md:grid">
      <div />
      <p className="modal-label text-center">Used/Current</p>
      <p className="modal-label text-center">
        New Limit <span className="text-red-500">*</span>
      </p>
    </div>
    <div className="flex flex-col gap-5">
      <SubscriptionLimitField
        label="Prompt Limit"
        used={user.usedPrompt}
        currentAllowed={user.allowedPrompt}
        value={values.allowedPrompt}
        onChange={(value) => onChange("allowedPrompt", value)}
        onSubmit={onSubmit}
      />
      <SubscriptionLimitField
        label="Study Creation Limit"
        used={user.createdStudies}
        currentAllowed={user.allowedStudies}
        value={values.allowedStudies}
        onChange={(value) => onChange("allowedStudies", value)}
        onSubmit={onSubmit}
        showDivider
      />
      <SubscriptionLimitField
        label="Question Addition Limit"
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
  used,
  currentAllowed,
  value,
  onChange,
  onSubmit,
  showDivider = false,
}: {
  label: string;
  used: number;
  currentAllowed: number;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  showDivider?: boolean;
}) => (
  <div className={cn("bg-white", showDivider && "border-t border-black/35 pt-5")}>
    <div className="grid items-start gap-4 px-1 md:grid-cols-[minmax(220px,1fr)_130px_160px] md:items-center">
      <div className="min-w-0">
        <p className="text-[17px] font-bold text-login-primary">{label}</p>
      </div>
      <LimitValue mobileLabel="Used/Current" value={`${used}/${currentAllowed}`} />
      <div className="flex min-w-0 flex-col gap-2">
        <span className="modal-label md:hidden">
          New Limit <span className="text-red-500">*</span>
        </span>
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
          aria-label={`New limit for ${label}`}
          placeholder="Add limit"
        />
      </div>
    </div>
  </div>
);

const LimitValue = ({
  mobileLabel,
  value,
}: {
  mobileLabel: string;
  value: number | string;
}) => (
  <div className="flex items-center justify-between gap-3 rounded-md bg-[var(--color-surface-soft)] px-3 py-2 text-sm font-bold text-[var(--color-text-strong)] md:justify-center md:bg-transparent md:px-0 md:py-0">
    <span className="modal-label md:hidden">{mobileLabel}</span>
    <span className="text-login-primary">{value}</span>
  </div>
);
