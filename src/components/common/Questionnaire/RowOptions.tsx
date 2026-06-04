import React from "react";
import Input from "../../ui/Input";
import { LuTrash2 } from "react-icons/lu";
import IconActionButton from "../../ui/IconActionButton";
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
        className={`questionnaire-heading min-h-8 flex-1 border-b border-[color:var(--color-login-primary)]/35 px-1.5 py-0 text-[15px] focus-visible:border-[color:var(--color-login-primary)]/35 focus-visible:ring-0 ${
          error ? "ring-1 ring-red-400" : ""
        }`}
        required
      />
      {qID && optionID ? (
        <OptionLogic qID={qID} rowIndex={optionID} optionText={Value} />
      ) : null}
      <IconActionButton
        type="button"
        tone="danger"
        onClick={onDelete}
        tooltip="Delete option"
        className="h-7 w-7 p-1"
      >
        <LuTrash2 size={18} />
      </IconActionButton>
    </div>
  );
};

export default RowOptions;
