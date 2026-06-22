# ENSPK-106 Report Page Responsiveness

## Goal

Keep the Report subheader on one row at every available content width without hiding actions or creating horizontal overflow.

## Confirmed Layout

- Always show `Report` as the page title.
- Always show the green three-dot action button.
- Always keep Next outside the dropdown.
- Show other report actions inline while space is available.
- Do not use viewport-width or device breakpoints to place actions.

## Adaptive Action Behavior

- Detect the actual space available inside the subheader.
- When the actions no longer fit, move them into the green three-dot dropdown one by one.
- Move the lowest-priority action first.
- Continue until the title, remaining inline actions, three dots, and Next fit on one row.
- When space returns, restore actions inline in reverse order.
- Never show the same action inline and in the dropdown at the same time.
- Do not wrap the subheader onto another row.

## Action Priority

Keep inline from highest to lowest priority:

1. Subgroups
2. Configure Subgroups, when enabled
3. Select Report Questions
4. Table/Chart View
5. Filters

Therefore, actions move into the dropdown in the reverse order. Configure Subgroups must not remain inline if Subgroups has moved into the dropdown.

These actions remain in the dropdown at all times:

1. Add New Filters
2. Download Excel Raw Data
3. Download SPSS Raw Data
4. Download Table Raw Data
5. Download PPT
6. Download History

## Behavior To Preserve

- Subgroups state and Configure Subgroups visibility
- Selected report questions
- Current Table/Chart mode
- Disabled Filters state
- Existing modals and downloads
- Loading and disabled states
- Next navigation to Crosstab with the current study ID
- Keyboard, focus, outside-click, Escape, and touch behavior

## Production Safety

- Observe container-size and action-size changes rather than relying on fixed breakpoints.
- Recalculate when Subgroups, labels, side panels, zoom, or available content width changes.
- Avoid visible action flicker while recalculating.
- Keep the dropdown inside the visible viewport.
- Keep wide report tables scrollable inside their own container.
- Do not change Questionnaire or Publish Survey as part of this task.

## Acceptance Criteria

- [ ] The title is always `Report`.
- [ ] Report, green three dots, and Next remain visible on one row.
- [ ] Actions move into the dropdown one by one only when space is insufficient.
- [ ] Actions return inline in reverse order when space becomes available.
- [ ] No action is duplicated between inline controls and the dropdown.
- [ ] No fixed viewport breakpoint controls action placement.
- [ ] No subheader or page-level horizontal overflow occurs.
- [ ] Existing action state and behavior remain unchanged.
- [ ] Dropdown actions remain keyboard and touch accessible.
- [ ] Report cards, charts, tables, navigation, and chat do not overlap.

## Verification

Resize the available report area continuously and verify every transition where an action enters or leaves the dropdown. Repeat with Subgroups on and off, both report modes, side panels open and closed, browser zoom, downloads, wide tables, keyboard navigation, and touch interaction.
