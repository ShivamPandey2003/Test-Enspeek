import { useEffect, useRef, useState, type FC } from "react";
import { createPortal } from "react-dom";
import {
  LuBadgeCheck,
  LuBadgeX,
  LuCrown,
  LuEllipsisVertical,
  LuSparkles,
} from "react-icons/lu";
import type { AdminPanelUser } from "../../../api-network/admin-panel/query";
import { modalDefinitions } from "../../../config/modalDefinitions";
import { cn } from "../../../utils";
import Button from "../../ui/Button";
import { Card, CardContent } from "../../ui/Card";
import DropDown from "../../global/DropDown";

export type AdminPanelActionType =
  | "status"
  | "plan"
  | "verification"
  | "subscription";

type UserCardProps = {
  user: AdminPanelUser;
  isDropdownOpen: boolean;
  onDropdownToggle: () => void;
  onDropdownClose: () => void;
  onAction: (user: AdminPanelUser, action: AdminPanelActionType) => void;
};

const UserCard: FC<UserCardProps> = ({
  user,
  isDropdownOpen,
  onDropdownToggle,
  onDropdownClose,
  onAction,
}) => {
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const actionButtonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const statusActionLabel =
    user.status === "active"
      ? modalDefinitions.deactivateUser.title
      : modalDefinitions.activateUser.title;
  const handleAction = (action: AdminPanelActionType) => {
    onDropdownClose();
    onAction(user, action);
  };

  const updateDropdownPosition = () => {
    const rect = actionButtonRef.current?.getBoundingClientRect();
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
    if (!isDropdownOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        dropdownRef.current?.contains(target) ||
        actionButtonRef.current?.contains(target)
      ) {
        return;
      }

      onDropdownClose();
    };

    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isDropdownOpen, onDropdownClose]);

  const DropDownData: DropdownData[] = user.isApproved
    ? [
        {
          Title: statusActionLabel,
          Icon: user.status === "active" ? LuBadgeX : LuBadgeCheck,
          onClick: () => handleAction("status"),
        },
        {
          Title: modalDefinitions.verifyUser.title,
          Icon: LuBadgeCheck,
          onClick: () => handleAction("verification"),
        },
        {
          Title: modalDefinitions.updateUserSubscription.title,
          Icon: LuSparkles,
          onClick: () => handleAction("subscription"),
        },
        {
          Title:
            user.plan === "free"
              ? modalDefinitions.changeToPaidUser.title
              : modalDefinitions.changeToFreeUser.title,
          Icon: LuCrown,
          onClick: () => handleAction("plan"),
        },
      ]
    : [
        {
          Title: modalDefinitions.verifyUser.title,
          Icon: LuBadgeCheck,
          onClick: () => handleAction("verification"),
        },
      ];

  return (
    <div className="relative">
      <Card className="home-surface home-border-soft platform-card-shadow-medium overflow-visible">
        <CardContent className="p-0">
          <div className="flex items-start justify-between gap-3 p-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h3 className="home-heading truncate text-[16px] font-semibold">
                  {user.name}
                </h3>
                <p className="home-heading truncate text-sm font-medium">{user.email}</p>
              </div>
            </div>
            <div className="relative shrink-0">
              <Button
                ref={actionButtonRef}
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full"
                tooltip="User actions"
                onClick={() => {
                  updateDropdownPosition();
                  onDropdownToggle();
                }}
              >
                <LuEllipsisVertical className="h-4 w-4" />
              </Button>
              {isDropdownOpen
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
                        Data={DropDownData}
                        className="relative right-auto z-[300] mt-0 w-full"
                      />
                    </div>,
                    document.body
                  )
                : null}
            </div>
          </div>

          <div className="grid gap-3 border-t home-border-soft p-4">
            <div className="grid grid-cols-3 gap-4">
              <MetaItem label="Subscription" value={user.plan} />
              <MetaItem label="Verification" value={user.isApproved ? "Yes" : "No"} />
              <MetaItem
                label="Status"
                value={user.status}
                valueClassName={
                  user.status === "active"
                    ? "text-[var(--color-study-activated)]"
                    : "text-[var(--color-questionnaire-stop)]"
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <LimitItem label="Prompt" used={user.usedPrompt} allowed={user.allowedPrompt} />
              <LimitItem label="Studies" used={user.createdStudies} allowed={user.allowedStudies} />
              <LimitItem label="Questions" used={user.createdQuestions} allowed={user.allowedQuestions} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const MetaItem = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex min-w-0 items-center gap-1.5 text-sm">
    <span className="shrink-0 font-medium text-login-primary">{label}: </span>
    <span className={cn("home-heading truncate font-semibold capitalize", valueClassName)}>
      {value}
    </span>
  </div>
);

const LimitItem = ({
  label,
  used,
  allowed,
}: {
  label: string;
  used: number;
  allowed: number;
}) => (
  <div className="flex min-w-0 items-center gap-1.5 text-sm">
    <span className="shrink-0 font-medium text-login-primary">{label}: </span>
    <span
      className="home-heading truncate font-bold"
      title={`${label} used of allowed: ${used} of ${allowed}`}
      aria-label={`${label} used of allowed: ${used} of ${allowed}`}
    >
      {used} of {allowed}
    </span>
  </div>
);

export default UserCard;
