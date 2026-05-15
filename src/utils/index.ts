import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UserProps } from "../components/common/UserManagement/UserCard";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function toTitleCase(value?: string) {
  return (value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

export function getFullName(firstName?: string, lastName?: string) {
  return [toTitleCase(firstName), toTitleCase(lastName)]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function normalizeDisplayName(name?: string, fallback = "there") {
  const normalized = toTitleCase(name);

  return normalized || fallback;
}

export function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function getInitials(name?: string, fallback = "U") {
  const parts = (name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) return fallback.toUpperCase();
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function searchUsers(users: UserProps[], query: string): UserProps[] {
  const lowerQuery = query.toLowerCase().trim();

  return users.filter((user) =>
    [user.name, user.email, user.role].some((field) =>
      field.toLowerCase().includes(lowerQuery)
    )
  );
}

export const handleCopy = async (Link: string) => {
  await navigator.clipboard.writeText(Link);
  toast.success("Link copied to clipboard!");
};

export const handleLinkClick = (link: string) => {
  window.open(link, "_blank");
};

export const handleKeyPress = (
  e: React.KeyboardEvent,
  callback: (e?: any) => void
) => {
  if (
    e.key === "Enter" &&
    !e.shiftKey &&
    (e.target as HTMLInputElement).value.trim() !== ""
  ) {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLInputElement).blur();
    callback(e);
  }
};

const HTML_TAG_PATTERN = /<\/?[a-z][\s\S]*>/i;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const formatRichText = (value?: string) => {
  if (!value) return "";

  if (HTML_TAG_PATTERN.test(value)) {
    return value;
  }

  return escapeHtml(value).replace(/\r\n|\r|\n/g, "<br />");
};

export const ChartResponseReFactor = (Data: SurveyData) => {
  const questionId = Data.seq[0];
  const ChartData = Data[questionId as keyof typeof Data];
  if (!ChartData) return null;
  const isType1 = ChartData._colorder?.length > 0;
  const rowOrder = ChartData._roworder || [];
  const rowOptions = ChartData._rowoptions || {};

  const categories = rowOrder.map((key) => rowOptions[key]);

  if (Boolean(ChartData.external)) {
    return {
      external: ChartData.external,
      categories: [],
      questionId,
      title: ChartData.label,
      chartData: [],
      Image: ChartData.external_link,
      baseText: `Base: (n = ${Data.BASE})`,
      questionText: ChartData.text,
      totalRespondents: Data.BASE,
    };
  }

  let chartData: any[] = [];

  if (isType1) {
    chartData = ChartData._colorder.map((colKey: string) => {
      const data = rowOrder.map((rowKey: string) => {
        return ChartData.data?.[colKey]?.[rowKey] ?? 0;
      });

      return {
        type: "column",
        name: ChartData._coloptions?.[colKey] ?? colKey,
        data,
        color: "#3F72AF",
      };
    });
  } else {
    const seriesData = rowOrder.map((key: string | number) => {
      return ChartData.data?.[key] ?? 0;
    });

    chartData = [
      {
        type: "column",
        name: "response",
        data: seriesData,
        color: "#3F72AF",
      },
    ];
  }

  return {
    external: ChartData.external,
    questionId,
    title: ChartData.label,
    chartData,
    categories,
    baseText: `Base: (n = ${Data.BASE})`,
    questionText: ChartData.text,
    totalRespondents: Data.BASE,
  };
};

export function getTableDataFromSurvey(Data: any) {
  const ChartData = Data[Data.seq[0]];
  if (!ChartData) return null;

  const questionId = Data.seq[0];
  const title = ChartData.label;
  const baseText = `Base: (n = ${Data.BASE})`;
  const questionText = ChartData.text;

  const isColumnType =
    ChartData._colorder &&
    Array.isArray(ChartData._colorder) &&
    ChartData._colorder.length > 0;

  if (!isColumnType) {
    const headers = ["Total"];
    const rows = ChartData._roworder.map((key:any) => ({
      rowLabel: ChartData._rowoptions[key],
      values: [`${ChartData.data[key]}%`],
    }));

    return {
      questionId,
      title,
      baseText,
      questionText,
      headers,
      baseRow: [`${Data.BASE}`],
      rows,
    };
  }

  const headers = ChartData._colorder.map(
    (col:any) => ChartData._coloptions[col] || col
  );

  const rows = ChartData._roworder.map((rowKey:any) => {
    return {
      rowLabel: ChartData._rowoptions[rowKey],
      values: ChartData._colorder.map((colKey:any) => {
        const val = ChartData.data?.[colKey]?.[rowKey] ?? 0;
        return `${val}%`;
      }),
    };
  });

  const baseRow = ChartData._colorder.map(
  (colKey: string) =>
    ChartData.base?.[colKey]?.[ChartData._roworder[0]] ?? 0
);


  return {
    questionId,
    title,
    baseText,
    questionText,
    headers,
    baseRow,
    rows,
  };
}
