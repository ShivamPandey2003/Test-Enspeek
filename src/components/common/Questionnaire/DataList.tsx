import { useState, type FC, type DragEvent, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { Accordion } from "../../ui/Accrodion";
import QuestionAccordionItem from "./QuestionAccordionItem";
import DeleteModel from "../../global/DeleteModel";
import CopyModel from "../../global/CopyModel";
import { cn } from "../../../utils";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import QuesLogicModal from "./QuestionLogicModal";
import { useCopyQuestionMutation, useDeleteQuestionMutation, useRearrangeQuestionMutation } from "../../../api-network/questionnaire/mutation";
import { setAllSubmitItems, setEditingQuestion } from "../../../store/QuestionSlice";
import { setIsAddingQuestion } from "../../../store/TriggerSlice";
import { useLocation } from "react-router";

interface DataListProps { }

const DataList: FC<DataListProps> = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useLocation();
  const studyID = state?.studyID;
  const submittedItems = useSelector(
    (state: RootState) => state.question.submitItems
  );
  const { launch, output } = useSelector((state: RootState) => state.study);
  const isDragDisabled = launch === 1 && output === 1;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const [qId, setQid] = useState("");
  const [oldLabel, setOldLabel] = useState("");
  const [isLogicOpen, setIsLogicOpen] = useState(false);
  const [selectedLogicQID, setSelectedLogicQID] = useState<string | null>(null);
  const MainDiv = useRef<HTMLDivElement | null>(null);

  const { mutate: deleteQuestion, isPending: isDeletePending } = useDeleteQuestionMutation(studyID);
  const { mutate: copyQuestion, isPending: isCopyPending } = useCopyQuestionMutation(studyID);
  const { mutate: rearrangeQuestions, isPending: isRearrangePending } = useRearrangeQuestionMutation(studyID);

  const onDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const onDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const updatedItems = [...submittedItems];
    const [movedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, movedItem);
    dispatch(setAllSubmitItems(updatedItems));
    setDraggedIndex(null);
    const dropOrder = updatedItems.reduce((acc, item, idx) => { acc[idx + 1] = item.qID; return acc; }, {} as Record<number, string>);
    rearrangeQuestions(dropOrder);
  };

  return (
    <div className="w-full px-3 py-4 md:px-6 md:py-6">
      {isRearrangePending && (
        <div className="flex items-center justify-center w-full h-full">
          <AiOutlineLoading3Quarters
            size={34}
            className={cn("animate-spin text-action")}
          />
        </div>
      )}
      <Accordion type="multiple" className="w-full space-y-4" ref={MainDiv}>
        {submittedItems.map((data, index) => (
          <div
            key={data.qID}
            draggable={!isDragDisabled && (data as Question & { isLoaded?: boolean }).isLoaded !== false}
            onDragStart={!isDragDisabled && (data as Question & { isLoaded?: boolean }).isLoaded !== false ? (e) => onDragStart(e, index) : undefined}
            onDragOver={!isDragDisabled && (data as Question & { isLoaded?: boolean }).isLoaded !== false ? (e) => onDragOver(e) : undefined}
            onDrop={!isDragDisabled && (data as Question & { isLoaded?: boolean }).isLoaded !== false ? (e) => onDrop(e, index) : undefined}
            className={cn(index === draggedIndex && "opacity-70")}
          >
            <QuestionAccordionItem
              Data={data}
              setIsDeleteOpen={() => {
                setIsDeleteOpen(true);
                setQid(data.qID);
                setOldLabel(data.qLabel);
              }}
              setEditData={() => {
                dispatch(setEditingQuestion(data));
                dispatch(setIsAddingQuestion(true));
              }}
              setIsCopyOpen={() => {
                setIsCopyOpen(true);
                setQid(data.qID);
                setOldLabel(data.qLabel);
              }}
              openLogicModal={() => {
                setIsLogicOpen(true);
                setSelectedLogicQID(data.qID);
              }}
            />
          </div>
        ))}

        <DeleteModel
          qID={qId}
          label={oldLabel}
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onClick={() =>
            deleteQuestion(qId, {
              onSuccess: () => {
                setIsDeleteOpen(false);
              },
            })
          }
          isPending={isDeletePending}
        />

        <CopyModel
          qID={qId}
          label={oldLabel}
          isOpen={isCopyOpen}
          onClose={() => setIsCopyOpen(false)}
          onClick={(newId, label) =>
            copyQuestion(
              { questionID: qId, newId, label },
              {
                onSuccess: () => {
                  setIsCopyOpen(false);
                },
              }
            )
          }
          isPending={isCopyPending}
        />

        <QuesLogicModal
          isOpen={isLogicOpen}
          onClose={() => setIsLogicOpen(false)}
          qID={selectedLogicQID}
        />
      </Accordion>
    </div>
  );
};

export default DataList;
