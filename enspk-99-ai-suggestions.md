# ENSPK-99 AI Suggestions

## Objective

- [x] Define the new AI Suggestions feature before coding.
- [x] Render backend-provided AI suggestions below the main AI response.
- [x] Let users click suggestion buttons to send that suggestion directly to the AI.
- [x] Keep the feature UI-only/frontend-only except using the existing chat send flow.

## Confirmed Business Logic

- [x] Suggestions render only when the chat API response includes a valid `suggestion` key.
  Clarification: If `suggestion` is missing, `null`, or empty, no suggestion UI should render.
- [x] Expected backend shape:

```ts
suggestion: {
  message: string;
  list: string[];
}
```

- [x] `suggestion.message` appears below the main AI response, not inside the same main message bubble.
- [x] Suggestions should render after a 3 second delay once the main AI response is already rendered.
  Clarification: It should feel like the AI responded again with guidance.
- [x] Show the existing chat thinking indicator during the suggestion delay.
- [x] Suggestion UI should support all response types.
  Clarification: Normal messages, questionnaire responses, study list responses, graph/table responses, and future response types may show suggestions.
- [x] `suggestion.message` uses the same message-bubble style as normal AI text.
- [x] `suggestion.list` renders as compact white rounded buttons below the suggestion message.
- [x] Suggestion buttons wrap across lines on smaller screens.
- [x] Clicking a suggestion button sends that exact suggestion text to the AI immediately.
- [x] Clicking a suggestion button should also add the suggestion text to chat history as a user message, same as manually sending.
- [x] Suggestion buttons are disabled while AI is typing or a chat request is pending.
- [x] If `suggestion.message` exists but `suggestion.list` is empty, show only the suggestion message.
- [x] If `suggestion.list` exists but `suggestion.message` is empty, show only the suggestion buttons.
- [x] Do not show a copy button below the suggestion message or suggestion buttons.

## Steps To Be Done

- [x] Store the `suggestion` payload from chat API responses in chat message history.
- [x] Remove temporary dummy suggestion fallback before production.
  Clarification: Suggestions now render only when backend returns `suggestion`.
- [x] Render the main AI response first as current behavior.
- [x] Render the suggestion block after a 3 second delay.
- [x] Create/extend a reusable suggestion UI component if it keeps chat rendering maintainable.
- [x] Style suggestion message as an AI guidance bubble.
- [x] Style suggestion list items as compact white rounded buttons.
- [x] Wire suggestion button click to existing chat send flow.
- [x] Disable suggestion buttons while AI is typing or request is pending.
- [x] Ensure no copy/edit action row appears below suggestions.
- [x] Run focused lint for changed files.
- [x] Run `npm run build`.

## Acceptance Criteria

- [x] Main AI response renders first.
- [x] Suggestion block appears about 3 seconds later.
- [x] Suggestion message renders below the main AI response.
- [x] Suggestion buttons render below suggestion message when provided.
- [x] Suggestion buttons send exact text directly to AI.
- [x] Sent suggestion appears as a normal user message in chat history.
- [x] Suggestion buttons are disabled during pending/typing state.
- [x] Suggestions work for all chat response types.
- [x] Suggestions do not show copy buttons.
- [x] Missing/empty suggestion data does not render anything or break chat.

## Edge Cases

- [x] `suggestion` missing, `null`, or not an object.
- [x] `suggestion.message` missing, empty, or not a string.
- [x] `suggestion.list` missing, empty, or not an array.
- [x] `suggestion.list` contains non-string values.
- [x] User clicks multiple suggestion buttons quickly.
  Clarification: Suggestion buttons disable immediately after the first successful click to prevent duplicate sends before Redux pending state updates.
- [x] User clicks suggestion while AI is typing/pending.
- [x] Long suggestion button text on mobile.
- [x] Suggestion attached to graph/table response.
- [x] Suggestion attached to questionnaire response.
- [x] Suggestion attached to study list response.

## Automated Verification

- [x] Re-reviewed implementation for invalid suggestion payloads.
- [x] Re-reviewed implementation for duplicate quick-click sends.
- [x] Re-reviewed implementation for all response types storing `suggestion`.
- [x] Focused lint completed for `src/components/common/chat-window/chat.tsx`.
  Note: Existing hook dependency warnings remain; no new lint errors were introduced.
- [x] `npm run build` completed successfully.
  Note: Existing Vite large chunk warning remains.

## Browser Verification Checklist

- [ ] Verify normal AI response with suggestions.
- [ ] Verify questionnaire-generated response with suggestions.
- [ ] Verify graph/table response with suggestions.
- [ ] Verify suggestion message-only response.
- [ ] Verify suggestion buttons-only response.
- [ ] Verify suggestion button click sends message immediately.
- [ ] Verify disabled state while AI is responding.
- [ ] Verify mobile wrapping and spacing.
