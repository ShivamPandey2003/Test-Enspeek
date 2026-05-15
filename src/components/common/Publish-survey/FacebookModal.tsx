import { useLocation } from "react-router";
import { FaFacebookF } from "react-icons/fa";
import SocialShareLinkModal from "../../global/modals/SocialShareLinkModal";
import { useFacebookLink } from "../../../api-network/publish-survey/query";

export default function FacebookModal({
  onClose,
}: Pick<SocialLinkModalProps, "onClose" | "onSave">) {
  const location = useLocation();
  const studyID = location.state?.studyID;
  const { facebookLinkData } = useFacebookLink(studyID);

  return (
    <SocialShareLinkModal
      isOpen={true}
      onClose={onClose}
      titleKey="facebookLink"
      headerIcon={
        <span className="text-[var(--color-brand-info)]">
          <FaFacebookF className="h-5 w-5" />
        </span>
      }
      accentClassName="text-[var(--color-brand-info)]"
      linkData={facebookLinkData}
      copySuccessMessage="Facebook link copied to clipboard!"
    />
  );
}
