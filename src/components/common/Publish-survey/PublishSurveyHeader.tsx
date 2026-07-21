import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";
import { FaFacebookF, FaUsers, FaWhatsapp } from "react-icons/fa";
import { LuArrowRight, LuDownload, LuEllipsis } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  setIsFbModalOpen,
  setIsWhatsappModalOpen,
} from "../../../store/CrosstabSlice";
import { useProgressiveOverflow } from "../../../utils/useProgressiveOverflow";
import Button from "../../ui/Button";
import OverflowActionsMenu, {
  type OverflowActionMenuItem,
} from "../../ui/OverflowActionsMenu";
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

type PublishActionId =
  | "initiate"
  | "facebook"
  | "whatsapp"
  | "download"
  | "inactive-initiate";

type PublishAction = {
  id: Exclude<PublishActionId, "inactive-initiate">;
  label: string;
  inlineLabel: string;
  Icon: ElementType;
  onSelect: () => void;
  disabled?: boolean;
  testId: string;
  className?: string;
  variant?: "theme" | "success" | "secondary";
};

export default function PublishSurveyHeader({
  studyID,
  studyName,
  launch,
  isSurveyActive,
  onHoverDisabledInitiate,
}: PublishSurveyHeaderProps) {
  const [isInitiateOpen, setIsInitiateOpen] = useState(false);
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const actionAreaRef = useRef<HTMLDivElement>(null);
  const overflowButtonRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
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
  const actionIds = useMemo<readonly PublishActionId[]>(
    () =>
      isSurveyActive
        ? [
            ...(canInitiate ? (["initiate"] as const) : []),
            "facebook",
            "whatsapp",
            ...(launch === 1 ? (["download"] as const) : []),
          ]
        : ["inactive-initiate"],
    [canInitiate, isSurveyActive, launch]
  );
  const {
    containerRef,
    fixedControlsRef,
    getItemRef,
    minimumWidth,
    visibleIds,
  } = useProgressiveOverflow(actionIds, {
    allVisibleFixedControlsRef: nextButtonRef,
  });

  const actions = useMemo<readonly PublishAction[]>(
    () => [
      {
        id: "initiate",
        label: initiateLabel,
        inlineLabel: initiateLabel,
        Icon: FaUsers,
        onSelect: () => setIsInitiateOpen(true),
        disabled: !canInitiate,
        testId: "INITIATE",
        variant: "theme",
      },
      {
        id: "facebook",
        label: "Facebook",
        inlineLabel: "Share on Facebook",
        Icon: FaFacebookF,
        onSelect: () => dispatch(setIsFbModalOpen(true)),
        testId: "FACEBOOK_SURVEY",
        className:
          "bg-[var(--color-brand-info)] text-white hover:brightness-95",
      },
      {
        id: "whatsapp",
        label: "WhatsApp",
        inlineLabel: "Share on WhatsApp",
        Icon: FaWhatsapp,
        onSelect: () => dispatch(setIsWhatsappModalOpen(true)),
        testId: "WHATSAPP_SURVEY",
        variant: "success",
        className: "hover:brightness-95",
      },
      {
        id: "download",
        label: "Download",
        inlineLabel: "Download",
        Icon: LuDownload,
        onSelect: () => {},
        disabled: true,
        testId: "PUBLISH_SURVEY_DOWNLOADS",
        variant: "secondary",
        className:
          "home-border-soft text-[var(--color-brand-info)] opacity-50 grayscale-[0.2]",
      },
    ],
    [canInitiate, dispatch, initiateLabel]
  );
  const actionsById = useMemo(
    () => new Map(actions.map((action) => [action.id, action])),
    [actions]
  );
  const overflowItems: readonly OverflowActionMenuItem[] = isSurveyActive
    ? actionIds
        .filter(
          (actionId): actionId is PublishAction["id"] =>
            actionId !== "inactive-initiate" && !visibleIds.has(actionId)
        )
        .map((actionId) => {
          const action = actionsById.get(actionId)!;
          return {
            id: action.id,
            label: action.label,
            Icon: action.Icon,
            onSelect: action.onSelect,
            disabled: action.disabled,
          };
        })
    : [];
  const showOverflowButton = overflowItems.length > 0;
  const rightStyle = useMemo(
    () => ({ minWidth: minimumWidth || undefined }),
    [minimumWidth]
  );

  const closeOverflow = () => {
    setIsOverflowOpen(false);
    window.requestAnimationFrame(() => overflowButtonRef.current?.focus());
  };

  useEffect(() => {
    if (!showOverflowButton) setIsOverflowOpen(false);
  }, [showOverflowButton]);

  useEffect(() => {
    if (!isOverflowOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!actionAreaRef.current?.contains(event.target as Node)) {
        setIsOverflowOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeOverflow();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOverflowOpen]);

  const goToReport = () => {
    if (!studyID) return;
    navigate("/report", { state: { studyID } });
  };

  return (
    <>
      <PageSubheader
        contentClassName="flex-row items-center justify-between gap-2"
        leftClassName="flex min-h-8 min-w-0 shrink items-center overflow-hidden"
        rightClassName="min-w-0 flex-1 flex-nowrap gap-2"
        rightStyle={rightStyle}
        left={
          <h1
            className="questionnaire-heading max-w-full truncate text-[16px] font-semibold leading-none"
            title="Publish Research"
          >
            Publish Research
          </h1>
        }
        right={
          <div ref={actionAreaRef} className="relative min-w-0 w-full">
            <div
              ref={containerRef}
              className="flex min-h-8 min-w-0 w-full flex-nowrap items-center justify-end gap-2"
            >
              {actionIds.map((actionId) => {
                if (!visibleIds.has(actionId)) return null;

                if (actionId === "inactive-initiate") {
                  return (
                    <span
                      key={actionId}
                      ref={getItemRef(actionId)}
                      title="Activate the study first."
                      className="shrink-0 cursor-not-allowed"
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
                  );
                }

                const action = actionsById.get(actionId);
                if (!action) return null;
                const Icon = action.Icon;
                return (
                  <div
                    key={action.id}
                    ref={getItemRef(action.id)}
                    className="shrink-0"
                  >
                    <Button
                      type="button"
                      data-test-id={action.testId}
                      variant={action.variant}
                      className={action.className}
                      onClick={action.onSelect}
                      disabled={action.disabled}
                    >
                      <Icon />
                      <span>{action.inlineLabel}</span>
                    </Button>
                  </div>
                );
              })}

              <div
                ref={fixedControlsRef}
                className="flex shrink-0 items-center gap-2"
              >
                {showOverflowButton ? (
                  <div className="relative">
                    <Button
                      ref={overflowButtonRef}
                      type="button"
                      data-test-id="PUBLISH_MORE_ACTIONS"
                      size="default"
                      tooltip="More publish actions"
                      aria-haspopup="menu"
                      aria-expanded={isOverflowOpen}
                      className="report-toolbar-btn bg-[var(--color-questionnaire-multi)] text-white hover:bg-[var(--color-questionnaire-multi)] hover:text-white hover:opacity-90"
                      onClick={() => setIsOverflowOpen((current) => !current)}
                    >
                      <LuEllipsis />
                    </Button>
                    {isOverflowOpen ? (
                      <OverflowActionsMenu
                        anchorRef={overflowButtonRef}
                        ariaLabel="Publish research actions"
                        items={overflowItems}
                        onClose={closeOverflow}
                      />
                    ) : null}
                  </div>
                ) : null}

                {isSurveyActive ? (
                  <Button
                    ref={nextButtonRef}
                    data-test-id="NEXT_TO_REPORT"
                    variant="theme"
                    onClick={goToReport}
                    disabled={!studyID}
                    className="shrink-0"
                  >
                    Next <LuArrowRight className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        }
      />

      <SampleCollectionModel
        isOpen={isInitiateOpen}
        onClose={() => setIsInitiateOpen(false)}
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
}
