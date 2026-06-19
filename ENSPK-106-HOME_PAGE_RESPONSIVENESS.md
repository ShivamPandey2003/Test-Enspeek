# ENSPK-106 Home Page Responsiveness Plan

## Aim

Make the authenticated home experience fully responsive below `768px` while keeping the current tablet and desktop behavior unchanged.

## Scope

- Header responsiveness below `768px`
- Floating mobile chat entry point on all authenticated pages below `768px`
- Mobile bottom-sheet chat window
- Shared modal responsiveness
- Home sidebar/study list alignment checks
- No horizontal overflow or UI overlap on mobile screens

## Header Requirements

- Header must remain aligned and usable below `768px`.
- Show a mobile back chevron to the left of the Enspeek logo on non-home routes below `768px`.
- The mobile back control should use the same muted chevron styling as the questionnaire expand control, reversed to point left, at `22px`.
- Mobile back navigation should use browser history when available and fall back to the home page.
- Header action icons must not overlap the `Enspeek` brand text.
- Show the written `Enspeek` text only when there is enough space.
- If space becomes tight, hide the written `Enspeek` text before it overlaps support, plan usage, profile, or dropdown controls.
- Keep the logo icon visible where possible.
- Below `768px`, hide the standalone Request for Assistance and plan usage header icons.
- Below `768px`, show Request for Assistance, Premium/Free plan usage, Profile, and Logout inside the avatar dropdown, subject to the user's access and plan visibility.
- Keep the mobile dropdown items ordered as Request for Assistance, plan usage, Profile, and Logout for client users.
- At and above `768px`, keep Request for Assistance and plan usage as standalone header icons and retain the existing desktop dropdown behavior.
- Support, plan usage, profile/avatar, and dropdown controls must remain accessible at every supported width.

## Floating Mobile Chat Requirements

- Show floating chat button on all authenticated pages below `768px`.
- Default position should be lower-right of the screen.
- Button should be `58px` square and use a `30px` chat icon.
- Button should use themed blue background, white icon, circular shape, and subtle shadow.
- User can drag the floating chat button.
- Dragged button must stay inside viewport bounds.
- Drag boundary calculations must use the same `58px` button size so the button cannot be clipped at viewport edges.
- Remember dragged position during the current session.
- When chat is closed, button shows chat icon.
- When chat is open, hide the floating chat button.
- Show an X close button outside the floating chat window.
- Clicking the floating chat button opens the chat window.
- Clicking the outside X button closes the chat window.
- Do not show a close button inside the chat window.
- Add smooth open/close animation.

## Mobile Chat Window Requirements

- Use bottom-sheet style below `768px`.
- Chat window should reuse the existing chat UI and behavior as much as possible.
- Chat content should be vertically scrollable.
- Chat input should remain accessible.
- Chat input placeholder should stay vertically aligned.
- Chat input placeholder should not wrap; it should truncate with ellipsis when space is limited.
- Chat window should respect screen width and height.
- Mobile chat should use the available vertical space with a height of `calc(100dvh - 4.5rem)` and a maximum height of `760px`.
- Preserve enough space above the sheet for the external close button to remain visible and reachable.
- Chat window should not cause horizontal scrolling.
- Add a backdrop behind the floating chat window, similar to modal overlay behavior.

## Shared Modal Requirements

- Improve shared modal components instead of one-off fixes.
- Modals should have proper spacing from device screen edges.
- Modal panels should be horizontally centered.
- Modal header icon, title, and close button must always stay on one line.
- Modal header title should truncate with ellipsis when horizontal space is limited.
- Modal content should remain vertically usable on short-height screens.
- Modal body should scroll when content is taller than the viewport.
- Footer buttons should stack or wrap cleanly on small screens.
- When footer buttons stack, submit/action button should appear above cancel/reset buttons.
- Inputs, labels, descriptions, and action buttons should not overlap.
- Long text should wrap safely.
- No modal should create horizontal page overflow.
- Plan Usage Limits modal metrics should fit at very narrow widths without text spilling outside the boxes.

## Home Page Areas To Check

- Header
- Home sidebar / study list
- Study tabs
- Search input
- Pagination controls
- Study cards
- Study action dropdowns
- Empty state hero
- Prompt action buttons
- Chat history state
- Floating chat button
- Floating chat bottom sheet
- Home-related modals

## Home-Related Modals

- Logout confirmation modal
- Plan Usage Limits modal
- Support Request modal
- Delete Study modal
- Archive / Restore Study modal
- Copy Study modal

## Acceptance Criteria

- [x] No horizontal scrollbar appears below `768px`.
- [x] Header controls never overlap the `Enspeek` brand text.
- [x] `Enspeek` text hides when mobile header space is not enough.
- [x] Header action icons remain accessible on mobile.
- [x] A `22px` muted left chevron appears before the logo on non-home routes below `768px`.
- [x] The mobile back chevron navigates backward and falls back to home when needed.
- [x] Standalone Request for Assistance and plan usage icons are hidden below `768px`.
- [x] The mobile avatar dropdown contains Request for Assistance, plan usage, Profile, and Logout in that order when all options are available.
- [x] Standalone Request for Assistance and plan usage icons remain available at and above `768px`.
- [x] Floating chat button appears on all authenticated pages below `768px`.
- [x] Floating chat button is `58px` square with a `30px` icon.
- [x] Floating chat button can be dragged and remains inside the viewport.
- [x] Floating chat button remembers position during the current session.
- [x] Floating chat button shows chat icon when closed.
- [x] Floating chat button is hidden when chat is open.
- [x] Floating chat uses themed blue background and white chat icon.
- [x] Floating chat opens as a bottom-sheet style window on mobile.
- [x] Floating chat sheet uses the available height up to `760px` while preserving external close-button clearance.
- [x] Floating chat shows backdrop behind the chat window.
- [x] Floating chat closes from the outside X button.
- [x] Floating chat window opens/closes with smooth animation.
- [x] No close button appears inside the chat window.
- [x] Chat content and chat input remain usable on mobile.
- [x] Mobile chat input placeholder is vertically aligned.
- [x] Mobile chat input placeholder truncates with ellipsis instead of wrapping.
- [x] Shared modals have proper spacing from screen edges.
- [x] Shared modals remain centered and aligned on mobile.
- [x] Modal header icon, title, and X close button always stay on one line.
- [x] Modal title truncates with ellipsis when space is limited.
- [x] Modal body scrolls when content is taller than the viewport.
- [x] Modal footer buttons do not overlap or overflow.
- [x] On stacked modal footers, submit/action button appears above cancel/reset.
- [x] Long modal text and input values wrap safely.
- [x] Plan Usage Limits metric boxes do not overflow at very narrow widths.
- [x] Study list, tabs, search, pagination, and study cards remain aligned below `768px`.
- [x] Study action dropdowns stay inside the visible screen.
- [x] Behavior above or equal to `768px` remains unchanged.

## Suggested Viewports For Verification

- `320px`
- `360px`
- `390px`
- `430px`
- `540px`
- `767px`
- `768px`
- Desktop width

## Implementation Order

1. Update shared modal responsive behavior.
2. Update header mobile spacing and brand text visibility.
3. Add floating mobile chat state and button below `768px`.
4. Add draggable behavior with viewport bounds and session memory.
5. Add mobile bottom-sheet chat window.
6. Check home sidebar/study list/dropdowns below `768px`.
7. Verify all acceptance criteria across target viewports.
