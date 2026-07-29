import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  LuBadgeCheck,
  LuBadgeX,
  LuCrown,
  LuEllipsisVertical,
  LuEye,
  LuSparkles,
  LuUsersRound,
} from "react-icons/lu";
import Button from "../../components/ui/Button";
import DropDown from "../../components/global/DropDown";
import { cn } from "../../utils";
import { modalDefinitions } from "../../config/modalDefinitions";
import { ADMIN_PANEL_TAB_LABELS, type AdminPanelTabId } from "../../config/userAccess";
import type { AdminPanelUser } from "../../api-network/admin-panel/query";
import type { AdminPanelActionType } from "../../components/common/UserManagement/UserCard";
import type { SupportTicket } from "../../api-network/support/query";
import {
  formatStatusLabel,
  getTicketStatusTone,
  isTicketResolvedStatus,
} from "./adminPanelUtils";

type AdminPanelTab = AdminPanelTabId;

export const AdminPanelTabs = ({
  activeTab,
  tabs,
  onChange,
}: {
  activeTab: AdminPanelTab;
  tabs: AdminPanelTab[];
  onChange: (tab: AdminPanelTab) => void;
}) => {
  const tabItems = tabs.map((value) => ({
    label: ADMIN_PANEL_TAB_LABELS[value],
    value,
  }));

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className="inline-flex items-end gap-0 leading-none">
        {tabItems.map((tab) => {
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

export const UserManagementTable = ({
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
              align={["Name", "Email"].includes(heading) ? "left" : "center"}
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
                  {user.plan === "paid" ? "Premium" : "Free"}
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

export const AdminManagementTable = ({
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
              align={["Name", "Email"].includes(heading) ? "left" : "center"}
              className={
                heading === "Name"
                  ? "min-w-[120px] max-w-[120px]"
                  : heading === "S.No."
                  ? "w-12 min-w-12"
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

export const TicketManagementTable = ({
  tickets,
  onView,
  onStatusChange,
  emptyMessage,
}: {
  tickets: SupportTicket[];
  onView: (ticket: SupportTicket) => void;
  onStatusChange: (ticket: SupportTicket) => void;
  emptyMessage: string;
}) => (
  <ManagementTableShell>
    <table className="w-full min-w-[1180px] border-separate border-spacing-0 text-sm">
      <thead className="sticky top-0 z-20">
        <tr className="home-surface">
          {[
            "S.No.",
            "Ticket",
            "Name",
            "Email",
            "Type Of Request",
            "Description",
            "Status",
            "Created At",
            "Updated At",
            "Actions",
          ].map((heading) => (
            <TableHeading
              key={heading}
              align={
                ["Name", "Email", "Type Of Request", "Description"].includes(heading)
                  ? "left"
                  : "center"
              }
              className={
                heading === "Email"
                  ? "min-w-[260px]"
                  : heading === "Ticket"
                    ? "min-w-[150px]"
                    : heading === "Name"
                      ? "min-w-[120px] max-w-[120px]"
                      : heading === "Type Of Request"
                        ? "min-w-[190px] max-w-[190px]"
                        : heading === "Description"
                          ? "min-w-[260px] max-w-[260px]"
                          : heading === "Created At" || heading === "Updated At"
                            ? "min-w-[120px]"
                            : heading === "S.No."
                              ? "w-12 min-w-12"
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
              className="group border-b home-border-soft transition-colors hover:bg-[var(--color-brand-primary-softest)]/45"
            >
              <TableData align="center" className="font-semibold text-[var(--color-text-strong)]">
                {index + 1}.
              </TableData>
              <TableData align="center" className="whitespace-nowrap font-bold text-login-primary">
                <button
                  type="button"
                  className="cursor-pointer whitespace-nowrap rounded px-1.5 py-1 font-bold text-login-primary transition-colors hover:bg-[var(--color-brand-primary-softest)]"
                  onClick={() => onView(ticket)}
                  title={`View ticket ${ticket.ticketNumber}`}
                >
                  {ticket.ticketNumber}
                </button>
              </TableData>
              <TableData className="min-w-[120px] max-w-[120px] font-semibold text-[var(--color-text-strong)]">
                <span className="block max-w-[120px] truncate" title={ticket.name}>
                  {ticket.name}
                </span>
              </TableData>
              <TableData className="min-w-[260px] font-medium text-[var(--color-text-strong)]">
                {ticket.email}
              </TableData>
              <TableData className="min-w-[190px] max-w-[190px] font-medium text-[var(--color-text-strong)]">
                <TwoLineText
                  value={ticket.assistanceTypeText}
                  title={ticket.assistanceTypeText}
                />
              </TableData>
              <TableData className="min-w-[260px] max-w-[260px] font-medium text-[var(--color-text-strong)]">
                <TwoLineText value={ticket.message} title={ticket.message} />
              </TableData>
              <TableData align="center">
                <StatusPill tone={getTicketStatusTone(ticket.status)}>
                  {formatStatusLabel(ticket.status)}
                </StatusPill>
              </TableData>
              <TableData align="center">{formatDateTime(ticket.createdAt)}</TableData>
              <TableData align="center">{formatDateTime(ticket.updatedAt)}</TableData>
              <TableData align="center">
                <TicketRowActions
                  ticket={ticket}
                  onView={onView}
                  onStatusChange={onStatusChange}
                />
              </TableData>
            </tr>
          ))
        ) : (
          <EmptyTableRow colSpan={10} message={emptyMessage} />
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
  if (heading === "S.No.") return "w-12 min-w-12";
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
      "whitespace-nowrap border-b border-[color:var(--color-brand-primary)] bg-login-primary px-2 py-3 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white",
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
      "border-b home-border-soft px-2 py-3 home-heading",
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

const LimitText = ({ used, allowed }: { used: number; allowed: number }) => (
  <span className="font-bold text-[var(--color-text-strong)]">
    {used}/{allowed}
  </span>
);

const TwoLineText = ({ value, title }: { value: string; title: string }) => (
  <span
    className="block overflow-hidden leading-5"
    title={title}
    style={{
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    }}
  >
    {value}
  </span>
);

export const StatusPill = ({
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

const useRowActionDropdown = ({
  isOpen,
  dropdownWidth,
  onClose,
}: {
  isOpen: boolean;
  dropdownWidth: number;
  onClose: () => void;
}) => {
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const updateDropdownPosition = useCallback(() => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

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
  }, [dropdownWidth]);

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

      onClose();
    };

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen, onClose, updateDropdownPosition]);

  return {
    buttonRef,
    dropdownRef,
    dropdownPosition,
    updateDropdownPosition,
  };
};

const UserRowActions = ({
  user,
  onAction,
}: {
  user: AdminPanelUser;
  onAction: (user: AdminPanelUser, action: AdminPanelActionType) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const {
    buttonRef,
    dropdownRef,
    dropdownPosition,
    updateDropdownPosition,
  } = useRowActionDropdown({
    isOpen,
    dropdownWidth: 286,
    onClose: closeDropdown,
  });

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
  onStatusChange,
}: {
  ticket: SupportTicket;
  onView: (ticket: SupportTicket) => void;
  onStatusChange: (ticket: SupportTicket) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const {
    buttonRef,
    dropdownRef,
    dropdownPosition,
    updateDropdownPosition,
  } = useRowActionDropdown({
    isOpen,
    dropdownWidth: 220,
    onClose: closeDropdown,
  });
  const isResolved = isTicketResolvedStatus(ticket.status);
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
      Title: isResolved ? "Unresolve" : "Resolve",
      Icon: isResolved ? LuBadgeX : LuBadgeCheck,
      onClick: () => {
        setIsOpen(false);
        onStatusChange(ticket);
      },
    },
  ];

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
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
};
