import { FaCopy } from "react-icons/fa";
import IconActionButton from "../../../ui/IconActionButton";

type ResearchLinkProps = {
  liveLink: string;
  onCopy: (link: string) => void;
};

const ResearchLink = ({ liveLink, onCopy }: ResearchLinkProps) => (
  <div className="flex items-center gap-2">
    <a
      href={liveLink}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:text-blue-800"
    >
      🔗 Click to view research
    </a>

    <IconActionButton
      tooltip="Copy research link"
      onClick={() => onCopy(liveLink)}
      tone="neutral"
      className="theme-text-muted"
    >
      <FaCopy />
    </IconActionButton>
  </div>
);

export default ResearchLink;
