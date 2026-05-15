import React from "react";
import Input from "../../ui/Input";
import { LuTrash2 } from "react-icons/lu";
import IconActionButton from "../../ui/IconActionButton";

interface RowOptions {
  optionKey:string;
  Value: string;
  onChange: (e:string)=>void;
  select: boolean;
  onSelect: (e:boolean)=>void;
  onDelete:()=>void
  error?: boolean;
}

const RowOptions:React.FC<RowOptions> = ({optionKey, Value, onChange, onDelete, error = false}) => {
  return (
    <div className="questionnaire-input flex items-center gap-3 rounded-[18px] px-4 py-3">
      <label htmlFor={`row`} className="questionnaire-label w-10 shrink-0 text-base font-medium">
        R{optionKey}
      </label>
      <Input value={Value} onChange={(e)=>onChange(e.target.value)} className={`questionnaire-heading rounded-[18px] border-0 bg-transparent px-1 py-1 text-base focus-visible:ring-0 ${
          error ? "ring-1 ring-red-400" : ""
        }`} required />
      <IconActionButton
        type="button"
        tone="danger"
        onClick={onDelete}
      >
        <LuTrash2 size={18} />
      </IconActionButton>
    </div>
  );
};

export default RowOptions;
