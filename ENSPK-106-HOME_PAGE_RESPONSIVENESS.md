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

- [ ] No horizontal scrollbar appears below `768px`.
- [ ] Header controls never overlap the `Enspeek` brand text.
- [ ] `Enspeek` text hides when mobile header space is not enough.
- [ ] Header action icons remain accessible on mobile.
- [ ] Floating chat button appears on all authenticated pages below `768px`.
- [ ] Floating chat button can be dragged and remains inside the viewport.
- [ ] Floating chat button remembers position during the current session.
- [ ] Floating chat button shows chat icon when closed.
- [ ] Floating chat button is hidden when chat is open.
- [ ] Floating chat uses themed blue background and white chat icon.
- [ ] Floating chat opens as a bottom-sheet style window on mobile.
- [ ] Floating chat shows backdrop behind the chat window.
- [ ] Floating chat closes from the outside X button.
- [ ] Floating chat window opens/closes with smooth animation.
- [ ] No close button appears inside the chat window.
- [ ] Chat content and chat input remain usable on mobile.
- [ ] Mobile chat input placeholder is vertically aligned.
- [ ] Mobile chat input placeholder truncates with ellipsis instead of wrapping.
- [ ] Shared modals have proper spacing from screen edges.
- [ ] Shared modals remain centered and aligned on mobile.
- [ ] Modal header icon, title, and X close button always stay on one line.
- [ ] Modal title truncates with ellipsis when space is limited.
- [ ] Modal body scrolls when content is taller than the viewport.
- [ ] Modal footer buttons do not overlap or overflow.
- [ ] On stacked modal footers, submit/action button appears above cancel/reset.
- [ ] Long modal text and input values wrap safely.
- [ ] Plan Usage Limits metric boxes do not overflow at very narrow widths.
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
