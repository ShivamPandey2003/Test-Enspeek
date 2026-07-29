# Task: Fix and Polish the "Quick actions" Suggestion Bar in `ChatTextArea.tsx`

## Context
The suggestion bar (rendered when `hasSuggestions` is true) should look like the reference screenshot — a separate pill-shaped card floating directly above the chat input, with a "Quick actions" label followed by rounded outline buttons (e.g. "Show archived studies", "Open a study", "View study statistics"), and the input bar below it with a rounded icon button on the left and a circular indigo send button on the right.

## Bugs to Fix

1. **Broken positioning value**
   The suggestions container uses `absolute -top-18`, but `18` is not in Tailwind's default spacing scale (it jumps from 16 to 20), so this class silently does nothing. Replace it with a working value (e.g. `-top-16` or an arbitrary value like `-top-[72px]`) and verify the bar actually sits above the input with a visible gap, not overlapping it.

2. **Duplicate styling causing visual clutter**
   The suggestions div currently repeats the exact same `rounded-3xl border border-slate-100 bg-white p-4 shadow-[0_4px_24px_rgba(79,70,229,0.08)]` classes as the parent chat container. Instead, give it its own distinct card treatment — e.g. a lighter shadow, slightly smaller padding — and make sure its width tracks the parent container's width rather than being an independent absolutely-positioned block that can mismatch/overflow.

3. **Alignment inside the pill bar**
   Ensure the "Quick actions" label and pill buttons are vertically centered on the same baseline (use `items-center` consistently), have consistent horizontal gaps (`gap-2`/`gap-3`), and that the row scrolls horizontally without clipping the last pill or the drop shadow (`overflow-x-auto` currently can clip `shadow`/focus rings — add horizontal padding or allow `overflow-visible` on the y-axis).

4. **Input row alignment**
   Double check vertical alignment between the left dropdown-trigger icon button, the textarea, and the right send button — they should all align on the same center line even as the textarea grows in height (the `items-end` on the flex row may look wrong once the "Quick actions" bar is also present; test with 1-line and multi-line input).

## UI Polish Requests
(Make it better than the current version, matching the screenshot's style)

- Style the pill buttons (`TruncatedSuggestionButton`) as clean white/rounded-full outline buttons with a subtle border (`border-slate-200`), dark slate text, and a soft hover state (e.g. `hover:bg-slate-50` or `hover:border-indigo-200`) rather than whatever default styling exists now.
- Make the "Quick actions" label visually distinct (indigo, semibold, smaller size) with a bit of right margin before the first pill, matching the screenshot spacing.
- Give the whole floating widget (suggestions bar + input bar) consistent corner radius and shadow depth so they read as one connected component, with a small visible gap between the two rather than being flush/overlapping.
- Smooth the transition when suggestions appear/disappear (fade + slight slide, not an abrupt pop-in) — reuse the existing `transition-all duration-300 ease-in-out` pattern already applied to the parent container.
- Verify this all works across the three `placement` variants (`floating`, `panel`, `mobileSheet`), since the absolute positioning trick for suggestions likely breaks under `panel`/`mobileSheet` where the parent isn't `absolute`-positioned at the bottom.

## Deliverable
Updated `ChatTextArea.tsx` (and `TruncatedSuggestionButton` if needed) with the above fixes, plus a one-line summary of what was changed and why.