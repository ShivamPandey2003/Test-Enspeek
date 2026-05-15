import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import LoaderSpinner from "../../global/LoaderSpinner";
import { setTrigger } from "../../../store/TriggerSlice";
import { useLocation } from "react-router";
import ModalInstruction from "../../ui/ModalInstruction";
import Checkbox from "../../ui/Checkbox";
import { useReportIncludeFiltersMutation } from "../../../api-network/report/mutation";
import { modalDefinitions } from "../../../config/modalDefinitions";
import Button from "../../ui/Button";

export default function FilterModal({ isOpen, setIsOpen }: FilterModalProps) {
  const definition = modalDefinitions.reportFilters;
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const filter = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch<AppDispatch>()
  const { state } = useLocation();

  const toggleFilter = (id: string) => {
    setSelectedFilters((prev) => prev.includes(id) ? prev.filter((filterId) => filterId !== id) : [...prev, id]);
  };

  const { includeReportFilters, isIncludeReportFiltersPending } =
    useReportIncludeFiltersMutation(state.studyID, () => {
      setIsOpen();
      dispatch(setTrigger(true));
    });

  if (!isOpen) return null;

  return (
    <DynamicModel
      Title={definition.title}
      ButtonText={
        isIncludeReportFiltersPending
          ? definition.submittingLabel!
          : definition.submitLabel!
      }
      isOpen={isOpen}
      onClick={() => includeReportFilters(selectedFilters)}
      onClose={() => setIsOpen()}
      className="max-w-lg"
      disable={isIncludeReportFiltersPending}
      closeDisabled={isIncludeReportFiltersPending}
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          onClick={setIsOpen}
          disabled={isIncludeReportFiltersPending}
        >
          {definition.cancelLabel}
        </Button>
      }
    >
      <ModalInstruction>
        Select the questions you want available in the report filters list, then save the updated filter set.
      </ModalInstruction>
      {isIncludeReportFiltersPending ? (
        <LoaderSpinner />
      ) : (
        <div className="max-h-[60vh] overflow-y-auto">
          {filter.FilterList.map((option) => (
            <div key={option.id} className="modal-card mb-3 flex items-center rounded-[16px] px-4 py-3">
              <Checkbox
                id={option.id}
                checked={selectedFilters.includes(option.id)}
                onChange={() => toggleFilter(option.id)}
                className="cursor-pointer"
              />
              <label htmlFor={option.id} className="ml-3 home-text text-sm font-medium">
                {option.label}
              </label>
            </div>
          ))}
        </div>
      )}
    </DynamicModel>
  );
}
