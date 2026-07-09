You are a senior React + TypeScript architect.

I have a large `ChatWindow` component that has become difficult to maintain. Your task is to **refactor it without changing any existing functionality or UI**.

## Primary Goal

Make this component:

* Easier to read
* Easier to maintain
* Easier to test
* Easier to extend
* More performant by preventing unnecessary re-renders

The final application **must behave exactly the same** as before.

## Important Rules

* **Do NOT change any business logic.**
* **Do NOT change any UI or styling.**
* **Do NOT change API calls.**
* **Do NOT change Redux logic.**
* **Do NOT change user experience.**
* **Do NOT introduce bugs.**
* Every existing feature must continue working exactly as it does now.

---

# Refactoring Objectives

## 1. Break the component into smaller components

Move large UI blocks into dedicated components.

For example:

* ChatMessage
* UserMessage
* AIMessage
* SurveyMessage
* SurveyChart
* SurveyTable
* MessageActions
* ChatHeader
* ChatBody
* EmptyConversation
* LoadingConversation
* ChatModals
* MessageBubble
* MessageAvatar

Choose a clean folder structure.

---

## 2. Extract reusable hooks

Move complex logic into custom hooks.

Examples:

* useChatScrolling()
* useChatModals()
* useSurveyData()
* useMessageFormatting()
* useClipboard()
* useSuggestionHandling()

The main component should become mostly JSX composition.

---

## 3. Extract utilities

Move repeated logic into utility files.

Examples:

* surveyDataParser.ts
* chartBuilder.ts
* tableBuilder.ts
* messageHelpers.ts
* scrollHelpers.ts
* typeGuards.ts

Avoid large inline helper functions.

---

## 4. Prevent unnecessary re-renders

Optimize rendering wherever possible.

Examples:

* React.memo
* useMemo
* useCallback
* stable props
* avoid recreating arrays/objects
* avoid unnecessary state updates

Only memoize where it provides actual benefit.

---

## 5. Reduce component size

The main ChatWindow component should mainly orchestrate the application.

Ideally it should read like:

* get state
* call hooks
* render components

Large rendering logic should live elsewhere.

---

## 6. Separate survey rendering

The survey rendering section is very large.

Move all survey-related parsing and rendering into dedicated modules.

Example:

SurveyRenderer

internally decides whether to render:

* Chart
* Table
* Crosstab
* External Image

The ChatWindow should not know those implementation details.

---

## 7. Improve readability

Replace deeply nested JSX with small components.

Avoid:

* nested ternaries
* giant anonymous functions
* inline calculations
* long JSX conditions

Prefer early returns and descriptive variables.

---

## 8. Organize files

Create a maintainable folder structure.

Example:

chat/

* ChatWindow.tsx
* ChatMessage.tsx
* ChatAvatar.tsx
* ChatSuggestion.tsx
* SurveyRenderer.tsx
* MessageBubble.tsx
* MessageActions.tsx
* EmptyState.tsx
* LoadingState.tsx
* hooks/
* utils/
* types/

You may improve this structure if you find a better one.

---

## 9. Preserve scrolling behavior

The scrolling system is critical.

Do not change its behavior.

You may move it into a custom hook but it must continue working exactly as before.

---

## 10. Preserve modal behavior

Chart modal

Table modal

Crosstab modal

must continue working exactly the same.

---

## 11. Preserve Redux behavior

Do not change:

* selectors
* dispatch flow
* store structure
* actions

Only reorganize where the code lives.

---

## 12. Improve TypeScript

Reduce usage of:

* any
* unknown where avoidable
* repeated type assertions

Create reusable interfaces where appropriate.

---

## 13. Remove duplicate logic

Find repeated code and extract reusable helpers/components.

---

## 14. Performance

Avoid rendering expensive components unless necessary.

Memoize expensive survey parsing and chart/table data generation.

---

## 15. Keep commits incremental

Refactor in small safe steps.

Suggested order:

1. Extract utility functions.
2. Extract custom hooks.
3. Extract presentational components.
4. Extract survey renderer.
5. Optimize rendering with React.memo/useMemo/useCallback.
6. Clean imports.
7. Remove dead code.
8. Verify behavior after each step.

Never perform a massive rewrite in one step.

---

# Deliverables

* Smaller, modular components
* Cleaner folder structure
* Better separation of concerns
* Reduced unnecessary re-renders
* Easier future maintenance
* Zero functional regressions
* No UI changes
* No API changes
* No behavior changes

Treat this as a production-grade refactor focused on maintainability, readability, and performance—not a feature rewrite.
