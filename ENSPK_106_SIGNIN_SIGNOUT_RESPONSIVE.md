# ENSPK-106 Signin/Signout Responsive Plan

## Aim

Make the signin/signout authentication screens fully responsive across small mobile, large mobile, tablet, laptop, and desktop screen sizes.

## Current Problem

On low screen widths, the Google reCAPTCHA UI can go outside the visible screen area. The checkbox reCAPTCHA has a fixed natural width, so when the auth card or viewport becomes narrow, it can create horizontal overflow.

## Pages/Areas In Scope

- `/login` OTP signin flow
- Signup form shown from `/login`
- OTP verification screen
- Account approval pending state
- Shared auth card/layout used by auth screens
- Captcha UI container

## Planned Fixes

- Keep the auth page/card width fluid so it fits small screens.
- Reduce auth card padding on narrow mobile screens.
- Wrap the captcha in a responsive container with `max-width: 100%`.
- Prevent captcha from creating horizontal page overflow.
- Use compact captcha mode or scale the captcha on very small screens if needed.
- Make OTP input boxes responsive so six boxes fit on narrow screens.
- Ensure long email addresses wrap or truncate safely.
- Keep desktop layout visually unchanged as much as possible.

## Recommended Captcha Approach

Preferred approach:

- Detect narrow screen width.
- Render Google reCAPTCHA with `size: "compact"` on small screens.
- Use normal captcha size on tablet/desktop screens.
- Add a wrapper around the captcha to contain overflow.

Fallback approach:

- If compact mode is not acceptable visually, scale the captcha down only on very narrow screens.
- Adjust wrapper height so the scaled captcha does not leave awkward spacing.

## Verification Plan

Check the auth flow at these widths:

- `320px`
- `360px`
- `390px`
- `430px`
- `768px`
- `1024px`
- Desktop width

Verify:

- No horizontal scroll.
- Captcha stays inside the screen.
- Auth card spacing looks balanced.
- Inputs and buttons fit properly.
- OTP boxes fit without overlap.
- Error messages do not break the layout.
- Long email text does not overflow.

## Acceptance Criteria

- [x] No horizontal scrollbar appears on `/login` at any tested viewport width.
- [x] Captcha stays fully visible inside the auth card on small mobile screens.
- [x] Signin form, signup form, OTP form, and approval pending state fit within the viewport.
- [x] OTP input boxes remain aligned and usable on narrow screens.
- [x] Buttons, inputs, labels, and error messages do not overlap.
- [x] Long email addresses do not push content outside the card.
- [x] Page remains vertically scrollable when screen height is limited.
- [x] Desktop/tablet layout remains visually consistent with the current design.
- [x] Responsive behavior is verified at `320px`, `360px`, `390px`, `430px`, `768px`, `1024px`, and desktop width.

## Implementation Order

1. Fix captcha responsiveness.
2. Adjust shared auth card spacing for mobile.
3. Adjust OTP input layout for narrow screens.
4. Review approval/message states.
5. Run responsive verification.
