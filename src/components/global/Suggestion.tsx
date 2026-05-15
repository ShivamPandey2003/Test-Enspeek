import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import type { AppDispatch, RootState } from "../../store/store";
import { setIsAddingQuestion, setQType } from "../../store/TriggerSlice";
import { setChatOpen } from "../../store/ChatSlice";
import useAiChat from "../../api-network/global/ai-chat";
import Button from "../ui/Button";
import { setEditingQuestion } from "../../store/QuestionSlice";

type SuggestionAction = {
  label: string;
  onClick: () => void;
};

const Suggestion = () => {
  const { pathname } = useLocation();
  const { link, name } = useSelector((state: RootState) => state.study);
  const dispatch = useDispatch<AppDispatch>();

  const { sendMessage, setDraftMessage } = useAiChat();

  const renderSuggestionRow = (actions: SuggestionAction[]) => (
    <div className="hidden gap-1 md:flex lg:gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          type="button"
          varinat="chip"
          size="xs"
          className="h-7 rounded-lg font-medium"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );

  if (pathname === "/questionnaire") {
    return renderSuggestionRow([
      {
        label: "Create New Question",
        onClick: () => {
          dispatch(setEditingQuestion(null));
          dispatch(setIsAddingQuestion(true));
          dispatch(setQType("text-only"));
          dispatch(setChatOpen(false));
        },
      },
      {
        label: "Generate",
        onClick: () => setDraftMessage("Generate questions [subject]"),
      },
      {
        label: "Remove",
        onClick: () => setDraftMessage("Delete question [Q.no]"),
      },
      {
        label: "Re-arrange",
        onClick: () => setDraftMessage("Move [Q3] to [position/Q4]"),
      },
    ]);
  }

  if (pathname === "/publish-survey") {
    const actions: SuggestionAction[] = [];

    if (!link) {
      actions.push({
        label: "Activate",
        onClick: () => setDraftMessage("Activate study"),
      });
    }

    actions.push(
      {
        label: "Survey Link",
        onClick: () => sendMessage("Give survey link"),
      },
      {
        label: "Test Link",
        onClick: () => sendMessage("Give me test link"),
      }
    );

    return renderSuggestionRow(actions);
  }

  if (pathname === "/report") {
    return renderSuggestionRow([
      {
        label: "Download PPT",
        onClick: () => setDraftMessage("Download PPT"),
      },
      {
        label: "Download Excel",
        onClick: () => setDraftMessage("Download Excel"),
      },
      {
        label: "Download SPSS",
        onClick: () => setDraftMessage("Download SPSS"),
      },
      {
        label: "Download Table",
        onClick: () => setDraftMessage("Download table raw data"),
      },
      {
        label: "Get Data",
        onClick: () => setDraftMessage("Get data of [Qid]"),
      },
    ]);
  }

  if (!pathname.split("/")[1]) {
    return renderSuggestionRow([
      {
        label: "Create Study",
        onClick: () => setDraftMessage("create study [study name]"),
      },
      {
        label: "Archived Study Count",
        onClick: () => sendMessage("archived study count"),
      },
      {
        label: "Total Study",
        onClick: () => sendMessage("total study"),
      },
    ]);
  }

  return renderSuggestionRow([
    {
      label: "Archived Study Count",
      onClick: () => sendMessage("archived study count"),
    },
    {
      label: "Study Info",
      onClick: () => sendMessage(`study info ${name}`),
    },
    {
      label: "Total Study",
      onClick: () => sendMessage("total study"),
    },
  ]);
};

export default Suggestion;
