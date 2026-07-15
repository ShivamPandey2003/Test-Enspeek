# Prompt: Restyle ChatTextArea UI (No Logic Changes)

I have an existing component `ChatTextArea.tsx` that contains working logic
(Redux state, focus handling, keyboard shortcuts, auto-resizing textarea,
suggestion dispatching, send/open chat handlers, disabled states, etc.). I
want you to **restyle it only** — do not change any functionality, hooks,
state management, event handlers, refs, or business logic.

Apply the following visual/UI design to the existing component, matching
this reference styling as closely as possible:

## Outer container

- `rounded-3xl`, `border border-slate-100`, white background
- Soft indigo-tinted shadow: `shadow-[0_4px_24px_rgba(79,70,229,0.08)]`
- Padding `p-4`

## Quick actions row (when suggestions exist)

- `flex items-center gap-3`, horizontally scrollable with scrollbar hidden
  (`overflow-x-auto` + `[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`)
- Label "Quick actions" styled as `text-sm font-semibold text-indigo-600`,
  `shrink-0`
- Suggestion chips restyled as pill buttons: `rounded-full border
  border-indigo-100 bg-white px-4 py-2 text-sm font-medium text-slate-700
  shadow-sm`, with hover state `hover:border-indigo-300 hover:bg-indigo-50
  hover:text-indigo-700` and `active:scale-[0.97]` press feedback,
  `whitespace-nowrap shrink-0`

## Input row

- Wrap in `flex items-end gap-2 rounded-2xl border border-slate-100
  bg-slate-50/60 px-3 py-2`
- Left icon button (keep existing `NewDropdown`/quick-commands trigger
  functionality, but restyle to): `h-8 w-8 rounded-full bg-indigo-50
  text-indigo-400 hover:bg-indigo-100`, using the `ListChecks` icon from
  `lucide-react` in place of `CiCircleList` if you want icon parity —
  otherwise keep existing icon but apply this coloring
- Textarea: transparent background, `text-sm text-slate-800`,
  `placeholder:text-slate-400`, `focus:outline-none`, no border, keep
  existing auto-resize behavior but constrain to `max-h-40`
- Send button: circular, `h-9 w-9 rounded-full bg-indigo-500 text-white
  shadow-md hover:bg-indigo-600`, disabled state `disabled:bg-indigo-200
  disabled:shadow-none disabled:cursor-not-allowed`, using `Send` icon from
  `lucide-react`

## Important constraints

- Preserve all existing props, refs, Redux selectors/dispatch,
  `useEffect`s, keyboard handling, placement variants (`floating`, `panel`,
  `mobileSheet`), and the `isChatInputDisabled` logic exactly as-is
- Only modify `className` strings and JSX structure needed for visual
  styling — do not remove any functional wrapper elements (floating
  launcher button, chat open/close animation classes, etc.) unless purely
  cosmetic
- Keep `TruncatedSuggestionButton` if it has its own logic (truncation,
  tooltips) — just update its internal className/styling to match the chip
  design above, don't replace it with a plain button unless it has no extra
  behavior
- Test that disabled states, loading spinner on send, and mobile sheet
  placement still render correctly after restyling