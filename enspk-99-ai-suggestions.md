# ENSPK-99 AI Suggestions

## Objective

- [x] Define the new AI Suggestions feature before coding.
- [ ] Render backend-provided AI suggestions below the main AI response.
- [ ] Let users click suggestion buttons to send that suggestion directly to the AI.
- [ ] Keep the feature UI-only/frontend-only except using the existing chat send flow.

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
- [x] Suggestions should render after a 1 second delay once the main AI response is already rendered.
  Clarification: It should feel like the AI responded again with guidance.
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

- [ ] Store the `suggestion` payload from chat API responses in chat message history.
- [ ] Render the main AI response first as current behavior.
- [ ] Render the suggestion block after a 1 second delay.
- [ ] Create/extend a reusable suggestion UI component if it keeps chat rendering maintainable.
- [ ] Style suggestion message as an AI guidance bubble.
- [ ] Style suggestion list items as compact white rounded buttons.
- [ ] Wire suggestion button click to existing chat send flow.
- [ ] Disable suggestion buttons while AI is typing or request is pending.
- [ ] Ensure no copy/edit action row appears below suggestions.
- [ ] Run focused lint for changed files.
- [ ] Run `npm run build`.

## Acceptance Criteria

- [ ] Main AI response renders first.
- [ ] Suggestion block appears about 1 second later.
- [ ] Suggestion message renders below the main AI response.
- [ ] Suggestion buttons render below suggestion message when provided.
- [ ] Suggestion buttons send exact text directly to AI.
- [ ] Sent suggestion appears as a normal user message in chat history.
- [ ] Suggestion buttons are disabled during pending/typing state.
- [ ] Suggestions work for all chat response types.
- [ ] Suggestions do not show copy buttons.
- [ ] Missing/empty suggestion data does not render anything or break chat.

## Edge Cases

- [ ] `suggestion` missing, `null`, or not an object.
- [ ] `suggestion.message` missing, empty, or not a string.
- [ ] `suggestion.list` missing, empty, or not an array.
- [ ] `suggestion.list` contains non-string values.
- [ ] User clicks multiple suggestion buttons quickly.
- [ ] User clicks suggestion while AI is typing/pending.
- [ ] Long suggestion button text on mobile.
- [ ] Suggestion attached to graph/table response.
- [ ] Suggestion attached to questionnaire response.
- [ ] Suggestion attached to study list response.

## Browser Verification Checklist

- [ ] Verify normal AI response with suggestions.
- [ ] Verify questionnaire-generated response with suggestions.
- [ ] Verify graph/table response with suggestions.
- [ ] Verify suggestion message-only response.
- [ ] Verify suggestion buttons-only response.
- [ ] Verify suggestion button click sends message immediately.
- [ ] Verify disabled state while AI is responding.
- [ ] Verify mobile wrapping and spacing.
