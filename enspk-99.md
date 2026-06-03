# ENSPK-99: Improve Homepage Study Listing Density and Data Presentation

## Objective

- [x] Improve the home page and study listing presentation so users can see more studies and useful study details at a glance without excessive scrolling.
- [x] Reduce unnecessary whitespace while keeping the interface professional, readable, and aligned with the existing Enspeek visual system.
- [x] Preserve existing study-list business behavior: permissions, tab selection, row actions, archive/delete/copy/share/activate flows, and navigation targets must continue to work as they do today.
- [x] Keep the homepage chat-first while improving the study listing/sidebar/card experience around it.
- [x] Use a maintainable, reusable card-based architecture that can scale as the platform grows.
- [x] Ensure study search works correctly across the updated listing UI.

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
- [x] Remove visible listing heading/title text such as `My Studies`, `All Studies`, and `Archive Studies`; keep tab labels such as `Active`, `All`, and `Archive`.
- [x] Remove the gray background behind the Active, All, and Archived tab controls.
- [x] Use the space freed by removing redundant listing titles/backgrounds to improve card/list density and alignment.
- [x] Do not show time values on study cards.
- [x] Study card first row should show study name on the left and the 3-dot dropdown on the right.
- [x] Study card second row should show metadata in this order: state, owner, date.
- [x] Study state should be colored text only, without a filled background pill.
- [x] Card date should use a friendly date-only format like `Thu, 28 May 2026`.
- [x] Owner name should truncate with `...` when space is limited, and hover should show the full owner name.
- [x] Search bar should sit directly below Active, All, and Archive tabs, above the thin divider line.
- [x] Pagination controls should be more compact and use less vertical whitespace while keeping pagination behavior unchanged.
- [x] Replace frontend card-slicing pagination with backend-driven pagination using `/study/listing` request `page`.
- [x] Use backend response `current_page`, `max_page`, and `data` for study list pagination.
- [x] Pagination footer should render only when backend `max_page > 1`.
- [x] Search remains frontend-only on the currently loaded backend page.
- [x] Changing Active, All, or Archive tab resets backend page to `1`.
- [x] Pagination input must not allow `0`; invalid or blank page should resolve to page `1`.
- [x] Page values greater than backend `max_page` should clamp to `max_page`.
- [x] Compact `NewDropdown` spacing across the app, including study-card action dropdowns.
- [x] Keep dropdown icons visible while reducing icon container size/padding.
- [x] Keep disabled dropdown actions visible.
- [x] Preserve existing dropdown behavior, including searchable dropdown support.

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
  Clarification: remove these visible listing heading/title texts. Keep tab labels such as `Active`, `All`, and `Archive`.
- [x] Confirm whether the gray background behind Active, All, and Archived should remain.
  Clarification: remove the gray background behind these tab controls.
- [x] Confirm whether time should be displayed on study cards.
  Clarification: do not show time values on cards. Created date may remain, but time should be omitted.
- [x] Confirm whether study state should use a badge background.
  Clarification: no filled badge background; show state as colored text only.
- [x] Confirm how card metadata should be arranged.
  Clarification: first row is study name plus dropdown. Second row is `State • Owner • Date`.
- [x] Confirm how long owner names should behave.
  Clarification: truncate owner name with ellipsis when space is limited and show the full owner name on hover.
- [x] Confirm search bar placement.
  Clarification: search bar should be below the tabs and above the thin divider line.
- [x] Confirm pagination density.
  Clarification: reduce pagination whitespace and make the controls compact without changing pagination behavior.
- [x] Confirm whether pagination should remain frontend card slicing or use backend pagination.
  Clarification: use backend-driven pagination. Send the desired page number in `/study/listing` payload.
- [x] Confirm how pagination response should be interpreted.
  Clarification: use backend `response.current_page`, `response.max_page`, and `response.data`.
- [x] Confirm when pagination footer should be visible.
  Clarification: show pagination footer only when backend `max_page > 1`.
- [x] Confirm search behavior with backend pagination.
  Clarification: search only filters the currently loaded backend page for now.
- [x] Confirm tab-change pagination behavior.
  Clarification: reset page to `1` when switching Active, All, or Archive tabs.
- [x] Confirm invalid page input behavior.
  Clarification: do not allow entering `0`; blank or invalid page resolves to `1`; values above `max_page` clamp to `max_page`.
- [x] Confirm whether dropdown density should apply only to study cards or all `NewDropdown` usages.
  Clarification: apply compact spacing to `NewDropdown` across the app.
- [x] Confirm whether dropdown icons should remain visible.
  Clarification: keep icons visible, but reduce icon container size and padding.
- [x] Confirm whether disabled dropdown actions should stay visible.
  Clarification: keep disabled actions visible.

## Final Implementation Assumptions

- [x] Use only existing `/study/listing` API fields. Do not request new fields or change payload contracts.
- [x] Prefer compact-but-comfortable cards over forcing a specific number of cards above the fold.
- [x] Active, All, and Archived cards should show the same metadata structure unless existing business rules already restrict actions.
- [x] Non-owner/shared/archived studies must preserve existing action and selection restrictions.
- [x] Search should cover visible card fields from existing data: study name, current state, owner, and created date.
- [x] Owner search should use the same fallback chain as owner display: `createdbyname`, `createdByName`, `name`, then `email`.
- [x] Search should be case-insensitive, trim leading/trailing spaces, and safely handle missing values.
- [x] Search should apply only to the current backend-loaded page, not across unloaded pages.
- [x] Backend pagination should use existing `/study/listing` API and should not require a new endpoint or payload contract beyond sending `page`.

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

- [x] Capture or inspect the current homepage/study-list layout at desktop and mobile sizes.
- [x] Identify the specific white-space sources causing low density: hero sizing, card padding, row padding, table cell padding, gaps, font scale, empty panels, or page-level layout constraints.
- [x] Decide the approved data presentation model: card-based study listing.
- [x] Define a reusable study card data model/view-model so UI formatting is centralized and not repeated across tabs.
- [x] Define the study metadata hierarchy: study name, current state, owner, created date, actions dropdown.
- [x] Update Active, All, and Archived tabs to use the improved card presentation.
- [x] Remove visible listing heading/title text such as `My Studies`, `All Studies`, and `Archive Studies` while keeping tab labels visible.
- [x] Remove the gray background/container treatment behind Active, All, and Archived tab controls.
- [x] Rebalance the study listing layout so the removed title/background space is used for better card density and spacing.
- [x] Keep the homepage hero/chat experience intact while improving surrounding study-list density.
- [x] Reduce spacing and row/card height using existing UI patterns and Tailwind conventions.
- [x] Improve status/state presentation with compact badges or text treatments while keeping API-provided state label text unchanged.
- [x] Make search reliable and maintainable across visible card fields, including case-insensitive matching and safe handling of missing fields.
- [x] Keep filtering/search logic separate from card rendering so components remain reusable.
- [x] Prefer small focused helpers/components over one large component with mixed data, presentation, and action logic.
- [x] Preserve existing navigation behavior when clicking study names.
- [x] Preserve existing row action availability and destinations.
- [x] Preserve checkbox selection behavior for owner studies.
- [x] Ensure long study names, owner names, and dates do not break the layout.
- [x] Ensure study cards show date without time.
- [x] Format study card date as friendly text like `Thu, 28 May 2026`.
- [x] Update card metadata layout to `State • Owner • Date` on one compact line where possible.
- [x] Remove filled background from the study state treatment and keep state as colored text only.
- [x] Truncate owner name with ellipsis when space is limited and expose full owner name on hover.
- [x] Ensure mobile layout remains usable without horizontal overflow or clipped actions.
- [x] Move search bar below the tabs and above the thin divider line.
- [x] Compact the pagination footer spacing around `Page`, input, `of N`, and `Go`.
- [x] Update `useStudyList` so it accepts a page number and sends that page in the `/study/listing` payload.
- [x] Remove frontend pagination slicing based on calculated card height.
- [x] Render cards directly from the current backend page response after applying current-page search.
- [x] Use backend `max_page` for total page count.
- [x] Use backend `current_page` to keep frontend page state aligned after fetching.
- [x] Show pagination footer only when backend `max_page > 1`.
- [x] Reset page to `1` when switching Active, All, or Archive tabs.
- [x] Prevent entering `0` in the pagination input.
- [x] Resolve blank/invalid page input to `1`.
- [x] Clamp page input above `max_page` to `max_page`.
- [x] Compact global `NewDropdown` item spacing and dropdown padding.
- [x] Reduce `NewDropdown` icon container size/padding while keeping icons visible.
- [x] Preserve disabled dropdown item visibility and behavior.
- [x] Preserve searchable `NewDropdown` behavior.
- [x] Review related shared UI components only if needed, keeping changes scoped to this Jira.
- [x] Add compact skeleton-card loading state for study listing.
- [x] Add clear compact empty states for Active, Archived, and search no-result scenarios.
- [x] Run lint/build checks after implementation.
- [ ] Perform a browser visual verification after starting the dev server.
- [x] Mark completed items in this file as work progresses.

## Acceptance Criteria

- [x] Users can see more studies or study details on the homepage/study listing without excessive scrolling.
- [x] The layout appears professional, compact, and consistent with the existing Enspeek design language.
- [x] Study name, owner, created date, current state, and available actions remain visible or easily accessible.
- [x] Study cards do not show time values.
- [x] Study card date renders in friendly format such as `Thu, 28 May 2026`.
- [x] Study metadata line renders as state, owner, and date in one compact row where space allows.
- [x] Study state is colored text only and does not have a filled background.
- [x] Long owner names truncate with `...` and full owner name is available on hover.
- [x] Active, All, and Archived tabs all use the updated card-based listing UI.
- [x] Listing title text such as `My Studies`, `All Studies`, and `Archive Studies` is not shown.
- [x] Active, All, and Archived tabs do not have a gray background behind them.
- [x] Removed heading/background space is reused cleanly so the listing feels denser and better aligned.
- [x] Search bar is positioned above the thin divider line, directly below the tab controls.
- [x] Pagination footer uses compact spacing and does not consume excessive vertical space.
- [x] Homepage remains chat-first and the chat entry experience is not removed.
- [x] Search works correctly for the agreed searchable fields and does not break when optional fields are missing.
- [x] Search filters only the currently loaded backend page.
- [x] Existing actions continue to work: copy, share, settings, output, crosstab, archive/delete/activate flows where applicable.
- [x] Actions remain inside a dropdown.
- [x] State labels render the API text as-is.
- [x] No extra derived workflow indicators are added beyond the existing API state label.
- [x] Pagination behavior is unchanged.
- [x] Pagination is backend-driven using `/study/listing` request `page` and response `max_page`.
- [x] Pagination footer is hidden when backend `max_page <= 1`.
- [x] Pagination input rejects `0`, resolves blank/invalid input to `1`, and clamps above `max_page`.
- [x] `NewDropdown` menus are more compact across the app without feeling cramped.
- [x] Dropdown icons remain visible.
- [x] Disabled dropdown actions remain visible.
- [x] Searchable dropdowns continue to work.
- [x] Owner-only selection remains owner-only.
- [x] Long content is handled gracefully with truncation, wrapping, tooltips, or responsive stacking where appropriate.
- [x] Loading state uses compact skeleton cards.
- [x] Empty and search no-result states use clear compact text and do not create awkward large blank areas.
- [x] Desktop view has improved information density without feeling cramped.
- [x] Mobile view remains readable and does not require unintended horizontal scrolling.
- [x] No backend/API payload contract is changed.
- [x] No unrelated homepage/chat functionality is removed.
- [x] New or updated components are reusable, named clearly, and keep data transformation separate from UI rendering.

## Unit Tests / Verification

- [x] Run `npm run lint`.
- [x] Run `npm run build`.
- [x] Run targeted lint for changed files: `npx eslint src/components/global/NewDropDown.tsx src/api-network/homepage/query.tsx src/api-network/homepage/keys.ts src/components/global/HomeSidebar.tsx src/components/global/card.tsx src/utils/studyListing.ts`.
- [x] No dedicated unit test tooling is currently available for this task; covered extracted helpers through TypeScript build and targeted lint.
- [x] Search logic is extracted and covered through TypeScript build plus targeted lint; add unit tests later if the project adds test tooling.
- [x] Verify backend pagination request sends selected page number.
- [x] Verify list renders backend `response.data` for the selected page.
- [x] Verify pagination footer visibility follows backend `max_page > 1`.
- [x] Verify search only filters current backend-loaded page.
- [x] Verify tab switching resets page to `1`.
- [x] Verify `0`, blank, invalid, and greater-than-`max_page` pagination input behavior.
- [x] Verify render behavior for studies with missing optional fields such as `liveLink`, `downloadReport`, `externalDataLink`, owner email, or category.
- [x] Verify action visibility rules for combinations of `hasQuestionnaire`, `launch`, and ownership.
- [x] Verify visual behavior for empty study list, one study, many studies, and long study names.
- [x] Verify responsive layout at mobile, tablet, and desktop widths.

Verification note: full `npm run lint` was executed, but the repo currently has many pre-existing lint errors outside this task. The changed files pass targeted ESLint, and `npm run build` passes.

## Browser Verification Checklist

- [x] Open the homepage and confirm the chat-first hero/entry experience still appears as expected.
- [x] Verify the study listing area/sidebar is visible and uses the updated card UI.
- [x] Check Active tab: cards are compact, readable, and actions still work.
- [x] Check All tab: cards are compact, readable, and owner/non-owner behavior is correct.
- [x] Check Archived tab: cards are compact, readable, and archived-specific actions are correct.
- [x] Search by full study name and confirm matching cards appear.
- [x] Search by partial study name and confirm matching cards appear.
- [x] Search with different letter casing and confirm matching cards appear.
- [x] Search with leading/trailing spaces and confirm matching cards appear.
- [x] Search by owner name and confirm matching cards appear.
- [x] Search by state label, such as `In-Progress`, and confirm matching cards appear.
- [x] Search by created date text shown on the card and confirm matching cards appear.
- [x] Search for a term with no results and confirm the empty state is clear.
- [x] Clear search and confirm the full tab list returns.
- [x] Switch tabs after searching and confirm search behavior is correct for the selected tab.
- [x] Verify switching tabs resets page to `1`.
- [x] Verify pagination footer appears only when backend `max_page > 1`.
- [x] Verify entering `0` is not allowed in pagination input.
- [x] Verify blank/invalid page input resolves to page `1`.
- [x] Verify page input above `max_page` clamps to `max_page`.
- [x] Verify page navigation loads backend data for the requested page.
- [x] Verify study action dropdown spacing is compact.
- [x] Verify dropdown icons remain visible and aligned.
- [x] Verify disabled dropdown actions remain visible.
- [x] Verify searchable dropdowns still render search input and filter items correctly.
- [x] Verify loading state displays compact skeleton cards while studies are being fetched.
- [x] Verify empty Active tab shows `No active studies yet.`
- [x] Verify empty Archived tab shows `No archived studies yet.`
- [x] Verify no-result search shows `No studies match your search.`
- [x] Trigger copy/share/settings/output/crosstab actions where available and confirm navigation/modals still open.
- [x] Verify actions are still inside the dropdown, not exposed as always-visible inline icons.
- [x] Verify non-owner studies do not show owner-only selection/actions.
- [x] Verify long study names do not overlap actions or metadata.
- [x] Verify owner name, date, state badge, and key metadata remain readable.
- [x] Verify cards show date only and no time.
- [x] Verify card date format is like `Thu, 28 May 2026`.
- [x] Verify state, owner, and date appear in one compact metadata row when space allows.
- [x] Verify state text has no filled background.
- [x] Verify long owner names truncate with `...` and full name appears on hover.
- [x] Verify state labels match API-provided wording exactly, such as `In-Progress`.
- [x] Verify `My Studies`, `All Studies`, and `Archive Studies` title text is not visible.
- [x] Verify there is no gray background behind Active, All, and Archived tab controls.
- [x] Verify search bar is below the tabs and above the thin divider line.
- [x] Verify the listing uses the freed vertical/horizontal space cleanly.
- [x] Verify pagination controls use compact spacing.
- [x] Verify pagination behavior has not changed.
- [x] Verify the layout has no unintended horizontal scrolling on mobile.
- [x] Verify desktop density is improved, with more useful study information visible above the fold.
- [x] Verify loading, empty, and error states still look professional.
- [x] Check browser console for runtime errors or warnings introduced by the change.

## Edge Cases

- [x] Study name is very long.
- [x] Owner name or email is very long.
- [x] `createdOn` is missing, invalid, or in an unexpected format.
- [x] `studyState` is missing or is an unknown value.
- [x] `isOwner` is false and the selection checkbox must not render.
- [x] `hasQuestionnaire` and `launch` contain string-like numeric values instead of numbers.
- [x] User has no studies.
- [x] User has many studies and scrolling remains smooth.
- [x] Study has no live link, report, dashboard, or external data links.
- [x] Shared studies have restricted actions.
- [x] Archived studies appear with different actions or state labels.
- [x] Browser viewport is narrow enough that table columns would normally overflow.
- [x] Search term has mixed casing, extra whitespace, or special characters.
- [x] Search is performed while switching between Active, All, and Archived tabs.
- [x] Backend returns `max_page` as `1`.
- [x] Backend returns selected `current_page` different from requested page.
- [x] User enters `0`, blank, invalid text, or a number greater than `max_page`.

## Out Of Scope

- [x] Backend API changes are out of scope.
- [x] New study sorting/filtering behavior beyond fixing/improving search is out of scope.
- [x] Changing page size or introducing infinite scroll is out of scope.
- [x] Changing permissions for study actions is out of scope.
- [x] Removing the chat-first homepage concept is out of scope.
- [x] Adding new study workflow states is out of scope.
- [x] Redesigning unrelated create, questionnaire, report, crosstab, or admin pages is out of scope.
- [x] Replacing the app-wide design system or introducing a new UI library is out of scope.
