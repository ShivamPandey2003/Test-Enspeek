import { useEffect, useMemo, useState, type FC } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatRichText } from "../../../utils";
import Button from "../../ui/Button";


interface Question_FormatProps {
    questions: QuestionFormat[];
    instruction: string
}

const Question_Format: FC<Question_FormatProps> = ({ questions = [], instruction }) => {
    const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});
    const questionsStateKey = useMemo(
        () =>
            questions
                .map((question) =>
                    [
                        question.label,
                        question.qText,
                        question.qType,
                        Array.isArray(question.options) ? question.options.join("\u001f") : "",
                    ].join("\u001e")
                )
                .join("\u001d"),
        [questions]
    );
    const expandableQuestionIndexes = useMemo(
        () =>
            questions
                .map((question, index) => ({
                    index,
                    isExpandable: Array.isArray(question.options) && question.options.length > 0,
                }))
                .filter((question) => question.isExpandable)
                .map((question) => question.index),
        [questions]
    );
    const hasMultipleExpandableQuestions = expandableQuestionIndexes.length > 1;
    const areAllQuestionsExpanded = useMemo(
        () =>
            expandableQuestionIndexes.length > 0 &&
            expandableQuestionIndexes.every((index) => expandedQuestions[index]),
        [expandedQuestions, expandableQuestionIndexes]
    );

    useEffect(() => {
        setExpandedQuestions({});
    }, [questionsStateKey]);

    const setQuestionExpanded = (index: number, isExpanded: boolean) => {
        setExpandedQuestions((current) => ({
            ...current,
            [index]: isExpanded,
        }));
    };

    const setAllQuestionsExpanded = (isExpanded: boolean) => {
        setExpandedQuestions(
            expandableQuestionIndexes.reduce<Record<number, boolean>>((nextExpandedQuestions, index) => {
                nextExpandedQuestions[index] = isExpanded;
                return nextExpandedQuestions;
            }, {})
        );
    };

    return (
        <div className="flex flex-col gap-2">
            {hasMultipleExpandableQuestions ? (
                <div className="flex flex-wrap items-center justify-end gap-2">
                    <Button
                        type="button"
                        variant="link"
                        size="default"
                        className="px-0 py-0 text-xs font-semibold leading-5"
                        onClick={() => setAllQuestionsExpanded(!areAllQuestionsExpanded)}
                    >
                        {areAllQuestionsExpanded ? "Collapse all" : "Expand all"}
                    </Button>
                </div>
            ) : null}
            {questions.map((question, i) => {
                const hasHiddenDetails = Array.isArray(question.options) && question.options.length > 0;

                return (
                <div key={`${question.label}-${i}`} className="border-b home-border last:border-b-0">
                    <strong className="break-words">{question.label}</strong>
                    <div className="mb-1.5 mt-1.5 break-words">
                        <strong className="me-1">Q{i + 1}:</strong>
                        <em>{question.qText}</em>
                    </div>
                    <div className="mb-1.5 break-words">
                        <strong>Question Type:</strong> {question.qType}
                    </div>
                    {hasHiddenDetails && expandedQuestions[i] ? (
                        <ul className="mb-1.5 flex flex-col gap-1">
                            {question?.options?.map((option, idx) => (
                                <li key={`${option}-${idx}`} className="flex items-center gap-1 break-words">
                                    <Checkbox checked={false} readOnly tabIndex={-1} />
                                    <span>{option}</span>
                                </li>
                            ))}
                        </ul>
                    ) : null}
                    {hasHiddenDetails ? (
                    <div className="flex justify-start">
                        <Button
                            type="button"
                            variant="link"
                            size="default"
                            className="px-0 py-0 text-xs font-semibold leading-5"
                            onClick={() => setQuestionExpanded(i, !expandedQuestions[i])}
                        >
                            {expandedQuestions[i] ? "Show less" : "Show more..."}
                        </Button>
                    </div>
                    ) : null}
                </div>
                );
            })}
            {instruction ? (
                <div className="break-words" dangerouslySetInnerHTML={{ __html: formatRichText(instruction) }} />
            ) : null}
        </div>
    );
};

export default Question_Format;

