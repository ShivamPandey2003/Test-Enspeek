# ENSPK-106 Publish Survey Responsiveness

## Goal

Keep the Publish Survey subheader responsive at every available content width without overlapping, wrapping, clipping, or hiding activated-study actions.

## Confirmed Layout

- Always show `Publish Research` as the page title.
- Show available actions inline while they fit.
- Base action placement on actual subheader space, not viewport or device breakpoints.
- Keep Next outside the dropdown whenever Next is available.
- Show the green three-dot button only when at least one action is inside its dropdown.

## Activated Study

- Keep actions inline while enough space is available.
- When the row no longer fits, move actions into the green dropdown one by one.
- Move the lowest-priority action first.
- Continue until the title, remaining inline actions, optional three dots, and Next fit on one row.
- When space returns, restore actions inline in reverse order.
- Never show the same action inline and in the dropdown simultaneously.
- Never move Next into the dropdown.

## Action Priority

Move actions into the dropdown in this order:

1. Download
2. WhatsApp
3. Facebook
4. Initiate Sample Collection

Restore them inline in reverse order when space becomes available.

## Inactive Study

An inactive study has only the disabled Initiate Sample Collection action.

- Show the disabled action inline while it fits safely.
- Hide the disabled action when there is not enough space.
- Do not place the disabled action inside the green dropdown.
- Do not show an empty green three-dot button.
- Preserve the existing inactive-state Next visibility rule.

## Dropdown Behavior

- Use the same green three-dot visual treatment as the Report page.
- Place the three-dot button immediately to the left of Next.
- Show an icon on the left and text on the right for each overflowed action.
- Preserve each action's current label, permission, disabled, and loading state.
- Keep the dropdown within the visible viewport.
- Reposition above or below the trigger based on available space.
- Allow internal scrolling when the dropdown is taller than the available space.
- Close after an action, outside click, or Escape.
- Return focus to the trigger when appropriate.

## Layout Safety

- Measure the actual subheader container and rendered action widths.
- Reserve space for the title, Next, gaps, padding, and the three-dot trigger when required.
- Recalculate when actions, labels, side panels, zoom, or container size change.
- Let the title truncate before protected controls overlap it.
- Do not create a second subheader row.
- Avoid action flicker while recalculating.
- Do not use hard-coded widths to control action placement.

## Behavior To Preserve

- Study activation rules
- Initiate Sample Collection behavior
- Facebook sharing
- WhatsApp sharing
- Download behavior
- Existing loading and disabled states
- Next navigation and study context
- Shared navigation and floating chat behavior

## Accessibility

- Give the three-dot trigger an accessible name and tooltip.
- Use semantic buttons and disabled states.
- Keep all actions keyboard and touch accessible.
- Maintain visible focus indicators.
- Support Escape and outside-click dismissal.
- Prevent duplicate focus targets when actions move.

## Acceptance Criteria

- [ ] Action placement responds to available subheader space without a viewport breakpoint.
- [ ] Activated-study actions move into the dropdown one by one in the confirmed order.
- [ ] Actions restore inline in reverse order when space returns.
- [ ] The green three-dot button appears only when it contains an action.
- [ ] Next remains outside the dropdown and does not overlap the title.
- [ ] The title and actions remain on one row without horizontal overflow.
- [ ] No action exists inline and in the dropdown at the same time.
- [ ] The inactive disabled action hides when it cannot fit.
- [ ] The inactive disabled action never appears in the dropdown.
- [ ] An empty green dropdown trigger is never shown.
- [ ] Existing action behavior and state remain unchanged.
- [ ] The dropdown remains inside the viewport and scrolls internally when required.
- [ ] Keyboard, focus, outside-click, Escape, and touch behavior work correctly.
- [ ] Shared navigation and chat do not cover the subheader or page content.

## Verification

Resize the available Publish Survey content area continuously and verify every point where an action enters or leaves the dropdown. Repeat for inactive and activated studies, side panels open and closed, browser zoom, loading states, keyboard navigation, touch interaction, and short-height viewports.

## Implementation Order

1. Audit the current Publish Survey actions and state rules.
2. Define one shared action model for inline and dropdown rendering.
3. Add measured, one-by-one overflow using the confirmed priority.
4. Implement the inactive disabled-action hide rule.
5. Add the viewport-aware green dropdown only when overflow exists.
6. Reserve title and Next space to prevent overlap.
7. Preserve existing action, loading, disabled, and navigation behavior.
8. Add focused overflow and interaction tests.
9. Run lint, type checking, production build, and responsive browser verification.
