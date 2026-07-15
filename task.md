Build the UI for a chat input component matching this design:

- Rounded white container (rounded-3xl, subtle shadow, thin border)
- Top row: "Quick actions" label in indigo, followed by a horizontal
  row of pill-shaped suggestion chips (rounded-full, white background,
  thin border, hover state turns border/bg light indigo). Row scrolls
  horizontally instead of wrapping or truncating text.
- Bottom row: rounded input area containing a small icon button on the
  left, a textarea/input in the middle with placeholder "Ask me
  anything...", and a circular indigo send button on the right
  (greyed out look when disabled).

Style: light theme, indigo/purple accents, soft shadows, generous
rounded corners throughout.

Stack: React + TypeScript + Tailwind CSS + lucide-react icons.

Just the UI/markup and styling — no need to wire up click handlers,
state management, or send logic.