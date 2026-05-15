import type { ReactElement } from "react";
import {
  LuArchive,
  LuBadgeCheck,
  LuCalendar,
  LuChartBar,
  LuCirclePlus,
  LuClipboardList,
  LuDownload,
  LuEraser,
  LuFileSpreadsheet,
  LuFolders,
  LuLink,
  LuMove,
  LuSearchCheck,
  LuTable,
  LuTrash2,
  LuWandSparkles,
} from "react-icons/lu";

export type PromptCatalogItem = {
  id: string;
  label: string;
  description?: string;
  message?: string;
  icon: ReactElement;
};

export const promptCatalog: PromptCatalogItem[] = [
  {
    id: "studies created by [owner name]",
    label: "Studies by Owner",
    icon: <LuFolders className="h-4 w-4" />,
    description: "AI lists all studies from that owner",
    message: "studies created by [owner name]",
  },
  {
    id: "count of in progress studies",
    label: "In Progress Count",
    icon: <LuSearchCheck className="h-4 w-4" />,
    description: "AI tells how many studies are in progress",
    message: "count of in progress studies",
  },
  {
    id: "give me survey link of [study name]",
    label: "Survey Link",
    icon: <LuLink className="h-4 w-4" />,
    description: "AI fetches the survey link for a study",
    message: "give me survey link of [study name]",
  },
  {
    id: "studies created on [mm, dd]",
    label: "Studies by Date",
    icon: <LuCalendar className="h-4 w-4" />,
    description: "AI filters studies by creation date",
    message: "studies created on [mm, dd]",
  },
  {
    id: "give me archived studies",
    label: "Archived Studies",
    icon: <LuArchive className="h-4 w-4" />,
    description: "AI lists all archived studies",
    message: "give me archived studies",
  },
  {
    id: "create [study name]",
    label: "Create Study",
    icon: <LuCirclePlus className="h-4 w-4" />,
    description: "Creates a new study and navigates",
    message: "create [study name]",
  },
  {
    id: "go QNR of particular [study name]",
    label: "Go To Questionnaire",
    icon: <LuClipboardList className="h-4 w-4" />,
    message: "go QNR of particular [study name]",
  },
  {
    id: "generate 4 questions related to any topic",
    label: "Generate Questions",
    icon: <LuWandSparkles className="h-4 w-4" />,
    message: "generate [number] questions related to [topic]",
  },
  {
    id: "generate 5 question with 3 open end related to any topic",
    label: "Questions By Type",
    icon: <LuWandSparkles className="h-4 w-4" />,
    message:
      "generate [number] questions with [number and question type] related to [topic]",
  },
  {
    id: "add all questions",
    label: "Add All Questions",
    icon: <LuDownload className="h-4 w-4" />,
    message: "add all questions",
  },
  {
    id: "add 1,2,3,6 questions",
    label: "Add Selected Questions",
    icon: <LuClipboardList className="h-4 w-4" />,
    message: "add [question number] questions",
  },
  {
    id: "move cq2 to 8",
    label: "Move Question",
    icon: <LuMove className="h-4 w-4" />,
    message: "move [question no] to [question no]",
  },
  {
    id: "move c8 to top or bottom",
    label: "Move To Position",
    icon: <LuMove className="h-4 w-4" />,
    message: "move [question no] to [position example:- top, bottom]",
  },
  {
    id: "delete cq5 question",
    label: "Delete Question",
    icon: <LuTrash2 className="h-4 w-4" />,
    message: "delete [question no]",
  },
  {
    id: "remove 1,2,5 questions",
    label: "Remove Questions",
    icon: <LuEraser className="h-4 w-4" />,
    message: "remove [question no]",
  },
  {
    id: "delete all questions",
    label: "Delete All Questions",
    icon: <LuTrash2 className="h-4 w-4" />,
    message: "delete all questions",
  },
  {
    id: "activate study",
    label: "Activate Study",
    icon: <LuBadgeCheck className="h-4 w-4" />,
    description: "Activate study [study name]",
    message: "activate study",
  },
  {
    id: "give me test link",
    label: "Get Test Link",
    icon: <LuLink className="h-4 w-4" />,
    message: "give me test link",
  },
  {
    id: "Download raw table of [study name]",
    label: "Download Raw Table",
    icon: <LuTable className="h-4 w-4" />,
    message: "Download raw table of [study name]",
  },
  {
    id: "Download Excel file of [study name]",
    label: "Download Excel",
    icon: <LuFileSpreadsheet className="h-4 w-4" />,
    message: "Download Excel file of [study name]",
  },
  {
    id: "Download PPT of [study name]",
    label: "Download PPT",
    icon: <LuChartBar className="h-4 w-4" />,
    message: "Download PPT of [study name]",
  },
  {
    id: "Download PPT of [qid] in [study name]",
    label: "Download PPT By QID",
    icon: <LuChartBar className="h-4 w-4" />,
    message: "Download PPT of [qid] in [study name]",
  },
  {
    id: "Download SPSS file of [study name]",
    label: "Download SPSS",
    icon: <LuChartBar className="h-4 w-4" />,
    message: "Download SPSS file of [study name]",
  },
  {
    id: "Get data of [qid] in [study name]",
    label: "Get Data",
    icon: <LuDownload className="h-4 w-4" />,
    message: "Get data of [qid] in [study name]",
  },
  {
    id: "Get count of completed surveys in [study name]",
    label: "Completed Count",
    icon: <LuChartBar className="h-4 w-4" />,
    message: "Get count of completed surveys in [study name]",
  },
  {
    id: "Get count of incompleted surveys in [study name]",
    label: "Incomplete Count",
    icon: <LuChartBar className="h-4 w-4" />,
    message: "Get count of incompleted surveys in [study name]",
  },
];
