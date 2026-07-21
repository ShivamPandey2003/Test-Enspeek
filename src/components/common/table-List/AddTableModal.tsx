import { useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { toast } from "sonner";
import AddCustomTableListModal from "./TableAdd";
import BannerLogic from "../../global/BannerLogic";
import { useAddCustomTable } from "../../../api-network/crosstab/tablelist/mutation";
import { useLocation } from "react-router";
import Input from "../../ui/Input";
import ModalInstruction from "../../ui/ModalInstruction";
import { modalDefinitions } from "../../../config/modalDefinitions";

interface ControlItem {
  id: number;
  variable: string;
}
interface TableRow {
  id: string;
  title: string;
  variables: string;
  logic: { pointLogic: string }[]
  controls: ControlItem[];
}

export default function AddCustomTableModal({
  open,
  onOpenChange,
}: AddCustomTableModalProps) {
  const definition = modalDefinitions.addCustomTable;
  const [tableLabel, setTableLabel] = useState("");
  const [tableText, setTableText] = useState("");
  const [tableLogic, setTableLogic] = useState<{ pointLogic: string }[]>([]);
  const location = useLocation()
   const { addCustomTableMutate } = useAddCustomTable(location.state.studyID);
  const [,setControlItems] = useState<ControlItem[]>([
    { id: Date.now(), variable: "variable1" },
  ]);

  const [rows, setRows] = useState<TableRow[]>([
    {
      id: "CT-1",
      title: "",
      variables: "",
      logic:[],
      controls: [{ id: Date.now(), variable: "variable1" }],
    },
  ]);

  const handleSubmit = () => {
  if (!tableLabel.trim()) {
    toast.error("Table label is required");
    return;
  }
  if (!tableText.trim()) {
    toast.error("Table text is required");
    return;
  }
  const emptyTitleRow = rows.find((row) => !row.title.trim());
  if (emptyTitleRow) {
    toast.error(`Row "${emptyTitleRow.id}" has an empty title`);
    return;
  }

  const payload = {
    bannerID: location?.state?.bannerID,
    title: tableLabel,
    description: tableText,
    qType: "Single-select", 
    logic: tableLogic,
    rowOptionList: rows.map((row, index) => ({
      active: 1, 
      id: row.id,
      optionCode: index + 1,
      optionLogic: row.logic,
      optionText: row.title,
      optionType: "standard", 
      seq: index + 1,
    })),
  };

  addCustomTableMutate(payload);
  setTableLabel("");
  setTableText("");
  setTableLogic([]);
  setRows([
    {
      id: "CT-1",
      title: "",
      variables: "",
      logic:[],
      controls: [{ id: Date.now(), variable: "variable1" }],
    },
  ]);
  setControlItems([{ id: Date.now(), variable: "variable1" }]);
  onOpenChange(false);
};

 

  return (
    <DynamicModel
      Title={definition.title}
      ButtonText={definition.submitLabel!}
      isOpen={open}
      onClose={() => onOpenChange(false)}
      onClick={handleSubmit}
      className="max-w-6xl"
    >
      <ModalInstruction>
        Define the table label, text, logic, and rows before creating a custom table.
      </ModalInstruction>
      <div className="space-y-4">
        <div>
          <label className="questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]">
            Table Label <span className="text-[var(--color-core-danger)]">*</span>
          </label>
          <Input
            variant="crosstab"
            className="mt-2"
            placeholder="Enter label"
            value={tableLabel}
            onChange={(e) => setTableLabel(e.target.value)}
          />
        </div>
        <div>
          <label className="questionnaire-label text-sm font-semibold text-[var(--color-text-strong)]">
            Table Text <span className="text-[var(--color-core-danger)]">*</span>
          </label>
          <Input
            variant="crosstab"
            className="mt-2"
            placeholder="Enter text"
            value={tableText}
            onChange={(e: any) => setTableText(e.target.value)}
          />
        </div>
        <div>
          <label className="crosstab-title text-sm font-semibold">Table Logic</label>
          <BannerLogic setLogicFunc={(e)=>setTableLogic(e)} />
        </div>
        <AddCustomTableListModal rows={rows} setRows={setRows}/>
      </div>
    </DynamicModel>
  );
}
