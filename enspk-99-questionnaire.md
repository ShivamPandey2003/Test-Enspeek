# ENSPK-99 Questionnaire: Compact Layout & Content Density

## Objective

- [x] Improve questionnaire page density so users can see more questions on screen without unnecessary scrolling.
- [x] Make collapsed question cards more compact while preserving readability and visual hierarchy.
- [x] Make expanded question content more compact in both normal view and edit mode.
- [x] Show more editable question content on screen when a question is expanded in edit mode.
- [x] Reduce unused whitespace in the subheader, question cards, options, inputs, and expanded sections.
- [x] Keep the page professional, readable, and consistent with the Enspeek design language.
- [x] Maintain accessibility and usability for buttons, inputs, selects, text areas, and keyboard navigation.
- [x] This is a UI-only density/presentation task. No backend, API, questionnaire data, validation rule, or workflow changes are expected.

## Confirmed Business Logic

- [x] Page subheader should use less vertical space.
- [x] Question cards should use tighter padding without losing visual grouping.
- [x] Spacing between question cards should be reduced enough to show more questions in the viewport.
- [x] Question type badges and question ID badges should be compact but still readable.
- [x] Row option inputs should use less visual space while remaining easy to read and edit.
- [x] Expanded question content should show more content above the fold in normal view.
- [x] Expanded question content should show more content above the fold in edit mode.
- [x] Text line-height and label spacing should be tightened only where readability remains good.
- [x] All interactive buttons and elements must keep comfortable touch/click targets.
- [x] Question headings should be sized for dense layout, not oversized.
- [x] Logic sections, option lists, and edit fields inside expanded content should avoid unnecessary gaps.
- [x] Mobile, tablet, and desktop layouts should all benefit from improved density.
- [x] Form inputs, text areas, and selects must remain usable after spacing changes.
- [x] Icon sizes should remain clear and recognizable unless a specific issue is found.

## Business Logic Clarifications

- [x] Confirm this task is UI-only.
  Clarification: Yes. Do not change APIs, data payloads, questionnaire business logic, save behavior, validation rules, or navigation flow.
- [x] Confirm the main density goal.
  Clarification: The aim is to show more collapsed questions on screen and show more expanded question content without excessive scrolling.
- [x] Confirm expanded question scope.
  Clarification: Both normal expanded view and expanded edit mode are in scope.
- [x] Confirm edit mode goal.
  Clarification: When a question is expanded for editing, more fields/options/actions should be visible without scrolling while keeping inputs usable.
- [x] Confirm spacing approach.
  Clarification: Reduce whitespace by adjusting padding, margins, gaps, label spacing, and line-height where appropriate. Do not hard-code exact spacing values from this document if a better local component pattern exists.
- [x] Confirm readability requirement.
  Clarification: Compact is desired, but question text, labels, badges, options, and form fields must remain easy to scan.
- [x] Confirm accessibility requirement.
  Clarification: Interactive controls must remain comfortable to click/tap and keyboard accessible.
- [x] Confirm responsive requirement.
  Clarification: Density improvements must work on mobile, tablet, and desktop, with no cramped layout or horizontal scrolling.

## Current Observed Implementation

- [ ] `PageSubheader` in `src/components/ui/PageSubheader.tsx` uses relatively generous padding.
- [ ] Question cards in `QuestionAccordionItem.tsx` use generous padding.
- [ ] Question cards use larger desktop horizontal padding.
- [ ] Expanded accordion content uses generous padding.
- [ ] Row options in `RowOptions.tsx` use generous input padding.
- [ ] Question spacing is determined by card margin.
- [ ] Question type label uses roomy badge padding.
- [ ] Question heading is visually prominent and should be reviewed for dense layout.
- [ ] Question ID badge uses roomy badge padding.
- [ ] Expanded edit mode needs review for unused whitespace around inputs, options, logic, and actions.

## Steps To Be Done

- [ ] Review `PageSubheader` and reduce unused vertical/horizontal space.
- [ ] Review collapsed question card layout and reduce padding where it does not harm readability.
- [ ] Reduce spacing between question cards so more questions are visible in the viewport.
- [ ] Make question type badges more compact while keeping them readable.
- [ ] Make question ID badges more compact while keeping them readable.
- [ ] Reduce row option/input padding where fields still remain usable.
- [ ] Review expanded accordion content and reduce unused padding/gaps.
- [ ] Review expanded edit mode and reduce unused spacing around editable fields and controls.
- [ ] Reduce gaps or margins within expanded content sections such as logic, options, and edit form areas.
- [ ] Optimize line heights on question labels and supporting text where safe.
- [ ] Test and ensure all interactive buttons remain comfortable to click/tap.
- [ ] Test mobile responsiveness at various viewport sizes.
- [ ] Test desktop responsiveness and ensure layout is not cramped.
- [ ] Verify readability of question text and labels after spacing reductions.
- [ ] Run build and targeted lint for changed files.
- [ ] Perform browser verification on questionnaire page at mobile and desktop sizes.

## Acceptance Criteria

- [ ] `PageSubheader` uses less space and feels visually compact.
- [ ] Question cards have tighter vertical padding without visual hierarchy loss.
- [ ] Spacing between question cards is noticeably reduced.
- [ ] Question type badges are more compact.
- [ ] Question ID badges are more compact.
- [ ] Row option inputs have reduced padding for density while staying usable.
- [ ] Expanded accordion content has tighter spacing.
- [ ] Expanded edit mode has tighter spacing and shows more editable content without excessive scrolling.
- [ ] More collapsed questions are visible in the viewport.
- [ ] More expanded normal-view content is visible in the viewport.
- [ ] More expanded edit-mode content is visible in the viewport.
- [ ] All text remains readable and legible.
- [ ] All interactive elements remain comfortable to click/tap.
- [ ] Mobile layout is responsive and not cramped.
- [ ] Desktop layout shows improved content density.
- [ ] Visual hierarchy and design language remain consistent.
- [ ] No regression in usability or accessibility.
- [ ] Question cards still have sufficient visual separation.
- [ ] Accordion expand/collapse remains smooth and intuitive.
- [ ] Form inputs, text areas, and selects remain usable and properly sized.

## Unit Tests / Verification

- [ ] Run `npm run build`.
- [ ] Run targeted lint for changed files.
- [ ] Verify no console errors or warnings.
- [ ] Check responsive design at 375px mobile viewport.
- [ ] Check responsive design at 768px tablet viewport.
- [ ] Check responsive design at 1920px desktop viewport.
- [ ] Compare viewport space before/after optimization.
- [ ] Verify readability of question headings after spacing changes.
- [ ] Verify readability of labels and badges.
- [ ] Verify touch/click usability for all buttons and controls using DevTools/browser checks.

Verification note: Pending code implementation and build verification.

## Browser Verification Checklist

- [ ] Open questionnaire page at mobile size.
- [ ] Verify page subheader is visually compact.
- [ ] Verify question cards are closer together.
- [ ] Verify more collapsed questions are visible vertically.
- [ ] Verify question text remains readable.
- [ ] Verify question type labels are compact but visible.
- [ ] Verify row option inputs are properly padded for input.
- [ ] Verify expanded accordion sections have reduced padding.
- [ ] Expand a question and verify normal expanded content density.
- [ ] Enter edit mode for an expanded question and verify more editable content is visible without excessive scrolling.
- [ ] Test touch interactions on mobile for buttons, inputs, selects, and text areas.
- [ ] Open questionnaire page at desktop size.
- [ ] Verify header is not too small or cramped.
- [ ] Verify card spacing maintains visual rhythm.
- [ ] Verify no horizontal scrolling or layout shift.
- [ ] Expand multiple questions and verify layout stability.
- [ ] Verify edit/copy/delete buttons are easily clickable.
- [ ] Test keyboard navigation using Tab, Enter, and Space.
- [ ] Verify form inputs are clearly visible and accessible.
- [ ] Verify visual consistency across all question types.
- [ ] Scroll through full question list and check overall density.

## Density Guidance

- [ ] Prefer compact, reusable component-level spacing over one-off overrides.
- [ ] Use the existing component structure and design tokens/classes wherever possible.
- [ ] Tune spacing by visual outcome: more visible questions, less unused whitespace, and no cramped controls.
- [ ] Do not blindly apply fixed spacing values from this document; inspect the actual component and choose the smallest comfortable spacing.
- [ ] Expanded normal view and expanded edit mode should both feel denser and easier to scan.
- [ ] Avoid reducing font sizes or line heights so far that long question text becomes harder to read.
- [ ] Preserve clear separation between question title, metadata, options, logic, and actions.
- [ ] Keep action buttons, form controls, and keyboard focus states easy to use.

## Notes

- Mobile-first approach: optimize mobile first, then verify desktop does not become cramped.
- Consider breakpoints: mobile, tablet, desktop, and wide desktop.
- Maintain visual separation between interactive elements.
- Test with keyboard navigation to ensure no usability regressions.
- Ensure form inputs remain properly sized for accurate text entry.
