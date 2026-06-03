# ENSPK-99: Improve Homepage Study Listing Density and Data Presentation

## Objective

- [ ] Improve the home page and study listing presentation so users can see more studies and useful study details at a glance without excessive scrolling.
- [ ] Reduce unnecessary whitespace while keeping the interface professional, readable, and aligned with the existing Enspeek visual system.
- [ ] Preserve existing study-list business behavior: permissions, tab selection, row actions, archive/delete/copy/share/activate flows, and navigation targets must continue to work as they do today.
- [ ] Keep the homepage chat-first while improving the study listing/sidebar/card experience around it.
- [ ] Use a maintainable, reusable card-based architecture that can scale as the platform grows.
- [ ] Ensure study search works correctly across the updated listing UI.

## Confirmed Business Logic

- [x] This task is UI-only.
- [x] No API or backend changes are allowed.
- [x] Homepage must remain chat-first.
- [x] Study listings should use cards as the preferred presentation model.
- [x] Updated UI must apply to Active, All, and Archived tabs.
- [x] Search functionality is in scope and must work properly.
- [x] Architecture should be maintainable, reusable, and scalable for an early-stage platform.
- [x] Card actions must stay in a dropdown.
- [x] Pagination behavior must remain unchanged.
- [x] Study state labels should display the API value as-is, for example `In-Progress`.
- [x] Do not add derived workflow labels when the API state already communicates status such as `In-Progress`, launched, or collecting data.
- [x] Study card field priority is: study name, current state, owner, created date, actions dropdown.
- [x] Loading state should use compact skeleton cards instead of a large blank area.
- [x] Empty/no-result states should use clear text such as `No active studies yet.`, `No archived studies yet.`, and `No studies match your search.`
- [x] Remove visible listing title text such as `My Studies`, `All Studies`, and `Archive Studies`.
- [x] Remove the gray background behind the Active, All, and Archived tab controls.
- [x] Use the space freed by removing redundant listing titles/backgrounds to improve card/list density and alignment.
- [x] Do not show time values on study cards.

## Business Logic Clarifications

- [x] Confirm whether this task is UI-only, or whether backend/API changes are expected.
  Clarification: this task is UI-only. No backend/API changes are allowed.
- [x] Confirm whether the homepage should continue to be chat-first, or whether study listing content should become visible on the first screen.
  Clarification: homepage must continue to be chat-first.
- [x] Confirm which study lists are in scope: only home page active studies, or also archived/shared/all-active tabs if present.
  Clarification: Active, All, and Archived tabs are in scope.
- [x] Confirm whether the current `/study/listing` API fields are sufficient, or if additional fields should be requested/displayed.
  Clarification: current API fields are sufficient. Use only existing `/study/listing` fields and do not request new fields.
- [x] Confirm the priority order of fields in dense study cards/table rows.
  Clarification: use this card order: study name, current state, owner, created date, actions dropdown.
- [x] Confirm whether row actions should remain in the existing dropdown, become visible inline icons, or use a hybrid compact action layout.
  Clarification: actions must stay in the dropdown.
- [x] Confirm whether study state labels should be displayed exactly as API returns them, or normalized into a fixed set of product labels.
  Clarification: show API state labels exactly as returned, for example `In-Progress`.
- [x] Confirm whether density should favor table layout, card/list layout, or responsive table on desktop plus compact cards on mobile.
  Clarification: use card-based listing UI.
- [x] Confirm the minimum acceptable readability target: compact but comfortable rows/cards, or maximum number of visible studies above the fold.
  Clarification: prefer compact-but-comfortable cards. Do not sacrifice readability just to maximize count above the fold.
- [x] Confirm whether pagination behavior should remain unchanged, or if page size/infinite scroll/virtualization is expected.
  Clarification: pagination must remain unchanged.
- [x] Confirm whether sorting and filtering improvements are in scope, or whether this ticket only changes presentation.
  Clarification: search improvement is in scope. New sorting/filtering beyond search is out of scope.
- [x] Confirm whether empty, loading, and error states should be redesigned as part of the density work.
  Clarification: yes for loading and empty states. Use compact skeleton cards for loading and clear compact empty/no-result text.
- [x] Confirm whether archived/shared/non-owner studies should expose different visible metadata or action availability.
  Clarification: preserve existing restrictions. Do not change permissions, selection rules, or action availability.
- [x] Confirm whether listing headings such as `My Studies`, `All Studies`, and `Archive Studies` should remain visible.
  Clarification: remove these visible listing title texts.
- [x] Confirm whether the gray background behind Active, All, and Archived should remain.
  Clarification: remove the gray background behind these tab controls.
- [x] Confirm whether time should be displayed on study cards.
  Clarification: do not show time values on cards. Created date may remain, but time should be omitted.

## Final Implementation Assumptions

- [x] Use only existing `/study/listing` API fields. Do not request new fields or change payload contracts.
- [x] Prefer compact-but-comfortable cards over forcing a specific number of cards above the fold.
- [x] Active, All, and Archived cards should show the same metadata structure unless existing business rules already restrict actions.
- [x] Non-owner/shared/archived studies must preserve existing action and selection restrictions.
- [x] Search should cover visible card fields from existing data: study name, current state, owner, and created date.
- [x] Search should be case-insensitive, trim leading/trailing spaces, and safely handle missing values.

## Current Observed Implementation

- [x] Homepage route `/` renders `ProjectListing` from `src/components/common/list/project-list.tsx`.
- [x] Current homepage is primarily a chat-first hero surface when no chat messages exist.
- [x] Study listing data is fetched by `useStudyList(enableTab)` in `src/api-network/homepage/query.tsx`.
- [x] Study records currently support fields such as `studyName`, `studyCategory`, `studyState`, `createdOn`, `studyID`, `launch`, `hasQuestionnaire`, `liveLink`, `output`, `studyType`, `isOwner`, owner `name`, and `email`.
- [x] Existing table columns are defined in `src/components/common/list/Column.tsx`: select, study name, created on, owner, current state, and action.
- [x] Existing row actions include Copy Study, Share Study, Settings, Output, and Crosstab depending on study state fields.
- [x] Existing sidebar/tab/search logic is in `src/components/global/HomeSidebar.tsx`.
- [x] Existing study card implementation is in `src/components/global/card.tsx`.
- [x] Existing list tabs use `myactive`, `allactive`, and `isarchived` selections.
- [x] Current sidebar search appears to filter by study name and should be reviewed for field naming consistency and correct behavior.

## Steps To Be Done

- [ ] Capture or inspect the current homepage/study-list layout at desktop and mobile sizes.
- [ ] Identify the specific white-space sources causing low density: hero sizing, card padding, row padding, table cell padding, gaps, font scale, empty panels, or page-level layout constraints.
- [x] Decide the approved data presentation model: card-based study listing.
- [ ] Define a reusable study card data model/view-model so UI formatting is centralized and not repeated across tabs.
- [x] Define the study metadata hierarchy: study name, current state, owner, created date, actions dropdown.
- [ ] Update Active, All, and Archived tabs to use the improved card presentation.
- [ ] Remove visible listing title text such as `My Studies`, `All Studies`, and `Archive Studies`.
- [ ] Remove the gray background/container treatment behind Active, All, and Archived tab controls.
- [ ] Rebalance the study listing layout so the removed title/background space is used for better card density and spacing.
- [ ] Keep the homepage hero/chat experience intact while improving surrounding study-list density.
- [ ] Reduce spacing and row/card height using existing UI patterns and Tailwind conventions.
- [ ] Improve status/state presentation with compact badges or text treatments while keeping API-provided state label text unchanged.
- [ ] Make search reliable and maintainable across visible card fields, including case-insensitive matching and safe handling of missing fields.
- [ ] Keep filtering/search logic separate from card rendering so components remain reusable.
- [ ] Prefer small focused helpers/components over one large component with mixed data, presentation, and action logic.
- [ ] Preserve existing navigation behavior when clicking study names.
- [ ] Preserve existing row action availability and destinations.
- [ ] Preserve checkbox selection behavior for owner studies.
- [ ] Ensure long study names, owner names, and dates do not break the layout.
- [ ] Ensure study cards show date without time.
- [ ] Ensure mobile layout remains usable without horizontal overflow or clipped actions.
- [ ] Review related shared UI components only if needed, keeping changes scoped to this Jira.
- [ ] Add compact skeleton-card loading state for study listing.
- [ ] Add clear compact empty states for Active, Archived, and search no-result scenarios.
- [ ] Run lint/build checks after implementation.
- [ ] Perform a browser visual verification after starting the dev server.
- [ ] Mark completed items in this file as work progresses.

## Acceptance Criteria

- [ ] Users can see more studies or study details on the homepage/study listing without excessive scrolling.
- [ ] The layout appears professional, compact, and consistent with the existing Enspeek design language.
- [ ] Study name, owner, created date, current state, and available actions remain visible or easily accessible.
- [ ] Study cards do not show time values.
- [ ] Active, All, and Archived tabs all use the updated card-based listing UI.
- [ ] Listing title text such as `My Studies`, `All Studies`, and `Archive Studies` is not shown.
- [ ] Active, All, and Archived tabs do not have a gray background behind them.
- [ ] Removed heading/background space is reused cleanly so the listing feels denser and better aligned.
- [ ] Homepage remains chat-first and the chat entry experience is not removed.
- [ ] Search works correctly for the agreed searchable fields and does not break when optional fields are missing.
- [ ] Existing actions continue to work: copy, share, settings, output, crosstab, archive/delete/activate flows where applicable.
- [ ] Actions remain inside a dropdown.
- [ ] State labels render the API text as-is.
- [ ] No extra derived workflow indicators are added beyond the existing API state label.
- [ ] Pagination behavior is unchanged.
- [ ] Owner-only selection remains owner-only.
- [ ] Long content is handled gracefully with truncation, wrapping, tooltips, or responsive stacking where appropriate.
- [ ] Loading state uses compact skeleton cards.
- [ ] Empty and search no-result states use clear compact text and do not create awkward large blank areas.
- [ ] Desktop view has improved information density without feeling cramped.
- [ ] Mobile view remains readable and does not require unintended horizontal scrolling.
- [ ] No backend/API payload contract is changed.
- [ ] No unrelated homepage/chat functionality is removed.
- [ ] New or updated components are reusable, named clearly, and keep data transformation separate from UI rendering.

## Unit Tests / Verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
- [ ] If test tooling is added or already available later, add focused tests for any extracted study presentation helpers.
- [ ] If search logic is extracted, add focused test coverage for case-insensitive search, whitespace trimming, missing fields, and multiple fields if approved.
- [ ] Verify render behavior for studies with missing optional fields such as `liveLink`, `downloadReport`, `externalDataLink`, owner email, or category.
- [ ] Verify action visibility rules for combinations of `hasQuestionnaire`, `launch`, and ownership.
- [ ] Verify visual behavior for empty study list, one study, many studies, and long study names.
- [ ] Verify responsive layout at mobile, tablet, and desktop widths.

## Browser Verification Checklist

- [ ] Open the homepage and confirm the chat-first hero/entry experience still appears as expected.
- [ ] Verify the study listing area/sidebar is visible and uses the updated card UI.
- [ ] Check Active tab: cards are compact, readable, and actions still work.
- [ ] Check All tab: cards are compact, readable, and owner/non-owner behavior is correct.
- [ ] Check Archived tab: cards are compact, readable, and archived-specific actions are correct.
- [ ] Search by full study name and confirm matching cards appear.
- [ ] Search by partial study name and confirm matching cards appear.
- [ ] Search with different letter casing and confirm matching cards appear.
- [ ] Search with leading/trailing spaces and confirm matching cards appear.
- [ ] Search by owner name and confirm matching cards appear.
- [ ] Search by state label, such as `In-Progress`, and confirm matching cards appear.
- [ ] Search by created date text shown on the card and confirm matching cards appear.
- [ ] Search for a term with no results and confirm the empty state is clear.
- [ ] Clear search and confirm the full tab list returns.
- [ ] Switch tabs after searching and confirm search behavior is correct for the selected tab.
- [ ] Verify loading state displays compact skeleton cards while studies are being fetched.
- [ ] Verify empty Active tab shows `No active studies yet.`
- [ ] Verify empty Archived tab shows `No archived studies yet.`
- [ ] Verify no-result search shows `No studies match your search.`
- [ ] Trigger copy/share/settings/output/crosstab actions where available and confirm navigation/modals still open.
- [ ] Verify actions are still inside the dropdown, not exposed as always-visible inline icons.
- [ ] Verify non-owner studies do not show owner-only selection/actions.
- [ ] Verify long study names do not overlap actions or metadata.
- [ ] Verify owner name, date, state badge, and key metadata remain readable.
- [ ] Verify cards show date only and no time.
- [ ] Verify state labels match API-provided wording exactly, such as `In-Progress`.
- [ ] Verify `My Studies`, `All Studies`, and `Archive Studies` title text is not visible.
- [ ] Verify there is no gray background behind Active, All, and Archived tab controls.
- [ ] Verify the listing uses the freed vertical/horizontal space cleanly.
- [ ] Verify pagination behavior has not changed.
- [ ] Verify the layout has no unintended horizontal scrolling on mobile.
- [ ] Verify desktop density is improved, with more useful study information visible above the fold.
- [ ] Verify loading, empty, and error states still look professional.
- [ ] Check browser console for runtime errors or warnings introduced by the change.

## Edge Cases

- [ ] Study name is very long.
- [ ] Owner name or email is very long.
- [ ] `createdOn` is missing, invalid, or in an unexpected format.
- [ ] `studyState` is missing or is an unknown value.
- [ ] `isOwner` is false and the selection checkbox must not render.
- [ ] `hasQuestionnaire` and `launch` contain string-like numeric values instead of numbers.
- [ ] User has no studies.
- [ ] User has many studies and scrolling remains smooth.
- [ ] Study has no live link, report, dashboard, or external data links.
- [ ] Shared studies have restricted actions.
- [ ] Archived studies appear with different actions or state labels.
- [ ] Browser viewport is narrow enough that table columns would normally overflow.
- [ ] Search term has mixed casing, extra whitespace, or special characters.
- [ ] Search is performed while switching between Active, All, and Archived tabs.

## Out Of Scope

- [x] Backend API changes are out of scope.
- [x] New study sorting/filtering behavior beyond fixing/improving search is out of scope.
- [x] Changing pagination, page size, or introducing infinite scroll is out of scope.
- [x] Changing permissions for study actions is out of scope.
- [x] Removing the chat-first homepage concept is out of scope.
- [x] Adding new study workflow states is out of scope.
- [x] Redesigning unrelated create, questionnaire, report, crosstab, or admin pages is out of scope.
- [x] Replacing the app-wide design system or introducing a new UI library is out of scope.
