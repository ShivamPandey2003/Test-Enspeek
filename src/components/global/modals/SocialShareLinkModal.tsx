import { toast } from "sonner";
import { LuCopy, LuInfo, LuLink, LuMessageSquareQuote } from "react-icons/lu";
import Button from "../../ui/Button";
import ModalScaffold from "../../ui/modal/ModalScaffold";
import ModalInfoBlock from "../../ui/modal/ModalInfoBlock";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function SocialShareLinkModal({
  isOpen,
  onClose,
  titleKey,
  headerIcon,
  accentClassName,
  linkData,
  copySuccessMessage,
}: SocialLinkModalProps) {
  const definition = modalDefinitions[titleKey];
  const copyContent = linkData?.short_url || "";

  return (
    <ModalScaffold
      isOpen={isOpen}
      onClose={onClose}
      className={definition.maxWidthClass ?? "max-w-[90vw] md:max-w-[980px]"}
      title={definition.title}
      icon={headerIcon}
      footerLeft={
        <Button type="button" varinat="cancel" onClick={onClose}>
          {definition.cancelLabel}
        </Button>
      }
      footerRight={
        <Button
          type="button"
          varinat={definition.tone === "success" ? "success" : "theme"}
          onClick={() => {
            if (copyContent) {
              navigator.clipboard.writeText(copyContent);
              toast.success(copySuccessMessage);
            }
            onClose();
          }}
        >
          <LuCopy className="h-4 w-4" />
          {definition.submitLabel}
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        {linkData?.short_url ? (
          <>
            <div className="modal-card flex items-center gap-5 px-5 py-5">
              <span className={`modal-header-icon ${accentClassName}`}>
                <LuLink className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                  <strong className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[var(--color-text-strong)]">
                    Link:
                  </strong>
                  <a
                    href={linkData.short_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-0 truncate text-[22px] leading-8 text-[var(--color-brand-primary)] underline decoration-dashed underline-offset-4"
                  >
                    {linkData.short_url}
                  </a>
                </div>
              </div>
            </div>

            {linkData.Message ? (
              <div className="modal-card flex items-center gap-5 px-5 py-5">
                <span className={`modal-header-icon ${accentClassName}`}>
                  <LuMessageSquareQuote className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <p className="questionnaire-heading shrink-0 text-[24px] font-extrabold text-[var(--color-text-strong)]">
                      Message:
                    </p>
                    <p className="min-w-0 truncate text-[22px] leading-8 text-[var(--color-text-default)]">
                      {linkData.Message}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="modal-card px-5 py-8 text-center">
            <p className="text-lg theme-text-muted">Generating link...</p>
          </div>
        )}

        <ModalInfoBlock
          className="gap-5 rounded-lg px-5 py-5 force_align_center"
          icon={
            <span className={`modal-header-icon ${accentClassName}`}>
              <LuInfo className="h-5 w-5" />
            </span>
          }
        >
          <p className="text-left text-[21px] leading-9 text-[var(--color-text-default)]">
            Copy and paste the message to start the conversation after opening
            the link
          </p>
        </ModalInfoBlock>
      </div>
    </ModalScaffold>
  );
}
