import type { ApiMethod } from "../services/apiService";

type ApiRegistryEntry = {
  endpoint: string;
  method: ApiMethod;
  queryKey: string;
  mutationKey: string;
};

const url = {
  studyListing: {
    endpoint: "/study/listing",
    method: "post",
    queryKey: "studyListing",
    mutationKey: "study_listing",
  },

  userLogin: {
    endpoint: "/user/login",
    method: "post",
    queryKey: "userLogin",
    mutationKey: "user_login",
  },

  verifyCaptcha: {
    endpoint: "/verify-captcha",
    method: "post",
    queryKey: "verifyCaptcha",
    mutationKey: "verify_captcha",
  },

  userSignup: {
    endpoint: "/user/signup",
    method: "post",
    queryKey: "userSignup",
    mutationKey: "user_signup",
  },

  userLoginOtp: {
    endpoint: "/user/login2",
    method: "post",
    queryKey: "userLoginOtp",
    mutationKey: "user_login_otp",
  },

  userResendOtp: {
    endpoint: "/user/resend-otp",
    method: "post",
    queryKey: "userResendOtp",
    mutationKey: "user_resend_otp",
  },

  userVerifyOtp: {
    endpoint: "/user/verify-otp",
    method: "post",
    queryKey: "userVerifyOtp",
    mutationKey: "user_verify_otp",
  },

  userInfo: {
    endpoint: "/user/info",
    method: "post",
    queryKey: "userInfo",
    mutationKey: "user_info",
  },

  userLookup: {
    endpoint: "/user/lookup",
    method: "post",
    queryKey: "userLookup",
    mutationKey: "user_lookup",
  },

  studyShare: {
    endpoint: "/study/share",
    method: "post",
    queryKey: "studyShare",
    mutationKey: "study_share",
  },

  studyCreate: {
    endpoint: "/study/create",
    method: "post",
    queryKey: "studyCreate",
    mutationKey: "study_create",
  },

  studyInfo: {
    endpoint: "/study/info",
    method: "post",
    queryKey: "studyInfo",
    mutationKey: "study_info",
  },

  studyArchive: {
    endpoint: "/study/archive",
    method: "post",
    queryKey: "studyArchive",
    mutationKey: "study_archive",
  },

  studyDelete: {
    endpoint: "/study/delete",
    method: "post",
    queryKey: "studyDelete",
    mutationKey: "study_delete",
  },

  studyReplicate: {
    endpoint: "/study/replicate",
    method: "post",
    queryKey: "studyReplicate",
    mutationKey: "study_replicate",
  },

  studyActivate: {
    endpoint: "/study/activate",
    method: "post",
    queryKey: "studyActivate",
    mutationKey: "study_activate",
  },

  setLaunch: {
    endpoint: "/study/set/launch",
    method: "post",
    queryKey: "setLaunch",
    mutationKey: "set_launch",
  },

  getQuota: {
    endpoint: "/study/get/quota",
    method: "post",
    queryKey: "getStudyQuota",
    mutationKey: "get_study_quota",
  },

  setQuota: {
    endpoint: "/study/set/quota",
    method: "post",
    queryKey: "setStudyQuota",
    mutationKey: "set_study_quota",
  },

  getSubgroup: {
    endpoint: "/study/get_subgroup",
    method: "post",
    queryKey: "getSubgroup",
    mutationKey: "get_subgroup",
  },

  generateGlobalLink: {
    endpoint: "/study/generate/globallink",
    method: "post",
    queryKey: "generateGlobalLink",
    mutationKey: "generate_global_link",
  },

  studyChatbot: {
    endpoint: "/studychatbot/chatStudy",
    method: "post",
    queryKey: "studyChatbot",
    mutationKey: "study_chatbot",
  },

  getCategories: {
    endpoint: "/specification/getCategories",
    method: "post",
    queryKey: "getCategories",
    mutationKey: "get_categories",
  },

  getSpecs: {
    endpoint: "/specification/getSpecs",
    method: "post",
    queryKey: "getSpecs",
    mutationKey: "get_specs",
  },

  questionnaireQuestionType: {
    endpoint: "/questionnaire/qtype",
    method: "post",
    queryKey: "questionnaireQuestionType",
    mutationKey: "questionnaire_question_type",
  },

  questionnaireAddRi: {
    endpoint: "/questionnaire/add/ri",
    method: "post",
    queryKey: "questionnaireAddRi",
    mutationKey: "questionnaire_add_ri",
  },

  questionnaireAdd: {
    endpoint: "/questionnaire/add",
    method: "post",
    queryKey: "questionnaireAdd",
    mutationKey: "questionnaire_add",
  },

  questionnaireEdit: {
    endpoint: "/questionnaire/edit",
    method: "post",
    queryKey: "questionnaireEdit",
    mutationKey: "questionnaire_edit",
  },

  deleteQuestion: {
    endpoint: "/questionnaire/deleteQuestion",
    method: "post",
    queryKey: "deleteQuestion",
    mutationKey: "delete_question",
  },

  questionCopy: {
    endpoint: "/questionnaire/replicate",
    method: "post",
    queryKey: "questionCopy",
    mutationKey: "question_copy",
  },

  questionRearrange: {
    endpoint: "/questionnaire/rearrange",
    method: "post",
    queryKey: "questionRearrange",
    mutationKey: "question_rearrange",
  },

  fetchQuestionList: {
    endpoint: "/questionnaire/fetch/qlist",
    method: "post",
    queryKey: "fetchQuestionList",
    mutationKey: "fetch_question_list",
  },

  questionView: {
    endpoint: "/questionnaire/view/:qId",
    method: "post",
    queryKey: "questionView",
    mutationKey: "question_view",
  },

  questionGet: {
    endpoint: "/questionnaire/get/:questionId",
    method: "post",
    queryKey: "questionGet",
    mutationKey: "question_get",
  },

  questionEditLogic: {
    endpoint: "/questionnaire/edit/:qId/logic",
    method: "post",
    queryKey: "questionEditLogic",
    mutationKey: "question_edit_logic",
  },

  questionLogicVars: {
    endpoint: "/questionnaire/logic/vars",
    method: "post",
    queryKey: "questionLogicVars",
    mutationKey: "question_logic_vars",
  },

  questionLogicOptions: {
    endpoint: "/questionnaire/logic/opts",
    method: "post",
    queryKey: "questionLogicOptions",
    mutationKey: "question_logic_options",
  },

  facebookLink: {
    endpoint: "/questionnaire/generate/facebook/link",
    method: "post",
    queryKey: "facebookLink",
    mutationKey: "facebook_link",
  },

  whatsappLink: {
    endpoint: "/questionnaire/generate/whatsapp/link",
    method: "post",
    queryKey: "whatsappLink",
    mutationKey: "whatsapp_link",
  },

  crosstabFinalReport: {
    endpoint: "/crosstab/freport",
    method: "post",
    queryKey: "crosstabFinalReport",
    mutationKey: "crosstab_final_report",
  },

  crosstabBannerList: {
    endpoint: "/crosstab/banner/list",
    method: "post",
    queryKey: "crosstabBannerList",
    mutationKey: "crosstab_banner_list",
  },

  crosstabBannerAdd: {
    endpoint: "/crosstab/banner/add",
    method: "post",
    queryKey: "crosstabBannerAdd",
    mutationKey: "crosstab_banner_add",
  },

  crosstabBannerEdit: {
    endpoint: "/crosstab/banner/edit",
    method: "post",
    queryKey: "crosstabBannerEdit",
    mutationKey: "crosstab_banner_edit",
  },

  crosstabBannerDelete: {
    endpoint: "/crosstab/banner/delete",
    method: "post",
    queryKey: "crosstabBannerDelete",
    mutationKey: "crosstab_banner_delete",
  },

  crosstabBannerCopy: {
    endpoint: "/crosstab/banner/replicate",
    method: "post",
    queryKey: "crosstabBannerCopy",
    mutationKey: "crosstab_banner_copy",
  },

  crosstabTableList: {
    endpoint: "/crosstab/tableList/list",
    method: "post",
    queryKey: "crosstabTableList",
    mutationKey: "crosstab_table_list",
  },

  crosstabQuestionList: {
    endpoint: "/crosstab/tableList/qlist",
    method: "post",
    queryKey: "crosstabQuestionList",
    mutationKey: "crosstab_question_list",
  },

  crosstabTableAdd: {
    endpoint: "/crosstab/tableList/add",
    method: "post",
    queryKey: "crosstabTableAdd",
    mutationKey: "crosstab_table_add",
  },

  crosstabTableOutput: {
    endpoint: "/crosstab/tableList/output/:bannerId/:tableId",
    method: "post",
    queryKey: "crosstabTableOutput",
    mutationKey: "crosstab_table_output",
  },

  crosstabLogicVars: {
    endpoint: "/crosstab/logic/vars",
    method: "post",
    queryKey: "crosstabLogicVars",
    mutationKey: "crosstab_logic_vars",
  },

  crosstabLogicOptions: {
    endpoint: "/crosstab/logic/opts",
    method: "post",
    queryKey: "crosstabLogicOptions",
    mutationKey: "crosstab_logic_options",
  },

  crosstabTableOptionList: {
    endpoint: "/crosstab/tableList/opList/:tableId/:qId",
    method: "post",
    queryKey: "crosstabTableOptionList",
    mutationKey: "crosstab_table_option_list",
  },

  crosstabBannerPointList: {
    endpoint: "/crosstab/bannerPoint/list",
    method: "post",
    queryKey: "crosstabBannerPointList",
    mutationKey: "crosstab_banner_point_list",
  },

  crosstabBannerPointAdd: {
    endpoint: "/crosstab/bannerPoint/add",
    method: "post",
    queryKey: "crosstabBannerPointAdd",
    mutationKey: "crosstab_banner_point_add",
  },

  crosstabCustomTableAdd: {
    endpoint: "/crosstab/tableList/custom/add",
    method: "post",
    queryKey: "crosstabCustomTableAdd",
    mutationKey: "crosstab_custom_table_add",
  },

  crosstabTableEditByQuestionId: {
    endpoint: "/crosstab/tableList/edit/:qId",
    method: "post",
    queryKey: "crosstabTableEditByQuestionId",
    mutationKey: "crosstab_table_edit_by_question_id",
  },

  crosstabTableDownload: {
    endpoint: "/crosstab/table/download",
    method: "post",
    queryKey: "crosstabTableDownload",
    mutationKey: "crosstab_table_download",
  },

  reportSideBySideVariables: {
    endpoint: "/report/side_by_side/list/vars",
    method: "post",
    queryKey: "reportSideBySideVariables",
    mutationKey: "report_side_by_side_variables",
  },

  reportFiltersInclude: {
    endpoint: "/report/filters/include",
    method: "post",
    queryKey: "reportFiltersInclude",
    mutationKey: "report_filters_include",
  },

  reportProcessList: {
    endpoint: "/report/processList",
    method: "post",
    queryKey: "reportProcessList",
    mutationKey: "report_process_list",
  },

  reportViewList: {
    endpoint: "/report/view/list",
    method: "post",
    queryKey: "reportViewList",
    mutationKey: "report_view_list",
  },

  reportExportExcel: {
    endpoint: "/report/export/data/excel",
    method: "post",
    queryKey: "reportExportExcel",
    mutationKey: "report_export_excel",
  },

  reportProcess: {
    endpoint: "/report/process",
    method: "post",
    queryKey: "reportProcess",
    mutationKey: "report_process",
  },

  reportExportSpss: {
    endpoint: "/report/export/data/spss",
    method: "post",
    queryKey: "reportExportSpss",
    mutationKey: "report_export_spss",
  },

  reportProcessClear: {
    endpoint: "/report/process/clear",
    method: "post",
    queryKey: "reportProcessClear",
    mutationKey: "report_process_clear",
  },

  reportTableReadyAll: {
    endpoint: "/report/table/ready/all",
    method: "post",
    queryKey: "reportTableReadyAll",
    mutationKey: "report_table_ready_all",
  },

  reportReadyAll: {
    endpoint: "/report/reportReadyAll",
    method: "post",
    queryKey: "reportReadyAll",
    mutationKey: "report_ready_all",
  },

  reportViewById: {
    endpoint: "/report/view/:qId",
    method: "post",
    queryKey: "reportViewById",
    mutationKey: "report_view_by_id",
  },

  reportAppliedFilter: {
    endpoint: "/report/appliedfilter",
    method: "post",
    queryKey: "reportAppliedFilter",
    mutationKey: "report_applied_filter",
  },

  reportFiltersList: {
    endpoint: "/report/filters/list",
    method: "post",
    queryKey: "reportFiltersList",
    mutationKey: "report_filters_list",
  },

  reportFilters: {
    endpoint: "/report/filters",
    method: "post",
    queryKey: "reportFilters",
    mutationKey: "report_filters",
  },
} as Record<string, ApiRegistryEntry>;

export default url;
