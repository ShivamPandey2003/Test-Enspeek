export const getPageName = (path: string): string => {
  if (path.includes("questionnaire")) {
    return "qnr";
  } else if (path.includes("publish-survey")) {
    return "svry";
  } else if (path.includes("create")) {
    return "crt";
  } else if (path.includes("report")) {
    return "rpt";
  } else if (path.includes("crosstab")) {
    return "xtab";
  } else if (path.includes("/")) {
    return "db";
  }

  return '';
}

