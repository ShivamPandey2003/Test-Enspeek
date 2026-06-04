# ENSPK-99 Publish Survey: Compact Layout & Content Density

## Objective

- [x] Improve publish survey page density so users can see more content without unnecessary scrolling.
- [x] Reduce padding and extra whitespace in active, inactive, response overview, quota/stat, and research link sections.
- [x] Keep this task UI-only. No API, backend, data, quota, activation, link generation, or navigation behavior changes.
- [x] Preserve existing business states: inactive research, active/live research, quota overview, and research link actions.

## Confirmed Business Logic

- [x] This task is UI-only.
  Clarification: Do not change API payloads, activation behavior, quota calculation, live link generation, copy behavior, or routing.
- [x] Inactive research box should remain the same message/action flow, but with reduced padding.
  Clarification: Keep “Research is not active yet...” and `Activate Study`; only compact spacing.
- [x] Live research banner should keep the current live-state styling, but use less padding.
  Clarification: Do not redesign the state; reduce whitespace only.
- [x] Research link should no longer sit inside a bordered/boxed input-style container.
  Clarification: Show link as a compact plain row with copy/open icons still visible on the right.
- [x] Response overview should be compact.
  Clarification: Reduce padding around `Response Overview`, `Total Quota`, `Progress`, and stats.
- [x] Stat cards should show label and value in one line.
  Clarification: `Complete 0`, `Disqualified 0`, and `Incomplete 0`; number should be right-aligned.
- [x] Publish survey subheader buttons should use smaller common button dimensions.
  Clarification: Use the existing `Button` component and existing variant names/colors. Do not create `primary-button`, `secondary-button`, `tertiary-button`, or `primary-std-button`.
- [x] Button variants should keep their existing meaning and color behavior.
  Clarification: Only reduce button sizing/alignment. Existing variants such as `theme`, `success`, `danger`, `cancel`, `secondary`, etc. should continue to work by variant.
- [x] Compact button sizing target.
  Clarification: Use `py-1 px-2`, icon/text gap `2`, and horizontally/vertically centered content. Aim is to make buttons smaller while preserving usability.

## Steps To Be Done

- [ ] Review `src/components/common/Publish-survey/survey.tsx`.
- [ ] Review `src/components/common/Publish-survey/Quota.tsx`.
- [ ] Review `src/components/common/Publish-survey/PublishSurveyHeader.tsx`.
- [ ] Compact inactive research activation box padding and button spacing.
- [ ] Compact live research banner padding without changing live-state meaning.
- [ ] Remove bordered/boxed styling around research link while keeping copy/open actions.
- [ ] Compact research link spacing and ensure long URLs wrap cleanly.
- [ ] Compact `Response Overview` container padding and internal gaps.
- [ ] Convert Complete/Disqualified/Incomplete cards to one-line label/value layout.
- [ ] Right-align stat values in stat cards.
- [ ] Standardize publish survey subheader button sizing using the existing `Button` component and existing variant names.
- [ ] Ensure icon + text buttons use gap `2` and centered alignment.
- [ ] Do not introduce new button variant names for this requirement.
- [ ] Run targeted lint for changed files.
- [ ] Run `npm run build`.
- [ ] Perform browser verification on inactive and active publish survey states.

## Acceptance Criteria

- [ ] Publish survey page shows more content above the fold.
- [ ] Inactive activation box is visibly more compact.
- [ ] `Activate Study` remains clear and clickable.
- [ ] Live research banner keeps current meaning and styling while using less padding.
- [ ] Research link appears without a bordered/boxed container.
- [ ] Copy and open-link icons remain available and aligned with the link.
- [ ] Response overview is compact and readable.
- [ ] `Complete`, `Disqualified`, and `Incomplete` stats display label and number in one row.
- [ ] Stat numbers are right-aligned.
- [ ] Publish survey subheader buttons share smaller compact dimensions.
- [ ] Existing button variant names and colors remain appropriate to each action.
- [ ] No API/backend/data behavior changes are introduced.
- [ ] No horizontal overflow with long research links.

## Verification

- [ ] Run targeted lint for changed files.
- [ ] Run `npm run build`.
- [ ] Verify inactive state: activation box padding is compact.
- [ ] Verify active state: live banner and research link are compact.
- [ ] Verify research link has no bordered/boxed wrapper.
- [ ] Verify copy/open icons still work.
- [ ] Verify response overview cards show `Label Value` in one line.
- [ ] Verify stat values are right-aligned.
- [ ] Verify subheader buttons use smaller compact sizing while keeping existing variant colors.
- [ ] Verify mobile, tablet, and desktop layouts do not feel cramped or overflow.

## Notes

- Prefer existing reusable components and classes.
- Do not add new button naming abstractions for this task. Keep the existing `Button` variant method and reduce shared sizing/alignment only.
- Keep design professional and consistent with the rest of ENSPK-99 density work.
