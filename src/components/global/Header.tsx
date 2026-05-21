import { useEffect, useRef, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { LuChevronDown, LuCrown, LuGift, LuUsersRound } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router";
import ICON from "../../assets/icons/icon.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setMessages } from "../../store/ChatSlice";
import DropDown from "./DropDown";
import Modal from "../ui/Modal";
import { cn, getFullName, getInitials } from "../../utils";
import Button from "../ui/Button";
import ModalScaffold from "../ui/modal/ModalScaffold";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [manualPlanLimitModalOpen, setManualPlanLimitModalOpen] = useState(false);
  const [dismissedFreePlanModal, setDismissedFreePlanModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { name } = useSelector((state: RootState) => state.study);
  const user = useSelector((state: RootState) => state.user);
  const {
    firstName,
    lastName,
    loginType,
    userType,
    planType,
    planInfoSynced,
    apiToken,
  } = user;
  const showStudyName = pathname !== "/" && name.trim() !== "";
  const isUserManagementPage = pathname.startsWith("/user-management");
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch<AppDispatch>();
  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const initials = getInitials(fullName, "U");
  const canAccessAdminPanel = ["admin"].includes((loginType || userType || "").toLowerCase());
  const isAdminLogin = (loginType || userType || "").toLowerCase() === "admin";
  const isPlanInfoVisible = Boolean(planInfoSynced && !isAdminLogin);
  const isFreeUser = Number(planType) === 0;
  const isPaidUser = Number(planType) === 1;
  const PlanIcon = isPaidUser ? LuCrown : LuGift;
  const shouldShowFreePlanAfterLogin = Boolean(
    apiToken &&
    sessionStorage.getItem(`enspeek-show-free-plan-modal:${apiToken}`) === "1"
  );
  const shouldAutoOpenFreePlanModal = Boolean(
    isPlanInfoVisible &&
    isFreeUser &&
    shouldShowFreePlanAfterLogin &&
    !dismissedFreePlanModal
  );
  const isPlanLimitModalOpen =
    manualPlanLimitModalOpen || shouldAutoOpenFreePlanModal;

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "RESET_STORE" });
    dispatch(setMessages([]));
    setDropdownOpen(false);
    setLogoutModalOpen(false);
    window.location.href = "/login";
  };

  const DropdownData = [
    ...(canAccessAdminPanel && !isUserManagementPage
      ? [
        {
          Title: "User Management",
          Icon: LuUsersRound,
          onClick: () => {
            setDropdownOpen(false);
            navigate("/user-management");
          },
        },
      ]
      : []),
    {
      Title: "Logout",
      Icon: FaSignOutAlt,
      onClick: () => {
        setDropdownOpen(false);
        setLogoutModalOpen(true);
      },
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closePlanLimitModal = () => {
    setManualPlanLimitModalOpen(false);

    if (shouldAutoOpenFreePlanModal && apiToken) {
      sessionStorage.removeItem(`enspeek-show-free-plan-modal:${apiToken}`);
      setDismissedFreePlanModal(true);
    }
  };

  return (
    <div
      className={cn(
        "home-surface sticky top-0 flex h-[62px] items-center justify-between gap-6 border-b home-border px-6",
        logoutModalOpen ? "z-[130]" : "z-40"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <Link to={"/"} className="flex shrink-0 items-center gap-3">
          <img src={ICON} alt="Enspeek" className="h-11 w-auto" />
          <span className="text-[23px] font-extrabold tracking-[-0.03em] text-login-primary">
            Enspeek
          </span>
        </Link>
        {showStudyName && (
          <>
            <div className="home-muted shrink-0 mx-2 text-sm font-medium">|</div>
            <div className="home-heading min-w-0 flex-1 truncate text-[16px] font-semibold">
              {name}
            </div>
          </>
        )}
      </div>
      {isUserManagementPage ? (
        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
          <h1 className="home-heading text-[18px] font-bold">
            User Management
          </h1>
        </div>
      ) : null}
      <div className="relative flex shrink-0 items-center" ref={dropdownRef}>
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={toggleDropdown}
        >
          {isPlanInfoVisible && (isFreeUser || isPaidUser) ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setManualPlanLimitModalOpen(true);
              }}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border shadow-sm transition-colors",
                isPaidUser
                  ? "border-[color:var(--color-brand-primary)]/25 bg-[var(--color-brand-primary-softest)] text-login-primary hover:bg-login-primary/10"
                  : "border-[color:var(--color-brand-primary)]/20 bg-white text-login-primary hover:bg-[var(--color-brand-primary-softest)]"
              )}
              aria-label={isPaidUser ? "View paid plan usage" : "View free plan usage limits"}
              title={isPaidUser ? "Paid plan usage" : "Free plan usage limits"}
            >
              <PlanIcon className="h-[18px] w-[18px]" />
            </button>
          ) : null}
          {fullName && (
            <span className="home-heading text-[14px] font-semibold capitalize">
              {fullName}
            </span>
          )}
          <div
            title={fullName}
            data-test-id="PROFILE"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-login-primary text-sm font-semibold text-white"
          >
            {initials}
          </div>
          <LuChevronDown className="home-muted" size={18} />
        </div>
        {dropdownOpen && (
          <div className="absolute right-0 top-full mt-2">
            <DropDown Data={DropdownData} />
          </div>
        )}
      </div>
      <Modal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        className="max-w-md"
      >
        <div className="p-6">
          <h3 className="home-heading text-[22px] font-bold">Confirm Logout</h3>
          <p className="home-muted mt-3 text-[15px] leading-6">
            Are you sure you want to log out from your Enspeek account?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              varinat="cancel"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              varinat="theme"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
      <PlanLimitsModal
        isOpen={isPlanLimitModalOpen}
        onClose={closePlanLimitModal}
        user={user}
      />
    </div>
  );
};

const PlanLimitsModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}) => {
  const planType = Number(user.planType);
  const isPaidUser = planType === 1;
  const Icon = isPaidUser ? LuCrown : LuGift;
  const title = isPaidUser ? "Paid Plan Usage" : "Free Plan Usage Limits";
  const description = isPaidUser
    ? "These values show your current usage across your paid plan allowance."
    : "You're on the Free Plan. Here’s your included allowance for studies, prompts, and question generation.";

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
      title={title}
      icon={<Icon className="h-5 w-5" />}
      description={description}
      footerRight={
        <Button type="button" varinat="cancel" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="grid gap-2">
        <div className="hidden grid-cols-[minmax(0,1fr)_300px] items-center gap-3 px-4 sm:grid">
          <div />
          <div className="grid grid-cols-3 gap-2 text-center">
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-black">
              Used
            </span>
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-black">
              Allowed
            </span>
            <span className="text-[12px] font-extrabold uppercase tracking-[0.08em] text-black">
              Remaining
            </span>
          </div>
        </div>
        <PlanLimitRow
          label="Studies"
          used={user.createdStudies ?? 0}
          allowed={user.allowedStudies ?? 0}
          usedLabel="created"
        />
        <PlanLimitRow
          label="Prompts"
          used={user.usedPrompt ?? 0}
          allowed={user.allowedPrompt ?? 0}
          usedLabel="used"
        />
        <PlanLimitRow
          label="Questions"
          used={user.createdQuestions ?? 0}
          allowed={user.allowedQuestions ?? 0}
          usedLabel="created"
        />
      </div>
    </ModalScaffold>
  );
};

const PlanLimitRow = ({
  label,
  used,
  allowed,
  usedLabel,
}: {
  label: string;
  used: number;
  allowed: number;
  usedLabel: string;
}) => {
  const remaining = Math.max(allowed - used, 0);

  return (
    <div className="rounded-md border border-[color:var(--color-brand-primary)]/16 bg-white px-4 py-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-center">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-login-primary">{label}</p>
          <p className="home-muted mt-0.5 text-sm">
            {used} {usedLabel} of {allowed} allowed
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <PlanMetric mobileLabel="Used" value={used} />
          <PlanMetric mobileLabel="Allowed" value={allowed} />
          <PlanMetric mobileLabel="Remaining" value={remaining} />
        </div>
      </div>
    </div>
  );
};

const PlanMetric = ({ mobileLabel, value }: { mobileLabel: string; value: number }) => (
  <div className="rounded-md bg-[var(--color-surface-soft)] px-3 py-2">
    <span className="home-heading block text-sm font-bold">{value}</span>
    <span className="mt-0.5 block text-[11px] font-extrabold uppercase tracking-[0.08em] text-black sm:hidden">
      {mobileLabel}
    </span>
  </div>
);

export default Header;
