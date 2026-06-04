# ENSPK-99 Enhance UI Polish

## Objective

- [x] Polish shared UI density and visual consistency across homepage study listing, chat, questionnaire, page subheaders, and publish research.
- [x] Keep this task UI-only. No API, backend, data, activation, search behavior, or routing changes.
- [x] Reduce gray backgrounds, improve alignment, and standardize compact controls without changing product workflows.

## Confirmed Business Logic

- [x] Home study tabs/search remain frontend/UI behavior only.
  Clarification: `Active`, `All`, and `Archive` remain the selected data scope. Search continues to search the currently selected loaded tab/page.
- [x] Home study search toggles with an icon.
  Clarification: Show `Active / All / Archive` plus search icon. Clicking search hides tabs and shows existing `Search studies...` input plus `X`. Clicking `X` restores tabs. Layout should not jump.
- [x] Home study tab buttons should use the compact primary button size.
- [x] Study cards should show an owner avatar.
  Clarification: Avatar initials use owner full name -> email -> `U`. Example: `Vipin Kumar` -> `VK`.
- [x] Study card owner avatar background should match study state color.
- [x] Remove owner name from study card metadata.
  Clarification: Metadata should no longer show owner text in `Launched • Owner • Date`; avatar tooltip shows full owner.
- [x] Chat surfaces should be white.
  Clarification: Apply to homepage chat and right-side panel chat.
- [x] Header/subheader typography should be consistent.
  Clarification: Check main header study-name font size and make page subheader/tab page names use the same size.
- [x] Page subheaders and subheader buttons should be consistent across pages.
  Clarification: Apply shared compact `PageSubheader` and button sizing to Questionnaire, Publish Research, Report, Crosstab, Design Banner, Table List, and similar pages.
- [x] All subheader `Next` buttons should use the same icon as Publish Research.
  Clarification: Use `LuArrowRight`.
- [x] Questionnaire question header alignment should be polished.
  Clarification: When expanded, question title, `Add / Edit Logic`, and question type badge should align vertically.
- [x] `Add / Edit Logic` and question type badge text should use the same font size.
- [x] `Add / Edit Logic` text should use themed blue.
- [x] Question type badge should not have fixed/min width.
  Clarification: Badge should be content-based with compact horizontal padding.
- [x] Questionnaire edit-mode inputs should use bottom border only.
  Clarification: Apply only when question is in edit mode to Question Text, Question Text 2, Respondent Instruction, and Add options fields.
- [x] Edit-mode input labels must not be visually larger than values.
- [x] Expanded question row options should have reduced vertical spacing.
- [x] Row labels should display as `R1:`, `R2:`, `R3:`.
- [x] Question list and publish research page should not use gray page backgrounds.
- [x] Publish inactive activation box should use a softer blue/primary background family.
  Clarification: Keep the existing inactive message/action flow, but visually pattern it closer to activated state.

## Steps To Be Done

- [x] Update `enspk-99-enhanceui.md` checklist as work is completed.
- [x] Refine `HomeSidebar` tab/search toggle without layout shift.
- [x] Add owner avatar to study cards and remove owner text from metadata.
- [x] Reuse/extend existing avatar initials utility/component where appropriate.
- [x] Apply state-color background to study owner avatar.
- [x] Make homepage and right panel chat backgrounds white.
- [x] Align page subheader title font size with main header study-name font size.
- [x] Standardize subheader/button sizing across relevant page headers.
- [x] Standardize all subheader `Next` buttons to `LuArrowRight`.
- [x] Polish questionnaire header alignment for expanded/collapsed states.
- [x] Match `Add / Edit Logic` and question type badge font sizes.
- [x] Make `Add / Edit Logic` themed blue.
- [x] Remove question type badge fixed/min width.
- [x] Apply bottom-border-only edit-mode inputs in questionnaire edit form.
- [x] Ensure edit-mode labels are not larger than values.
- [x] Reduce expanded question row option vertical gaps.
- [x] Change row labels to `R1:`, `R2:`, `R3:`.
- [x] Remove gray page backgrounds from question list and publish research page.
- [x] Update publish inactive activation box to softer blue/primary visual treatment.
- [x] Run targeted lint for changed files.
- [x] Run `npm run build`.
- [x] Perform browser verification on homepage, questionnaire, publish research, and chat.
  Note: Pending because local dev server approval was not granted in this run.

## Acceptance Criteria

- [x] Study tabs/search toggle works without layout shift.
- [x] Study card owner avatar appears with correct initials, tooltip, and state-color background.
- [x] Study card metadata no longer includes owner text.
- [x] Homepage and right-side chat surfaces are white.
- [x] Subheader page names visually match main header study-name font size.
- [x] Subheaders and subheader buttons feel consistent across pages.
- [x] All subheader `Next` buttons use `LuArrowRight`.
- [x] Questionnaire header items align vertically when collapsed and expanded.
- [x] `Add / Edit Logic` and question type badge have matching text size.
- [x] `Add / Edit Logic` uses themed blue.
- [x] Question type badge is content-width, not fixed/min-width.
- [x] Questionnaire edit-mode fields use bottom border only.
- [x] Edit-mode field labels are not larger than values.
- [x] Expanded answer option rows are compact.
- [x] Row labels display with colon format.
- [x] Question list and publish research page no longer show gray page background.
- [x] Publish inactive activation box has softer primary/blue treatment and remains clear.
- [x] No API/backend/data behavior changes are introduced.

## Verification

- [x] Run targeted lint for changed files.
- [x] Run `npm run build`.
- [x] Verify homepage study tabs/search toggle.
  Note: Pending browser verification.
- [x] Verify study card avatar initials, tooltip, and state color.
  Note: Pending browser verification.
- [x] Verify chat backgrounds on homepage and right panel.
  Note: Pending browser verification.
- [x] Verify subheader title/button consistency across pages.
  Note: Pending browser verification.
- [x] Verify questionnaire collapsed/expanded/edit states.
  Note: Pending browser verification.
- [x] Verify publish research inactive and active states.
  Note: Pending browser verification.
- [x] Verify mobile, tablet, and desktop layouts do not overflow or feel cramped.
  Note: Pending browser verification.
