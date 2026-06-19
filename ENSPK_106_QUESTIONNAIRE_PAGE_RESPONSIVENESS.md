# ENSPK-106 Questionnaire Page Responsiveness Plan

## Aim

Make the questionnaire page fully responsive below and above `768px` while preserving the established desktop experience and keeping all questionnaire actions accessible.

## Scope

- Mobile questionnaire layout below `768px`
- Responsive questionnaire subheader
- Mobile question action dropdown
- Mobile accordion interaction without a visible expand/collapse icon
- Shared fixed bottom navigation below `768px`
- Desktop layout at `768px` and above
- Left sidebar, questionnaire content, and right chat alignment
- No horizontal overflow, clipped actions, or overlapping controls

## Breakpoint Behavior

### Mobile: Below 768px

- Use the mobile questionnaire layout.
- Hide the desktop left sidebar.
- Show the shared fixed bottom navigation.
- Replace the question action icons with a three-dot dropdown.
- Hide the question expand/collapse chevron.
- Keep the questionnaire subheader compact and responsive.

### Desktop view: 768px and Above

- Preserve the current desktop layout and behavior.
- Keep the left sidebar, questionnaire content, and right chat panel properly aligned.
- Keep one consistent desktop view at every width from `768px` upward.
- Make the desktop view fluid and responsive without introducing a separate layout division at a larger breakpoint.

## Mobile Bottom Navigation

- Treat the bottom navigation as a shared authenticated-page component for all pages.
- Show it only below `768px`.
- Fix it to the bottom of the viewport.
- Display icons only; do not show text labels.
- Match the desktop sidebar unlock rules; do not render navigation items that are not yet available for the current study.
- Keep the items in this left-to-right order:
  1. Home
  2. Questionnaire
  3. Publish Survey
  4. Report
  5. Crosstab
- Visually highlight the active page icon.
- Give every icon an accessible label and title.
- Add enough page-bottom spacing so content is not hidden behind the fixed navigation.
- Keep the navigation usable with device safe-area insets.
- Ensure the mobile floating chat control and chat sheet do not block the bottom navigation.
- Hide the bottom navigation when the viewport is `768px` or wider.

## Questionnaire Subheader

- Below `768px`, show `Questionnaire` on the left.
- Show the dynamic question count and the `Next` button on the right.
- Keep the `Next` button visible and usable as horizontal space becomes limited.
- Use CSS overflow and ellipsis behavior instead of JavaScript width calculations.
- Truncate `Questionnaire` first when space becomes limited.
- If the screen becomes narrower, truncate the question count after the title.
- Keep the question count grammatically correct for singular and plural values where supported.
- Do not add a questionnaire-level three-dot action menu at this time.
- Reserve the general subheader action-dropdown pattern for other pages when those pages are addressed.
- At and above `768px`, retain the appropriate desktop subheader layout without overlap.

## Mobile Question Strip

- Below `768px`, keep the question strip compact and readable.
- Show the question type immediately to the left of the three-dot action button.
- Supported type labels such as Single Select and Multiple Select must remain visible.
- Allow long question type labels to truncate safely without pushing the action button off-screen.
- Show one three-dot action button at the right edge of the strip.
- Do not show separate Add/Edit Logic, Edit Question, Copy Question, or Delete Question icons.
- Do not show the expand/collapse chevron below `768px`.
- Tapping the question strip should continue to expand or collapse the question.
- Clicking the question type control or three-dot action button must not expand or collapse the question accidentally.
- Preserve keyboard accessibility and clear focus states for interactive controls.

## Mobile Question Action Dropdown

- Open the dropdown from the question strip's three-dot button.
- Show an icon on the left and text on the right for every option.
- Keep the options in this order:
  1. Add/Edit Logic
  2. Edit Question
  3. Copy Question
  4. Delete Question
- Use the label `Add/Edit Logic` as confirmed.
- Keep destructive styling for Delete Question.
- Position the menu within the visible viewport with appropriate edge spacing.
- Allow the menu to reposition vertically or horizontally when space is limited.
- Close the menu after an action is selected or after clicking outside it.
- Preserve the existing permissions, disabled states, and action behavior.

## Question Edit Header

- In edit mode, keep the question ID, question label, confirm action, and cancel action on one line.
- Truncate the question ID/label area with CSS ellipsis when horizontal space is limited.
- Replace the Save and Close text buttons with a green circular check button and a gray circular X button.
- Do not show the collapse chevron while a question is being edited.
- Preserve the existing create-question controls when the form is not editing an existing question.

## Answer Option Actions

- In both edit and non-edit modes, place Termination, Skip To, and Delete Option inside a three-dot dropdown.
- Delete Option must remove the answer option itself, not only reset its logic.
- In edit mode, remove the option from the pending form state.
- In non-edit mode, save the question with the selected option removed through the existing question edit behavior.
- When termination or skip logic is applied, show a logic-applied icon immediately to the left of the three-dot button.
- Keep the Skip To selector usable inside the dropdown.
- Keep termination and skip logic mutually exclusive, matching the existing behavior.

## Logic Modal Actions

- Keep Reset Logic and Save Logic on one row when space allows.
- When the buttons stack, show Save Logic above Reset Logic.

## Desktop Requirements

- At and above `768px`, retain the desktop question action presentation.
- Keep the expand/collapse icon visible in the desktop question strip.
- Keep the question type and action controls aligned at all supported desktop widths.
- Use fluid, responsive panel widths throughout the full desktop range from `768px` upward.
- Prevent the left sidebar and right chat panel from squeezing the questionnaire into an unusable width.
- Allow long study names, question text, type labels, and subheader content to truncate or wrap safely.
- Keep the questionnaire editor vertically scrollable where needed.
- Keep the chat content scrollable and the chat input accessible.
- Avoid controls wrapping into unintended rows or overlapping adjacent panels.
- Keep the desktop layout visually and functionally consistent as the viewport grows.

## Interaction and Accessibility Requirements

- All icon-only controls must have accessible names.
- Interactive elements must remain keyboard accessible.
- Dropdown focus must remain usable after opening and closing the menu.
- Question strip keyboard behavior must remain consistent with accordion behavior.
- Touch targets should remain large enough for mobile use.
- Fixed navigation and floating controls must not cover modal actions or focused inputs.
- Opening a modal or dropdown must not create horizontal page overflow.

## Areas To Verify

- Global header and mobile back control
- Questionnaire subheader
- Dynamic question count
- Next button
- Question strip in collapsed and expanded states
- Question type label and selector
- Three-dot question action menu
- Add/Edit Logic action
- Edit Question action
- Copy Question action
- Delete Question action and confirmation modal
- Shared mobile bottom navigation
- Active bottom-navigation state
- Mobile floating chat button and chat sheet
- Left sidebar from `768px` upward
- Questionnaire editor from `768px` upward
- Right chat panel from `768px` upward
- Desktop layout across all widths from `768px` upward

## Acceptance Criteria

- [ ] No horizontal scrollbar appears at supported viewport widths.
- [ ] Below `768px`, the desktop left sidebar is replaced by the fixed bottom navigation.
- [ ] Bottom navigation shows icon-only Home, Questionnaire, Publish Survey, Report, and Crosstab items in the confirmed order.
- [ ] Locked sidebar destinations are not rendered in the mobile bottom navigation.
- [ ] The active bottom-navigation item is visually highlighted.
- [ ] Every bottom-navigation icon has an accessible label.
- [ ] Page content is not covered by the fixed bottom navigation.
- [ ] Mobile floating chat controls do not block the bottom navigation.
- [ ] Below `768px`, the subheader shows Questionnaire on the left and the question count plus Next on the right.
- [ ] The Next button remains visible at narrow widths.
- [ ] Questionnaire truncates with CSS ellipsis before the question count truncates.
- [ ] The question count truncates safely when the viewport becomes extremely narrow.
- [ ] No questionnaire-level subheader action dropdown is shown.
- [ ] Below `768px`, the question type appears immediately left of the three-dot action button.
- [ ] Below `768px`, separate question action icons are hidden.
- [ ] Below `768px`, the expand/collapse chevron is hidden.
- [ ] Tapping the question strip still expands and collapses the question.
- [ ] Clicking the question type or three-dot control does not toggle the question.
- [ ] The mobile question action menu shows icons on the left and text on the right.
- [ ] The action menu order is Add/Edit Logic, Edit Question, Copy Question, and Delete Question.
- [ ] The question action dropdown stays inside the visible viewport.
- [ ] Existing action permissions, disabled states, and behaviors are preserved.
- [ ] In question edit mode, the ID/label and circular confirm/cancel actions remain on one line.
- [ ] The edited question ID/label truncates safely when space is limited.
- [ ] The edit-mode collapse chevron is hidden.
- [ ] Termination, Skip To, and Delete Option appear in a row-level three-dot dropdown in edit and non-edit modes.
- [ ] Delete Option removes the answer option in both edit and non-edit modes.
- [ ] A logic-applied icon appears immediately left of the row menu when termination or skip logic exists.
- [ ] When logic modal actions stack, Save Logic appears above Reset Logic.
- [ ] At `768px` and above, the mobile bottom navigation is hidden.
- [ ] At `768px` and above, desktop question actions and the expand/collapse icon remain visible.
- [ ] At every width from `768px` upward, the left sidebar, questionnaire content, and right chat panel remain visible and usable.
- [ ] At every width from `768px` upward, panels do not overlap or create horizontal scrolling.
- [ ] The same desktop layout remains visually and functionally consistent throughout the complete desktop range.
- [ ] Dropdowns, modals, chat input, and fixed controls remain keyboard and touch accessible.

## Suggested Viewports For Verification

- `320px`
- `360px`
- `390px`
- `430px`
- `540px`
- `767px`
- `768px`
- `820px`
- `1024px`
- `1180px`
- `1440px`

## Implementation Order

1. Audit the current questionnaire, sidebar, subheader, question strip, and chat layout.
2. Add the shared icon-only mobile bottom navigation.
3. Add mobile content spacing and coordinate the floating chat position.
4. Update the mobile questionnaire subheader and CSS truncation priorities.
5. Replace mobile question action icons with the three-dot dropdown.
6. Hide the mobile chevron while preserving strip-based accordion interaction.
7. Correct the fluid three-column desktop layout at every width from `768px` upward.
8. Verify that the desktop layout remains consistent throughout the complete desktop range.
9. Test all acceptance criteria across the suggested viewport widths.
