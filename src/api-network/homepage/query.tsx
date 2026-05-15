import { apiRequest } from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setFilterStudys, setStudys } from "../../store/CrosstabStudySlice";
import url from "../url";
import queryStructure from "../query-template";
import { SyncUserInfo } from "../../store/UserSlice";
import homepageKeys from "./keys";

export const useStudyList = (enableTab: string) => {
    const { apiToken } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const TestFn = async () => {
        const res = await apiRequest(url.studyListing.method, url.studyListing.endpoint, {
            selection: enableTab,
            page: 1,
        });
        dispatch(setStudys(res.response.data));
        dispatch(setFilterStudys(res.response.data));
        return res.response;
    }
    const { data: studyList = {}, isLoading: isListLoading } = queryStructure({
        queryKey: homepageKeys.studyList(enableTab),
        queryFn: TestFn,
        enable: !!apiToken,
    });
    return { studyList, isListLoading };
}

export const useHomepageUserInfo = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();

    const syncUserInfo = async () => {
        const res = await apiRequest(url.userInfo.method, url.userInfo.endpoint, {});

        dispatch(SyncUserInfo({
            firstName: res.response.firstname ?? user.firstName,
            lastName: res.response.lastname ?? user.lastName,
            userType: res.response.usertype ?? user.userType,
            grp: res.response.grp ?? user.grp,
            suggest_login_password: res.response.suggest_login_password ?? user.suggest_login_password,
            updated_on: res.response.updated_on ?? user.updated_on,
            enabled: res.response.enabled ?? user.enabled,
        }));

        return res.response;
    };

    const { error, isLoading } = queryStructure({
        queryKey: homepageKeys.userInfo(),
        queryFn: syncUserInfo,
        enable: !!user.apiToken,
    });

    return { userInfoError: error, isUserInfoLoading: isLoading };
};
