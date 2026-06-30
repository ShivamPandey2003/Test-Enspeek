const MASTER_DATA_STORAGE_KEY = "masterData";
export const CHAT_HISTORY_READY_EVENT = "enspeek:chat-history-ready";

type MasterDataValue = string | number | boolean | null | undefined;

export type MasterData = Record<string, MasterDataValue> & {
  process_id?: string;
  order?: number;
};

type ChatProcess = {
  process_id?: unknown;
  order?: unknown;
};

const isBrowser = () => typeof window !== "undefined";

const isValidProcessId = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isValidOrder = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toMasterData = (value: unknown): MasterData => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as MasterData;
};

export const getMasterData = (): MasterData => {
  if (!isBrowser()) return {};

  try {
    const storedValue = window.localStorage.getItem(MASTER_DATA_STORAGE_KEY);
    if (!storedValue) return {};

    return toMasterData(JSON.parse(storedValue));
  } catch {
    return {};
  }
};

export const setMasterData = (masterData: MasterData) => {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(
      MASTER_DATA_STORAGE_KEY,
      JSON.stringify(masterData)
    );
  } catch {
    // Best effort persistence only.
  }
};

export const clearMasterDataProcess = () => {
  const masterData = getMasterData();

  delete masterData.process_id;
  delete masterData.order;

  setMasterData(masterData);

  return masterData;
};

export const updateMasterDataProcess = (process?: ChatProcess | null) => {
  if (!process) {
    return clearMasterDataProcess();
  }

  if (!isValidProcessId(process.process_id) || !isValidOrder(process.order)) {
    return clearMasterDataProcess();
  }

  const masterData = getMasterData();
  masterData.process_id = process.process_id;
  masterData.order = process.order;
  setMasterData(masterData);

  return masterData;
};

export const hasStoredProcessData = (masterData: MasterData) =>
  isValidProcessId(masterData.process_id) && isValidOrder(masterData.order);

