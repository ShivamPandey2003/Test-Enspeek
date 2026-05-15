import { useEffect, useRef, useState, type FC } from "react";
import { FaFacebookF, FaUsers, FaWhatsapp } from "react-icons/fa";
import SampleCollectionModel from "./SampleCollectionModel";
import { setIsHistoryModalOpen } from "../../../store/CrosstabSlice";
import { useDispatch, useSelector } from "react-redux";
import DropDown from "../../global/DropDown";
import type { RootState } from "../../../store/store";
import { useLocation, useNavigate } from "react-router";
import {
  setIsWhatsappModalOpen,
  setIsFbModalOpen,
} from "../../../store/CrosstabSlice";
import FacebookModal from "./FacebookModal";
import WhatsaapModal from "./WhatsaapModal";
import {
  LuArrowRight,
  LuClock3,
  LuDownload,
  LuFileSpreadsheet,
  LuFiles,
} from "react-icons/lu";
import PageSubheader from "../../ui/PageSubheader";
import Button from "../../ui/Button";

interface PublishSurveyHeaderProps {
  studyName?: string;
  launch?: number;
  isSurveyActive: boolean;
  onHoverDisabledInitiate?: (isHovered: boolean) => void;
}
const PublishSurveyHeader: FC<PublishSurveyHeaderProps> = ({
  studyName,
  launch,
  isSurveyActive,
  onHoverDisabledInitiate,
}) => {
  const [isOpenInitiate, setIsOpenInitiate] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { state } = useLocation();
  const studyInfo = useSelector((state: RootState) => state.study);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isWhatsappModalOpen, isFbModalOpen } = useSelector(
    (state: RootState) => state.crosstab
  );
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  };
  const rawDataDropdown = [
    {
      Title: "Download Excel Raw Data",
      Icon: LuFileSpreadsheet,
      onClick: () => {},
    },
    {
      Title: "Download SPSS Raw Data",
      Icon: LuFiles,
      onClick: () => {},
    },
    {
      Title: "Download History",
      Icon: LuClock3,
      onClick: () => {
        dispatch(setIsHistoryModalOpen(true));
      },
    },
  ];

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
        <PageSubheader
          left={
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="questionnaire-heading text-[18px] font-semibold leading-none md:text-[22px]">
                Publish Survey
              </h1>
            </div>
        }
        right={
          <>
            {isSurveyActive && (
              <>
                <Button
                  data-test-id="FACEBOOK_SURVEY"
                  className="bg-[var(--color-brand-info)] text-white hover:brightness-95"
                  onClick={() => {
                    dispatch(setIsFbModalOpen(true));
                  }}
                >
                  <FaFacebookF className="text-base" />
                  <span>Share on Facebook</span>
                </Button>
                <Button
                  varinat="success"
                  className="hover:brightness-95"
                  data-test-id="WHATSAPP_SURVEY"
                  onClick={() => {
                    dispatch(setIsWhatsappModalOpen(true));
                  }}
                >
                  <FaWhatsapp className="text-base" />
                  <span>Share on WhatsApp</span>
                </Button>
              </>
            )}
            {!isSurveyActive && (
              <span
                title="Activate the study first."
                className="inline-flex cursor-not-allowed"
                onMouseEnter={() => onHoverDisabledInitiate?.(true)}
                onMouseLeave={() => onHoverDisabledInitiate?.(false)}
                onFocus={() => onHoverDisabledInitiate?.(true)}
                onBlur={() => onHoverDisabledInitiate?.(false)}
              >
                <Button
                  type="button"
                  varinat="secondary"
                  size="default"
                  disabled
                  data-test-id="INITIATE_DISABLED"
                  aria-disabled="true"
                  className="pointer-events-none border-[var(--color-border-soft)] bg-[var(--color-surface-soft)] text-[var(--color-text-muted)] shadow-none opacity-55 grayscale-[0.2] saturate-[0.75]"
                >
                  <FaUsers /> Initiate Sample Collection
                </Button>
              </span>
            )}
            {isSurveyActive && launch !== 1 && (
              <Button
                data-test-id="INITIATE"
                varinat="theme"
                onClick={() => {
                  setIsOpenInitiate(true);
                }}
              >
                <FaUsers /> Initiate Sample Collection
              </Button>
            )}
            {isSurveyActive && launch === 1 && studyInfo.closed === 1 && (
              <Button
                varinat="theme"
                onClick={() => {
                  setIsOpenInitiate(true);
                }}
              >
                Relaunch Survey
              </Button>
            )}
            {launch === 1 && (
              <>
                <div className="relative" ref={dropdownRef}>
                  <Button
                    type="button"
                    varinat="secondary"
                    size="icon"
                    data-test-id="PUBLISH_SURVEY_DOWNLOADS"
                    aria-label="Open download history"
                    className="home-border-soft text-[var(--color-brand-info)] hover:bg-[var(--color-brand-primary-softest)]"
                    onClick={() => setOpen((prev) => !prev)}
                  >
                    <LuDownload className="h-4 w-4" />
                  </Button>
                  {open && (
                    <div className="absolute right-0 z-10 rounded-lg shadow-2xl">
                      <DropDown Data={rawDataDropdown} className="" />
                    </div>
                  )}
                </div>
                <Button
                  data-test-id="NEXT_TO_REPORT"
                  varinat="theme"
                  className="px-6"
                  onClick={() => {
                    navigate("/report", { state: { studyID: state.studyID } });
                  }}
                >
                  Next <LuArrowRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        }
        leftClassName="flex min-h-[42px] flex-wrap items-center gap-3"
        rightClassName="gap-3"
      />
      <SampleCollectionModel
        isOpen={isOpenInitiate}
        onClose={() => setIsOpenInitiate(false)}
        studyName={studyName}
      />
      {isWhatsappModalOpen && (
        <WhatsaapModal
          onClose={() => dispatch(setIsWhatsappModalOpen(false))}
          onSave={() => {
            dispatch(setIsWhatsappModalOpen(false));
          }}
        />
      )}
      {isFbModalOpen && (
        <FacebookModal
          onClose={() => dispatch(setIsFbModalOpen(false))}
          onSave={() => {
            dispatch(setIsFbModalOpen(false));
          }}
        />
      )}
    </>
  );
};
export default PublishSurveyHeader;
