import { apiRequest } from "../../services/apiService";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { setFilterStudys, setStudys } from "../../store/CrosstabStudySlice";
import url from "../url";
import queryStructure from "../query-template";
import { SyncUserInfo } from "../../store/UserSlice";
import homepageKeys from "./keys";
import { toNumber } from "../../utils";

export const syncHomepageUserInfo = async (
    user: RootState["user"],
    dispatch: AppDispatch
) => {
    const res = await apiRequest(url.userInfo.method, url.userInfo.endpoint, {});
    const response = res?.response ?? {};

    dispatch(SyncUserInfo({
        email: response.email ?? user.email,
        userId: response.user_id ?? user.userId,
        firstName: response.firstname ?? user.firstName,
        lastName: response.lastname ?? user.lastName,
        loginType: response.loginType ?? response.logintype ?? user.loginType,
        userType: response.usertype ?? user.userType,
        planType: toNumber(response.user_type, user.planType),
        grp: response.grp ?? user.grp,
        suggest_login_password: response.suggest_login_password ?? user.suggest_login_password,
        updated_on: response.updated_on ?? user.updated_on,
        createdAt: response.created_at ?? user.createdAt,
        updatedAt: response.updated_at ?? user.updatedAt,
        enabled: response.enabled ?? user.enabled,
        isActive: response.is_active ?? user.isActive,
        isApproved:
            response.is_approved === undefined
                ? user.isApproved
                : Number(response.is_approved) === 1,
        planInfoSynced: true,
        createdStudies: toNumber(response.createdstudies, user.createdStudies),
        allowedStudies: toNumber(response.allowedstudies, user.allowedStudies),
        usedPrompt: toNumber(response.used_prompt, user.usedPrompt),
        allowedPrompt: toNumber(response.allowed_prompt, user.allowedPrompt),
        createdQuestions: toNumber(response.created_questions, user.createdQuestions),
        allowedQuestions: toNumber(response.allowed_questions, user.allowedQuestions),
    }));

    return response;
};

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

    const { error, isLoading } = queryStructure({
        queryKey: homepageKeys.userInfo(),
        queryFn: () => syncHomepageUserInfo(user, dispatch),
        enable: !!user.apiToken,
    });

    return { userInfoError: error, isUserInfoLoading: isLoading };
};
