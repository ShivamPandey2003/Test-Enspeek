export type StudyListItem = Record<string, unknown>;

const getStudyField = (study: StudyListItem, ...keys: string[]) => {
  for (const key of keys) {
    const value = study?.[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  return "";
};

export const formatStudyDate = (value?: string | null) => {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) {
    return "";
  }

  const dateMatch = rawValue.match(/\d{4}-\d{2}-\d{2}/);
  const dateOnly = dateMatch?.[0] || rawValue;
  const parts = dateOnly.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (parts) {
    const [, year, month, day] = parts;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  const parsedDate = new Date(rawValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  return rawValue.replace(/\s+\d{1,2}:\d{2}:\d{2}.*$/, "");
};

export const getStudySearchText = (study: StudyListItem) => {
  const fields = [
    getStudyField(study, "studyname", "studyName"),
    getStudyField(study, "studystate", "studyState"),
    getStudyField(study, "createdbyname", "createdByName", "name", "email"),
    formatStudyDate(getStudyField(study, "createdon", "createdOn")),
  ];

  return fields.join(" ").toLowerCase();
};

export const filterStudiesBySearch = (
  studies: StudyListItem[] = [],
  searchTerm: string
) => {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return studies;
  }

  return studies.filter((study) =>
    getStudySearchText(study).includes(normalizedSearch)
  );
};
