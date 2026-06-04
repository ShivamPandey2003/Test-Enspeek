import React from "react";
import {
  AccordionContent,
  AccordionItem,
} from "../../ui/Accrodion";
import {
  LuChevronDown,
  LuChevronRight,
  LuCopy,
  LuGripVertical,
  LuGitBranchPlus,
  LuPencilLine,
  LuTrash2,
} from "react-icons/lu";
import Input from "../../ui/Input";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import OptionLogic from "./OptionLogic";
import { cn } from "../../../utils";
import { useAccordionContext } from "../../ui/Accrodion/Accordion";
import IconActionButton from "../../ui/IconActionButton";
import QuestionTypeBadge from "./QuestionTypeBadge";

interface QuestionAccordionItem {
  Data: Question;
  setIsDeleteOpen: () => void;
  setIsCopyOpen: (qID: string, qLabel: string) => void;
  setEditData: () => void;
  openLogicModal: () => void;
}

const QuestionAccordionItem: React.FC<QuestionAccordionItem> = ({
  Data,
  setIsDeleteOpen,
  setIsCopyOpen,
  setEditData,
  openLogicModal,
}) => {
  const { isExpanded, toggleItem } = useAccordionContext();
  const { launch, output } = useSelector((state: RootState) => state.study);
  const disableActions = launch === 1 && output === 1;
  const isLoaded = (Data as Question & { isLoaded?: boolean }).isLoaded !== false;
  const displayLabel =
    Data.qLabel?.replace(/^[A-Za-z0-9_-]+\s*:\s*/, "").trim() || Data.qLabel;
  const logic2Skip = useSelector(
    (state: RootState) => state.question.logic2Skip?.[Data.qID]
  );
  const expanded = isExpanded(Data.qID);

  return (
    <AccordionItem value={Data.qID} className="border-0" disabled={!isLoaded}>
      <div
        data-test-id={Data.qID}
        className={cn(
          "questionnaire-card questionnaire-border w-full rounded-[14px] border px-2.5 py-0.5 shadow-sm transition-shadow md:px-3",
          expanded && "rounded-b-none border-b-0 shadow-none",
          !isLoaded && "cursor-not-allowed pointer-events-none"
        )}
      >
        <div className="flex min-h-8 w-full items-center gap-2">
          <div
            className={cn(
              "questionnaire-muted shrink-0",
              disableActions || !isLoaded ? "cursor-default" : "cursor-move"
            )}
          >
            <LuGripVertical className="h-4 w-4" />
          </div>
          <div
            role="button"
            tabIndex={isLoaded ? 0 : -1}
            aria-expanded={expanded}
            className={cn(
              "min-w-0 flex-1 self-stretch",
              isLoaded ? "cursor-pointer" : "cursor-not-allowed"
            )}
            onClick={() => {
              if (isLoaded) {
                toggleItem(Data.qID);
              }
            }}
            onKeyDown={(e) => {
              if (!isLoaded) return;
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleItem(Data.qID);
              }
            }}
          >
            <div className="flex h-full w-full min-w-0 items-center gap-1.5">
              <span className="questionnaire-heading shrink-0 text-[14px] font-semibold leading-tight">
                {Data.qID}:
              </span>
              <div className="min-w-0 flex-1 pr-2">
                <p className="questionnaire-heading truncate text-left text-[14px] font-semibold leading-tight">
                  {displayLabel}
                </p>
              </div>
            </div>
          </div>
          <div className="ml-auto hidden h-full items-center justify-end gap-2 md:flex">
            <button
              type="button"
              title="Add or edit logic"
              className="questionnaire-clickable inline-flex h-6 items-center gap-1.5 rounded-full px-1.5 text-[12px] font-semibold leading-none text-login-primary"
              onClick={openLogicModal}
            >
              <LuGitBranchPlus className="h-4 w-4" />
              <span>Add / Edit Logic</span>
            </button>
            <QuestionTypeBadge type={Data.qType} />
          </div>
          {!disableActions && isLoaded && (
            <div className="questionnaire-muted flex items-center gap-1 md:gap-1.5">
              <IconActionButton
                tone="primary"
                tooltip="Edit question"
                data-test-id={`${Data.qID}_EDIT`}
                onClick={() => setEditData()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setEditData();
                  }
                }}
              >
                <LuPencilLine className="h-4 w-4" />
              </IconActionButton>
              <IconActionButton
                tone="primary"
                tooltip="Copy question"
                data-test-id={`${Data.qID}_COPY`}
                onClick={() => setIsCopyOpen(Data.qID, Data.qLabel)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsCopyOpen(Data.qID, Data.qLabel);
                  }
                }}
              >
                <LuCopy className="h-4 w-4" />
              </IconActionButton>
              <IconActionButton
                tone="danger"
                tooltip="Delete question"
                data-test-id={`${Data.qID}_DELETE`}
                onClick={() => setIsDeleteOpen()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsDeleteOpen();
                  }
                }}
              >
                <LuTrash2 className="h-4 w-4" />
              </IconActionButton>
            </div>
          )}
          <div
            title={
              !isLoaded
                ? "Loading question details"
                : expanded
                  ? "Collapse question"
                  : "Expand question"
            }
            className="questionnaire-muted questionnaire-clickable shrink-0"
            onClick={() => {
              if (isLoaded) {
                toggleItem(Data.qID);
              }
            }}
          >
            {!isLoaded ? (
              <span className="copying-dots inline-flex w-[1.5em] justify-start text-lg font-bold leading-none">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : expanded ? (
              <LuChevronDown className="h-4 w-4" />
            ) : (
              <LuChevronRight className="h-4 w-4" />
            )}
          </div>
        </div>
      </div>
      <AccordionContent>
        <div className="questionnaire-card questionnaire-border rounded-b-[20px] border border-t-0 px-3 pb-3 pt-1 md:px-4">
          {logic2Skip &&
            Object.entries(logic2Skip).map(([type, message]) => (
              <p key={type} className="questionnaire-delete mb-1 text-sm leading-snug">
                <span className="font-semibold capitalize">{type}:</span>{" "}
                {message}
              </p>
            ))}

          <div className="questionnaire-border space-y-2 border-t pt-2">
            <div>
              <p className="questionnaire-label text-[14px] leading-tight">
                Question Text
              </p>
              <p className="questionnaire-heading mt-1 text-[14px] leading-snug">
                {Data.qText}
              </p>
            </div>

            {Data.qNote3 && (
              <div>
                <p className="questionnaire-label text-[14px] leading-tight">
                  Instruction
                </p>
                <p className="questionnaire-heading mt-1 text-[14px] leading-snug italic">
                  {Data.qNote3}
                </p>
              </div>
            )}

            {!!Data.rowOptionList?.length && (
              <div>
                <p className="questionnaire-label text-[14px] leading-tight">
                  Answer Options
                </p>
                <div className="mt-1 space-y-0.5">
                  {Data.rowOptionList &&
                    Data.rowOptionList.map((key, index) => (
                    <div
                      key={key.optionID}
                      className="rounded-[12px] px-0.5 py-0.5"
                    >
                      <div className="flex items-center gap-1">
                        <label className="questionnaire-label w-6 shrink-0 text-[14px] leading-tight">{`R${
                          index + 1
                        }:`}</label>
                        <div className="flex w-full min-w-0 items-center justify-between gap-1.5">
                          <label
                            htmlFor={`option-${index}`}
                            className="questionnaire-heading text-[14px] leading-snug"
                          >
                            {key.optionText}
                          </label>

                          <div className="flex items-center gap-1.5">
                            <OptionLogic
                              key={index}
                              qID={Data.qID}
                              rowIndex={key.optionID}
                              optionText={key.optionText}
                            />
                          </div>
                        </div>

                        {Boolean(key.other) && (
                          <Input variant="questionnaire" className="h-8 min-h-8 w-24" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default QuestionAccordionItem;
