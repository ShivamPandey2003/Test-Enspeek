import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FaSignOutAlt } from "react-icons/fa";
import { LuChevronDown, LuLoaderCircle, LuMessageCircle, LuUsersRound, LuSettings, LuHouse, LuUserRound } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router";
import ICON from "../../assets/icons/icon.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setMessages } from "../../store/ChatSlice";
import DropDown from "./DropDown";
import Modal from "../ui/Modal";
import { cn, getFullName, getInitials } from "../../utils";
import Button from "../ui/Button";
import ModalScaffold from "../ui/modal/ModalScaffold";
import homepageKeys from "../../api-network/homepage/keys";
import { syncHomepageUserInfo } from "../../api-network/homepage/query";
import SupportRequestModal from "../common/support/SupportRequestModal";
import { getUserAccessConfig, normalizeLoginType } from "../../config/userAccess";
import { circleIconButtonClass, circleIconContentClass } from "../../constants/uiClasses";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [manualPlanLimitModalOpen, setManualPlanLimitModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [isPlanInfoRefreshing, setIsPlanInfoRefreshing] = useState(false);
  const [dismissedFreePlanModal, setDismissedFreePlanModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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
  const isUserManagementPage = pathname.startsWith("/user-management");
  const isProfilePage = pathname.startsWith("/profile");
  const showStudyName =
    pathname !== "/" &&
    !isUserManagementPage &&
    !isProfilePage &&
    name.trim() !== "";
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch<AppDispatch>();
  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const initials = getInitials(fullName, "U");
  const userAccess = getUserAccessConfig(loginType, userType);
  const normalizedLoginType = normalizeLoginType(loginType, userType);
  const isClientLogin = normalizedLoginType === "client";
  const isPlanInfoVisible = Boolean(planInfoSynced && isClientLogin);
  const isFreeUser = Number(planType) === 0;
  const isPaidUser = Number(planType) === 1;
  const PlanIcon = LuSettings
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
    ...(userAccess.canAccessAdminPanel && !isUserManagementPage
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
    ...(userAccess.canAccessProfile && !isProfilePage
      ? [
        {
          Title: "Profile",
          Icon: LuUserRound,
          onClick: () => {
            setDropdownOpen(false);
            navigate("/profile");
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

  const openPlanLimitModal = async () => {
    if (isPlanInfoRefreshing) return;

    setIsPlanInfoRefreshing(true);

    try {
      await queryClient.fetchQuery({
        queryKey: homepageKeys.userInfo(),
        queryFn: () => syncHomepageUserInfo(user, dispatch),
      });
      setManualPlanLimitModalOpen(true);
    } catch {
      // API service handles the visible error state.
    } finally {
      setIsPlanInfoRefreshing(false);
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
        <a
          href="https://enspeek.ai/"
          target="_blank"
          rel="noopener noreferrer"
          title="Visit website"
          className="flex shrink-0 items-center gap-3"
        >
          <img src={ICON} alt="Enspeek" className="h-11 w-auto" />
          <span className="text-[23px] font-bold tracking-[-0.03em] text-login-primary">
            Enspeek
          </span>
        </a>
        {showStudyName && (
          <>
            <div className="home-muted shrink-0 mx-2 text-sm font-medium">|</div>
            <div className="home-heading min-w-0 flex-1 truncate text-[16px] font-semibold">
              {name}
            </div>
          </>
        )}
      </div>
      {isUserManagementPage || isProfilePage ? (
        <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center justify-center md:flex">
          <h1 className="home-heading text-[18px] font-bold">
            {isProfilePage ? "Profile" : "User Management"}
          </h1>
        </div>
      ) : null}
      <div className="relative flex shrink-0 items-center" ref={dropdownRef}>
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={toggleDropdown}
        >
          {isUserManagementPage || isProfilePage ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                navigate("/");
              }}
              className={circleIconButtonClass}
              aria-label="Go to home"
              title="Home"
            >
              <span className={circleIconContentClass}>
                <LuHouse className="h-[18px] w-[18px]" />
              </span>
            </button>
          ) : null}
          {userAccess.canRequestSupport ? (
            <button
              type="button"
              className={circleIconButtonClass}
              aria-label="Support"
              title="Request for Assistance"
              onClick={(event) => {
                event.stopPropagation();
                setSupportModalOpen(true);
              }}
            >
              <span className={circleIconContentClass}>
                <LuMessageCircle className="h-[18px] w-[18px]" />
              </span>
            </button>
          ) : null}
          {isPlanInfoVisible && (isFreeUser || isPaidUser) ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                openPlanLimitModal();
              }}
              disabled={isPlanInfoRefreshing}
              className={cn(circleIconButtonClass, "disabled:cursor-wait disabled:opacity-70")}
              aria-label={isPaidUser ? "View premium plan usage" : "View free plan usage"}
              title={isPaidUser ? "Premium plan usage" : "Free plan usage"}
            >
              <span className={circleIconContentClass}>
                {isPlanInfoRefreshing ? (
                  <LuLoaderCircle className="h-[18px] w-[18px] animate-spin" />
                ) : (
                  <PlanIcon className="h-[18px] w-[18px]" />
                )}
              </span>
            </button>
          ) : null}
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
              variant="cancel"
              onClick={() => setLogoutModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="theme"
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
      <SupportRequestModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
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
  const Icon = LuSettings
  const planLabel = isPaidUser ? "Premium Plan" : "Free Plan";
  const title = "Plan Usage Limits";
  const description = `You're on the ${planLabel}. Here's your included allowance for studies, prompts, and question addition.`;

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-2xl"
      title={title}
      icon={<Icon className="h-5 w-5" />}
      description={description}
      footerRight={
        <Button type="button" variant="cancel" onClick={onClose}>
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
        />
        <PlanLimitRow
          label="Prompts"
          used={user.usedPrompt ?? 0}
          allowed={user.allowedPrompt ?? 0}
        />
        <PlanLimitRow
          label="Questions"
          used={user.createdQuestions ?? 0}
          allowed={user.allowedQuestions ?? 0}
        />
      </div>
    </ModalScaffold>
  );
};

const PlanLimitRow = ({
  label,
  used,
  allowed,
}: {
  label: string;
  used: number;
  allowed: number;
}) => {
  const remaining = Math.max(allowed - used, 0);

  return (
    <div className="rounded-md border border-[color:var(--color-brand-primary)]/16 bg-white px-4 py-3">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_300px] sm:items-center">
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-login-primary">{label}</p>
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
