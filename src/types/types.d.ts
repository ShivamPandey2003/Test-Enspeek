declare type DropdownData = {
  Title: string;
  Icon?: React.ElementType;
  onClick: () => void;
};

declare type Question = {
  qID: string;
  openai_to_show: number;
  "ADD-OPTION": string;
  qText: string;
  qText2: string;
  qType: string;
  ri: string;
  status: string;
  qLabel_esp: string;
  qText_esp: string | null;
  qText2_esp: string | null;
  ri_esp: string | null;
  qLabel: string;
  rating: number;
  hidden_column: number;
  from_output: number;
  modify: number;
  "PIPE-IN-OPTIONS": string;
  logic2: any[];
  note2: any[];
  qNote3: string;
  rowOptionList: Option[];
  colOptionList: Option[];
};

declare type Option = {
  skip_to: string;
  terminate: number;
  exclusive: number;
  optionCode: number;
  optionID: string;
  optionLogic: string;
  optionNote: string;
  optionText: string;
  optionTextSpanish: string;
  optionType: "single-select" | "multiple-select";
  other: boolean;
};

declare type User = {
  apiToken: string;
  firstName: string;
  lastName: string;
  userType: "admin" | "user" | string;
  grp: string;
  suggest_login_password: number;
  updated_on: string;
  enabled: number;
};

declare type Study = {
  projectDescription: string;
  studyName: string;
  studyCategory: string;
  studyState: string;
  createdOn: string;
  studyID: string;
  isActive: number;
  isArchived: number;
  isShared: number;
  program: number;
  programmed: number;
  launch: number;
  link: number;
  liveLink: string | null;
  data: number;
  externalData: number;
  externalDataLink: string | null;
  dashboard: number;
  dashboardLink: string | null;
  report: number;
  tier: number;
  hasQuestionnaire: number;
  downloadReport: string | null;
  output: number;
  studyType: string;
  whichCS: number;
  closed: number;
  kdi: number;
  tracking: number;
  isOwner: number;
  name: string;
  email: string;
  share: number;
  programAllow: number;
  upload: number;
};

declare type QuestionPayload = {
  studyID: string;
  newQID: string;
  qType: string;
  qText: string;
  qLabel: string;
  qText2: string | null;
  colOptionList: any[] | null;
  rowOptionList: any[] | null;
  logic1: Record<string, unknown> | null;
  logic2: string;
  logic3: string;
  note1: string;
  note2: string;
  note3: string;
  ri: string;
  rating: number;
  hidden_column: number;
  from_output: number;
  status: string | null;
  min_selection?: number;
  max_selection?: number;
};

declare type QuestionRedux = {
  CQID: string;
};

declare type QuestionFormat = {
  label: string;
  options: string[];
  qText: string;
  qType: "single-select" | "multi-select" | string;
};

declare type QuestionList = {
  qID: string;
  qType: string;
  qText: string;
  qText2: string;
  ri: string;
  qLabel: string;
};

declare type QuestionGroup = {
  groupID: string;
  groupText: string;
  groupLogic: string;
  qList: QuestionList[];
  logicOptions: {};
};

declare type QuestionData = {
  _coloptions: Record<string, unknown>;
  _coloptions_table: Record<string, unknown>;
  _colorder: string[];
  _colorder_table: string[];
  _rowoptions: Record<string, string>;
  _rowoptions_table: Record<string, string>;
  _roworder: string[];
  _roworder_table: string[];
  all_rollup: string[];
  base: number;
  base_text: string;
  color_code: Record<string, string>;
  data: Record<string, number> | any;
  data_table: Record<string, number>;
  external: number;
  external_link: string;
  is_base: number;
  is_roll_up: number;
  label: string;
  responding_base: Record<string, number>;
  set_roll_up: number;
  symbol: string;
  text: string;
  type: string;
};

declare type SurveyData = {
  BASE: number;
  Cell: string;
  "FILTERED BASE": number;
  [key: string]: QuestionData;
  cell_id: number;
  seq: string[];
};

declare type ReportFilterType = {
  seq: string[];
  [key: string]: Record<string, any>;
  BASE: number;
};

declare type FilterList = {
  id: string;
  label: string;
  marked: boolean;
  type: string;
};

declare type FilterItem = {
  id: string;
  label: string;
  text: string;
  type: string;
  _rowoptions: Record<string, unknown>;
  _coloptions: Record<string, unknown>;
  _roworder: string[];
  _colorder: string[];
  _rowlogic: Record<string, unknown>;
  _collogic: Record<string, unknown>;
};

declare type filterSliceType = {
  FilterList: FilterList[];
  ReportFilterList: FilterItem[];
  tableQList: string[];
  selected: string;
  fliterReportData: string[];
  side_by_side: string;
};

declare type BannerInfo = {
  active: number;
  bannerID: string;
  bannerList_logic: {
    pointLogic: string;
  }[];
  count: number;
  default: number;
  description: string;
  firstName: string;
  lastName: string;
  percent: number;
  seq: number;
  statGroup: string;
  statLevel: string;
  tableID_list: string[];
  tb_enabled: number;
  timestamp: string;
  title: string;
  userID: string;
};

declare type AddBannerPayload = {
  title: string;
  description: string;
  logic: any[];
  count: number;
  percent: number;
};

declare type EditBannerPayload = {
  bannerID: string;
  title: string;
  description: string;
  statGroup: string;
  logic: {
    pointLogic: string;
  }[];
  count: number;
  percent: number;
};

declare type Banner = {
  bannerid: string;
  title: string;
  description: string;
  bannerList_logic: string;
  active: number;
  seq: number;
  statGroup: string;
  statLevel: string | null;
  tb_enabled: number;
  userID: string;
  count: number;
  percent: number;
  default: number;
  tableID_list: string[];
};

declare type CrossTabDataSliceState = {
  Banners: Banner[];
  BannersAll: Banner[];
  BannerPointer: BannerPoint[];
  optsData: Record<string, any>;
  varsData: Record<string, any>;
  LogicData: Record<number, any>;
  tableData: BannerTable[];
};

declare type pointerSegment = {
  pointID: string;
  segTitle: string;
  groupName: string;
  logic: Record<string, string>[];
};

declare type BannerPoint = {
  active: number;
  alpha: string;
  bannerGroup: string;
  logic: {
    pointLogic: string;
  }[];
  pointID: string;
  seq: number;
  statLevel: string | null;
  title: string;
};

declare type BannerTable = {
  tableID: string;
  title: string;
  description: string;
  qID: string;
  qType: string;
  active: number;
  tbl_logic: any[];
};

declare type EditTableListQuestionPayload = {
  bannerID: string;
  description: string;
  tableID: string;
  title: string;
  rowOptionList: {
    active: number;
    id: string;
    optionCode: number;
    optionLogic: {
      pointLogic: string;
    }[];
    optionText: string;
    optionType: string;
    seq: number;
  }[];
  logic: {
    pointLogic: string;
  }[];
};

declare type AddCustomTablePayload = {
  bannerID: string;
  description: string;
  title: string;
  qType: string;
  rowOptionList: {
    active: number;
    id: string;
    optionCode: number;
    optionLogic: {
      pointLogic: string;
    }[];
    optionText: string;
    optionType: string;
    seq: number;
  }[];
  logic: {
    pointLogic: string;
  }[];
};
declare type QuestionOption = {
  id: string;
  optionText: string;
  optionType: string;
  optionLogic: {
    pointLogic: string;
  }[];
  optionCode: number;
  seq: number;
  active: number;
  op_show: number;
  include_in_base: number;
  net: any[];
  mean: number;
  median: number;
  stdev: number;
  old_q: number;
  net_val: number;
};

declare type QuesLogicPayload = {
  logic1: {
    SKIP: [
      {
        _lgic: string;
        QID: string;
        optionID: string;
        param: string;
        value: string;
        extend: [
          {
            _lgic: string;
            QID: string;
            optionID: string;
            param: string;
            value: string;
          }
        ];
      }
    ];
  };
};

declare type QueryStructureProps = {
  queryKey: readonly unknown[];
  queryFn: () => any;
  enable?: boolean;
  refetchOnWindowFocus?: boolean;
  retry?: number;
};

declare type ModalDefinitionId =
  | "archiveStudy"
  | "unarchiveStudy"
  | "copyStudy"
  | "deleteStudy"
  | "copyQuestion"
  | "deleteQuestion"
  | "activateSurvey"
  | "initiateSampleCollection"
  | "facebookLink"
  | "whatsappLink"
  | "chooseSubgroup"
  | "reportFilters"
  | "downloadHistory"
  | "addBanner"
  | "copyBanner"
  | "deleteBanner"
  | "bannerSettings"
  | "updateTable"
  | "logicEditor"
  | "tableHistory"
  | "addCustomTable"
  | "addGroup"
  | "crosstabTable"
  | "fullChartView"
  | "fullTableView";

declare type BaseModalControlProps = {
  isOpen: boolean;
  onClose: () => void;
};

declare type DynamicModalProps = BaseModalControlProps & {
  Title: string;
  headerIcon?: React.ReactNode;
  description?: React.ReactNode;
  descriptionClassName?: string;
  ButtonText: string;
  buttonIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
  disable?: boolean;
  closeDisabled?: boolean;
  className?: string;
  bodyClassName?: string;
  footerContent?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  secondaryActionPosition?: "before" | "after";
  buttonVariant?: import("../components/ui/Button").ButtonProps["varinat"];
};

declare type LogicModalProps = BaseModalControlProps & {
  Title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  disable?: boolean;
  closeDisabled?: boolean;
  className?: string;
  footerContent?: React.ReactNode;
};

declare type ConfirmKeywordModalProps = BaseModalControlProps & {
  onConfirm: () => void;
  titleKey: ModalDefinitionId;
  targetLabel: string;
  keyword?: string;
  actionVerb?: string;
  warningToneClass?: string;
  isPending?: boolean;
  testId?: string;
  infoText?: React.ReactNode;
  appendIrreversibleWarning?: boolean;
  fieldLabel?: React.ReactNode;
};

declare type NameCopyModalProps = BaseModalControlProps & {
  onConfirm: (value: string) => void;
  titleKey: ModalDefinitionId;
  sourceLabel: string;
  fieldLabel: string;
  placeholder: string;
  defaultValue: string;
  copyText: string;
  isPending?: boolean;
};

declare type SocialLinkModalProps = BaseModalControlProps & {
  titleKey: ModalDefinitionId;
  headerIcon: React.ReactNode;
  accentClassName: string;
  linkData?: {
    short_url?: string;
    Message?: string;
  };
  copySuccessMessage: string;
  onSave?: (selected: string) => void;
};

declare type CopyQuestionModalProps = BaseModalControlProps & {
  onClick: (id: string, value: string) => void;
  qID?: string;
  label: string;
  isPending?: boolean;
};

declare type DeleteQuestionModalProps = BaseModalControlProps & {
  onClick: () => void;
  qID?: string;
  label: string;
  isPending?: boolean;
};

declare type ShareStudyModalProps = BaseModalControlProps & {
  studyName: string;
  onClick?: () => void;
};

declare type ActivateSurveyModalProps = BaseModalControlProps & {
  activate: () => Promise<unknown>;
  studyInfo: any;
  isPending: boolean;
};

declare type SampleCollectionModalProps = BaseModalControlProps & {
  studyName?: string;
};

declare type QuestionLogicModalProps = BaseModalControlProps & {
  qID: string | null;
};

declare type AddBannerModalProps = BaseModalControlProps & {
  onBannerDesignClick: (e: AddBannerPayload) => void;
  isPending: boolean;
};

declare type BannerSettingsModalProps = BaseModalControlProps & {
  Id: string;
};

declare type AddCustomTableModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    label: string;
    text: string;
    logic: string;
    rows: {
      id: string;
      title: string;
      variables: string;
      logic: { pointLogic: string }[];
      controls: { id: number; variable: string }[];
    }[];
  }) => void;
};

declare type EditTableModalProps = {
  qid: string;
  tid: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

declare type SetSubgroupModalProps = {
  options: Record<string, any>[];
  onSave: (selected: string) => void | Promise<void>;
  onClose: () => void;
};

declare type HistoryModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

declare type FilterModalProps = {
  isOpen: boolean;
  setIsOpen: () => void;
};

declare type TableAndChartModalProps = BaseModalControlProps & {
  message: any;
  type: "chart" | "table";
};

declare type CrosstabTableModalProps = BaseModalControlProps & {
  message: any;
};
