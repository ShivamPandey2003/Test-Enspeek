import { useEffect, useMemo, useState } from "react";
import DynamicModel from "../../global/DynamicModel";
import { LuArrowUpDown, LuSave, LuTable, LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";
import BannerLogic from "../../global/BannerLogic";
import { useEditTableListQuestion } from "../../../api-network/crosstab/tablelist/mutation";
import {
  useOpList,
  useTableOutputEditRows,
} from "../../../api-network/crosstab/tablelist/query";
import { useLocation } from "react-router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Button from "../../ui/Button";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import IconActionButton from "../../ui/IconActionButton";
import Checkbox from "../../ui/Checkbox";
import { modalDefinitions } from "../../../config/modalDefinitions";

export default function EditTableModal({
  open,
  onOpenChange,
  qid,
  tid,
}: EditTableModalProps) {
  const definition = modalDefinitions.updateTable;
  const { state } = useLocation();
  const { opListData, isOpListPending } = useOpList(
    tid,
    qid,
    state.bannerID,
    state.studyID
  );
  const {
    tableOutputEditRowsData: tableOutputData,
    isTableOutputEditRowsPending: isTableOutputPending,
  } = useTableOutputEditRows(state.bannerID, tid, state.studyID, open);
  const [tableLabel, setTableLabel] = useState("");
  const [tableText, setTableText] = useState("");
  const [rows, setRows] = useState<QuestionOption[]>([]);
  const [logics, setLogics] = useState<
    {
      pointLogic: string;
    }[]
  >([]);

  const { editTableListQuestionMutate, isEditTableListQuestionPending } =
    useEditTableListQuestion({
      qId: qid,
      studyID: state.studyID,
      cb: () => onOpenChange(false),
    });

  const mergedRows = useMemo(() => {
    if (!opListData?.rowOptionList?.length) {
      return [];
    }

    const rowsById = new Map<string, QuestionOption>(
      opListData.rowOptionList.map((row: QuestionOption) => [row.id, row])
    );
    const orderedIds = tableOutputData?._row_order?.length
      ? tableOutputData._row_order
      : opListData.rowOptionList.map((row: QuestionOption) => row.id);

    return orderedIds.map((rowId: string, index: number) => {
      const sourceRow = rowsById.get(rowId);
      return {
        ...(sourceRow ?? {
          id: rowId,
          optionText: "",
          optionType: "standard",
          optionLogic: [],
          optionCode: index + 1,
          seq: index + 1,
          active: 1,
          op_show: 1,
          include_in_base: 0,
          net: [],
          mean: 0,
          median: 0,
          stdev: 0,
          old_q: 0,
          net_val: 0,
        }),
        optionText:
          tableOutputData?._rows?.[rowId as keyof typeof tableOutputData._rows] ??
          sourceRow?.optionText ??
          "",
      } as QuestionOption;
    });
  }, [opListData, tableOutputData]);

  useEffect(() => {
    if (!isOpListPending && opListData) {
      setTableLabel(opListData.title);
      setTableText(opListData.description);
      setRows(mergedRows);
      setLogics(opListData.logic ?? []);
    }
  }, [isOpListPending, mergedRows, opListData]);

  const isLoading = isOpListPending || isTableOutputPending;

  const handleDeleteRow = (id: string) => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleRowTitleChange = (id: string, title: string) => {
    setRows(
      rows.map((row) => (row.id === id ? { ...row, optionText: title } : row))
    );
  };

  const handleSelectOption = (id: string, value: boolean) => {
    setRows((prev) =>
      prev.map((row) =>
        row.id === id ? { ...row, op_show: value ? 1 : 0 } : row
      )
    );
  };

  const updateTable = () => {
    if (!tableLabel.trim()) {
      toast.error("Table label is required");
      return;
    }
    if (!tableText.trim()) {
      toast.error("Table text is required");
      return;
    }
    editTableListQuestionMutate({
      bannerID: state.bannerID,
      title: tableLabel,
      description: tableText,
      logic: logics,
      rowOptionList: rows.map(({ op_show, old_q, net, ...item }) => ({
        ...item,
        show: op_show,
        net: net.length ? net : "",
      })),
      tableID: tid,
    });
  };

  return (
    <DynamicModel
      Title={tableLabel}
      description="Update the table details, logic, and row settings, then save the refreshed table configuration."
      descriptionClassName="theme-modal-description"
      headerIcon={
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-primary-softest)] text-login-primary">
          <LuTable className="h-5 w-5" />
        </span>
      }
      disable={isEditTableListQuestionPending}
      ButtonText={
        isEditTableListQuestionPending
          ? definition.submittingLabel!
          : definition.submitLabel!
      }
      buttonIcon={
        isEditTableListQuestionPending ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        ) : (
          <LuSave className="h-4 w-4" />
        )
      }
      isOpen={open}
      onClose={() =>
        !isEditTableListQuestionPending && onOpenChange(false)
      }
      onClick={updateTable}
      className="max-w-6xl"
      bodyClassName="theme-surface"
      buttonVariant="success"
      secondaryAction={
        <Button
          type="button"
          varinat="cancel"
          className="border-gray-300 text-[var(--color-text-strong)] hover:bg-gray-50"
          onClick={() => onOpenChange(false)}
          disabled={isEditTableListQuestionPending}
        >
          {definition.cancelLabel}
        </Button>
      }
    >
      {isLoading ? (
        <div className="flex justify-center">
          <AiOutlineLoading3Quarters
            size={34}
            className={"animate-spin text-action"}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          {opListData.logic.length !== 0 &&
            opListData.logic.some((item: any) =>
              logics.some((logic: any) => logic.pointLogic === item.pointLogic)
            ) && (
              <div>
                <p className="crosstab-title text-sm font-semibold">Banner Point Logic</p>
                {opListData.logic.map((item: any, index: number) => (
                  <div
                    key={index}
                    className="mt-2 flex items-center gap-4 text-[var(--color-questionnaire-stop)]"
                  >
                    <span>
                      <span className="crosstab-title">{index + 1}.</span>{" "}
                      {item.pointLogic}
                    </span>
                    <IconActionButton
                      tone="danger"
                      tooltip="Delete logic"
                      onClick={() =>
                        setLogics((prev) =>
                          prev.filter(
                            (logic) => logic.pointLogic !== item.pointLogic
                          )
                        )
                      }
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </IconActionButton>
                  </div>
                ))}
              </div>
            )}
          <div className="space-y-2">
            <label className="text-base font-medium text-login-primary">
              Table Logic
              <span className="ml-0.5 text-[var(--color-questionnaire-stop)]">
                *
              </span>
            </label>
            <div className="flex items-center gap-2">
              <BannerLogic
                setLogicFunc={(e) => setLogics(e)}
              />
            </div>
          </div>
          <div className="crosstab-surface overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="home-panel-soft-bg border-b home-border-soft">
                  <th className="w-12 border-r home-border-soft px-3 py-3 text-left crosstab-title">
                    Re-order
                  </th>
                  <th className="w-16 border-r home-border-soft px-3 py-3 text-left crosstab-title">
                    Show
                  </th>
                  <th className="w-24 border-r home-border-soft px-3 py-3 text-left crosstab-title">
                    Row ID
                  </th>
                  <th className="border-r home-border-soft px-3 py-3 text-left crosstab-title">
                    Row Title
                  </th>
                  <th className="w-32 px-3 py-3"></th>
                  <th className="w-12 px-3 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y home-border-soft">
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border-r home-border-soft px-3 py-3 align-middle text-center">
                      <Button type="button" varinat="secondary" size="icon" className="crosstab-muted cursor-all-scroll shadow-none">
                        <LuArrowUpDown />
                      </Button>
                    </td>
                    <td className="border-r home-border-soft px-3 py-3 align-middle text-center">
                      <Checkbox
                        checked={Boolean(row.op_show)}
                        onChange={(e) =>
                          handleSelectOption(row.id, e.target.checked)
                        }
                      />
                    </td>
                    <td className="crosstab-title border-r home-border-soft px-3 py-3 align-middle">
                      {row.id}
                    </td>
                    <td className="border-r home-border-soft px-3 py-3">
                      <Input
                        variant="crosstab"
                        value={row.optionText}
                        onChange={(e) =>
                          handleRowTitleChange(row.id, e.target.value)
                        }
                        className="rounded-lg px-2.5 py-2"
                      />
                    </td>
                    <td className="border-r home-border-soft px-3 py-3">
                      {row.id === "" ? (
                        <Select
                          variant="crosstab"
                          className="rounded-lg px-2.5 py-2"
                        >
                          <option value="">Select</option>
                          <option value="option1">Net</option>
                          <option value="option2">Mean</option>
                          <option value="option2">Median</option>
                          <option value="option2">Standard Deviation</option>
                        </Select>
                      ) : null}
                    </td>
                    <td className="px-3 py-3">
                      <IconActionButton
                        tone="danger"
                        tooltip="Delete row"
                        onClick={() => handleDeleteRow(row.id)}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </IconActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DynamicModel>
  );
}
