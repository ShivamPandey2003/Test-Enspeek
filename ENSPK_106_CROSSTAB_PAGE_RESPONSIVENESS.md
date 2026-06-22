# ENSPK-106 Crosstab Page Responsiveness

## Goal

Make the full Crosstab workflow responsive to its actual available content space without fixed viewport breakpoints, overlapping controls, clipped menus, or page-level horizontal overflow.

## Scope

- Banner List subheader
- Banner search
- Banner-card actions
- Design Banner subheader and breadcrumbs
- Table List subheader and breadcrumbs
- Save, Submit, Settings, Download, and Switch Banner controls
- Dropdown, popover, modal, loading, disabled, keyboard, and touch behavior

## Shared Rules

- Measure the actual available container space and rendered control widths.
- Keep primary actions visible while moving lower-priority actions into green three-dot menus one by one.
- Show a three-dot trigger only when it contains an action.
- Never render the same action inline and in a dropdown simultaneously.
- Restore actions inline in reverse order when space returns.
- Collapse breadcrumbs and wide inputs before allowing protected actions to overlap.
- Keep dropdowns and popovers inside the viewport and internally scrollable when required.
- Do not wrap subheader controls onto another row.

## Banner List Subheader

- Always show `Banner List` as the page title.
- Keep Create Banner inline while space allows.
- Move Download History into the green dropdown first.
- Collapse the search field into a search icon when the full field cannot fit.
- Open a focused search popover from the compact search icon.
- Move Create Banner into the green dropdown only when the remaining space is insufficient.
- Do not show a Next button because Crosstab is the final study workflow page.

## Banner Cards

- Keep the banner title and description readable and safely truncated or wrapped.
- Keep card actions inline while they fit.
- Move card actions into a card-level three-dot menu in this order:
  1. Delete
  2. Download
  3. Settings
  4. Copy
  5. Edit
  6. View
- Keep View and Edit inline for the longest time.
- Preserve confirmation, pending, navigation, settings, copy, and download behavior.
- Keep destructive Delete visually distinct inside the dropdown.

## Design Banner Subheader

- Keep Submit visible and outside any dropdown.
- Preserve Submit validation, loading, and disabled behavior.
- Show full breadcrumbs while they fit.
- When breadcrumbs cannot fit, replace them with a back control and the active `Design Banner` label.
- Truncate long banner names before they can overlap Submit.
- Do not add a three-dot menu when Submit is the only action.

## Table List Subheader

### No Table Data

- Keep Save Question visible and outside any dropdown.
- Preserve validation, pending, and disabled behavior.
- Collapse breadcrumbs to a back control plus the active page label when required.
- Do not show an empty three-dot trigger.

### Existing Table Data

- Keep Settings and Download inline while they fit.
- Move Settings into the green dropdown first.
- Move Download into the green dropdown next.
- Preserve the existing Download options without creating an inaccessible nested menu.
- Keep the banner selector and Go control inline while they fit.
- Replace selector and Go with a compact `Switch Banner` control when they cannot fit.
- Open a viewport-safe selector popover from Switch Banner.
- Preserve the selected banner, navigation state, and Go behavior.
- Collapse breadcrumbs before protected controls overlap.

## Search And Switch Popovers

- Open from semantic buttons with accessible names and expanded states.
- Focus the search input or selector when opened.
- Close after completion, outside click, or Escape.
- Return focus to the trigger when closed.
- Reposition on resize and scroll.
- Remain inside the viewport with usable edge spacing.

## Production Safety

- Use one action model for inline and dropdown rendering.
- Use stable action IDs and priority ordering.
- Observe container, control, breadcrumb, and label-size changes.
- Recalculate for side panels, browser zoom, text scaling, and state changes.
- Avoid visible flicker during overflow calculation.
- Preserve API mutations, Redux state, query refreshes, modal state, and navigation context.
- Reuse the shared overflow measurement and viewport-aware menu foundations.

## Accessibility

- Use semantic buttons, inputs, selects, and menu items.
- Provide names and tooltips for icon-only controls.
- Maintain visible focus indicators and semantic disabled states.
- Support keyboard navigation, Escape, outside click, and touch interaction.
- Prevent duplicate or hidden focus targets during action movement.
- Preserve destructive-action confirmation requirements.

## Acceptance Criteria

- [ ] No fixed viewport breakpoint controls action placement.
- [ ] No subheader, card, dropdown, or popover creates page-level horizontal overflow.
- [ ] Green three-dot triggers appear only when they contain actions.
- [ ] Actions move one by one in the confirmed priority order and restore in reverse.
- [ ] Banner List search collapses into an accessible search popover when required.
- [ ] Banner-card actions follow the confirmed overflow order.
- [ ] Submit and Save Question remain outside dropdowns and do not overlap breadcrumbs.
- [ ] Breadcrumbs collapse into a back control plus active label when required.
- [ ] Table List Settings and Download overflow in the confirmed order.
- [ ] Selector and Go become Switch Banner only when they cannot fit.
- [ ] Existing action, loading, disabled, modal, download, and navigation behavior is preserved.
- [ ] Dropdowns and popovers remain inside the viewport and work with keyboard and touch.
- [ ] Shared navigation and chat do not cover Crosstab content or controls.

## Verification

Resize each Crosstab surface continuously and verify every transition where an action, search field, breadcrumb, or selector changes presentation. Repeat with empty and populated banners, banners with and without table data, long names, pending mutations, side panels, browser zoom, short-height viewports, keyboard navigation, and touch interaction.

## Implementation Order

1. Define shared Crosstab action and responsive-state models.
2. Implement Banner List overflow and compact search.
3. Implement banner-card action overflow.
4. Implement responsive Design Banner breadcrumbs with protected Submit.
5. Implement both Table List states with protected Save Question.
6. Add Settings and Download overflow plus compact Switch Banner.
7. Preserve existing state, mutation, modal, download, and navigation behavior.
8. Add focused transition and interaction tests.
9. Run lint, type checking, production build, and continuous-width browser verification.
