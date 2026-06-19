# ENSPK-106 Publish Survey Responsiveness Plan

## Aim

Make the Publish Survey page and its subheader responsive while preserving clear action availability for inactive and activated studies.

## Scope

- Publish Research subheader behavior
- Inactive study action visibility
- Activated study action dropdown
- Persistent Next action for activated studies
- CSS title truncation
- Mobile bottom navigation compatibility
- Desktop action presentation at and above `1280px`
- No horizontal overflow, clipped controls, or overlapping actions

## Responsive States

The subheader behavior depends on both viewport width and study activation state.

### Inactive Study

This is the state where Initiate Sample Collection is disabled and no other publish actions are available.

#### Below 768px

- Show only the `Publish Research` title.
- Do not show the disabled Initiate Sample Collection action.
- Do not show the three-dot action menu.
- Do not show the Next button.

#### At 768px and Above

- Show the `Publish Research` title.
- Show the disabled Initiate Sample Collection button directly in the subheader.
- Do not place the disabled action inside a three-dot menu.
- Do not show the three-dot action menu.
- Do not show the Next button.

### Activated Study

This is the state where publish and sharing actions are available.

#### Below 1280px

- Show `Publish Research` on the left.
- Show a three-dot action menu on the right.
- Place the three-dot action immediately to the left of Next.
- Keep Next outside the dropdown and always visible.
- Use CSS ellipsis for `Publish Research` if horizontal space becomes limited.
- Allow the title to shrink before the three-dot action or Next button.
- Do not allow the three-dot action or Next button to wrap onto another row.

#### At 1280px and Above

- Preserve the existing desktop inline action presentation.
- Keep the available publish, sharing, download, and navigation actions visible and aligned.
- Keep Next directly accessible.
- Do not show the compact three-dot action menu when all desktop actions fit inline.

## Compact Action Dropdown

- Use the compact action dropdown only for activated studies below `1280px`.
- Show an icon on the left and text on the right for every item.
- Keep the options in this order:
  1. Initiate Sample Collection
  2. Facebook
  3. WhatsApp
  4. Download
- Preserve the existing click behavior for every action.
- Preserve existing permissions, loading states, and disabled states.
- Keep the dropdown inside the visible viewport with appropriate edge spacing.
- Allow the dropdown to reposition vertically or horizontally when space is limited.
- Close the dropdown after an action is selected or after clicking outside it.
- Keep the dropdown keyboard accessible and close it with Escape.

## Subheader Layout

- Keep the title area flexible with `min-width: 0` behavior.
- Keep the action area shrink-safe and on one line.
- Use CSS overflow, `white-space: nowrap`, and `text-overflow: ellipsis` for title truncation.
- Do not use JavaScript viewport measurements for title truncation.
- Keep the three-dot button and Next as fixed-size, non-shrinking controls.
- Maintain clear spacing between the title, three-dot action, and Next.
- Prevent the subheader from creating horizontal page overflow.

## Next Button Rules

- Show Next only when the study is activated and the publish actions are available.
- Keep Next outside the three-dot dropdown.
- Keep Next visible at every activated-study viewport width.
- Preserve the existing Next navigation behavior.
- Do not show Next in the inactive study state.

## Initiate Sample Collection Rules

- Below `768px`, do not render the disabled Initiate Sample Collection action.
- At `768px` and above, show the disabled Initiate Sample Collection button directly when it is the only available action.
- For activated studies below `1280px`, place Initiate Sample Collection as the first dropdown option.
- At `1280px` and above, retain the existing inline desktop placement for the available action.

## Shared Mobile Navigation

- Continue using the shared icon-only bottom navigation below `768px` on study workflow pages.
- Apply the same unlock rules used by the desktop sidebar.
- Do not render navigation destinations that are not yet unlocked.
- Highlight Publish Survey when the current route is the publish page.
- Ensure page content is not covered by the fixed bottom navigation.
- Keep the floating chat control above the bottom navigation.

## Accessibility Requirements

- Give the three-dot action button an accessible name and tooltip.
- Give every icon-only control an accessible name.
- Keep dropdown items operable by keyboard.
- Maintain visible focus indicators.
- Keep disabled controls semantically disabled.
- Preserve readable labels for screen readers when the visual title is truncated.
- Ensure touch targets remain usable below `768px`.

## Areas To Verify

- Inactive subheader below `768px`
- Inactive subheader at `768px` and above
- Activated subheader below `768px`
- Activated subheader from `768px` through `1279px`
- Activated desktop subheader at `1280px` and above
- Publish Research title truncation
- Three-dot action positioning
- Next button visibility and navigation
- Initiate Sample Collection visibility and behavior
- Facebook action
- WhatsApp action
- Download action
- Dropdown viewport positioning
- Shared bottom navigation active state
- Floating chat clearance
- Keyboard and touch interaction

## Acceptance Criteria

- [ ] No horizontal scrollbar appears at supported viewport widths.
- [ ] For an inactive study below `768px`, only Publish Research is shown in the subheader.
- [ ] For an inactive study below `768px`, Initiate Sample Collection, the three-dot menu, and Next are hidden.
- [ ] For an inactive study at `768px` and above, the disabled Initiate Sample Collection button is shown directly.
- [ ] For an inactive study at `768px` and above, the three-dot menu and Next are hidden.
- [ ] For an activated study below `1280px`, the three-dot menu appears immediately left of Next.
- [ ] For an activated study below `1280px`, Next remains outside the dropdown and visible.
- [ ] Publish Research truncates with CSS ellipsis before the action controls shrink or wrap.
- [ ] The compact dropdown order is Initiate Sample Collection, Facebook, WhatsApp, and Download.
- [ ] Every compact dropdown item shows an icon on the left and text on the right.
- [ ] The compact dropdown stays inside the visible viewport.
- [ ] At `1280px` and above, activated-study actions use the existing inline desktop presentation.
- [ ] At `1280px` and above, the compact three-dot menu is hidden when actions are inline.
- [ ] Existing action behavior, permissions, loading states, and disabled states are preserved.
- [ ] The shared mobile bottom navigation follows desktop unlock rules.
- [ ] Publish Survey is highlighted in the mobile bottom navigation on the publish route.
- [ ] Fixed navigation and floating chat controls do not cover page content or subheader actions.
- [ ] All subheader and dropdown controls remain keyboard and touch accessible.

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
- `1279px`
- `1280px`
- `1440px`

Test both inactive and activated study states at each relevant viewport.

## Implementation Order

1. Audit the current Publish Research subheader and action availability rules.
2. Separate inactive and activated subheader states explicitly.
3. Implement inactive mobile visibility below `768px`.
4. Preserve the direct disabled Initiate Sample Collection action at `768px` and above.
5. Add the activated-study compact dropdown below `1280px`.
6. Keep Next outside the dropdown and non-shrinking.
7. Add CSS-only Publish Research title truncation.
8. Preserve the inline activated desktop actions at `1280px` and above.
9. Verify shared bottom navigation and floating chat clearance.
10. Test all acceptance criteria across the suggested viewport widths and both study states.
