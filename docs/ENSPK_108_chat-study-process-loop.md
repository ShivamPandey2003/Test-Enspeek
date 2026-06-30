# ENSPK-108 Chat Study Process Loop

## Goal

- [x] Support backend-driven continuation of `chatStudy` work using `response.process`
- [x] Persist process state in `localStorage` using `masterData`
- [x] Resume pending process work after `chatStudy/history` completes
- [x] Keep the chat blocked while the backend process is still running
- [x] Avoid showing unnecessary chat messages for process-only responses
- [x] Never show `Loading...` and `Thinking...` together in the chat window

## APIs In Scope

- [x] `POST /studychatbot/chatStudy`
- [x] `POST /studychatbot/chatStudy/history`

## API Contract

- [x] `chatStudy` uses the standard envelope

```json
{
  "code": 200,
  "message": "Success",
  "response": {}
}
```

- [x] `response.process` is optional
- [x] When valid, `response.process` may contain:
  - [x] `process_id`
  - [x] `order`
  - [x] optional extra fields like `status`

## masterData Rules

- [x] `masterData` is stored in `localStorage`
- [x] `masterData` is an object
- [x] `masterData` may contain:
  - [x] `process_id`
  - [x] `order`

Example:

```json
{
  "process_id": "some-id",
  "order": 2
}
```

## Storage Helper Rules

- [x] We must have a helper to read `masterData` from `localStorage`
- [x] We must have a helper to write `masterData` back to `localStorage`
- [x] We must have a helper to update `process_id` and `order`
- [x] We must have a helper to remove `process_id` and `order`
- [x] Any time `masterData` changes, it must be saved back to `localStorage`

## chatStudy Response Handling Rules

- [x] Every `chatStudy` response must be checked for `response.process`
- [x] If both `response.process.process_id` and `response.process.order` exist:
  - [x] save both into `masterData`
  - [x] update `localStorage`
- [x] If either `process_id` or `order` is missing:
  - [x] remove both from `masterData`
  - [x] update `localStorage`

## Process-Only Response Rule

- [x] If `response` contains only process data, do not add any visible AI message to the chat

Example of process-only response:

```json
{
  "code": 200,
  "message": "Success",
  "response": {
    "process": {
      "process_id": "2427499e-bd4f-4e3e-94b6-a139e7bf44ac",
      "order": 2
    }
  }
}
```

- [x] For this case:
  - [x] update `masterData`
  - [x] continue the loop if needed
  - [x] do not insert `AI responded with no message.`
  - [x] do not insert any empty/fallback AI bubble into the chat UI

- [x] If the response includes user-visible content, normal rendering should still happen

Example:

```json
{
  "code": 200,
  "message": "Success",
  "response": {
    "process": {
      "process_id": "25bc565f-085f-470f-b028-3eb08fbc0219",
      "status": "RUNNING",
      "order": 1
    },
    "message": "Working on your request..."
  }
}
```

## History Completion Trigger Rules

- [x] `chatStudy/history` is called when a page with valid chat-history context loads
- [x] After all history-related work is complete, check `masterData`
- [x] If `masterData.process_id` and `masterData.order` both exist:
  - [x] call `chatStudy`
- [x] If either value is missing:
  - [x] do nothing extra

## Payload For History-Triggered chatStudy Call

- [x] The history-triggered process call must send only:

```json
{
  "process_id": "89b54d21-33f3-4604-84c4-d78f630e0f2f",
  "order": 2,
  "apiToken": "IEisxFA4Zvo7xjafyJKpdZ0snsttJush"
}
```

- [x] Do not send `prompt`
- [x] Do not send `pageName`
- [x] Do not send `studyID`
- [x] Do not send `followUp`

## Empty History Rule

- [x] The process loop must still start even if history response is empty

Example:

```json
{
  "code": 200,
  "message": "Success",
  "response": {
    "page": 1,
    "pageSize": 20,
    "total": 0,
    "has_more": false,
    "data": []
  }
}
```

- [x] Empty history does not cancel the follow-up `chatStudy` trigger

## Process Loop Rules

- [x] After history is done and valid process state exists, start the process loop
- [x] The follow-up `chatStudy` response must still go through the normal response flow
- [x] If the response again contains valid `process_id` and `order`:
  - [x] update `masterData`
  - [x] wait 5 seconds
  - [x] call `chatStudy` again
- [x] Continue this loop until `process_id` or `order` is no longer valid
- [x] When either value is no longer valid:
  - [x] remove both from `masterData`
  - [x] save to `localStorage`
  - [x] stop the loop

## Thinking State Rules

- [x] While the process loop is active, the chat must stay in `Thinking...`
- [x] While the process loop is active, user send/input must stay disabled
- [x] The `Thinking...` state must remain visible even during the 5-second wait
- [x] The user should feel that the AI is still working until the loop finishes

## Loading vs Thinking Rules

- [x] Do not show `Loading...` and `Thinking...` together
- [x] If `Loading...` is visible, `Thinking...` must not be visible
- [x] The history-triggered `chatStudy` call must begin only after history-loading UI work has settled
- [x] Once history loading is finished, the UI may move into the AI `Thinking...` state

## Existing Behavior That Must Still Work

- [x] Normal user send flow
- [x] Existing `chatStudy` response handling
- [x] Graph response handling
- [x] Suggestion handling
- [x] Navigation handling
- [x] Follow-up handling
- [x] Download handling
- [x] Recall chaining behavior

## Failure Handling Rules

- [x] If a looped `chatStudy` call fails, current chat error handling should still run
- [x] The loop must not stay stuck forever after an unrecoverable failure
- [x] The blocked input / thinking state must be released if the loop is abandoned

## Full Step-By-Step Flow

### Step 1: Page loads

- [x] User lands on a page with valid chat-history context
- [x] App calls `POST /studychatbot/chatStudy/history`

### Step 2: History finishes

- [x] History response is processed
- [x] Redux history state is updated
- [x] History-loading UI is allowed to settle
- [x] Only after that, app checks `masterData`

### Step 3: Check stored process state

- [x] Read `masterData` from `localStorage`
- [x] If `process_id` is missing, stop here
- [x] If `order` is missing, stop here
- [x] If both exist, continue to the next step

### Step 4: Start process continuation

- [x] Set chat to `Thinking...`
- [x] Disable user input/send
- [x] Call `POST /studychatbot/chatStudy` with only:
  - [x] `process_id`
  - [x] `order`
  - [x] `apiToken`

### Step 5: Handle chatStudy response

- [x] Process the response with existing `chatStudy` logic
- [x] Inspect `response.process`
- [x] Update `masterData` accordingly

### Step 6: Process-only response case

- [x] If the response contains only `process` data:
  - [x] do not add a visible AI message
  - [x] do not add fallback text
  - [x] keep loop logic working

### Step 7: Continue or stop loop

- [x] If valid `process_id` and `order` are returned again:
  - [x] save them
  - [x] wait 5 seconds
  - [x] call `chatStudy` again
- [x] If either one is missing:
  - [x] clear both keys from `masterData`
  - [x] stop the loop

### Step 8: Finish UI state

- [x] When the loop ends, stop `Thinking...`
- [x] Re-enable chat input/send
- [x] Keep history UI behavior normal

## Summary

- [x] `masterData` tracks `process_id` and `order`
- [x] `chatStudy` updates or clears that state on every response
- [x] `chatStudy/history` can restart pending backend work after page load
- [x] Process-only responses stay invisible in the chat UI
- [x] The chat remains blocked with `Thinking...` while backend work is active
- [x] `Loading...` and `Thinking...` never appear together
