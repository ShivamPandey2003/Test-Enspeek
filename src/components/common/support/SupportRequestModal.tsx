import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import {
  LuBadgeCheck,
  LuChevronDown,
  LuLoaderCircle,
  LuX,
} from "react-icons/lu";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import ModalField from "../../ui/modal/ModalField";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import Textarea from "../../ui/Textarea";
import { useRequestSupportMutation } from "../../../api-network/support/mutation";
import { useSupportAssistanceTypes, useSupportRequestInfo } from "../../../api-network/support/query";
import {
  modalDefinitions,
  renderModalIcon,
} from "../../../config/modalDefinitions";
import { cn } from "../../../utils";

type SupportRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SUPPORT_MESSAGE_MAX_LENGTH = 2000;

export default function SupportRequestModal({
  isOpen,
  onClose,
}: SupportRequestModalProps) {
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [submittedTicketId, setSubmittedTicketId] = useState("");
  const supportTypeRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const hasShownLimitToastRef = useRef(false);
  const {
    requestInfo,
    isLoading: isRequestInfoLoading,
    isFetching: isRequestInfoFetching,
  } = useSupportRequestInfo(isOpen);
  const isCheckingRequestInfo = isRequestInfoLoading || isRequestInfoFetching;
  const hasOpenRequest = Boolean(requestInfo && !requestInfo.isResolved);
  const { assistanceTypes, isLoading } = useSupportAssistanceTypes(
    isOpen && !isCheckingRequestInfo && !hasOpenRequest
  );
  const requestSupportMutation = useRequestSupportMutation();
  const activeAssistanceTypes = hasOpenRequest
    ? requestInfo?.assistanceTypes ?? []
    : assistanceTypes;
  const activeSelectedCodes = hasOpenRequest
    ? requestInfo?.assistanceTypes.map((item) => item.code) ?? []
    : selectedCodes;
  const activeMessage = hasOpenRequest ? requestInfo?.message ?? "" : message;
  const messageCharacterCount = activeMessage.length;
  const selectedItems = useMemo(
    () =>
      activeAssistanceTypes.filter((item) =>
        activeSelectedCodes.includes(item.code)
      ),
    [activeAssistanceTypes, activeSelectedCodes]
  );
  const isSubmitting = requestSupportMutation.isPending;
  const isSubmitted = Boolean(submittedTicketId);
  const reviewTicketId = submittedTicketId || requestInfo?.ticketId || "";
  const showReviewState = isSubmitted || hasOpenRequest;
  const isSubmitDisabled =
    isSubmitted ||
    hasOpenRequest ||
    isCheckingRequestInfo ||
    isSubmitting ||
    selectedCodes.length === 0 ||
    message.trim().length === 0;
  const modalDescription = showReviewState ? undefined : (
    "Tell us what you need help with, and our support team will review your request."
  );
  const definition = modalDefinitions.requestSupport;

  useEffect(() => {
    if (!isDropdownOpen) return;

    updateDropdownPosition();

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        supportTypeRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }

      setIsDropdownOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("resize", updateDropdownPosition);
    window.addEventListener("scroll", updateDropdownPosition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("resize", updateDropdownPosition);
      window.removeEventListener("scroll", updateDropdownPosition, true);
    };
  }, [isDropdownOpen, selectedItems.length]);

  const updateDropdownPosition = () => {
    const triggerRect = supportTypeRef.current?.getBoundingClientRect();

    if (!triggerRect) return;

    const spacing = 8;

    setDropdownPosition({
      top: triggerRect.bottom + spacing,
      left: triggerRect.left,
      width: triggerRect.width,
    });
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setIsDropdownOpen(false);
    setSubmittedTicketId("");
    setSelectedCodes([]);
    setMessage("");
    onClose();
  };

  const toggleSelection = (code: string) => {
    setSelectedCodes((currentCodes) =>
      currentCodes.includes(code)
        ? currentCodes.filter((item) => item !== code)
        : [...currentCodes, code]
    );
  };

  const removeSelection = (code: string) => {
    setSelectedCodes((currentCodes) =>
      currentCodes.filter((item) => item !== code)
    );
  };

  const updateMessage = (value: string) => {
    if (value.length > SUPPORT_MESSAGE_MAX_LENGTH) {
      showLimitToast();
    } else if (value.length < SUPPORT_MESSAGE_MAX_LENGTH) {
      hasShownLimitToastRef.current = false;
    }

    setMessage(value.slice(0, SUPPORT_MESSAGE_MAX_LENGTH));
  };

  const showLimitToast = () => {
    if (hasShownLimitToastRef.current) return;

    toast.warning(
      `Assistance description cannot exceed ${SUPPORT_MESSAGE_MAX_LENGTH} characters.`
    );
    hasShownLimitToastRef.current = true;
  };

  const handleSubmit = () => {
    if (isSubmitDisabled) return;

    requestSupportMutation.mutate(
      {
        assistance_type: selectedCodes,
        message: message.trim(),
      },
      {
        onSuccess: (response) => {
          const ticketId =
            response?.response?.ticket_id ??
            response?.response?.ticket_number ??
            "";
          setSubmittedTicketId(String(ticketId));
          setIsDropdownOpen(false);
        },
      }
    );
  };

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={closeModal}
      className={definition.maxWidthClass ?? "max-w-2xl"}
      title={definition.title}
      icon={renderModalIcon(definition.icon)}
      description={modalDescription}
      closeDisabled={isSubmitting}
      bodyClassName="space-y-5 !pt-3"
      footerLeft={
        <Button
          type="button"
          variant="cancel"
          disabled={isSubmitting}
          onClick={closeModal}
        >
          {definition.cancelLabel ?? "Cancel"}
        </Button>
      }
      footerRight={
        !showReviewState ? (
          <Button
            type="button"
            variant="theme"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <>
                <span className="modal-spinner" />
                {definition.submittingLabel ?? "Submitting..."}
              </>
            ) : (
              definition.submitLabel ?? "Request Assistance"
            )}
          </Button>
        ) : null
      }
    >
      {showReviewState ? (
        <div className="rounded-xl border border-[color:var(--color-brand-primary)]/20 bg-[var(--color-brand-primary-softest)]/45 p-5 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-login-primary shadow-sm">
            <LuBadgeCheck className="h-6 w-6" />
          </span>
          <h3 className="mt-4 text-[18px] font-bold text-[var(--color-text-strong)]">
            Your request is under review
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-black">
            We received your support request. Our support team will review it
            and respond to you by email.
          </p>
          {hasOpenRequest ? (
            <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-black">
              You can submit a new request once this ticket is resolved.
            </p>
          ) : null}
          {reviewTicketId ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-login-primary shadow-sm">
              Ticket ID: {reviewTicketId}
            </div>
          ) : null}
        </div>
      ) : null}

      {isCheckingRequestInfo && !showReviewState ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center">
          <LuLoaderCircle className="h-7 w-7 animate-spin text-login-primary" />
          <div>
            <p className="text-sm font-bold text-[var(--color-text-strong)]">
              Checking support request status
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Please wait while we load your latest support information.
            </p>
          </div>
        </div>
      ) : null}

      {!showReviewState && !isCheckingRequestInfo ? (
        <>
      <ModalField label="Type of request" required>
        <div className="relative" ref={supportTypeRef}>
          <button
            type="button"
            disabled={isSubmitting || hasOpenRequest || isCheckingRequestInfo}
            onClick={() => {
              setIsDropdownOpen((currentValue) => !currentValue);
              window.requestAnimationFrame(updateDropdownPosition);
            }}
            className={cn(
              "flex min-h-[52px] w-full items-center gap-2 rounded-lg border border-[var(--color-border-default)] bg-white px-3 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-brand-primary)]/25",
              isDropdownOpen &&
              "border-[var(--color-brand-primary)] ring-2 ring-[color:var(--color-brand-primary)]/20"
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap gap-2.5">
              {selectedItems.length > 0 ? (
                selectedItems.map((item) => (
                  <span
                    key={item.code}
                    className="inline-flex max-w-full items-center gap-2 rounded-md bg-[var(--color-brand-primary-softest)] px-2.5 py-1.5 text-sm font-semibold text-[var(--color-text-strong)]"
                  >
                    <span className="truncate">{item.label}</span>
                    {!hasOpenRequest ? (
                      <span
                        role="button"
                        tabIndex={0}
                        className="inline-flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-login-primary"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeSelection(item.code);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            event.stopPropagation();
                            removeSelection(item.code);
                          }
                        }}
                        aria-label={`Remove ${item.label}`}
                      >
                        <LuX className="h-3.5 w-3.5" />
                      </span>
                    ) : null}
                  </span>
                ))
              ) : (
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Select support type
                </span>
              )}
            </div>
            <LuChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition-transform",
                isDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {isDropdownOpen ? createPortal(
            <div
              ref={dropdownRef}
              className="fixed z-[650] rounded-xl border border-[var(--color-border-default)] bg-white p-1.5 shadow-xl"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  <LuLoaderCircle className="h-4 w-4 animate-spin" />
                  Loading assistance types...
                </div>
              ) : assistanceTypes.length > 0 ? (
                <div className="flex flex-col gap-1.5">
                  {assistanceTypes.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--color-text-strong)] transition-colors hover:bg-[var(--color-brand-primary-softest)]",
                        activeSelectedCodes.includes(item.code) &&
                          "bg-[var(--color-brand-primary-softest)]"
                      )}
                      onClick={() => toggleSelection(item.code)}
                    >
                      <Checkbox
                        checked={activeSelectedCodes.includes(item.code)}
                        readOnly
                      />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="px-3 py-3 text-sm font-semibold text-[var(--color-text-muted)]">
                  No assistance types found.
                </p>
              )}
            </div>,
            document.body
          ) : null}
        </div>
      </ModalField>

      <ModalField
        label={
          <span className="flex w-full items-center justify-between gap-3">
            <span>
              Description
              <span className="text-red-500"> *</span>
            </span>
            <span className="text-xs font-bold text-[var(--color-text-muted)]">
              {messageCharacterCount}/{SUPPORT_MESSAGE_MAX_LENGTH} Characters
            </span>
          </span>
        }
      >
        <Textarea
          variant="modal"
          disabled={isSubmitting || hasOpenRequest || isCheckingRequestInfo}
          value={activeMessage}
          maxLength={SUPPORT_MESSAGE_MAX_LENGTH}
          onChange={(event) => updateMessage(event.target.value)}
          onKeyDown={(event) => {
            const allowedNavigationKeys = [
              "Backspace",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
              "ArrowUp",
              "ArrowDown",
              "Home",
              "End",
              "Tab",
            ];

            if (
              message.length >= SUPPORT_MESSAGE_MAX_LENGTH &&
              !event.ctrlKey &&
              !event.metaKey &&
              !event.altKey &&
              event.key.length === 1 &&
              !allowedNavigationKeys.includes(event.key)
            ) {
              showLimitToast();
            }
          }}
          onPaste={(event) => {
            const pastedText = event.clipboardData.getData("text");
            if (message.length + pastedText.length > SUPPORT_MESSAGE_MAX_LENGTH) {
              showLimitToast();
            }
          }}
          placeholder="Please provide additional detail on what you are requesting help for."
          className="min-h-[140px] resize-y"
        />
      </ModalField>
        </>
      ) : null}
    </ModalScaffold>
  );
}
