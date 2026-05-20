import { useEffect, useRef, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import { LuChevronDown, LuUsersRound } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router";
import ICON from "../../assets/icons/icon.png";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setMessages } from "../../store/ChatSlice";
import DropDown from "./DropDown";
import Modal from "../ui/Modal";
import { cn, getFullName, getInitials } from "../../utils";
import Button from "../ui/Button";

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { name } = useSelector((state: RootState) => state.study);
  const { firstName, lastName, loginType, userType } = useSelector((state: RootState) => state.user);
  const showStudyName = pathname !== "/" && name.trim() !== "";
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const dispatch = useDispatch<AppDispatch>();
  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const initials = getInitials(fullName, "U");
  const canAccessAdminPanel = ["admin", "client"].includes(
    (loginType || userType || "").toLowerCase()
  );

  const handleLogout = () => {
    localStorage.clear();
    dispatch({ type: "RESET_STORE" });
    dispatch(setMessages([]));
    setDropdownOpen(false);
    setLogoutModalOpen(false);
    window.location.href = "/login";
  };

  const DropdownData = [
    ...(canAccessAdminPanel
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
      <div className="relative flex shrink-0 items-center" ref={dropdownRef}>
        <div
          className="flex cursor-pointer items-center gap-3"
          onClick={toggleDropdown}
        >
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
    </div>
  );
};

export default Header;
