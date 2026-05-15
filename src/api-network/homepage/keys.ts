import url from "../url";

export const homepageKeys = {
  all: ["homepage"] as const,

  studyList: (selection?: string) =>
    [...homepageKeys.all, url.studyListing.queryKey, selection] as const,

  userInfo: () =>
    [...homepageKeys.all, url.userInfo.queryKey] as const,
};

export default homepageKeys;
