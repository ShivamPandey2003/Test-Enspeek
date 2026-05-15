import type { FC } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatRichText } from "../../../utils";


interface Question_FormatProps {
    questions: QuestionFormat[];
    instruction: string
}

const Question_Format: FC<Question_FormatProps> = ({ questions = [], instruction }) => {
    return (
        <div className="flex flex-col">
            {questions.map((question, i) => (
                <div key={i} className="mt-3">
                    <strong>{question.label}</strong>
                    <div className="mt-2 mb-2">
                        <strong className="me-1">Q{i + 1}:</strong>
                        <em>{question.qText}</em>
                    </div>
                    <div className="mb-2">
                        <strong>Question Type:</strong> {question.qType}
                    </div>
                    <ul className="mb-2">
                        {question?.options?.map((option, idx) => (
                            <div  key={idx} className="flex items-center gap-1"><Checkbox checked={false} readOnly tabIndex={-1} /><li>{option}</li></div>
                        ))}
                    </ul>
                </div>
            ))}
            <div className="break-words" dangerouslySetInnerHTML={{ __html: formatRichText(instruction) }} />
        </div>
    );
};

export default Question_Format;

