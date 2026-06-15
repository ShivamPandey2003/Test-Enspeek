# Enspeek UI Change Requirements

## Scope

This document captures requested UI updates for the Enspeek chat experience and OTP authentication pages.

Relevant areas:

- Chat window: `src/components/common/chat-window/chat.tsx`
- Chat agent config: `src/config/chatAgent.ts`
- Auth card: `src/components/common/Auth/Form/AuthCard.tsx`
- OTP login/sign-up page: `src/components/common/Auth/otp-login/OtpLoginPage.tsx`

## Implementation Guardrails

- These changes are UI-only.
- Do not change backend/API behavior, request payloads, response handling, authentication logic, or chat business logic.
- The AI name must be controlled from one place only, preferably `src/config/chatAgent.ts`.
- Do not hardcode the AI name directly inside chat components or auth UI files.

## Chat Avatar And Labels

### Current Behavior

- AI chat avatar shows the initials `PK`.
- User chat avatar shows initials based on the user's name.
- Chat bubbles do not show small labels under each avatar.

### Required Change

- Replace the AI `PK` initials avatar with the Enspeek logo.
- Replace the user's initials avatar with a Lucide user icon.
- Use `src/assets/icons/icon` for the AI-side icon if possible.
- Under the AI avatar circle, show `AI` in small text.
- Under the user avatar circle, show the user's first name in small text.

### Acceptance Criteria

- [ ] AI messages and AI suggestion blocks use `src/assets/icons/icon` instead of `PK`, if the asset works cleanly in the chat avatar.
- [ ] User messages use a Lucide user icon instead of initials.
- [ ] The `AI` label appears directly below the AI avatar.
- [ ] The user's first name appears directly below the user avatar.
- [ ] Labels are small, readable, and aligned with their avatar without disturbing chat bubble alignment.
- [ ] If the user's first name is unavailable, use a sensible fallback such as `User`.
- [ ] The AI name can be updated from one central config file only.
- [ ] No AI name text is hardcoded in individual UI components.

## Chat Message Actions

### Current Behavior

- Chat messages show copy and edit action icons.
- AI/user text messages can show a copy icon.
- User messages can also show an edit icon.

### Required Change

- Remove copy and edit icons from the chat message UI.

### Acceptance Criteria

- [ ] The copy icon is no longer visible below chat messages.
- [ ] The edit icon is no longer visible below user messages.
- [ ] Existing message rendering, chart/table actions, and research/live-link copy actions should stay unchanged.

## Chat Suggestion Button Overflow

### Current Behavior

- Suggestion button text can overflow outside the side chat area when the suggestion text is too long.

### Required Change

- Long suggestion button text should stay within the chat area.
- If text is too long, truncate it with `...` at the end.
- On hover, show the full suggestion text only when truncation is actually needed.
- Do not show hover text/tooltips for suggestions that are already fully visible.

### Acceptance Criteria

- [ ] Suggestion buttons never overflow outside the chat panel.
- [ ] Long text is displayed on one line or within the intended chip layout with an ellipsis.
- [ ] The full text is available on hover only for truncated suggestions.
- [ ] No tooltip/title appears for non-truncated suggestion text.

## Login Page UI

### Current Behavior

- Login page uses a themed blue background.
- The auth card currently includes the logo and `Enspeek`.
- The UI currently shows a sign-in/sign-up toggle at the top.
- Sign-in mode shows:
  - `OTP Login`
  - `Use email to receive a one-time password`

### Required Change

- Use a plain white page background instead of the themed blue background.
- Add a visible shadow to the main auth box.
- Show the logo first.
- Below the logo, show `Enspeek` in the same bold style.
- Below that, show `Sign in to Enspeek` in bold.
- In `Sign in to Enspeek`, the word `Enspeek` should use the themed blue color.
- Remove the following UI text/controls from the sign-in screen:
  - `Sign in`
  - `Sign up`
  - `OTP Login`
  - `Use email to receive a one-time password`

### Acceptance Criteria

- [ ] The login page background is white.
- [ ] The auth box has a shadow and remains centered/responsive.
- [ ] The logo and `Enspeek` brand text are stacked vertically.
- [ ] The sign-in heading reads `Sign in to Enspeek`.
- [ ] Only the `Enspeek` word in the heading uses the themed blue color.
- [ ] The old sign-in/sign-up toggle is not visible on the sign-in page.
- [ ] The old `OTP Login` title and subtitle are not visible.
- [ ] A footer link can still let users reach sign-up, for example `Need an account? Sign up`.

## Sign-Up Page UI

### Current Behavior

- Sign-up mode uses the same auth card and sign-in/sign-up toggle.
- Sign-up mode shows:
  - `Create your account`
  - `Register first, then sign in with OTP`

### Required Change

- Apply the same white-background and shadowed-card treatment as the login page.
- Keep the logo and bold `Enspeek` brand text.
- Use `Sign up to Enspeek` as the sign-up page heading.
- In `Sign up to Enspeek`, the word `Enspeek` should use the themed blue color.
- Remove the following UI text/controls from the sign-up screen:
  - Duplicate/old `Enspeek` headings if present
  - `Create your account`
  - `Register first, then sign in with OTP`

### Acceptance Criteria

- [ ] The sign-up page follows the same visual treatment as the login page.
- [ ] The sign-in/sign-up toggle is not visible on the sign-up page.
- [ ] The old `Create your account` title and helper subtitle are not visible.
- [ ] The sign-up heading reads `Sign up to Enspeek`.
- [ ] Only the `Enspeek` word in the sign-up heading uses the themed blue color.
- [ ] The page still clearly supports account creation through the form and its submit button.
- [ ] A footer link can still let users return to sign-in, for example `Already registered? Sign in`.

## Confirmed Decisions

1. Sign-up should still be reachable from the login page through a footer link.
2. Sign-in should still be reachable from the sign-up page through a footer link.
3. The sign-up page heading should be `Sign up to Enspeek`.
4. The user chat avatar should use a Lucide user icon.
5. The AI chat avatar should use `src/assets/icons/icon` if possible.
6. Only message-level chat copy/edit icons should be removed.
7. The copy icon beside research/live links should stay.
