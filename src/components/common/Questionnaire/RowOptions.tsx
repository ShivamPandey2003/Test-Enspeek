import React from "react";
import Input from "../../ui/Input";
import OptionLogic from "./OptionLogic";

interface RowOptions {
  optionKey: string;
  Value: string;
  onChange: (e: string) => void;
  select: boolean;
  onSelect: (e: boolean) => void;
  onDelete: () => void;
  error?: boolean;
  qID?: string;
  optionID?: string;
}

const RowOptions: React.FC<RowOptions> = ({
  optionKey,
  Value,
  onChange,
  onDelete,
  error = false,
  qID,
  optionID,
}) => {
  return (
    <div className="flex min-h-9 items-center gap-1.5 rounded-[12px] px-0.5 py-0.5">
      <label htmlFor={`row-${optionKey}`} className="questionnaire-label w-5 shrink-0 text-sm font-medium leading-tight">
        R{optionKey}:
      </label>
      <Input
        id={`row-${optionKey}`}
        variant="bare"
        value={Value}
        onChange={(e)=>onChange(e.target.value)}
        className={`questionnaire-heading min-h-8 flex-1 border-b border-[var(--color-questionnaire-border)] px-1.5 py-0 text-[15px] focus-visible:border-[var(--color-questionnaire-border)] focus-visible:ring-0 ${
          error ? "ring-1 ring-red-400" : ""
        }`}
        required
      />
      {qID && optionID ? (
        <OptionLogic
          qID={qID}
          rowIndex={optionID}
          optionText={Value}
          onDelete={onDelete}
        />
      ) : (
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--color-questionnaire-stop)]"
          aria-label="Delete option"
          title="Delete option"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default RowOptions;
