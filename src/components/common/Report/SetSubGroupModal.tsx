import React, { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";
import { LuListFilter, LuSave } from "react-icons/lu";
import Button from "../../ui/Button";
import Radio from "../../ui/Radio";
import { modalDefinitions } from "../../../config/modalDefinitions";

const SetSubgroupModal: React.FC<SetSubgroupModalProps> = ({
  options,
  onSave,
  onClose,
}) => {
  const definition = modalDefinitions.chooseSubgroup;
  const { selected } = useSelector((state: RootState) => state.filter);
  const [select, setSelect] = useState<string>(selected);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await Promise.resolve(onSave(select));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DynamicModel
      isOpen={true}
      onClose={onClose}
      Title={definition.title}
      headerIcon={
        <span className="inline-flex items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuListFilter className="h-5 w-5" />
        </span>
      }
      description="Choose the subgroup variable you want to apply in the report view."
      descriptionClassName="theme-text-default"
      ButtonText={isSaving ? definition.submittingLabel! : definition.submitLabel!}
      buttonIcon={
        isSaving ? (
          <span className="h-4 w-4 rounded-full border-2 border-white/35 border-t-white animate-spin" />
        ) : (
          <LuSave className="h-4 w-4" />
        )
      }
      onClick={handleSave}
      disable={isSaving}
      secondaryAction={
        <Button
          type="button"
          variant="cancel"
          onClick={onClose}
          disabled={isSaving}
        >
          {definition.cancelLabel}
        </Button>
      }
      buttonVariant="success"
      className="max-w-lg"
      bodyClassName="questionnaire-page-bg"
      >
      <div className="px-4">
        <div className="space-y-2">
          {options.map((option, index) => (
            <label
              key={index}
              className="bg-white border border-[var(--color-brand-primary)]/16 cursor-pointer flex items-center p-2 rounded space-x-3"
            >
              <Radio
                name="benefit"
                value={option.qID}
                checked={select === option.qID}
                onChange={() => setSelect(option.qID)}
              />
              <span className="home-text text-sm font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>
    </DynamicModel>
  );
};

export default SetSubgroupModal;
