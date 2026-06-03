# ENSPK-99 Chat Window: Shared Avatar, Agent Identity, and Message Actions

## Objective

- [x] Improve chat message presentation across the home page and right-side chat panel.
- [x] Create a shared avatar/initials component used by both the header profile avatar and chat message avatars.
- [x] Make avatar initials consistently centered at all screen sizes.
- [x] Introduce a configurable AI agent identity using `Peek` as the agent name and `PK` as the avatar initials.
- [x] Add copy actions for AI and user messages.
- [x] Add edit action for user messages that copies the message text into the chat input and focuses the cursor at the end.
- [x] Reduce unnecessary chat whitespace while keeping chart/table/question responses readable.
- [x] Polish message bubbles in a restrained product-friendly style.

## Confirmed Business Logic

- [x] AI agent name is `Peek`.
- [x] AI avatar initials are `PK`.
- [x] Agent name and initials must be configurable from one shared place.
- [x] AI avatar should show `PK`, not the full text `Peek`.
- [x] AI avatar tooltip/display name should use `Peek`.
- [x] Empty-state copy should refer to `Peek AI agent`.
- [x] User avatars should continue to use dynamic user initials.
- [x] User with first and last name should show first characters, for example `Vipin Kumar` -> `VK`.
- [x] User with only one name should show only the first initial.
- [x] Empty user name fallback should be `U`.
- [x] Shared avatar component should be used in both the header profile avatar and chat message avatars.
- [x] Copy icon should be available for both AI and user messages.
- [x] Copying an AI message should copy text only, not chart/table rendered data.
- [x] Copying a user message should copy text only.
- [x] Copy action should show toast feedback such as `Message copied`.
- [x] User messages should have an edit action.
- [x] Edit action should not remove the old user message from chat history.
- [x] Edit action should put the exact user message text into the chat input.
- [x] After edit action, cursor should focus at the end of the chat input.
- [x] Edit action should be disabled while AI is typing or pending.
- [x] Copy action should remain enabled while AI is typing or pending.
- [x] Copy/edit icons should be visible, subtle, and small rather than hover-only.
- [x] Message spacing should be reduced across both home and right-side chat, without cramping chart/table/question responses.
- [x] Bubble styling should be polished and restrained, with no heavy gradients.
- [x] Header avatar and chat user avatar should both use `#4f56e6`.
- [x] Avatar size should remain unchanged.
- [x] Reduce padding inside regular text message bubbles.
- [x] Chat input send button should use the send-horizontal icon style.
- [x] User message bubble background should use theme color `#4f56e6`.
- [x] Chat message area should not use `home-page-bg` as its background class.
- [x] AI response messages should have a slightly darker shadow, but not too dark.

## Business Logic Clarifications

- [x] Confirm AI agent name and avatar text.
  Clarification: use agent name `Peek` and avatar initials `PK`.
- [x] Confirm whether agent naming should be hardcoded in multiple components.
  Clarification: no. Use one shared config for agent name, initials, and label.
- [x] Confirm whether shared avatar should cover header and chat.
  Clarification: yes. Header profile avatar and chat message avatars should use the same avatar/initials component.
- [x] Confirm whether user edit removes prior message.
  Clarification: no. It only fills the chat input and focuses the cursor.
- [x] Confirm copy behavior for AI messages containing charts/tables/question cards.
  Clarification: copy text only.
- [x] Confirm whether user messages also need copy.
  Clarification: yes.
- [x] Confirm action icon visibility.
  Clarification: actions should be visible and subtle, not hover-only.
- [x] Confirm edit while AI is responding.
  Clarification: disable edit while `isTyping` or `pending`.
- [x] Confirm message bubble visual direction.
  Clarification: restrained polish, better spacing, no flashy/heavy gradients.
- [x] Confirm whether header and chat user avatars should match color.
  Clarification: yes. Use `#4f56e6` for both header avatar and chat user avatar.
- [x] Confirm whether avatar size should change.
  Clarification: no size change. Keep the current shared `h-9 w-9` size.
- [x] Confirm which chat spacing should be reduced.
  Clarification: reduce padding inside regular text message bubbles.
- [x] Confirm send button icon.
  Clarification: use the send-horizontal icon style.
- [x] Confirm user message color.
  Clarification: use `#4f56e6` as the user message bubble background.
- [x] Confirm chat area background.
  Clarification: remove `home-page-bg` from chat message area background.
- [x] Confirm AI message shadow.
  Clarification: add a slightly darker, restrained shadow for AI response bubbles.

## Current Observed Implementation

- [x] Home chat and right-side chat use common `ChatWindow` from `src/components/common/chat-window/chat.tsx`.
- [x] Home and panel chat input use common `ChatTextArea` from `src/components/global/chattextares.tsx`.
- [x] `Root.layout.tsx` renders the right-side chat panel using `ChatWindow surface="card"` and `ChatTextArea placement="panel"`.
- [x] Home chat uses wider `ChatWindow surface="page"` behavior.
- [x] Header profile avatar currently computes initials in `src/components/global/Header.tsx`.
- [x] Chat message avatars currently compute user initials inside `ChatWindow`.
- [x] AI chat avatar currently shows hardcoded `AI`.
- [x] AI tooltip currently uses `Enspeek AI`.
- [x] Empty-state text currently references `Enspeek AI`.
- [x] Chat input state is managed by `ChatSlice.message`.
- [x] `useAiChat` exposes `setDraftMessage`, which can be used to fill the chat input for edit behavior.

## Steps To Be Done

- [x] Add shared chat agent identity config, for example `CHAT_AGENT_NAME`, `CHAT_AGENT_INITIALS`, and `CHAT_AGENT_LABEL`.
- [x] Add a reusable avatar/initials component with stable centering and sizing.
- [x] Update header profile avatar to use the shared avatar component.
- [x] Update chat user avatar to use the shared avatar component.
- [x] Update chat AI avatar to use the shared avatar component with `PK`.
- [x] Ensure avatar text is centered horizontally and vertically at all supported sizes.
- [x] Update AI tooltip/display text from hardcoded `Enspeek AI` or `AI` to the shared `Peek` config.
- [x] Update empty chat state text to use `Peek AI agent`.
- [x] Adjust `getInitials` behavior or avatar input mapping so single-name users show one initial only.
- [x] Add copy action under each AI message.
- [x] Add copy action under each user message.
- [x] Add edit action under each user message.
- [x] Wire copy action to copy readable message text to clipboard.
- [x] Strip or normalize rich text/HTML so copied message text is readable.
- [x] Show toast feedback after successful copy.
- [x] Wire edit action to set the chat input draft to the exact user message text.
- [x] Focus the chat input after edit and move cursor to the end of the line.
- [x] Disable edit action while `isTyping` or `pending`.
- [x] Keep copy action enabled while `isTyping` or `pending`.
- [x] Make message action icons small, subtle, and always visible.
- [x] Reduce vertical spacing between regular text messages.
- [x] Reduce regular text message bubble padding.
- [x] Replace chat input send icon with send-horizontal icon.
- [x] Apply `#4f56e6` background to user message bubbles.
- [x] Remove `home-page-bg` from chat message area background.
- [x] Add restrained darker shadow to AI response message bubbles.
- [x] Keep chart/table/question response spacing readable.
- [x] Polish message bubble styling with restrained borders, spacing, and surface colors.
- [x] Update header avatar and chat user avatar color to `#4f56e6`.
- [x] Ensure home chat and right-side panel chat both use the updated behavior.
- [x] Run build and targeted lint for changed files.
- [x] Perform browser verification on home chat and right-side chat panel.
- [x] Mark completed items in this file as work progresses.

## Acceptance Criteria

- [x] Header avatar and chat user avatar use the same shared avatar component.
- [x] User initials are centered in the avatar on all screen sizes.
- [x] AI avatar uses `PK`.
- [x] AI tooltip/display name uses `Peek`.
- [x] Agent name/initials can be changed from one shared config.
- [x] Empty chat state references `Peek AI agent`.
- [x] `Vipin Kumar` renders as `VK`.
- [x] Single-name user renders as one initial.
- [x] Empty user name renders fallback `U`.
- [x] Copy icon appears under AI messages.
- [x] Copy icon appears under user messages.
- [x] Edit icon appears under user messages only.
- [x] Copy action copies readable message text.
- [x] AI chart/table/question responses copy text only and do not attempt to serialize rendered visuals.
- [x] Copy action shows toast feedback.
- [x] Edit action fills chat input with the exact user message text.
- [x] Edit action focuses chat input and places cursor at the end.
- [x] Edit action is disabled while AI is typing or pending.
- [x] Existing send behavior remains unchanged.
- [x] Existing chat history remains unchanged when editing a previous user message.
- [x] Message actions do not overlap long text, charts, tables, or question cards.
- [x] Home chat and right-side panel chat both render the improved UI.
- [x] Message spacing is denser but still readable.
- [x] Message bubble styling looks polished and consistent with the existing Enspeek design system.
- [x] Header and chat user avatars use matching `#4f56e6` color.
- [x] Regular text message bubbles use reduced internal padding.
- [x] Send button uses send-horizontal icon.
- [x] User message bubble background uses `#4f56e6`.
- [x] Chat message area no longer uses `home-page-bg`.
- [x] AI response messages have a restrained darker shadow.

## Unit Tests / Verification

- [x] Run `npm run build`.
- [x] Run targeted lint for changed files.
- [x] If test tooling becomes available, add focused tests for avatar initials generation.
- [x] If test tooling becomes available, add focused tests for copy text normalization.
- [x] Verify copy action for plain AI text.
- [x] Verify copy action for plain user text.
- [x] Verify copy action for rich text/HTML message.
- [x] Verify copy action for AI chart/table/question message copies text only.
- [x] Verify edit action fills input and focuses cursor at end.
- [x] Verify edit action is disabled while `isTyping` or `pending`.
- [x] Verify copy action remains enabled while `isTyping` or `pending`.

Verification note: `npm run build` passes. Targeted lint for changed files passes with no errors; `chat.tsx` still has pre-existing hook dependency warnings.

## Browser Verification Checklist

- [x] Open home page chat and verify AI avatar shows `PK`.
- [x] Open home page chat and verify user avatar initials are centered.
- [x] Open right-side chat panel and verify AI avatar shows `PK`.
- [x] Open right-side chat panel and verify user avatar initials are centered.
- [x] Verify header profile avatar uses the same centered avatar style.
- [x] Verify header profile avatar uses the same color as chat user avatars.
- [x] Verify AI avatar tooltip/name uses `Peek`.
- [x] Verify empty chat state says `Peek AI agent`.
- [x] Send a user message and verify copy + edit actions appear under it.
- [x] Receive an AI message and verify copy action appears under it.
- [x] Click user copy action and verify message text is copied.
- [x] Click AI copy action and verify message text is copied.
- [x] Click user edit action and verify the message text appears in chat input.
- [x] Verify cursor is focused at the end of the input after edit.
- [x] Trigger AI typing/pending state and verify edit action is disabled.
- [x] Verify copy action still works while AI is typing/pending.
- [x] Verify long messages do not overlap avatar or action icons.
- [x] Verify chart/table/question responses still have enough spacing.
- [x] Verify message spacing is reduced without feeling cramped.
- [x] Verify regular text message bubble padding is reduced.
- [x] Verify send button uses send-horizontal icon.
- [x] Verify user messages use `#4f56e6` background.
- [x] Verify chat message area does not show `home-page-bg`.
- [x] Verify AI response shadow is visible but not too dark.
- [x] Verify mobile layout keeps avatar text centered and actions usable.
- [x] Check browser console for runtime errors or warnings introduced by this change.

## Edge Cases

- [x] User has first and last name.
- [x] User has only one name.
- [x] User has no name.
- [x] User has very long name.
- [x] AI agent config changes from `Peek`/`PK` to another name/initials.
- [x] Message text is empty or whitespace-only.
- [x] Message contains HTML/rich text.
- [x] Message contains a long URL.
- [x] Message contains chart/table/question response data.
- [x] Clipboard API fails or is unavailable.
- [x] User clicks edit while AI is typing.
- [x] User clicks copy while AI is typing.
- [x] Chat input is closed or not focused before edit action.
- [x] Home chat uses wide layout.
- [x] Right-side chat uses narrow panel layout.
- [x] Mobile viewport has limited horizontal space.

## Out Of Scope

- [x] Changing backend/chatbot API behavior is out of scope.
- [x] Removing or rewriting chat history persistence is out of scope.
- [x] Editing old chat history entries is out of scope.
- [x] Copying rendered chart/table visuals is out of scope.
- [x] Adding markdown export/download is out of scope.
- [x] Replacing the app-wide design system is out of scope.
