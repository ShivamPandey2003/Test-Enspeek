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
- Header action icons must not overlap the `Enspeek` brand text.
- Show the written `Enspeek` text only when there is enough space.
- If space becomes tight, hide the written `Enspeek` text before it overlaps support, plan usage, profile, or dropdown controls.
- Keep the logo icon visible where possible.
- Support, plan usage, profile/avatar, and dropdown controls must remain accessible.

## Floating Mobile Chat Requirements

- Show floating chat button on all authenticated pages below `768px`.
- Default position should be lower-right of the screen.
- Button should use themed blue background, white icon, circular shape, and subtle shadow.
- User can drag the floating chat button.
- Dragged button must stay inside viewport bounds.
- Remember dragged position during the current session.
- When chat is closed, button shows chat icon.
- When chat is open, same button changes to close icon.
- Clicking the button opens/closes the chat window.
- Do not show a separate close button inside the chat window.
- Add smooth open/close animation.

## Mobile Chat Window Requirements

- Use bottom-sheet style below `768px`.
- Chat window should reuse the existing chat UI and behavior as much as possible.
- Chat content should be vertically scrollable.
- Chat input should remain accessible.
- Chat window should respect screen width and height.
- Chat window should not cause horizontal scrolling.
- Floating button should remain usable when chat is open.

## Shared Modal Requirements

- Improve shared modal components instead of one-off fixes.
- Modals should have proper spacing from device screen edges.
- Modal panels should be horizontally centered.
- Modal content should remain vertically usable on short-height screens.
- Modal body should scroll when content is taller than the viewport.
- Footer buttons should stack or wrap cleanly on small screens.
- Inputs, labels, descriptions, and action buttons should not overlap.
- Long text should wrap safely.
- No modal should create horizontal page overflow.

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

- [ ] No horizontal scrollbar appears below `768px`.
- [ ] Header controls never overlap the `Enspeek` brand text.
- [ ] `Enspeek` text hides when mobile header space is not enough.
- [ ] Header action icons remain accessible on mobile.
- [ ] Floating chat button appears on all authenticated pages below `768px`.
- [ ] Floating chat button can be dragged and remains inside the viewport.
- [ ] Floating chat button remembers position during the current session.
- [ ] Floating chat button shows chat icon when closed.
- [ ] Floating chat button shows close icon when chat is open.
- [ ] Floating chat opens as a bottom-sheet style window on mobile.
- [ ] Floating chat closes from the same floating button.
- [ ] Floating chat window opens/closes with smooth animation.
- [ ] No separate close button appears inside the chat window.
- [ ] Chat content and chat input remain usable on mobile.
- [ ] Shared modals have proper spacing from screen edges.
- [ ] Shared modals remain centered and aligned on mobile.
- [ ] Modal body scrolls when content is taller than the viewport.
- [ ] Modal footer buttons do not overlap or overflow.
- [ ] Long modal text and input values wrap safely.
- [ ] Study list, tabs, search, pagination, and study cards remain aligned below `768px`.
- [ ] Study action dropdowns stay inside the visible screen.
- [ ] Behavior above or equal to `768px` remains unchanged.

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
