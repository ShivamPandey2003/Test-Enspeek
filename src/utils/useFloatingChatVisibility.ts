import { useEffect, useState } from "react";

const OPEN_MODAL_SELECTOR = '[role="dialog"][aria-modal="true"]';

export const isFloatingChatDisabledPath = (pathname: string) =>
  pathname.startsWith("/profile") ||
  pathname.startsWith("/user-management");

export const useHasOpenModal = () => {
  const [hasOpenModal, setHasOpenModal] = useState(false);

  useEffect(() => {
    const updateModalVisibility = () => {
      setHasOpenModal(Boolean(document.querySelector(OPEN_MODAL_SELECTOR)));
    };

    updateModalVisibility();

    const observer = new MutationObserver(updateModalVisibility);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["aria-modal", "role"],
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return hasOpenModal;
};
