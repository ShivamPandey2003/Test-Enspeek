import { useEffect, useRef, useState } from "react";
import { FaPlus, FaRotateLeft } from "react-icons/fa6";
import { LuGitBranchPlus, LuTrash2 } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { setLogic, setValidateLogic } from "../../../store/CrosstabSlice";
import type { AppDispatch, RootState } from "../../../store/store";
import { setLogicPayload } from "../../../store/QuestionSlice";
import { cn } from "../../../utils";
import IconActionButton from "../../ui/IconActionButton";
import Select from "../../ui/Select";
import { useQuestionnaireGetQuestion, useQuestionnaireLogicVars } from "../../../api-network/questionnaire/query";
import { useQuestionLogicOptionsMutation } from "../../../api-network/questionnaire/mutation";

export interface LogicRow {
  id: string;
  groupId: string;
  variable: string;
  option: string;
  value: string;
  connector?: string;
  type: "main" | "condition" | "simple";
}

interface QuesLogicProp {
  activeTab?: number;
  storeComponent?: string;
  setLogicFunc?: (logic: { pointLogic: string }[]) => void;
  questionID: string | null;
  resetFlag?: boolean;
  isOpen: boolean;
}

export default function QuestionLogic({
  setLogicFunc,
  activeTab,
  storeComponent,
  questionID,
  resetFlag,
  isOpen,
}: QuesLogicProp) {
  const [selectedConditions, setSelectedConditions] = useState<Record<string, string>>({});
  const { optsData, varsData, LogicData } = useSelector(
    (state: RootState) => state.crossTabData
  );
  const { validateLogic, logic } = useSelector(
    (state: RootState) => state.crosstab
  );
  const [rows, setRows] = useState<LogicRow[]>(
    LogicData[activeTab as number]?.length
      ? LogicData[activeTab as number]
      : [
        {
          id: "1",
          groupId: "1",
          variable: "",
          option: "",
          value: "",
          type: "main",
        },
      ]
  );

  const connectors = ["AND", "OR"];
  const dispatch = useDispatch<AppDispatch>();
  const { state } = useLocation();
  const location = useLocation();
  const studyID = location.state?.studyID;

  useQuestionnaireLogicVars(state.studyID, questionID || undefined);
  const { mutate: fetchLogicOptions } = useQuestionLogicOptionsMutation(
    state.studyID
  );
  const fetchLogicOptionsRef = useRef(fetchLogicOptions);
  const { questionGetData: data } = useQuestionnaireGetQuestion(
    studyID,
    questionID,
    isOpen
  );

  useEffect(() => {
    fetchLogicOptionsRef.current = fetchLogicOptions;
  }, [fetchLogicOptions]);

  useEffect(() => {
    if (!Object.keys(LogicData).length) {
      setRows([
        {
          id: "1",
          groupId: "1",
          variable: "",
          option: "",
          value: "",
          type: "main",
        },
      ]);
    }
  }, [LogicData]);

  const handleFirstChange = (groupId: string, value: string) => {
    setSelectedConditions((prev) => ({
      ...prev,
      [groupId]: value,
    }));
  };

  const generateLogicPayload = (updatedRows: LogicRow[]) => {
    const groups = [...new Set(updatedRows.map((row) => row.groupId))];
    const logic1Payload: Record<string, any> = {};

    groups.forEach((groupId) => {
      const groupRows = updatedRows.filter((row) => row.groupId === groupId);
      const mainRow = groupRows.find((row) => row.type === "main");
      const conditionRows = groupRows.filter((row) => row.type === "condition");

      if (
        !mainRow ||
        !mainRow.variable?.trim() ||
        !mainRow.option?.trim() ||
        !mainRow.value?.trim()
      ) {
        return;
      }

      const logicType = selectedConditions[groupId];

      if (!logicType) return;

      if (!logic1Payload[logicType]) {
        logic1Payload[logicType] = [];
      }

      logic1Payload[logicType].push({
        _lgic: "IF",
        QID: mainRow.variable,
        optionID: mainRow.option,
        param: mainRow.value,
        value: "",
        extend: conditionRows
          .filter((row) => row.variable && row.option && row.value)
          .map((row) => ({
            _lgic: `${row.connector ?? "AND"} IF`,
            QID: row.variable,
            optionID: row.option,
            param: row.value,
            value: "",
          })),
      });
    });

    return {
      logic1: logic1Payload,
    };
  };

  const dispatchLogic = (updatedRows: LogicRow[]) => {
    const validRows = updatedRows.filter(
      (row) => row.variable && row.option && row.value
    );

    if (
      updatedRows.some(
        (row) =>
          row.variable.trim() !== "" ||
          row.option.trim() !== "" ||
          row.value.trim() !== ""
      )
    ) {
      dispatch(
        setValidateLogic({
          ...validateLogic,
          [activeTab as number]: updatedRows,
        })
      );
    } else {
      const newLogic = { ...validateLogic };
      delete newLogic[activeTab as number];
      dispatch(setValidateLogic(newLogic));
    }

    const logicArray = validRows.map((row) => ({
      pointLogic: `${row.option.includes("_") ? row.option : row.variable.toUpperCase()
        }${row.value}`,
    }));

    dispatch(setLogic({ ...logic, [storeComponent as string]: logicArray }));
    setLogicFunc?.(logicArray);
    const payload = generateLogicPayload(updatedRows);
    dispatch(setLogicPayload({ logic1: payload.logic1 }));
  };

  const handleVariableChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, variable: value, option: "", value: "" } : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
    fetchLogicOptions(value);
  };

  const handleOptionChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, option: value } : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const handleValueChange = (rowId: string, value: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId ? { ...row, value } : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const handleConnectorChange = (rowId: string, value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, connector: value } : row))
    );
  };

  const addNewLogicGroup = () => {
    const newGroupId = Date.now().toString();
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        groupId: newGroupId,
        variable: "",
        option: "",
        value: "",
        type: "main",
      },
    ]);
  };

  const addConditionRow = (groupId: string) => {
    setRows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        groupId,
        variable: "",
        option: "",
        value: "",
        connector: "AND",
        type: "condition",
      },
    ]);
  };

  const resetRow = (rowId: string) => {
    const updatedRows = rows.map((row) =>
      row.id === rowId
        ? {
          ...row,
          variable: "",
          option: "",
          value: "",
          connector: row.type === "condition" ? "AND" : row.connector,
        }
        : row
    );
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const deleteRow = (rowId: string) => {
    const updatedRows = rows.filter((row) => row.id !== rowId);
    setRows(updatedRows);
    dispatchLogic(updatedRows);
  };

  const resetAllGroupRows = (groupId: string) => {
    const updatedRows = rows
      .map((row) =>
        row.groupId === groupId && row.type === "main"
          ? { ...row, variable: "", option: "", value: "" }
          : row
      )
      .filter((row) => row.groupId !== groupId || row.type === "main");

    setRows(updatedRows);
    setSelectedConditions((prev) => {
      const updated = { ...prev };
      delete updated[groupId];
      return updated;
    });
    dispatchLogic(updatedRows);
  };

  const deleteGroup = (groupId: string) => {
    const updatedRows = rows.filter((row) => row.groupId !== groupId);
    setRows(updatedRows);
  };

  useEffect(() => {
    if (!data || !isOpen) return;

    const transformedRows: LogicRow[] = [];
    const selectedConditionMap: Record<string, string> = {};
    const uniqueVariables: string[] = [];
    let groupCounter = 1;

    Object.entries(data).forEach(([logicType, entries]: [string, any]) => {
      if (!Array.isArray(entries)) return;

      entries.forEach((entry: any) => {
        const groupId = `group-${groupCounter += 1}`;

        if (entry.QID) uniqueVariables.push(entry.QID);

        transformedRows.push({
          id: crypto.randomUUID(),
          groupId,
          variable: (entry.QID || "").toLowerCase(),
          option: entry.optionID || "",
          value: String(entry.param || "").trim(),
          type: "main",
        });

        selectedConditionMap[groupId] = logicType;

        if (Array.isArray(entry.extend)) {
          entry.extend.forEach((ext: any) => {
            if (ext.QID) uniqueVariables.push(ext.QID);

            transformedRows.push({
              id: crypto.randomUUID(),
              groupId,
              variable: (ext.QID || "").toLowerCase(),
              option: ext.optionID || "",
              value: String(ext.param || "").trim(),
              connector: ext._lgic?.split(" ")[0] || "AND",
              type: "condition",
            });
          });
        }
      });
    });

    if (transformedRows.length === 0) {
      setRows([
        {
          id: "1",
          groupId: "1",
          variable: "",
          option: "",
          value: "",
          type: "main",
        },
      ]);
      setSelectedConditions({});
      return;
    }

    setRows(transformedRows);
    setSelectedConditions(selectedConditionMap);

    [...new Set(uniqueVariables)].forEach((variable) => {
      if (variable.trim()) {
        fetchLogicOptionsRef.current(variable);
      }
    });
  }, [data, isOpen]);

  useEffect(() => {
    if (!resetFlag) return;

    const resetRows = [
      {
        id: "1",
        groupId: "1",
        variable: "",
        option: "",
        value: "",
        type: "main" as const,
      },
    ];

    setRows(resetRows);
    setSelectedConditions({});
    dispatch(
      setValidateLogic({
        ...validateLogic,
        [activeTab as number]: resetRows,
      })
    );
    dispatch(setLogic({ ...logic, [storeComponent as string]: [] }));
    dispatch(setLogicPayload({ logic1: {} }));
  }, [activeTab, dispatch, resetFlag, storeComponent]);

  useEffect(() => {
    if (!rows.length) return;

    const hasValidMainRow = rows.some(
      (row) =>
        row.type === "main" &&
        row.variable?.trim() &&
        row.option?.trim() &&
        row.value?.trim()
    );

    if (hasValidMainRow) {
      dispatchLogic(rows);
    }
  }, [rows]);

  const uniqueGroupIds = [...new Set(rows.map((row) => row.groupId))];
  const lastGroupId = uniqueGroupIds[uniqueGroupIds.length - 1];

  return (
    <div>
      {uniqueGroupIds.map((groupId, index) => {
        const groupRows = rows.filter((row) => row.groupId === groupId);
        const mainRow = groupRows.find((row) => row.type === "main");
        const conditionRows = groupRows.filter((row) => row.type === "condition");

        return (
          <div
            key={groupId}
            className="questionnaire-card questionnaire-border mb-4 w-full rounded-[22px] border px-4 py-4 shadow-sm"
          >
            {mainRow && (
              <div
                className={cn(
                  "flex flex-wrap items-center gap-3",
                  conditionRows.length > 0 && "mb-4"
                )}
              >
                <Select
                  variant="questionnaire"
                  name="condition"
                  className="min-w-[220px]"
                  value={selectedConditions[groupId] || ""}
                  onChange={(e) => handleFirstChange(groupId, e.target.value)}
                >
                  <option value="">Select condition</option>
                  {varsData?.condition?.length > 0 &&
                    varsData.condition.map((cond: any, conditionIndex: number) => (
                      <option key={conditionIndex} value={cond.code}>
                        {cond.show}
                      </option>
                    ))}
                </Select>

                {selectedConditions[groupId] && (
                  <Select
                    variant="questionnaire"
                    value={mainRow.variable || ""}
                    onChange={(e) => handleVariableChange(mainRow.id, e.target.value)}
                    className="min-w-[220px]"
                  >
                    <option value="">Select variables</option>
                    {varsData?.variables?.survey?.length > 0 && (
                      <optgroup label="survey">
                        {varsData.variables.survey.map((item: any, variableIndex: number) => (
                          <option
                            key={`${item.param}-${variableIndex}`}
                            value={item.param.toLowerCase()}
                          >
                            {item.show}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </Select>
                )}

                {mainRow.variable &&
                  optsData[mainRow.variable] &&
                  optsData[mainRow.variable].length > 0 && (
                    <Select
                      variant="questionnaire"
                      value={mainRow.option || ""}
                      onChange={(e) => handleOptionChange(mainRow.id, e.target.value)}
                      className="min-w-[200px]"
                    >
                      <option value="">Select option</option>
                      {optsData[mainRow.variable].map((opt: any, optionIndex: number) => (
                        <option key={optionIndex} value={opt.mark}>
                          {opt.show}
                        </option>
                      ))}
                    </Select>
                  )}

                {mainRow.option !== "" && (
                  <Select
                    variant="questionnaire"
                    value={String(mainRow.value) || ""}
                    onChange={(e) => handleValueChange(mainRow.id, e.target.value)}
                    className="min-w-[200px]"
                  >
                    <option value="">Select value</option>
                    {optsData[mainRow.variable]
                      ?.find(
                        (opt: any) =>
                          String(opt.mark).toLowerCase() ===
                          String(mainRow.option).toLowerCase()
                      )
                      ?.options?.map((opt: any, valueIndex: number) => (
                        <option key={valueIndex} value={String(opt.code)}>
                          {opt.show}
                        </option>
                      ))}
                  </Select>
                )}

                <div className="flex items-center gap-2">
                  {selectedConditions[groupId] && (
                    <IconActionButton
                      tone="primary"
                      tooltip="Add condition"
                      onClick={() => addConditionRow(groupId)}
                    >
                      <LuGitBranchPlus className="h-4 w-4" />
                    </IconActionButton>
                  )}
                  <IconActionButton
                    tone="neutral"
                    tooltip="Reset group"
                    onClick={() => resetAllGroupRows(groupId)}
                  >
                    <FaRotateLeft />
                  </IconActionButton>

                  {groupId === lastGroupId && (
                    <IconActionButton tone="primary" onClick={addNewLogicGroup}>
                      <FaPlus />
                    </IconActionButton>
                  )}

                  {index > 0 && (
                    <IconActionButton
                      tone="danger"
                      tooltip="Delete group"
                      onClick={() => deleteGroup(groupId)}
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </IconActionButton>
                  )}
                </div>
              </div>
            )}

            {conditionRows.map((row, rowIndex) => (
              <div
                key={row.id}
                className={cn(
                  "flex flex-wrap items-center gap-3",
                  rowIndex !== conditionRows.length - 1 && "mb-4"
                )}
              >
                <div title="AND/OR condition">
                  <Select
                    variant="questionnaire"
                    value={row.connector || "AND"}
                    onChange={(e) => handleConnectorChange(row.id, e.target.value)}
                    className="min-w-[140px]"
                  >
                    {connectors.map((connector) => (
                      <option key={connector} value={connector}>
                        {connector}
                      </option>
                    ))}
                  </Select>
                </div>

                <Select
                  variant="questionnaire"
                  value={row.variable || ""}
                  onChange={(e) => handleVariableChange(row.id, e.target.value)}
                  className="min-w-[220px]"
                >
                  <option value="">Select variables</option>
                  {varsData?.variables?.survey?.length > 0 && (
                    <optgroup label="survey">
                      {varsData.variables.survey.map((item: any, variableIndex: number) => (
                        <option
                          key={`${item.param}-${variableIndex}`}
                          value={item.param.toLowerCase()}
                        >
                          {item.show}
                        </option>
                      ))}
                    </optgroup>
                  )}
                </Select>

                {row.variable &&
                  optsData[row.variable] &&
                  optsData[row.variable].length > 0 && (
                    <Select
                      variant="questionnaire"
                      value={row.option || ""}
                      onChange={(e) => handleOptionChange(row.id, e.target.value)}
                      className="min-w-[200px]"
                    >
                      <option value="">Select option</option>
                      {optsData[row.variable].map((opt: any, optionIndex: number) => (
                        <option key={optionIndex} value={opt.mark}>
                          {opt.show}
                        </option>
                      ))}
                    </Select>
                  )}

                {row.option !== "" && (
                  <Select
                    variant="questionnaire"
                    value={String(row.value) || ""}
                    onChange={(e) => handleValueChange(row.id, e.target.value)}
                    className="min-w-[200px]"
                  >
                    <option value="">Select value</option>
                    {optsData[row.variable]
                      ?.find(
                        (opt: any) =>
                          String(opt.mark).toLowerCase() ===
                          String(row.option).toLowerCase()
                      )
                      ?.options?.map((opt: any, valueIndex: number) => (
                        <option key={valueIndex} value={String(opt.code)}>
                          {opt.show}
                        </option>
                      ))}
                  </Select>
                )}

                <div className="flex items-center gap-2">
                  <IconActionButton
                    tone="neutral"
                    tooltip="Reset row"
                    onClick={() => resetRow(row.id)}
                  >
                    <FaRotateLeft />
                  </IconActionButton>
                  <IconActionButton
                    tone="danger"
                    tooltip="Delete row"
                    onClick={() => deleteRow(row.id)}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </IconActionButton>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
