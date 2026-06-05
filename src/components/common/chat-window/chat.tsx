import React, { useEffect, useLayoutEffect, useState } from "react";
import TypingIndicator from "./typing-indicator";
import Question_Format from "./Question-format";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import { setMessage, setMessages } from "../../../store/ChatSlice";
import { useLocation } from "react-router";
import { cn, formatRichText } from "../../../utils";
import { FaChartBar, FaCopy, FaExpandArrowsAlt, FaTable } from "react-icons/fa";
import SingleSelectChart from "../Report/Charts";
import TableForm from "../Report/TableForm";
import QuestionCard from "../Report/QuestionCard";
import TableAndChartModal from "../Report/TableAndChartModal";
import TableModal from "../Crosstab/TableModal";
import { toast } from "sonner";
import { PRIMARY_CHART_COLOR } from "../../../utils/chartColors";
import { getFullName } from "../../../utils";
import { LuBotMessageSquare, LuSparkles } from "react-icons/lu";
import Button from "../../ui/Button";
import IconActionButton from "../../ui/IconActionButton";
import AvatarInitials from "../../ui/AvatarInitials";
import { CHAT_AGENT_INITIALS, CHAT_AGENT_LABEL, CHAT_AGENT_NAME } from "../../../config/chatAgent";
import { FOCUS_CHAT_INPUT_EVENT } from "../../../utils/modalFocus";
import { LuCopy, LuPencilLine } from "react-icons/lu";

const RESPONSE_SCROLL_GAP = 12;

const getUserInitials = (firstName?: string, lastName?: string) => {
  const parts = [firstName, lastName]
    .map((part) => part?.trim())
    .filter(Boolean) as string[];

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "U";

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

const getReadableMessageText = (value?: string) => {
  if (!value) return "";

  const parser = new DOMParser();
  const documentValue = parser.parseFromString(value, "text/html");
  const parsedText = documentValue.body.textContent?.trim();

  return parsedText || value.replace(/<[^>]*>/g, "").trim();
};

const toArray = <T,>(value: unknown): T[] => {
  return Array.isArray(value) ? value : [];
};

const toRecord = (value: unknown): Record<string, unknown> => {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
};

const toDisplayText = (value: unknown, fallback = "") => {
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  return fallback;
};

const toChartNumber = (value: unknown) => {
  if (typeof value === "number") return value;

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const ChatWindow: React.FC<{
  surface?: "auto" | "page" | "card";
  scrollMode?: "internal" | "external";
}> = ({
  surface = "auto",
  scrollMode = "internal",
}) => {
  const { messages, isTyping, pending } = useSelector(
    (state: RootState) => state.chat
  );
  const { firstName, lastName } = useSelector((state: RootState) => state.user);
  const { pathname } = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const messageRowRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const messageContentRefs = React.useRef<Array<HTMLDivElement | null>>([]);
  const scrollTimersRef = React.useRef<number[]>([]);
  const latestRowObserverRef = React.useRef<ResizeObserver | null>(null);
  const previousChatStateRef = React.useRef({
    messageCount: messages.length,
    isTyping,
    pending,
  });
  const CHAT_HISTORY_KEY = "chat_history";
  const findScrollableAncestor = (element: HTMLElement | null) => {
    let current = element?.parentElement ?? null;

    while (current) {
      const style = window.getComputedStyle(current);
      const canScroll =
        /(auto|scroll)/.test(style.overflowY) &&
        current.scrollHeight > current.clientHeight;

      if (canScroll) {
        return current;
      }
      current = current.parentElement;
    }

    return null;
  };
  const getScrollElement = () => {
    if (scrollMode === "internal") {
      return scrollContainerRef.current;
    }

    return findScrollableAncestor(rootRef.current);
  };
  const scrollToBottom = () => {
    const scrollElement = getScrollElement();

    if (!scrollElement) return;
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: "smooth",
    });
  };
  const clearScheduledScrolls = () => {
    scrollTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    scrollTimersRef.current = [];
  };
  const disconnectLatestRowObserver = () => {
    latestRowObserverRef.current?.disconnect();
    latestRowObserverRef.current = null;
  };
  const scheduleScroll = (callback: () => void, delay = 0) => {
    const timer = window.setTimeout(() => {
      scrollTimersRef.current = scrollTimersRef.current.filter(
        (activeTimer) => activeTimer !== timer
      );
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(callback);
      });
    }, delay);
    scrollTimersRef.current.push(timer);
  };
  const scheduleRowAlignment = (index: number) => {
    clearScheduledScrolls();
    disconnectLatestRowObserver();
    [0, 80, 160, 280, 440].forEach((delay) => {
      scheduleScroll(() => scrollMessageRowIntoView(index), delay);
    });

    const row = messageRowRefs.current[index];
    if (!row || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      scrollMessageRowIntoView(index);
    });
    observer.observe(row);
    latestRowObserverRef.current = observer;

    scheduleScroll(() => {
      disconnectLatestRowObserver();
    }, 900);
  };
  const scheduleBottomScroll = () => {
    clearScheduledScrolls();
    disconnectLatestRowObserver();
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(scrollToBottom);
    });
  };
  const scrollMessageRowIntoView = (index: number) => {
    const container = getScrollElement();
    const row = messageRowRefs.current[index];

    if (!container || !row) return;
    const containerRect = container.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const nextScrollTop =
      container.scrollTop + (rowRect.top - containerRect.top) - RESPONSE_SCROLL_GAP;

    container.scrollTop = Math.max(nextScrollTop, 0);
  };
  const hasLoadedFromStorage = React.useRef(false);
  const [selectedChart, setSelectedChart] = React.useState<number | null>(null);
  const [isChartModalOpen, setIsChartModalOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<{
    [key: number]: "chart" | "table";
  }>({});
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [selectedCrosstab, setSelectedCrosstab] = useState<number | null>(null);
  const [isCrosstabModalOpen, setIsCrosstabModalOpen] = useState(false);
  const fullName = getFullName(firstName, lastName) || firstName || "User";
  const userInitials = getUserInitials(firstName, lastName);
  const isHomePageSurface =
    pathname === "/" && (surface === "auto" || surface === "page");
  const isResponseLocked = isTyping || pending;
  const handleCopyMessage = async (index: number, text?: string, includeRenderedContent = true) => {
    const renderedText = includeRenderedContent
      ? messageContentRefs.current[index]?.innerText?.trim()
      : "";
    const readableText = renderedText || getReadableMessageText(text);

    if (!readableText) {
      toast.warning("No message text to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(readableText);
      toast.success("Message copied.");
    } catch {
      toast.error("Unable to copy message.");
    }
  };
  const handleEditMessage = (text?: string) => {
    const readableText = getReadableMessageText(text);

    if (!readableText || isResponseLocked) return;

    dispatch(setMessage(readableText));
    window.dispatchEvent(new Event(FOCUS_CHAT_INPUT_EVENT));
  };
  useEffect(() => {
    const defaultTabs: { [key: number]: "chart" | "table" } = {};
    messages.forEach((_, i) => {
      defaultTabs[i] = "chart";
    });
    setActiveTab(defaultTabs);
  }, [messages]);

  React.useEffect(() => {
    if (hasLoadedFromStorage.current || messages.length > 0) {
      hasLoadedFromStorage.current = true;
      return;
    }

    const chat = localStorage.getItem(CHAT_HISTORY_KEY);
    if (chat) {
      dispatch(setMessages(JSON.parse(chat)));
    }
    hasLoadedFromStorage.current = true;
  }, []);

  React.useEffect(() => {
    if (hasLoadedFromStorage.current) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  React.useEffect(() => {
    return () => {
      clearScheduledScrolls();
      disconnectLatestRowObserver();
    };
  }, []);

  useLayoutEffect(() => {
    scheduleBottomScroll();
  }, [pathname]);

  useLayoutEffect(() => {
    const previousState = previousChatStateRef.current;
    const latestMessage = messages[messages.length - 1];
    const messageAdded = messages.length > previousState.messageCount;
    const thinkingStarted =
      (isTyping || pending) && !(previousState.isTyping || previousState.pending);

    if (messageAdded && latestMessage?.sender === "user") {
      scheduleBottomScroll();
    } else if (thinkingStarted) {
      scheduleBottomScroll();
    } else if (messageAdded && latestMessage) {
      scheduleRowAlignment(messages.length - 1);
    }

    previousChatStateRef.current = {
      messageCount: messages.length,
      isTyping,
      pending,
    };
  }, [isHomePageSurface, isTyping, messages, pending]);

  return (
    <div
      ref={rootRef}
      className="z-50 flex h-full min-h-0 w-full max-w-full flex-col"
    >
      <div
        ref={scrollContainerRef}
        className={cn(
          "min-h-0 flex-1",
          scrollMode === "internal" && "overflow-y-auto",
          surface === "page"
            ? "home-surface"
            : surface === "card"
              ? "home-surface"
              : pathname === "/"
                ? "home-surface"
                : "home-surface"
        )}
        style={scrollMode === "internal" ? { scrollbarGutter: "stable" } : undefined}
      >
        <div
          className={cn(
            isHomePageSurface
              ? "mx-auto w-[min(94%,1120px)] pb-28 pt-4 md:pt-6"
              : "px-4 pb-3 pt-4 md:px-6 md:pt-6"
          )}
        >
        {messages.map((msg, index) => {
          const isUserMessage = msg.sender === "user";
          const messageText = getReadableMessageText(msg.text);
          const responseKeys =
            msg.response && !Array.isArray(msg.response) && typeof msg.response === "object"
              ? Object.keys(msg.response)
              : [];
          const showMessageActions = !msg.sdata && !msg.crosstab;

          return (
          <div
            key={index}
            ref={(element) => {
              messageRowRefs.current[index] = element;
            }}
            data-test-id={`${msg.sender}-${index}`}
            className={cn(
              "mb-4 flex w-full",
              isUserMessage ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "flex max-w-full items-start gap-2.5",
                isUserMessage && "flex-row-reverse"
              )}
            >
              <AvatarInitials
                label={isUserMessage ? fullName : CHAT_AGENT_NAME}
                title={isUserMessage ? fullName : CHAT_AGENT_NAME}
                initials={isUserMessage ? userInitials : CHAT_AGENT_INITIALS}
                className={cn(
                  "mt-0.5 h-9 w-9 text-[12px] shadow-sm",
                  isUserMessage
                    ? "bg-[#4f56e6] text-white"
                    : "home-avatar-ai"
                )}
              />
              <div className={cn("flex min-w-0 max-w-full flex-col", isUserMessage && "items-end")}>
                <div
                ref={(element) => {
                  messageContentRefs.current[index] = element;
                }}
                className={
                  msg.sdata || msg.crosstab
                    ? "max-w-[min(100%,860px)]"
                    : cn(
                        "inline-block max-w-[min(100%,820px)] rounded-[16px] px-3 py-2 text-left text-sm shadow-sm",
                        isUserMessage
                          ? "bg-[#4f56e6] text-white shadow-md"
                          : "home-surface home-text border home-border shadow-[0_6px_16px_rgba(15,23,42,0.08)]"
                      )
                }
              >
              {(!msg.questions || msg.questions.add) && !msg.sdata && (
                <div
                  className="break-words text-[14px] leading-6"
                  dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}
                />
              )}
              {Array.isArray(msg.questions) &&
                msg.questions.length === 0 &&
                !msg.sdata && (
                  <div
                    className="break-words text-[14px] leading-6"
                    dangerouslySetInnerHTML={{ __html: formatRichText(msg.text) }}
                  />
                )}
              {msg.questions && !msg.questions.add && (
                <Question_Format
                  questions={msg.questions.questions}
                  instruction={msg.instruction}
                />
              )}
              {Array.isArray(msg.response) ? (
                <ul className="list-disc px-6">
                  {msg.response.map((item: { studyID: string; studyName: string }) => (
                    <li key={item.studyID}>{item.studyName}</li>
                  ))}
                </ul>
              ) : (
                responseKeys.length > 0 && (
                  <div className="mt-2">
                    {responseKeys.map((key, index) => (
                      <p className="mt-1 break-words" key={index}>
                        <strong>{key}:</strong>{" "}
                        <span className="text-gray-500">
                          {msg.response[key]}
                        </span>
                      </p>
                    ))}
                  </div>
                )
              )}
              {msg.type === "surveydata" &&
                (() => {
                  const sdata = msg.sdata;
                  if (
                    !sdata ||
                    !Array.isArray(sdata.seq) ||
                    sdata.seq.length === 0
                  )
                    return null;

                  const qid = sdata.seq[0];
                  const questionData = {
                    ...sdata[qid],
                    base: sdata.BASE,
                    base_text: sdata.BASE_TEXT,
                  };
                  if (!qid || !questionData) return null;

                  const dataValues = toRecord(questionData.data);
                  const firstDataValue = Object.values(dataValues)[0];
                  const rawRowOptions = toRecord(
                    questionData._rowoptions ?? questionData._rows
                  );
                  const rawColOptions = toRecord(
                    questionData._coloptions ?? questionData._cols
                  );
                  const rawColOrder = toArray<string>(
                    questionData._colorder ?? questionData._col_order
                  );
                  const colOrder =
                    rawColOrder.length > 0 ? rawColOrder : Object.keys(dataValues);
                  const rawRowOrder = toArray<string>(
                    questionData._roworder ?? questionData._row_order
                  );
                  const firstColumnData = toRecord(firstDataValue);
                  const rowOrder =
                    rawRowOrder.length > 0
                      ? rawRowOrder
                      : Object.keys(
                          firstColumnData && Object.keys(firstColumnData).length > 0
                            ? firstColumnData
                            : dataValues
                        );

                  const isChart = activeTab[index] === "chart";
                  const isTable = activeTab[index] === "table";

                  const isCrosstab =
                    colOrder.length > 0 &&
                    firstDataValue !== null &&
                    typeof firstDataValue === "object";

                  const chartData = isCrosstab
                      ? colOrder.map((colId: string) => ({
                          name: toDisplayText(rawColOptions[colId], colId),
                          color: PRIMARY_CHART_COLOR,
                          data: rowOrder.map((rowId: string) => {
                            const columnData = toRecord(dataValues[colId]);
                            return {
                              name: toDisplayText(rawRowOptions[rowId], rowId),
                            y: toChartNumber(columnData[rowId]),
                          };
                        }),
                      }))
                    : [
                        {
                          name: "Responses",
                          color: PRIMARY_CHART_COLOR,
                          data: rowOrder.map((rowId: string) => ({
                            name: toDisplayText(rawRowOptions[rowId], rowId),
                            y: toChartNumber(dataValues[rowId]),
                          })),
                        },
                      ];

                  const categories = rowOrder.map(
                    (rowId: string) => toDisplayText(rawRowOptions[rowId], rowId)
                  );

                  const headers = !isCrosstab
                    ? ["Total"]
                    : colOrder.map(
                        (colId: string) =>
                          toDisplayText(rawColOptions[colId], colId)
                      );

                  const rows = rowOrder.map(
                    (rowId: string) => {
                      const rowLabel =
                        toDisplayText(rawRowOptions[rowId], rowId);
                      const values = !isCrosstab
                        ? [`${toDisplayText(dataValues[rowId], "0")}%`]
                        : colOrder.map(
                            (colId: string) => {
                              const columnData = toRecord(dataValues[colId]);
                              return `${toDisplayText(columnData[rowId], "0")}%`;
                            }
                          );
                      return {
                        rowLabel,
                        values,
                      };
                    }
                  );

                  const baseRow = !isCrosstab
                    ? [questionData.base ?? 0]
                    : colOrder.map((colId: string) => {
                        const val =
                          questionData.base?.[colId] ??
                          questionData.responding_base?.[colId]?.[
                            rowOrder[0]
                          ];
                        return val ?? 0;
                      });
                  const baseText = (() => {
                    if (
                      typeof questionData.base_text === "string" &&
                      questionData.base_text.trim()
                    ) {
                      return questionData.base_text;
                    }

                    if (typeof questionData.base === "number") {
                      return `Base: (n = ${questionData.base})`;
                    }

                    if (typeof questionData.base === "object" && questionData.base !== null) {
                      const total = Object.values(questionData.base).reduce(
                        (acc: number, val: unknown) =>
                          acc + (typeof val === "number" ? val : 0),
                        0
                      );
                      return `Base: (n = ${total})`;
                    }

                    return "Base: (n = 0)";
                  })();

                  return (
                    <div className="w-full mt-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant={isChart ? "theme" : "outline"}
                            size="sm"
                            className={`rounded-md ${
                              isChart
                                ? "text-white"
                                : "theme-text-default"
                            }`}
                            onClick={() =>
                              setActiveTab((prev) => ({
                                ...prev,
                                [index]: "chart",
                              }))
                            }
                          >
                            <FaChartBar />
                          </Button>
                          {!(
                            questionData.external === 1 &&
                            questionData.external_link
                          ) && (
                            <Button
                              type="button"
                              variant={isTable ? "theme" : "outline"}
                              size="sm"
                              className={`rounded-md ${
                                isTable
                                  ? "text-white"
                                  : "theme-text-default"
                              }`}
                              onClick={() =>
                                setActiveTab((prev) => ({
                                  ...prev,
                                  [index]: "table",
                                }))
                              }
                            >
                              <FaTable />
                            </Button>
                          )}
                        </div>

                        {(isChart || isTable) && (
                          <IconActionButton
                            onClick={() => {
                              if (isChart) {
                                setSelectedChart(index);
                                setIsChartModalOpen(true);
                              } else {
                                setSelectedTable(index);
                                setIsTableModalOpen(true);
                              }
                            }}
                            tone="neutral"
                            className="text-xl theme-text-muted"
                          >
                            <FaExpandArrowsAlt />
                          </IconActionButton>
                        )}
                      </div>

                      {isChart ? (
                        <QuestionCard
                          title={questionData.label}
                          qId={qid}
                          studyID={msg.studyID}
                        >
                          {questionData.external === 1 &&
                          questionData.external_link ? (
                            <div className="w-full">
                              <img
                                src={questionData.external_link}
                                alt={questionData.label}
                                className="w-full max-w-xl justify-center"
                              />
                            </div>
                          ) : (
                            <SingleSelectChart
                              hasData={!!questionData.data}
                              chartData={chartData}
                              categories={categories}
                              baseText={baseText}
                              questionText={questionData.text || ""}
                              totalRespondents={questionData.base ?? 1}
                              questionId={qid}
                            />
                          )}
                        </QuestionCard>
                      ) : (
                        <TableForm
                          questionId={qid}
                          title={questionData.label}
                          baseText={baseText}
                          questionText={questionData.text || ""}
                          headers={headers}
                          baseRow={baseRow}
                          rows={rows}
                          studyID={msg.studyID}
                        />
                      )}
                    </div>
                  );
                })()}
              <>
                {msg.liveLink && (
                  <div className="flex items-center gap-2">
                    <a
                      href={msg.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      🔗 Click to view research
                    </a>

                    <IconActionButton
                      tooltip="Copy research link"
                      onClick={() => {
                        if (msg.liveLink) {
                          navigator.clipboard.writeText(msg.liveLink);
                        }
                        toast.success("Research link copied to clipboard!");
                      }}
                      tone="neutral"
                      className="theme-text-muted"
                    >
                      <FaCopy />
                    </IconActionButton>
                  </div>
                )}
              </>
                </div>
                {showMessageActions && (
                  <div
                    className={cn(
                      "mt-1.5 flex items-center gap-1.5",
                      isUserMessage ? "justify-end" : "justify-start"
                    )}
                  >
                    <IconActionButton
                      tooltip="Copy message"
                      onClick={() => handleCopyMessage(index, msg.text)}
                      tone="neutral"
                      className="home-muted h-7 w-7 p-1.5"
                      disabled={!messageText}
                    >
                      <LuCopy className="h-3.5 w-3.5" />
                    </IconActionButton>
                    {isUserMessage && (
                      <IconActionButton
                        tooltip={
                          isResponseLocked
                            ? `Wait for ${CHAT_AGENT_NAME} to finish responding`
                            : "Edit message"
                        }
                        onClick={() => handleEditMessage(msg.text)}
                        tone="neutral"
                        className="home-muted h-7 w-7 p-1.5"
                        disabled={isResponseLocked || !messageText}
                      >
                        <LuPencilLine className="h-3.5 w-3.5" />
                      </IconActionButton>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          );
        })}

        {(isTyping || pending) && (
          <TypingIndicator />
        )}
        {messages.length === 0 && !isTyping && (
          <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center">
            <div className="relative flex h-18 w-18 items-center justify-center rounded-[20px] bg-gradient-to-br from-login-primary to-action shadow-lg">
              <LuBotMessageSquare className="h-8 w-8 text-white" />
              <LuSparkles className="absolute -right-3 -top-3 h-4 w-4 text-amber-400" />
              <LuSparkles className="absolute -left-3 bottom-1 h-3.5 w-3.5 text-violet-500" />
            </div>
            <div className="mt-6">
              <p className="questionnaire-heading text-lg font-semibold">
                No conversation yet
              </p>
              <p className="home-highlight mt-2 text-sm leading-6">
                Start chatting with {CHAT_AGENT_LABEL} to refine, create, or organize your questions.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
        </div>
      </div>

      {isChartModalOpen && selectedChart !== null && (
        <TableAndChartModal
          isOpen={isChartModalOpen}
          onClose={() => {
            setIsChartModalOpen(false);
            setSelectedChart(null);
          }}
          message={messages[selectedChart]}
          type="chart"
        />
      )}

      {isTableModalOpen && selectedTable !== null && (
        <TableAndChartModal
          isOpen={isTableModalOpen}
          onClose={() => {
            setIsTableModalOpen(false);
            setSelectedTable(null);
          }}
          message={messages[selectedTable]}
          type="table"
        />
      )}

      {isCrosstabModalOpen && selectedCrosstab !== null && (
        <TableModal
          isOpen={isCrosstabModalOpen}
          onClose={() => {
            setIsCrosstabModalOpen(false);
            setSelectedCrosstab(null);
          }}
          message={messages[selectedCrosstab]}
        />
      )}
    </div>
  );
};

export default ChatWindow;
