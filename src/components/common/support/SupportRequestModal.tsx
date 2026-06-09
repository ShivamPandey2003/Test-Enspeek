import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  LuBadgeCheck,
  LuLoaderCircle,
} from "react-icons/lu";
import Button from "../../ui/Button";
import ModalField from "../../ui/modal/ModalField";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import Select from "../../ui/Select";
import Textarea from "../../ui/Textarea";
import { useRequestSupportMutation } from "../../../api-network/support/mutation";
import { useSupportAssistanceTypes, useSupportRequestInfo } from "../../../api-network/support/query";
import {
  modalDefinitions,
  renderModalIcon,
} from "../../../config/modalDefinitions";

type SupportRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SUPPORT_MESSAGE_MAX_LENGTH = 2000;

export default function SupportRequestModal({
  isOpen,
  onClose,
}: SupportRequestModalProps) {
  const [selectedCode, setSelectedCode] = useState("");
  const [message, setMessage] = useState("");
  const [submittedTicketId, setSubmittedTicketId] = useState("");
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
  const activeSelectedCode = hasOpenRequest
    ? requestInfo?.assistanceTypes[0]?.code ?? ""
    : selectedCode;
  const activeMessage = hasOpenRequest ? requestInfo?.message ?? "" : message;
  const messageCharacterCount = activeMessage.length;
  const isSubmitting = requestSupportMutation.isPending;
  const isSubmitted = Boolean(submittedTicketId);
  const reviewTicketId = submittedTicketId || requestInfo?.ticketId || "";
  const showReviewState = isSubmitted || hasOpenRequest;
  const isSubmitDisabled =
    isSubmitted ||
    hasOpenRequest ||
    isCheckingRequestInfo ||
    isSubmitting ||
    selectedCode.length === 0 ||
    message.trim().length === 0;
  const modalDescription = showReviewState ? undefined : (
    "Tell us what you need help with, and our support team will review your request."
  );
  const definition = modalDefinitions.requestSupport;

  const closeModal = () => {
    if (isSubmitting) return;

    setSubmittedTicketId("");
    setSelectedCode("");
    setMessage("");
    onClose();
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
        assistance_type: [selectedCode],
        message: message.trim(),
      },
      {
        onSuccess: (response) => {
          const ticketId =
            response?.response?.ticket_id ??
            response?.response?.ticket_number ??
            "";
          setSubmittedTicketId(String(ticketId));
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
        <div className="rounded-xl border border-[var(--color-brand-primary)]/20 bg-[var(--color-brand-primary-softest)]/45 p-5 text-center">
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
        <Select
          variant="modal"
          value={activeSelectedCode}
          disabled={isSubmitting || hasOpenRequest || isCheckingRequestInfo || isLoading}
          onChange={(event) => setSelectedCode(event.target.value)}
        >
          <option value="">
            {isLoading ? "Loading assistance types..." : "Select support type"}
          </option>
          {activeAssistanceTypes.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </Select>
        {!isLoading && assistanceTypes.length === 0 ? (
          <p className="mt-2 text-sm font-semibold text-[var(--color-text-muted)]">
            No assistance types found.
          </p>
        ) : null}
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
