# Chat Study Process Loop Flow

## Goal

Support a backend-driven `chatStudy` process loop using `response.process` from:

- `POST /studychatbot/chatStudy`
- `POST /studychatbot/chatStudy/history`

The UI should keep showing `Thinking...` and prevent the user from sending a new chat message while the backend process chain is still active.

## API Shape

The existing `chatStudy` API envelope is:

```json
{
  "code": 200,
  "message": "...",
  "response": {
    "process": {
      "process_id": "some-id",
      "order": 2
    }
  }
}
```

The `process` object is optional.

## masterData

We will use a local-storage-backed object named `masterData`.

Expected keys inside `masterData`:

```json
{
  "process_id": "some-id",
  "order": 2
}
```

## Storage Rules

We need helper functions for:

- reading `masterData` from `localStorage`
- writing `masterData` to `localStorage`
- updating/removing `process_id` and `order`

Behavior:

1. If a `chatStudy` response contains both:
   - `response.process.process_id`
   - `response.process.order`
2. Then update:
   - `masterData["process_id"]`
   - `masterData["order"]`
3. Save the updated `masterData` back to `localStorage`

If either value is missing:

1. Remove both:
   - `masterData["process_id"]`
   - `masterData["order"]`
2. Save the updated `masterData` back to `localStorage`

This rule applies every time a `chatStudy` response is handled.

## History Trigger

After `POST /studychatbot/chatStudy/history` completes and all current history-related work is finished:

1. Read `masterData` from `localStorage`
2. Check whether both exist:
   - `masterData.process_id`
   - `masterData.order`
3. Only if both exist, call `POST /studychatbot/chatStudy`

This extra `chatStudy` call is not driven by user input. It is driven by saved process state.

## Payload For Process Loop Call

When triggered from `masterData`, the `chatStudy` payload must be exactly:

```json
{
  "process_id": "89b54d21-33f3-4604-84c4-d78f630e0f2f",
  "order": 2,
  "apiToken": "IEisxFA4Zvo7xjafyJKpdZ0snsttJush"
}
```

Notes:

- Only `process_id`, `order`, and `apiToken` are sent
- Do not send `prompt`, `pageName`, `studyID`, or `followUp` in this process-loop call
- This may change in the future, but not for the current implementation

## Process Loop Behavior

When the history-triggered `chatStudy` call returns:

1. Run the normal current `chatStudy` response handling as-is
2. Also inspect `response.process`
3. If both `process_id` and `order` are present:
   - update `masterData`
   - wait 5 seconds
   - call `chatStudy` again with the new `masterData`
4. If either one is missing:
   - remove both keys from `masterData`
   - save updated `masterData`
   - stop the loop

This creates a polling-like loop that continues until the backend stops returning a valid process pair.

## Thinking State And Input Blocking

While the process loop is active:

- chat must stay in `Thinking...` state
- user input/send must remain disabled

Important:

- the loading state must remain active even during the 5-second wait between loop calls
- the user should feel that the AI is still working during the entire backend process chain

The loading/thinking state should stop only when:

- the loop ends because `process_id` or `order` is no longer valid in the latest `chatStudy` response
- or the process flow fails and we intentionally exit the loop

## Existing Chat Behavior Must Remain

The looped `chatStudy` response must still go through the current normal response handling.

That means existing behaviors should continue to work:

- AI message rendering
- graph/table response handling
- suggestions
- navigation
- follow-up handling
- downloads
- recall behavior
- any other current `chatStudy` logic

The only added behavior is:

- process tracking in `masterData`
- history-triggered process-loop calls
- persistent thinking/input blocking while the loop is active

## Full End-To-End Flow

### 1. User lands on a page

If the page has chat-history context, the app calls:

```text
POST /studychatbot/chatStudy/history
```

### 2. Chat history finishes loading

After all current history processing is done:

1. read `masterData` from `localStorage`
2. check `process_id` and `order`

### 3. No stored process state

If `masterData.process_id` or `masterData.order` is missing:

- do nothing
- allow normal chat behavior

### 4. Stored process state exists

If both exist:

1. set chat to thinking/loading
2. block chat input/send
3. call:

```json
{
  "process_id": "...",
  "order": 2,
  "apiToken": "..."
}
```

### 5. Process response comes back

1. run the existing `chatStudy` response flow normally
2. inspect `response.process`

### 6. Valid process returned again

If both `process_id` and `order` are returned again:

1. update `masterData`
2. save `masterData` to `localStorage`
3. keep `Thinking...` active
4. keep chat input blocked
5. wait 5 seconds
6. call `chatStudy` again

### 7. Process no longer returned

If either `process_id` or `order` is missing:

1. remove both keys from `masterData`
2. save `masterData` to `localStorage`
3. stop the loop
4. stop the extra thinking/loading state
5. re-enable user chat input

## Failure Handling Expectation

If a looped `chatStudy` call fails:

- the current chat error handling should still apply
- the process loop should not remain stuck forever
- the thinking/input-block state must be released if the loop is abandoned

Exact failure behavior can be finalized during implementation, but the UI must not stay permanently blocked after an unrecoverable failure.

## Implementation Notes

- Do not break the existing direct user-send flow
- Do not break existing recall chaining behavior
- Do not mix the process-loop payload with the normal prompt payload
- Centralize `masterData` local-storage access so updates stay consistent
- Make sure the loop starts only after history processing is complete
- Make sure the loop does not allow duplicate overlapping process calls

## Summary

We are adding a local-storage-backed process tracker (`masterData`) that:

- stores `process_id` and `order`
- is updated on every `chatStudy` response
- is cleared when either value is missing
- triggers an automatic `chatStudy` loop after chat history load
- keeps the chat in `Thinking...` state until the backend process chain finishes
