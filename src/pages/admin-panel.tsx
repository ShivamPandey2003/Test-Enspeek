import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HiSearch } from "react-icons/hi";
import {
  LuBadgeCheck,
  LuBadgeX,
  LuCrown,
  LuEllipsisVertical,
  LuEye,
  LuInfo,
  LuSparkles,
  LuUsersRound,
} from "react-icons/lu";
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
import Textarea from "../components/ui/Textarea";
import { cn, handleKeyPress } from "../utils";
import DropDown from "../components/global/DropDown";
import {
  type SupportTicket,
  useSupportTickets,
} from "../api-network/support/query";
import {
  getSupportResponseMessage,
  type ResolveSupportTicketPayload,
  useResolveSupportTicketMutation,
} from "../api-network/support/mutation";
import supportKeys from "../api-network/support/keys";

type ActionModalState = {
  user: AdminPanelUser;
  action: AdminPanelActionType;
} | null;

type SubscriptionFormState = {
  allowedPrompt: string;
  allowedStudies: string;
  allowedQuestions: string;
};

type AdminPanelTab = "users" | "admins" | "tickets";
type TicketModalState = {
  ticket: SupportTicket;
  mode: "view" | "resolve";
} | null;

const toPositiveInteger = (value: string) => {
  if (!/^\d+$/.test(value.trim())) return null;

  const parsedValue = Number(value);
  return Number.isSafeInteger(parsedValue) ? parsedValue : null;
};

const toOptionalUpdatedLimit = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) return undefined;

  return toPositiveInteger(normalizedValue);
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
  const [activeTab, setActiveTab] = useState<AdminPanelTab>("users");
  const [search, setSearch] = useState("");
  const [actionModal, setActionModal] = useState<ActionModalState>(null);
  const [ticketModal, setTicketModal] = useState<TicketModalState>(null);
  const [keywordValue, setKeywordValue] = useState("");
  const [ticketResponseSubject, setTicketResponseSubject] = useState("");
  const [ticketResponseMessage, setTicketResponseMessage] = useState("");
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionFormState>({
    allowedPrompt: "",
    allowedStudies: "",
    allowedQuestions: "",
  });
  const queryClient = useQueryClient();
  const {
    users,
    isLoading: isUsersLoading,
    error: usersError,
  } = useAdminPanelUsers(activeTab === "users");
  const {
    admins,
    isLoading: isAdminsLoading,
    error: adminsError,
  } = useAdminPanelAdmins(activeTab === "admins");
  const {
    tickets,
    isLoading: isTicketsLoading,
    error: ticketsError,
  } = useSupportTickets(activeTab === "tickets");
  const updateUserMutation = useUpdateAdminPanelUserMutation();
  const resolveTicketMutation = useResolveSupportTicketMutation();
  const isUsersTab = activeTab === "users";
  const isAdminsTab = activeTab === "admins";
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
        ticket.email,
        ticket.status,
        ticket.message,
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

  const openTicketModal = (ticket: SupportTicket, mode: "view" | "resolve") => {
    setTicketModal({ ticket, mode });
    setTicketResponseSubject(ticket.subject);
    setTicketResponseMessage(ticket.adminMessage);
  };

  const closeTicketModal = () => {
    if (resolveTicketMutation.isPending) return;

    setTicketModal(null);
    setTicketResponseSubject("");
    setTicketResponseMessage("");
  };

  const updateCachedUser = (updatedUser: AdminPanelUser) => {
    const queryKey =
      activeTab === "users" ? adminPanelKeys.users() : adminPanelKeys.admins();

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

  const handleTicketSubmit = () => {
    if (!ticketModal) return;

    const subject = ticketResponseSubject.trim();
    const message = ticketResponseMessage.trim();

    if (!subject || !message) {
      toast.warning("Please enter subject and response message.");
      return;
    }

    const payload: ResolveSupportTicketPayload = {
      ticket_number: ticketModal.ticket.ticketNumber,
      subject,
      message,
      status: "resolved",
    };

    resolveTicketMutation.mutate(payload, {
      onSuccess: (response) => {
        updateCachedTicket({
          ...ticketModal.ticket,
          subject,
          adminMessage: message,
          status: "resolved",
        });
        toast.success(
          getSupportResponseMessage(
            response,
            "Support ticket updated successfully."
          )
        );
        closeTicketModal();
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
          <AdminPanelTabs
            activeTab={activeTab}
            onChange={(tab) => {
              setActiveTab(tab);
              setSearch("");
            }}
          />
        }
        right={
          <div className="home-search-bg flex h-10 w-full items-center rounded-[18px] px-3 sm:w-72">
            <HiSearch className="home-muted h-4 w-4" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={
                isUsersTab
                  ? "Search users..."
                  : isAdminsTab
                    ? "Search admins..."
                    : "Search tickets..."
              }
              className="home-text h-full border-0 bg-transparent px-2 text-sm home-chat-placeholder focus:outline-none focus-visible:ring-0"
            />
          </div>
        }
        className="shrink-0 pb-0"
        leftClassName="items-end"
        rightClassName="pb-3"
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
            onView={(ticket) => openTicketModal(ticket, "view")}
            onResolve={(ticket) => openTicketModal(ticket, "resolve")}
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
          ticketModal?.mode === "resolve"
            ? "Resolve Support Ticket"
            : modalDefinitions.supportTicketDetails.title
        }
        icon={renderModalIcon(modalDefinitions.supportTicketDetails.icon)}
        closeDisabled={resolveTicketMutation.isPending}
        footerLeft={
          <Button
            type="button"
            variant="cancel"
            onClick={closeTicketModal}
            disabled={resolveTicketMutation.isPending}
          >
            Cancel
          </Button>
        }
        footerRight={
          <Button
            type="button"
            variant="theme"
            onClick={handleTicketSubmit}
            disabled={
              resolveTicketMutation.isPending ||
              !ticketResponseSubject.trim() ||
              !ticketResponseMessage.trim()
            }
          >
            {resolveTicketMutation.isPending ? (
              <>
                <span className="modal-spinner" />
                {modalDefinitions.supportTicketDetails.submittingLabel}
              </>
            ) : (
              modalDefinitions.supportTicketDetails.submitLabel
            )}
          </Button>
        }
      >
        {ticketModal ? (
          <TicketDetailModalBody
            ticket={ticketModal.ticket}
            subject={ticketResponseSubject}
            message={ticketResponseMessage}
            onSubjectChange={setTicketResponseSubject}
            onMessageChange={setTicketResponseMessage}
            onSubmit={handleTicketSubmit}
          />
        ) : null}
      </ModalScaffold>
    </div>
  );
}

const AdminPanelTabs = ({
  activeTab,
  onChange,
}: {
  activeTab: AdminPanelTab;
  onChange: (tab: AdminPanelTab) => void;
}) => {
  const tabs: Array<{ label: string; value: AdminPanelTab }> = [
    { label: "Users", value: "users" },
    { label: "Admins", value: "admins" },
    { label: "Tickets", value: "tickets" },
  ];

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="inline-flex items-end gap-0 leading-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onChange(tab.value)}
              className={cn(
                "min-w-24 cursor-pointer rounded-t-md border px-5 py-3 text-sm font-semibold leading-none transition-colors",
                isActive
                  ? "!border-[var(--color-brand-primary)] !bg-login-primary !font-bold !text-white shadow-sm"
                  : "border-transparent bg-transparent text-[var(--color-text-muted)] hover:bg-white/70 hover:text-login-primary"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const UserManagementTable = ({
  users,
  onAction,
  emptyMessage,
}: {
  users: AdminPanelUser[];
  onAction: (user: AdminPanelUser, action: AdminPanelActionType) => void;
  emptyMessage: string;
}) => (
  <ManagementTableShell>
    <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-sm">
      <thead className="sticky top-0 z-20">
        <tr className="home-surface">
          {[
            "S.No.",
            "Name",
            "Email",
            "Subscription",
            "Verification",
            "Status",
            "Prompt",
            "Studies",
            "Questions",
            "Created At",
            "Last Login",
            "Actions",
          ].map((heading) => (
            <TableHeading
              key={heading}
              align={heading === "Name" || heading === "Email" ? "left" : "center"}
              className={getUserTableColumnClassName(heading)}
            >
              {heading}
            </TableHeading>
          ))}
        </tr>
      </thead>
      <tbody>
        {users.length > 0 ? (
          users.map((user, index) => (
            <tr
              key={user.email}
              className="group border-b home-border-soft transition-colors hover:bg-[var(--color-brand-primary-softest)]/45"
            >
              <TableData align="center" className="font-semibold text-[var(--color-text-strong)]">
                {index + 1}.
              </TableData>
              <TableData className="min-w-[120px] max-w-[120px] font-semibold text-[var(--color-text-strong)]">
                <span className="block max-w-[120px] truncate" title={user.name}>
                  {user.name}
                </span>
              </TableData>
              <TableData className="min-w-[260px] font-medium text-[var(--color-text-strong)]">
                {user.email}
              </TableData>
              <TableData align="center">
                <StatusPill tone={user.plan === "paid" ? "paid" : "free"}>
                  {user.plan === "paid" ? "Paid" : "Free"}
                </StatusPill>
              </TableData>
              <TableData align="center">
                <StatusPill tone={user.isApproved ? "success" : "warning"}>
                  {user.isApproved ? "Verified" : "Pending"}
                </StatusPill>
              </TableData>
              <TableData align="center">
                <StatusPill tone={user.status === "active" ? "success" : "danger"}>
                  {user.status}
                </StatusPill>
              </TableData>
              <TableData align="center">
                <LimitText used={user.usedPrompt} allowed={user.allowedPrompt} />
              </TableData>
              <TableData align="center">
                <LimitText used={user.createdStudies} allowed={user.allowedStudies} />
              </TableData>
              <TableData align="center">
                <LimitText used={user.createdQuestions} allowed={user.allowedQuestions} />
              </TableData>
              <TableData align="center">{formatDateTime(user.createdAt)}</TableData>
              <TableData align="center">{formatDateTime(user.lastLogin)}</TableData>
              <TableData align="center">
                <UserRowActions user={user} onAction={onAction} />
              </TableData>
            </tr>
          ))
        ) : (
          <EmptyTableRow colSpan={12} message={emptyMessage} />
        )}
      </tbody>
    </table>
  </ManagementTableShell>
);

const AdminManagementTable = ({
  admins,
  emptyMessage,
}: {
  admins: AdminPanelUser[];
  emptyMessage: string;
}) => (
  <ManagementTableShell>
    <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
      <thead className="sticky top-0 z-20">
        <tr className="home-surface">
          {["S.No.", "Name", "Email", "Created At", "Last Login"].map((heading) => (
            <TableHeading
              key={heading}
              align={heading === "Name" || heading === "Email" ? "left" : "center"}
              className={
                heading === "Name"
                  ? "min-w-[120px] max-w-[120px]"
                  : heading === "S.No."
                  ? "min-w-[70px]"
                  : undefined
              }
            >
              {heading}
            </TableHeading>
          ))}
        </tr>
      </thead>
      <tbody>
        {admins.length > 0 ? (
          admins.map((admin, index) => (
            <tr
              key={admin.email}
              className="group border-b home-border-soft transition-colors hover:bg-[var(--color-brand-primary-softest)]/45"
            >
              <TableData align="center" className="font-semibold text-[var(--color-text-strong)]">
                {index + 1}.
              </TableData>
              <TableData className="min-w-[120px] max-w-[120px] font-semibold text-[var(--color-text-strong)]">
                <span className="block max-w-[120px] truncate" title={admin.name}>
                  {admin.name}
                </span>
              </TableData>
              <TableData className="min-w-[260px] font-medium text-[var(--color-text-strong)]">
                {admin.email}
              </TableData>
              <TableData align="center">{formatDateTime(admin.createdAt)}</TableData>
              <TableData align="center">{formatDateTime(admin.lastLogin)}</TableData>
            </tr>
          ))
        ) : (
          <EmptyTableRow colSpan={5} message={emptyMessage} />
        )}
      </tbody>
    </table>
  </ManagementTableShell>
);

const TicketManagementTable = ({
  tickets,
  onView,
  onResolve,
  emptyMessage,
}: {
  tickets: SupportTicket[];
  onView: (ticket: SupportTicket) => void;
  onResolve: (ticket: SupportTicket) => void;
  emptyMessage: string;
}) => (
  <ManagementTableShell>
    <table className="w-full min-w-[760px] border-separate border-spacing-0 text-sm">
      <thead className="sticky top-0 z-20">
        <tr className="home-surface">
          {["S.No.", "Ticket Number", "Name", "Email", "Status", "Actions"].map((heading) => (
            <TableHeading
              key={heading}
              align={heading === "Name" || heading === "Email" ? "left" : "center"}
              className={
                heading === "Email"
                  ? "min-w-[260px]"
                  : heading === "Ticket Number"
                    ? "min-w-[150px]"
                    : heading === "Name"
                      ? "min-w-[120px] max-w-[120px]"
                      : heading === "S.No."
                        ? "min-w-[70px]"
                        : undefined
              }
            >
              {heading}
            </TableHeading>
          ))}
        </tr>
      </thead>
      <tbody>
        {tickets.length > 0 ? (
          tickets.map((ticket, index) => (
            <tr
              key={ticket.id}
              title={`Open ticket ${ticket.ticketNumber}`}
              onClick={() => onView(ticket)}
              className="group cursor-pointer border-b home-border-soft transition-colors hover:bg-[var(--color-brand-primary-softest)]/45"
            >
              <TableData align="center" className="font-semibold text-[var(--color-text-strong)]">
                {index + 1}
              </TableData>
              <TableData align="center" className="font-bold text-login-primary">
                {ticket.ticketNumber}
              </TableData>
              <TableData className="min-w-[120px] max-w-[120px] font-semibold text-[var(--color-text-strong)]">
                <span className="block max-w-[120px] truncate" title={ticket.name}>
                  {ticket.name}
                </span>
              </TableData>
              <TableData className="min-w-[260px] font-medium text-[var(--color-text-strong)]">
                {ticket.email}
              </TableData>
              <TableData align="center">
                <StatusPill tone={getTicketStatusTone(ticket.status)}>
                  {ticket.status}
                </StatusPill>
              </TableData>
              <TableData align="center">
                <TicketRowActions
                  ticket={ticket}
                  onView={onView}
                  onResolve={onResolve}
                />
              </TableData>
            </tr>
          ))
        ) : (
          <EmptyTableRow colSpan={6} message={emptyMessage} />
        )}
      </tbody>
    </table>
  </ManagementTableShell>
);

const ManagementTableShell = ({ children }: { children: React.ReactNode }) => (
  <div className="home-surface home-border-soft platform-card-shadow-medium h-[calc(100vh-154px)] overflow-hidden rounded-xl border">
    <div className="h-full overflow-auto">{children}</div>
  </div>
);

const getUserTableColumnClassName = (heading: string) => {
  if (heading === "S.No.") return "min-w-[70px]";
  if (heading === "Name") return "min-w-[120px] max-w-[120px]";
  if (heading === "Email") return "min-w-[260px]";
  if (heading === "Subscription" || heading === "Verification") {
    return "min-w-[130px]";
  }
  if (heading === "Created At" || heading === "Last Login") {
    return "min-w-[120px]";
  }
  return undefined;
};

const TableHeading = ({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) => (
  <th
    className={cn(
      "whitespace-nowrap border-b border-[color:var(--color-brand-primary)] bg-login-primary px-3 py-3 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white",
      align === "center" ? "text-center" : "text-left",
      className
    )}
  >
    {children}
  </th>
);

const TableData = ({
  children,
  className,
  align = "left",
}: {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "center";
}) => (
  <td
    className={cn(
      "border-b home-border-soft px-1 py-1 home-heading",
      align === "center" ? "text-center" : "text-left",
      className
    )}
  >
    {children}
  </td>
);

const EmptyTableRow = ({ colSpan, message }: { colSpan: number; message: string }) => (
  <tr>
    <td colSpan={colSpan} className="px-6 py-16 text-center">
      <div className="flex flex-col items-center justify-center">
        <LuUsersRound className="h-9 w-9 text-login-primary" />
        <p className="home-heading mt-3 text-[16px] font-semibold">{message}</p>
      </div>
    </td>
  </tr>
);

const getTableEmptyMessage = (
  error: unknown,
  label: "users" | "admins" | "tickets"
) => {
  if (error instanceof globalThis.Error) {
    return error.message;
  }

  if (error) {
    return `Unable to load ${label}.`;
  }

  return `No ${label} found`;
};

const LimitText = ({ used, allowed }: { used: number; allowed: number }) => (
  <span className="font-bold text-[var(--color-text-strong)]">
    {used}/{allowed}
  </span>
);

const StatusPill = ({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "primary" | "success" | "danger" | "warning" | "neutral" | "paid" | "free";
}) => {
  const toneClassName = {
    primary: "bg-[var(--color-brand-primary-softest)] text-login-primary",
    paid: "bg-[var(--color-study-activated)]/10 text-[var(--color-study-activated)]",
    free: "bg-[var(--color-brand-primary-softest)] text-login-primary",
    success: "bg-[var(--color-study-activated)]/10 text-[var(--color-study-activated)]",
    danger: "bg-[var(--color-questionnaire-stop)]/10 text-[var(--color-questionnaire-stop)]",
    warning: "bg-amber-50 text-amber-700",
    neutral: "bg-[var(--color-surface-soft)] text-[var(--color-text-strong)]",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex min-w-20 justify-center rounded-full px-2.5 py-1 text-xs font-bold capitalize",
        toneClassName
      )}
    >
      {children}
    </span>
  );
};

const getTicketStatusTone = (
  status: string
): "primary" | "success" | "danger" | "warning" | "neutral" => {
  const normalizedStatus = status.toLowerCase();

  if (["resolved", "closed", "completed"].includes(normalizedStatus)) {
    return "success";
  }

  if (["rejected", "failed", "cancelled"].includes(normalizedStatus)) {
    return "danger";
  }

  if (["pending", "in progress", "open"].includes(normalizedStatus)) {
    return "warning";
  }

  return "neutral";
};

const UserRowActions = ({
  user,
  onAction,
}: {
  user: AdminPanelUser;
  onAction: (user: AdminPanelUser, action: AdminPanelActionType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const statusActionLabel =
    user.status === "active"
      ? modalDefinitions.deactivateUser.title
      : modalDefinitions.activateUser.title;
  const actions: DropdownData[] = user.isApproved
    ? [
        {
          Title: statusActionLabel,
          Icon: user.status === "active" ? LuBadgeX : LuBadgeCheck,
          onClick: () => handleAction("status"),
        },
        {
          Title: modalDefinitions.updateUserSubscription.title,
          Icon: LuSparkles,
          onClick: () => handleAction("subscription"),
        },
        ...(user.plan === "free"
          ? [
              {
                Title: modalDefinitions.changeToPaidUser.title,
                Icon: LuCrown,
                onClick: () => handleAction("plan"),
              },
            ]
          : []),
      ]
    : [
        {
          Title: modalDefinitions.verifyUser.title,
          Icon: LuBadgeCheck,
          onClick: () => handleAction("verification"),
        },
      ];

  function handleAction(action: AdminPanelActionType) {
    setIsOpen(false);
    onAction(user, action);
  }

  const updateDropdownPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dropdownWidth = 286;
    const dropdownHeight =
      dropdownRef.current?.getBoundingClientRect().height ?? 0;
    const viewportPadding = 12;
    const bottomSpace = window.innerHeight - rect.bottom;
    const shouldOpenUp = dropdownHeight > 0 && bottomSpace < dropdownHeight;
    const top =
      shouldOpenUp
        ? Math.max(viewportPadding, rect.top - dropdownHeight - 8)
        : dropdownHeight > 0
          ? Math.min(
              rect.bottom + 8,
              window.innerHeight - dropdownHeight - viewportPadding
            )
          : rect.bottom + 8;
    const left = Math.min(
      window.innerWidth - dropdownWidth - viewportPadding,
      Math.max(viewportPadding, rect.right - dropdownWidth)
    );

    setDropdownPosition({ top, left });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, actions.length]);

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        tooltip="User actions"
        onClick={() => {
          updateDropdownPosition();
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        <LuEllipsisVertical className="h-4 w-4" />
      </Button>
      {isOpen
        ? createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-[300] w-[286px]"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <DropDown
                Data={actions}
                className="relative right-auto z-[300] mt-0 w-full"
              />
            </div>,
            document.body
          )
        : null}
    </>
  );
};

const TicketRowActions = ({
  ticket,
  onView,
  onResolve,
}: {
  ticket: SupportTicket;
  onView: (ticket: SupportTicket) => void;
  onResolve: (ticket: SupportTicket) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const actions: DropdownData[] = [
    {
      Title: "View Ticket",
      Icon: LuEye,
      onClick: () => {
        setIsOpen(false);
        onView(ticket);
      },
    },
    {
      Title: "Resolve",
      Icon: LuBadgeCheck,
      onClick: () => {
        setIsOpen(false);
        onResolve(ticket);
      },
    },
  ];

  const updateDropdownPosition = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const dropdownWidth = 220;
    const dropdownHeight =
      dropdownRef.current?.getBoundingClientRect().height ?? 0;
    const viewportPadding = 12;
    const bottomSpace = window.innerHeight - rect.bottom;
    const shouldOpenUp = dropdownHeight > 0 && bottomSpace < dropdownHeight;
    const top =
      shouldOpenUp
        ? Math.max(viewportPadding, rect.top - dropdownHeight - 8)
        : dropdownHeight > 0
          ? Math.min(
              rect.bottom + 8,
              window.innerHeight - dropdownHeight - viewportPadding
            )
          : rect.bottom + 8;
    const left = Math.min(
      window.innerWidth - dropdownWidth - viewportPadding,
      Math.max(viewportPadding, rect.right - dropdownWidth)
    );

    setDropdownPosition({ top, left });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-full"
        tooltip="Ticket actions"
        onClick={() => {
          updateDropdownPosition();
          setIsOpen((currentValue) => !currentValue);
        }}
      >
        <LuEllipsisVertical className="h-4 w-4" />
      </Button>
      {isOpen
        ? createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-[300] w-[220px]"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
              }}
            >
              <DropDown
                Data={actions}
                className="relative right-auto z-[300] mt-0 w-full"
              />
            </div>,
            document.body
          )
        : null}
    </div>
  );
};

const formatDateTime = (value: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};

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
  const confirmationMessage =
    action === "plan"
      ? {
          targetPlan: user.plan === "free" ? "Paid" : "Free",
        }
      : null;

  return (
    <div className="space-y-4">
      <p className="theme-text-default text-[15px] leading-6">
        {confirmationMessage ? (
          <>
            Are you sure you want to change{" "}
            <span className="font-bold text-login-primary">{user.name}</span>{" "}
            to a{" "}
            <span className="font-bold text-login-primary">
              {confirmationMessage.targetPlan}
            </span>{" "}
            user?
          </>
        ) : (
          <>
            Are you sure you want to {actionText}{" "}
            <span className="font-semibold text-login-primary">{user.name}</span>?
          </>
        )}
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

const TicketDetailModalBody = ({
  ticket,
  subject,
  message,
  onSubjectChange,
  onMessageChange,
  onSubmit,
}: {
  ticket: SupportTicket;
  subject: string;
  message: string;
  onSubjectChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: () => void;
}) => (
  <div className="space-y-5">
    <div className="rounded-xl border border-[color:var(--color-brand-primary)]/16 bg-[var(--color-brand-primary-softest)]/35 p-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <TicketMetaItem label="Ticket Number" value={ticket.ticketNumber} />
        <TicketMetaItem label="Email" value={ticket.email} />
        <TicketMetaItem label="Status" value={ticket.status} />
      </div>
      {ticket.assistanceTypes.length > 0 ? (
        <div className="mt-4">
          <p className="modal-label mb-2">Requested Assistance</p>
          <div className="flex flex-wrap gap-2">
            {ticket.assistanceTypes.map((item) => (
              <span
                key={item}
                className="rounded-full bg-white px-3 py-1 text-xs font-bold text-login-primary shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div className="mt-4">
        <p className="modal-label mb-2">User Request</p>
        <div className="min-h-[100px] rounded-lg border border-[color:var(--color-brand-primary)]/14 bg-white p-3 text-sm leading-6 text-[var(--color-text-strong)]">
          {ticket.message || "No request details provided."}
        </div>
      </div>
    </div>

    <div className="grid gap-4">
      <ModalField label="Response Subject" required>
        <Input
          variant="modal"
          value={subject}
          onChange={(event) => onSubjectChange(event.target.value)}
          onKeyDown={(event) => handleKeyPress(event, onSubmit)}
          placeholder="Enter response subject"
        />
      </ModalField>
      <ModalField label="Response Message" required>
        <Textarea
          variant="modal"
          value={message}
          onChange={(event) => onMessageChange(event.target.value)}
          placeholder="Write the response that will be sent to the user."
          className="min-h-[150px] resize-y"
        />
      </ModalField>
    </div>
  </div>
);

const TicketMetaItem = ({ label, value }: { label: string; value: string }) => (
  <div className="min-w-0">
    <p className="modal-label">{label}</p>
    <p className="mt-1 truncate text-sm font-bold text-[var(--color-text-strong)]" title={value}>
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
