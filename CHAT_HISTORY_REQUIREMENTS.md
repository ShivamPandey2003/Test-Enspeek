# Chat History Requirements

## Objective

Chat history should be backend-driven and page-specific. When a user lands on a page or refreshes the page, the frontend should load the relevant chat history from the backend and show it in the same chat UI used for live chat.

The history should include both sides of the conversation:

- User messages
- AI responses

The history UI should not feel different from newly generated chat messages.

## Payload

The frontend will call the chat history API with the current page context.

```json
{
  "apiToken": "3qC6Z8U57ALvusCMpgOHFEVt3tx0LElc",
  "pageName": "qnr",
  "studyID": "uqfxlzkr0g",
  "page": 1
}
```

Notes:

- `apiToken` will be added from the common API request setup.
- Authorization token will continue to be sent in the request header.
- `pageName` is required so each page gets only its relevant chat history.
- `studyID` should be sent only when the user is inside a study-specific area.
- `page` starts from `1`.

Send `studyID` only for these areas:

- Questionnaire page
- Publish survey page
- Report page
- Crosstab page
- Table list page
- Edit banner page

Do not send `studyID` for general platform pages where the user is not inside a study.

## API Call Sequence

Chat history should not be the first context API on a page.

- Home page: call `/uam/info` first, then chat history.
- Questionnaire page: call `/study/info` first, then chat history.
- Publish survey page: call `/study/info` first, then chat history.
- Report page: call `/study/info` first, then chat history.
- Crosstab page: call `/study/info` first, then chat history.
- Table list page: call `/study/info` first, then chat history.
- Edit banner page: call `/study/info` first, then chat history.

If chat history returns empty `data`, the existing UI should remain as-is. For example, home should continue showing the hero/empty state, and side chat pages should not show an unnecessary history message.

When the user changes page or refreshes the page:

- Clear the currently visible chat history for the old page context before showing the new page history.
- Show `Loading...` while the first chat history request is pending.
- Do not show old page chat messages, even for a short blink.
- Keep chat input and send button disabled until the current page history request is completed.
- If first-page history has no displayable messages, return to the existing empty/hero UI.

## Page Name Mapping

The frontend should send these `pageName` values:

- Home page: `db`
- Questionnaire page: `qnr`
- Publish survey page: `svry`
- Report page: `rpt`
- Crosstab page: `xtab`
- Table list page: `xtab`
- Edit banner page: `xtab`

Table list and edit banner are crosstab sub-pages, so they use the same crosstab page context.

## Expected API Response

The history API should return conversation rows in `response.data`.

Each row should contain:

- `user`: the text sent by the user.
- `response`: the AI response object in the same shape returned by the existing `chatStudy` API.
- `created_at`: the conversation row timestamp.

The frontend will convert each row into the same chat message objects used by the existing chat UI.

```json
{
  "code": 200,
  "message": "Success",
  "response": {
    "page": 1,
    "pageSize": 20,
    "total": 4,
    "has_more": true,
    "data": [
      {
        "user": "list of studies",
        "response": {
          "type": "message",
          "intent": "other",
          "message": "Sure, I found these studies for you.",
          "followUp": "",
          "response": [
            {
              "studyID": "uqfxlzkr0g",
              "studyName": "Customer Satisfaction Study"
            }
          ],
          "suggestion": {
            "message": "Here are a few quick actions you can try next.",
            "list": ["Show active studies", "Show launched studies"]
          }
        },
        "created_at": "2026-06-17T08:24:36.105759"
      },
      {
        "user": "Create new study named Games",
        "response": {
          "type": "creation",
          "route": "/questionnaire",
          "active": true,
          "intent": "create_study",
          "message": "Success! I've created the study 'Games' for you.",
          "studyId": "ckwgym976ltyj",
          "followUp": "",
          "suggestion": {
            "message": "Here are a few quick actions you can try next.",
            "list": ["Generate 5 questions for Games study"]
          }
        },
        "created_at": "2026-06-17T08:20:27.928410"
      },
      {
        "user": "activate the study",
        "response": {
          "add": false,
          "intent": "activate_study",
          "message": "Are you ready to activate this study? Once activated, respondents can start filling the survey. (yes/no)",
          "followUp": "activate the study"
        },
        "created_at": "2026-06-17T08:27:03.852788"
      },
      {
        "user": "yes",
        "response": {
          "add": true,
          "type": "activated",
          "intent": "activate_study",
          "message": "Study activated. You're all set to begin filling your survey!",
          "studyID": "uqfxlzkr0g",
          "liveLink": "https://dev-survey.enspeek.ai/example",
          "suggestion": {
            "message": "Here are a few quick actions you can try next.",
            "list": ["Share with team", "Go to homepage"]
          }
        },
        "created_at": "2026-06-17T08:27:20.577220"
      }
    ]
  }
}
```

If a row has `response: null`, frontend should show the user message and an AI-side fallback message:

```txt
Unable to load the AI response for this message.
```

If a row does not have a valid `user` value, frontend should show a user-side fallback message:

```txt
Unable to load the user message for this response.
```

## Supported ChatStudy Response Cases

The `response` object inside each history row should match the existing `chatStudy` response object. The frontend will map it to the existing chat UI message shape.

### 1. User Message

Used for messages sent by the user.

```json
{
  "sender": "user",
  "text": "User message text"
}
```

Frontend derives this from the row-level `user` key.

### 2. Normal AI Message

Used for standard AI text response.

```json
{
  "message": "AI response text"
}
```

### 3. AI Question Preview

Used when AI returns generated questions to preview.

```json
{
  "message": "Here are the suggested questions.",
  "questions": {
    "add": false,
    "questions": [
      {
        "label": "Customer Satisfaction",
        "qText": "How satisfied are you with our service?",
        "qType": "Single Select",
        "options": ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"]
      }
    ]
  },
  "instruction": "You can type 'add all questions' or add specific questions like 1, 2."
}
```

### 4. AI Question Added Confirmation

Used when questions are already added.

```json
{
  "message": "Questions have been added successfully.",
  "questions": {
    "add": true
  }
}
```

### 5. AI Suggestion

Used when AI shows suggestion buttons.

```json
{
  "message": "What would you like to do next?",
  "suggestion": {
    "message": "Choose one option below.",
    "list": ["Add more questions", "Preview questionnaire", "Publish survey"]
  }
}
```

### 6. AI Study List

Used when AI shows a list of studies.

```json
{
  "message": "Here are your available studies.",
  "response": [
    {
      "studyID": "uqfxlzkr0g",
      "studyName": "Customer Satisfaction Study"
    }
  ]
}
```

### 7. AI Key-Value Details

Used when AI shows object details.

```json
{
  "message": "Study details:",
  "response": {
    "Study Name": "Customer Satisfaction Study",
    "Status": "Active",
    "Total Questions": "12"
  }
}
```

### 8. AI Live Link

Used when AI returns a research/live survey link.

```json
{
  "message": "Your research is live.",
  "liveLink": "https://app.enspeek.ai/research/uqfxlzkr0g"
}
```

### 9. AI Survey Data

Used when AI returns chart/table report data.

```json
{
  "type": "surveydata",
  "message": "Here is the survey result.",
  "showGraph": true,
  "studyID": "uqfxlzkr0g",
  "sdata": {}
}
```

## Pagination Behavior

- On home page load or refresh, call `/uam/info` first. After user info is synced, call chat history API with `page: 1`.
- On study-specific page load or refresh, call `/study/info` first. After study info is stored in local storage, call chat history API with `page: 1`.
- If `has_more` is `true`, older history exists.
- When the user scrolls to the top of the chat area, call the same API with `page + 1`.
- Show a compact `Loading...` loader at the top while older history is loading.
- When older history API response arrives, convert `response.data` and prepend the converted messages to the existing chat messages.
- After older messages are prepended, keep the user's scroll position stable. The chat should not jump to the bottom.
- When `has_more` becomes `false`, stop calling older history pages.
- When all history is loaded and the user reaches the oldest message, show: `Conversation started here.`

## Loading And Suggestion Behavior

- On first page history load, show `Loading...` in the chat area.
- Do not show `Thinking...` while loading history messages.
- History suggestions should appear immediately when they exist in the history response.
- Delay suggestion display only for live AI chat API responses.
- History suggestion display should not force the chat to scroll to the bottom.
- Live AI chat suggestions can continue to scroll normally after they appear.

## Ordering

The backend should return messages in display order.

- `page: 1` should return the latest page of messages in oldest-to-newest order.
- `page: 2` and later should return older messages in oldest-to-newest order.

This allows frontend to use:

```ts
messages = normalizeChatHistoryRows(response.data);
```

for first load, and:

```ts
messages = [...normalizeChatHistoryRows(response.data), ...messages];
```

for loading older history.

## Empty History Behavior

If `page: 1` returns an empty `data` array, frontend should not show a special empty history message.

The existing empty or hero screen should remain visible.

## Frontend Implementation Rules

- Backend chat history is the source of truth for restored chat.
- Local storage should not be used for restoring chat history after refresh or page change.
- History messages and live chat messages should use the same UI rendering.
- Do not create a separate chat history UI.
- Avoid repeated mapping/rendering logic.
- Keep history normalization in one reusable helper.
- Reset loaded history when `pageName` or `studyID` changes.
- Do not repeatedly call history API while one history request is already pending.
- Keep the current page context in state so old-page history cannot render on a new page.
- Keep chat input and send button disabled while current page history is loading.
- Do not run live chat send logic until current page history is loaded.

## Implementation Approach To Avoid Repetition

The implementation should keep chat history logic centralized instead of spreading the same checks across pages.

Recommended approach:

- Add one chat history API entry in the central API URL registry.
- Create one reusable chat history hook/service for loading page 1 and older pages.
- Create one helper to build the history payload from current route context.
- Create one helper to decide whether `studyID` should be included.
- Keep all message rendering inside the existing chat window.
- Store history messages in the same Redux `messages` array used by live chat.
- Use one action/helper for replacing first-page history.
- Use one action/helper for prepending older history.
- Keep pagination state in one place, such as `page`, `hasMore`, `isLoadingHistory`, and `isLoadingOlderHistory`.
- Do not add separate render branches for "history message" and "live message".

This keeps the flow simple:

```ts
firstLoadRows = response.data;
olderRows = response.data;
```

Then:

```ts
messages = normalizeChatHistoryRows(firstLoadRows);
messages = [...normalizeChatHistoryRows(olderRows), ...messages];
```

Live chat should continue to append messages normally:

```ts
messages = [...messages, newLiveMessage];
```

## What Could Break If Backend Response Is Not Correct

- If row-level `user` is missing, the user-side message cannot be shown.
- If row-level `response` is missing or invalid, the AI-side message cannot be shown correctly.
- If `response.message` is missing, a blank AI message may show.
- If `questions` shape is wrong, question preview may break.
- If `suggestion.message` or `suggestion.list` shape is wrong, suggestions may not show.
- If `sdata` shape is wrong, chart/table output may not render.
- If backend returns newest-to-oldest order, chat order may look reversed.
- If history API does not separate by `pageName + studyID`, wrong page chat may show.

## Acceptance Criteria

- [x] Chat history API is called on page land and refresh.
- [x] Request includes current `pageName` and `page`.
- [x] Request includes `studyID` only for study-specific pages.
- [x] Home page calls `/uam/info` before chat history.
- [x] Study-specific pages call `/study/info` before chat history.
- [x] User and AI history messages both show in chat.
- [x] History messages look the same as live chat messages.
- [x] Page-specific history is shown only for the current page.
- [x] Old page chat is cleared before current page history is shown.
- [x] `Loading...` appears during first-page history loading.
- [x] Chat input and send button stay disabled while current page history is loading.
- [x] Older history loads when user scrolls to top and `has_more` is `true`.
- [x] Older history is prepended above current messages.
- [x] Compact loader appears at the top while older history is loading.
- [x] Scroll position stays stable after older history is prepended.
- [x] History suggestions appear immediately without live-response delay.
- [x] History suggestions do not force scroll to bottom during older-history prepend.
- [x] `Conversation started here.` appears when all history pages are loaded.
- [x] Empty first-page history keeps the existing empty/hero state.
- [x] Local storage is not used to restore chat history.
