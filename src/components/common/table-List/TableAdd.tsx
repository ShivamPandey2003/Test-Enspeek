import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import BannerLogic from "../../global/BannerLogic";
import IconActionButton from "../../ui/IconActionButton";

interface ControlItem {
  id: number;
  variable: string;
}
export interface TableRow {
  id: string;
  title: string;
  variables: string;
  logic: { pointLogic: string }[],
  controls: ControlItem[];
}

interface Props {
  rows: TableRow[];
  setRows: React.Dispatch<React.SetStateAction<TableRow[]>>;
}

export default function AddCustomTableListModal({ rows, setRows }: Props) {
  const handleCreateRow = () => {
    const newRowId = `CT-${rows.length + 1}`;
    setRows([
      ...rows,
      {
        id: newRowId,
        title: "",
        variables: "",
        logic:[],
        controls: [{ id: Date.now(), variable: "variable1" }],
      },
    ]);
  };

  const handleRowChange = (
    rowIndex: number,
    field: keyof Omit<TableRow, "id" | "controls">,
    value: any
  ) => {
    setRows((prev) =>
      prev.map((r, i) => (i === rowIndex ? { ...r, [field]: value } : r))
    );
  };

  const handleDeleteRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="crosstab-surface overflow-hidden">
      <div className="home-panel-soft-bg flex justify-end border-b home-border-soft px-4 py-3">
        <Button
          varinat="theme"
          onClick={handleCreateRow}
          className="report-toolbar-btn ml-4"
        >
          <LuPlus className="mr-1" />
          Create Row
        </Button>
      </div>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="border-b home-border-soft">
            <th className="w-24 border-r home-border-soft px-4 py-3 text-left crosstab-title">
              Row ID
            </th>
            <th className="border-r home-border-soft px-4 py-3 text-left crosstab-title">
              Row Title
            </th>
            <th className="w-12 px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y home-border-soft">
          {rows.map((row, rowIndex) => (
            <tr key={row.id}>
              <td className="crosstab-title border-r home-border-soft px-4 py-3 align-middle">
                <div className="text-sm font-medium">{row.id}</div>
              </td>
              <td className="border-r home-border-soft px-4 py-3 align-middle">
                <div className="space-y-2">
                  <Input
                    placeholder="Enter option text"
                    value={row.title}
                    onChange={(e) =>
                      handleRowChange(rowIndex, "title", e.target.value)
                    }
                    className="questionnaire-input questionnaire-heading w-full border questionnaire-border focus:outline-none"
                  />
                  <div className="space-y-2">
                    {row.controls.map((_, index) => (
                      <BannerLogic setLogicFunc={(e)=>handleRowChange(rowIndex, "logic", e)} key={index} />
                    ))}
                  </div>
                </div>
              </td>
              {rows.length > 1 && (
                <td className="px-4 py-3 text-center align-middle">
                  <IconActionButton
                    tone="danger"
                    tooltip="Delete row"
                    onClick={() => handleDeleteRow(rowIndex)}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </IconActionButton>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
