# Chat Interaction Requirements

## Scope

This document captures two new UI behavior requirements for the chat experience:

- Keep chat input/send disabled while suggestions are pending.
- Show AI-generated questions in an independent expand/collapse format.

Relevant areas:

- Chat window: `src/components/common/chat-window/chat.tsx`
- Chat input: `src/components/global/chattextares.tsx`
- Question display: `src/components/common/chat-window/Question-format.tsx`

## Requirement 1: Disable Chat Input Until Suggestions Are Ready

### Current Behavior

- While the chat API is responding, the chat input and send button are disabled.
- After the API response is received, the chat input and send button become active.
- If the AI response has suggestions, those suggestions may still be waiting to appear on screen after the API response.

### Required Change

- If an AI response includes suggestions, keep the chat input and send button disabled until the suggestions are actually shown on screen.
- This includes the full suggestion loading/waiting period before suggestions appear.
- Once suggestions are visible, enable the chat input and send button immediately.
- Treat suggestions as available only when the response has valid suggestion content.
- If there is no `suggestion` key, no `suggestion.list`, an empty `suggestion.list`, no `suggestion.message`, or an empty `suggestion.message`, do not keep the input/send button disabled for suggestions.
- If both `suggestion.list` and `suggestion.message` are empty or missing, behave the same as a response with no suggestions.
- After suggestions appear, users should still be able to either:
  - click a suggestion, or
  - type a custom message manually.

### Acceptance Criteria

- [ ] Chat input is disabled while the chat API response is loading.
- [ ] Send button is disabled while the chat API response is loading.
- [ ] If the API response includes suggestions, chat input stays disabled during the suggestion delay/loading period.
- [ ] If the API response includes suggestions, send button stays disabled during the suggestion delay/loading period.
- [ ] Chat input becomes enabled immediately after suggestions become visible.
- [ ] Send button becomes enabled immediately after suggestions become visible.
- [ ] If `suggestion` is missing, chat input/send button become enabled after the API response is complete.
- [ ] If `suggestion.list` is missing or empty and `suggestion.message` is missing or empty, chat input/send button become enabled after the API response is complete.
- [ ] Empty suggestion values do not trigger the suggestion waiting/disabled state.
- [ ] User can type a custom message after suggestions become visible.
- [ ] User can click a suggestion after suggestions become visible.
- [ ] If the API response has no suggestions, chat input/send button follow the current normal enabled behavior after the response is complete.

## Requirement 2: Expand/Collapse AI Question Responses

### Current Behavior

- When AI returns questions, the full question format is shown in the chat response.
- All question details are visible immediately.

### Required Change

- When AI returns questions, show each question in a collapsed state by default.
- Each question should expand/collapse independently.
- If more than one question is returned, show `Expand all` and `Collapse all` controls at the top of the question response.
- In collapsed state, show only:
  - question label
  - question text
  - question type
- Hide the remaining question details until the user expands that specific question.
- Show a `Show more...` button at the bottom of a collapsed question.
- Show a `Show less` button at the bottom of an expanded question.

### Acceptance Criteria

- [ ] AI question responses render each question independently.
- [ ] Each question is collapsed by default.
- [ ] If more than one question is returned, `Expand all` is shown at the top of the question response.
- [ ] If more than one question is returned, `Collapse all` is shown at the top of the question response.
- [ ] Clicking `Expand all` expands all questions in that response.
- [ ] Clicking `Collapse all` collapses all questions in that response.
- [ ] `Expand all` and `Collapse all` are not required when only one question is returned.
- [ ] Collapsed question view shows question label.
- [ ] Collapsed question view shows question text.
- [ ] Collapsed question view shows question type.
- [ ] Collapsed question view hides options, logic, instructions, and other extra details.
- [ ] Clicking `Show more...` expands only that specific question.
- [ ] Expanded view shows the hidden question details.
- [ ] Clicking `Show less` collapses only that specific question.
- [ ] Expanding one question does not expand other questions.
- [ ] Collapsing one question does not collapse other questions.

## Confirmed Decisions

1. Chat input/send should stay disabled during the full suggestion waiting period.
2. Chat input/send should become enabled immediately after suggestions appear.
3. Missing or empty suggestion data should not keep chat input/send disabled.
4. Users can type their own message after suggestions appear.
5. Each question should expand/collapse independently.
6. Questions should be collapsed by default.
7. Show `Expand all` and `Collapse all` when there is more than one question.
8. Collapsed question view should show only question label, question text, and question type.
9. Use `Show more...` for expanding.
10. Use `Show less` for collapsing.
