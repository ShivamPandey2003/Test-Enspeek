import { formatRichText } from "../../../../utils";
import Question_Format from "../Question-format";
import type { ChatMessage } from "../types";
import {
  getResponseKeys,
  isStudyListResponse,
  shouldRenderMessageText,
  shouldRenderQuestionFormat,
} from "../utils/messageContent";
import ResearchLink from "./ResearchLink";

type MessageBubbleProps = {
  msg: ChatMessage;
  onCopyLink: (link: string) => void;
  /** Survey view, rendered between the response block and the research link. */
  surveySlot?: React.ReactNode;
};

/**
 * Renders the non-survey content of a message: plain text, questionnaire
 * preview, study-list / key-value responses, the survey slot, and the live
 * research link. Field-level conditions match the original render exactly.
 */
const MessageBubble = ({ msg, onCopyLink, surveySlot }: MessageBubbleProps) => {
  const responseKeys = getResponseKeys(msg.response);

  return (
    <>
      {shouldRenderMessageText(msg) && (
        <div
          className="break-words text-[14px] leading-6"
          dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}
        />
      )}
      {shouldRenderQuestionFormat(msg) && (
        <Question_Format
          questions={msg.questions.questions}
          instruction={msg.instruction ?? ""}
        />
      )}
      {isStudyListResponse(msg.response) ? (
        <ul className="list-disc px-6">
          {msg.response.map((item: { studyID: string; studyName: string }, index) => (
            <li key={index}>{item.studyName}</li>
          ))}
        </ul>
      ) : (
        responseKeys.length > 0 && (
          <div className="mt-2">
            {responseKeys.map((key, index) => (
              <p className="mt-1 break-words" key={index}>
                <strong>{key}:</strong>{" "}
                <span className="text-gray-500">{msg.response[key]}</span>
              </p>
            ))}
          </div>
        )
      )}
      {surveySlot}
      {msg.liveLink && (
        <ResearchLink liveLink={msg.liveLink} onCopy={onCopyLink} />
      )}
    </>
  );
};

export default MessageBubble;
