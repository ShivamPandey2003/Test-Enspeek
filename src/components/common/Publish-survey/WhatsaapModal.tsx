import { useLocation } from "react-router";
import { FaWhatsapp } from "react-icons/fa";
import SocialShareLinkModal from "../../global/modals/SocialShareLinkModal";
import { useWhatsappLink } from "../../../api-network/publish-survey/query";

export default function WhatsaapModal({
  onClose,
}: Pick<SocialLinkModalProps, "onClose" | "onSave">) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const { whatsappLinkData } = useWhatsappLink(studyID);

  return (
    <SocialShareLinkModal
      isOpen={true}
      onClose={onClose}
      titleKey="whatsappLink"
      headerIcon={
        <span className="text-[var(--color-study-activated)]">
          <FaWhatsapp className="h-5 w-5" />
        </span>
      }
      accentClassName="text-[var(--color-study-activated)]"
      linkData={whatsappLinkData}
      copySuccessMessage="WhatsApp link copied to clipboard!"
    />
  );
}
