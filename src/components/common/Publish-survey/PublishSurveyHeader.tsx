import { useState, type FC } from "react";
import { FaFacebookF, FaUsers, FaWhatsapp } from "react-icons/fa";
import {
  LuArrowRight,
  LuDownload,
  LuEllipsisVertical,
} from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setIsFbModalOpen,
  setIsWhatsappModalOpen,
} from "../../../store/CrosstabSlice";
import NewDropdown, {
  type DropdownItem,
} from "../../global/NewDropDown";
import Button from "../../ui/Button";
import PageSubheader from "../../ui/PageSubheader";
import FacebookModal from "./FacebookModal";
import SampleCollectionModel from "./SampleCollectionModel";
import WhatsaapModal from "./WhatsaapModal";

interface PublishSurveyHeaderProps {
  studyID?: string;
  studyName?: string;
  launch?: number;
  isSurveyActive: boolean;
  onHoverDisabledInitiate?: (isHovered: boolean) => void;
}

type PublishAction = DropdownItem & {
  testId?: string;
  desktopClassName?: string;
  desktopVariant?: "theme" | "success" | "secondary";
  showOnDesktop?: boolean;
};

const PublishSurveyHeader: FC<PublishSurveyHeaderProps> = ({
  studyID,
  studyName,
  launch,
  isSurveyActive,
  onHoverDisabledInitiate,
}) => {
  const [isOpenInitiate, setIsOpenInitiate] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { closed } = useSelector((state: RootState) => state.study);
  const { isWhatsappModalOpen, isFbModalOpen } = useSelector(
    (state: RootState) => state.crosstab
  );

  const canInitiate = launch !== 1 || closed === 1;
  const initiateLabel =
    launch === 1 && closed === 1
      ? "Relaunch Research"
      : "Initiate Sample Collection";

  const publishActions: PublishAction[] = [
    {
      id: "initiate",
      label: initiateLabel,
      icon: <FaUsers />,
      onClick: () => setIsOpenInitiate(true),
      disabled: !canInitiate,
      testId: "INITIATE",
      desktopVariant: "theme",
      showOnDesktop: canInitiate,
    },
    {
      id: "facebook",
      label: "Facebook",
      icon: <FaFacebookF />,
      onClick: () => dispatch(setIsFbModalOpen(true)),
      testId: "FACEBOOK_SURVEY",
      desktopClassName:
        "bg-[var(--color-brand-info)] text-white hover:brightness-95",
    },
    {
      id: "whatsapp",
      label: "WhatsApp",
      icon: <FaWhatsapp />,
      onClick: () => dispatch(setIsWhatsappModalOpen(true)),
      testId: "WHATSAPP_SURVEY",
      desktopVariant: "success",
      desktopClassName: "hover:brightness-95",
    },
    {
      id: "download",
      label: "Download",
      icon: <LuDownload />,
      disabled: true,
      testId: "PUBLISH_SURVEY_DOWNLOADS",
      desktopVariant: "secondary",
      desktopClassName:
        "home-border-soft text-[var(--color-brand-info)] opacity-50 grayscale-[0.2]",
      showOnDesktop: launch === 1,
    },
  ];

  const goToReport = () => {
    if (!studyID) return;
    navigate("/report", { state: { studyID } });
  };

  const title = (
    <h1
      className="questionnaire-heading truncate text-[16px] font-semibold leading-none"
      title="Publish Research"
    >
      Publish Research
    </h1>
  );

  return (
    <>
      <PageSubheader
        left={title}
        right={
          isSurveyActive ? (
            <>
              <div className="min-[1280px]:hidden">
                <NewDropdown
                  position="bottom-right"
                  items={publishActions}
                  trigger={
                    <button
                      type="button"
                      aria-label="Publish research actions"
                      title="Publish research actions"
                      className="questionnaire-muted inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-brand-primary-softest)] hover:text-login-primary"
                    >
                      <LuEllipsisVertical className="h-5 w-5" />
                    </button>
                  }
                />
              </div>

              <div className="hidden items-center gap-2 min-[1280px]:flex">
                {publishActions
                  .filter((action) => action.showOnDesktop !== false)
                  .map((action) => (
                    <Button
                      key={action.id}
                      type="button"
                      data-test-id={action.testId}
                      variant={action.desktopVariant}
                      className={action.desktopClassName}
                      onClick={action.onClick}
                      disabled={action.disabled}
                    >
                      {action.icon}
                      <span>
                        {action.id === "facebook"
                          ? "Share on Facebook"
                          : action.id === "whatsapp"
                            ? "Share on WhatsApp"
                            : action.label}
                      </span>
                    </Button>
                  ))}
              </div>

              <Button
                data-test-id="NEXT_TO_REPORT"
                variant="theme"
                onClick={goToReport}
                disabled={!studyID}
                className="shrink-0"
              >
                Next <LuArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span
              title="Activate the study first."
              className="hidden cursor-not-allowed md:inline-flex"
              onMouseEnter={() => onHoverDisabledInitiate?.(true)}
              onMouseLeave={() => onHoverDisabledInitiate?.(false)}
              onFocus={() => onHoverDisabledInitiate?.(true)}
              onBlur={() => onHoverDisabledInitiate?.(false)}
            >
              <Button
                type="button"
                variant="secondary"
                size="default"
                disabled
                data-test-id="INITIATE_DISABLED"
                aria-disabled="true"
                className="pointer-events-none border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] shadow-none opacity-55 grayscale-[0.2] saturate-[0.75]"
              >
                <FaUsers /> Initiate Sample Collection
              </Button>
            </span>
          )
        }
        contentClassName="flex-row items-center justify-between gap-2"
        leftClassName="min-w-0 flex-1 overflow-hidden"
        rightClassName="min-w-0 shrink-0 flex-nowrap gap-2"
      />

      <SampleCollectionModel
        isOpen={isOpenInitiate}
        onClose={() => setIsOpenInitiate(false)}
        studyName={studyName}
      />

      {isWhatsappModalOpen ? (
        <WhatsaapModal
          onClose={() => dispatch(setIsWhatsappModalOpen(false))}
          onSave={() => dispatch(setIsWhatsappModalOpen(false))}
        />
      ) : null}

      {isFbModalOpen ? (
        <FacebookModal
          onClose={() => dispatch(setIsFbModalOpen(false))}
          onSave={() => dispatch(setIsFbModalOpen(false))}
        />
      ) : null}
    </>
  );
};

export default PublishSurveyHeader;
