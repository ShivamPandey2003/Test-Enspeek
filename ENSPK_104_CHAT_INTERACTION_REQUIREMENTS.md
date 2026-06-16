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

- [x] Chat input is disabled while the chat API response is loading.
- [x] Send button is disabled while the chat API response is loading.
- [x] If the API response includes suggestions, chat input stays disabled during the suggestion delay/loading period.
- [x] If the API response includes suggestions, send button stays disabled during the suggestion delay/loading period.
- [x] Chat input becomes enabled immediately after suggestions become visible.
- [x] Send button becomes enabled immediately after suggestions become visible.
- [x] If `suggestion` is missing, chat input/send button become enabled after the API response is complete.
- [x] If `suggestion.list` is missing or empty and `suggestion.message` is missing or empty, chat input/send button become enabled after the API response is complete.
- [x] Empty suggestion values do not trigger the suggestion waiting/disabled state.
- [x] User can type a custom message after suggestions become visible.
- [x] User can click a suggestion after suggestions become visible.
- [x] If the API response has no suggestions, chat input/send button follow the current normal enabled behavior after the response is complete.

## Requirement 2: Expand/Collapse AI Question Responses

### Current Behavior

- When AI returns questions, the full question format is shown in the chat response.
- All question details are visible immediately.

### Required Change

- When AI returns questions, show each question in a collapsed state by default.
- Each question should expand/collapse independently.
- If more than one question is returned, show one bulk action at the top of the question response.
- Show `Expand all` when not all questions are expanded.
- Show `Collapse all` when all questions are expanded.
- In collapsed state, show only:
  - question label
  - question text
  - question type
- Hide the remaining question details until the user expands that specific question.
- Show a `Show more...` button at the bottom of a collapsed question.
- Show a `Show less` button at the bottom of an expanded question.
- Do not show `Show more...` or `Show less` for questions that have no hidden details to display.
- `Show more...` and `Show less` should be aligned to the left.
- The instruction text should always be visible at the bottom of the question response.

### Acceptance Criteria

- [x] AI question responses render each question independently.
- [x] Each question is collapsed by default.
- [x] If more than one question is returned, only one bulk action is shown at the top of the question response.
- [x] If more than one question is returned and not all questions are expanded, `Expand all` is shown.
- [x] If more than one question is returned and all questions are expanded, `Collapse all` is shown.
- [x] Clicking `Expand all` expands all questions in that response.
- [x] Clicking `Collapse all` collapses all questions in that response.
- [x] `Expand all` and `Collapse all` are not required when only one question is returned.
- [x] Collapsed question view shows question label.
- [x] Collapsed question view shows question text.
- [x] Collapsed question view shows question type.
- [x] Collapsed question view hides options, logic, instructions, and other extra details.
- [x] Clicking `Show more...` expands only that specific question.
- [x] Expanded view shows the hidden question details.
- [x] Clicking `Show less` collapses only that specific question.
- [x] `Show more...` is hidden when a question has no hidden details.
- [x] `Show less` is hidden when a question has no hidden details.
- [x] `Show more...` appears on the left side of the question card.
- [x] `Show less` appears on the left side of the question card.
- [x] Expanding one question does not expand other questions.
- [x] Collapsing one question does not collapse other questions.
- [x] Instruction text is always visible at the bottom of the question response.

## Confirmed Decisions

1. Chat input/send should stay disabled during the full suggestion waiting period.
2. Chat input/send should become enabled immediately after suggestions appear.
3. Missing or empty suggestion data should not keep chat input/send disabled.
4. Users can type their own message after suggestions appear.
5. Each question should expand/collapse independently.
6. Questions should be collapsed by default.
7. Show only one bulk action when there is more than one question: `Expand all` when not all questions are expanded, and `Collapse all` when all questions are expanded.
8. Collapsed question view should show only question label, question text, and question type.
9. Use `Show more...` for expanding.
10. Use `Show less` for collapsing.
11. `Show more...` and `Show less` should be left aligned.
12. Instruction text should always be visible at the bottom.
13. Hide question-level expand/collapse controls when there is nothing extra to reveal.
