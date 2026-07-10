# Comprehensive Project Audit, Refactoring & Bug Fix Mission

You are acting as a Senior Staff Software Engineer, Software Architect, Performance Engineer, and Code Reviewer.

Your objective is **not just to fix bugs**, but to transform this entire project into a production-quality codebase that is clean, maintainable, easy to understand, and highly performant.

## Primary Goal

Perform a complete audit of the entire project.

You must inspect **every single file** without skipping anything.

Do not assume something is correct simply because it compiles.

Think like someone preparing this codebase for a large engineering team.

---

# Phase 1 — Project Understanding

Before modifying anything:

* Read the complete project.
* Understand the architecture.
* Understand data flow.
* Understand folder structure.
* Understand business logic.
* Understand state management.
* Understand API flow.
* Understand component hierarchy.
* Understand custom hooks.
* Understand utility functions.
* Understand routing.
* Understand styling architecture.
* Understand build configuration.
* Understand TypeScript configuration.
* Understand testing setup.
* Understand deployment configuration if present.

Create a mental model of how everything works.

Do NOT start randomly editing files.

---

# Phase 2 — Full Audit Report

Generate a report before making changes.

Include every issue you discover.

## Architecture Problems

* Tight coupling
* Circular dependencies
* Bad abstractions
* Duplicate logic
* Poor folder organization
* Components with too many responsibilities
* Business logic inside UI
* Poor separation of concerns

---

## React Problems

Find every:

* unnecessary re-render
* unnecessary useEffect
* missing dependency
* stale closure
* memory leak
* infinite render possibility
* unnecessary state
* derived state
* prop drilling
* context misuse
* unstable callback
* unstable object creation
* incorrect key usage
* hydration issue
* StrictMode issue
* Suspense issue
* lazy loading opportunity

---

## Performance Problems

Check for:

* expensive renders
* missing memoization
* unnecessary memoization
* bad React Query usage
* Redux performance
* Zustand performance
* selector optimization
* large bundle size
* duplicate packages
* unnecessary imports
* code splitting opportunities
* lazy loading
* image optimization
* CSS optimization
* unnecessary API calls
* waterfall requests
* layout shift
* unnecessary DOM updates

---

## TypeScript Problems

Find:

* any usage
* unsafe casting
* incorrect generic usage
* duplicated interfaces
* poor naming
* weak typing
* nullable issues
* unreachable code
* dead code

---

## UI Problems

Find:

* inconsistent spacing
* accessibility issues
* keyboard navigation issues
* missing aria labels
* bad responsive layouts
* inconsistent colors
* inconsistent typography
* duplicated components

---

## Code Quality

Find:

* duplicated code
* long functions
* long components
* magic numbers
* magic strings
* nested conditions
* nested ternaries
* unnecessary comments
* poor naming
* inconsistent formatting
* poor file organization

---

## API Layer

Check:

* error handling
* retry logic
* loading states
* race conditions
* cancellation
* timeout handling
* caching
* optimistic updates
* request deduplication

---

## Security

Check for:

* XSS
* unsafe HTML rendering
* token handling
* secret exposure
* localStorage misuse
* cookie misuse
* authentication issues
* authorization issues

---

## Testing

Report:

* missing tests
* components difficult to test
* missing edge cases
* flaky logic

---

## Bundle Analysis

Identify:

* large dependencies
* duplicated libraries
* unnecessary packages
* tree shaking opportunities

---

# Phase 3 — Prioritize

Categorize every issue.

## Critical

Can crash the app or produce incorrect behavior.

## High

Performance or maintainability issue.

## Medium

Code quality issue.

## Low

Minor cleanup.

Estimate the impact of every issue.

---

# Phase 4 — Refactoring Rules

You must NOT refactor the entire project at once.

Instead, work component by component.

For every component:

1. Understand it.
2. Explain its purpose.
3. List all issues.
4. Fix all bugs.
5. Improve readability.
6. Improve performance.
7. Improve naming.
8. Improve typing.
9. Remove duplication.
10. Simplify logic.
11. Keep functionality identical unless a bug exists.
12. Follow React and TypeScript best practices.
13. Follow SOLID principles where appropriate.
14. Reduce complexity.
15. Make the component beginner-friendly.

The finished code should be understandable by a junior developer with only basic React knowledge.

---

# Coding Standards

The resulting code should:

* be simple
* be readable
* be modular
* be maintainable
* avoid clever tricks
* avoid unnecessary abstractions
* use descriptive names
* have small functions
* have small components
* follow single responsibility
* avoid deeply nested code
* avoid duplicate logic
* have predictable behavior

Prefer clarity over cleverness.

---

# Performance Standards

Every refactor should improve or preserve performance.

Look for:

* unnecessary renders
* unstable references
* object recreation
* callback recreation
* unnecessary effects
* unnecessary state
* expensive computations

Only use:

* useMemo
* useCallback
* React.memo

when there is a measurable benefit.

Do not over-optimize.

---

# Documentation

For every completed component provide:

## Summary

What the component does.

## Bugs Fixed

List everything fixed.

## Refactors

Explain every improvement.

## Performance Improvements

Explain why performance improved.

## Readability Improvements

Explain why the code is easier to understand.

## Risk Level

Low / Medium / High

---

# Workflow (Very Important)

You MUST work incrementally.

Never refactor multiple major components in one step.

Process:

1. Choose ONE component.
2. Analyze it.
3. Show your findings.
4. Show the proposed refactor.
5. Apply the refactor.
6. Verify behavior is unchanged (except intentional bug fixes).
7. Present a summary.
8. STOP.

Then ask:

> "Component complete. Would you like me to continue with the next component?"

Do not continue until I explicitly approve.

Repeat this process until the entire project has been completed.

---

# Bug Hunting

Assume bugs exist even if they are not immediately visible.

Look for:

* edge cases
* race conditions
* async issues
* stale data
* concurrency problems
* incorrect cleanup
* hidden performance bottlenecks
* inconsistent state
* unreachable code
* memory leaks
* event listener leaks
* improper error handling

Think like a QA engineer and a performance engineer.

---

# Constraints

* Do not introduce unnecessary dependencies.
* Do not rewrite working code without a clear benefit.
* Preserve existing functionality unless fixing a bug.
* Keep commits focused on one component or logical unit.
* Prefer composition over inheritance.
* Prefer explicit code over clever abstractions.
* Ensure every change is production-ready.

---

# Success Criteria

The project should end up being:

* Easier to understand.
* Easier to maintain.
* Easier for beginners to contribute to.
* Faster.
* More reliable.
* Better typed.
* More modular.
* Free of obvious bugs.
* Free of hidden performance issues.
* Consistent across the entire codebase.
* Ready for long-term development by a team.


<!-- claude --resume 7443e7a0-e486-4b9e-b4b1-2642cb9c71b1 -->