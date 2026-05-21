# Board Question Anticipator

Board Question Anticipator is a fixture-first React/Vite portfolio product that pressure-tests a synthetic executive update before a board or investor meeting. It produces skeptical questions, weak-claim flags, evidence gaps, and a backup artifact checklist.

## Portfolio Signal

This project demonstrates strategic communication judgment rather than slide styling. The product shows how an operator can review a leadership narrative for claims that will get challenged, surface missing proof, and assemble a stronger meeting packet before the room asks for it.

## Synthetic Data Boundary

All data is synthetic and lives in `src/data/boardUpdate.ts`. The update memo, company name, metrics, risks, and claims are invented for demonstration. No real company metrics, investor notes, customer names, or board materials are included.

## Stack Rationale

- Vite + React + TypeScript keeps the first slice fast, inspectable, and static-deployable.
- Local typed fixtures make the data boundary obvious and keep secrets out of the client bundle.
- Vitest covers deterministic narrative-risk classification without pretending to use live AI.
- Plain CSS keeps the workbench portable for future workers and fixers.

## File Map

- `src/data/boardUpdate.ts`: synthetic update memo, metrics, claims, and open risks.
- `src/lib/anticipator.ts`: deterministic question, weak-claim, evidence-gap, and artifact-checklist logic.
- `src/lib/anticipator.test.ts`: Vitest coverage for the core narrative-risk rules.
- `src/App.tsx`: reviewer-facing product surface.
- `src/App.css` and `src/index.css`: responsive UI styling.

## Local Setup

```bash
npm ci
npm run test -- --run
npm run build
npm run preview
```

## Verification

Required verification for this first slice:

- `npm ci`
- `npm run test -- --run`
- `npm run build`
- Local or built-output smoke for `Board Question Anticipator`, `Skeptical questions`, and `Evidence gaps`

## Decision Log

- Built this as a narrative-risk review tool, not a deck generator, because the portfolio value is judgment under scrutiny.
- Kept the first slice deterministic and fixture-first so reviewers can audit the assumptions without API keys or hidden model behavior.
- Used backup artifacts as the output unit because board prep becomes useful when it tells the presenter what proof to bring.
- Treated low-confidence and unsupported claims as weak claims; high-confidence claims still receive questions but do not automatically become repair items.
- Escalated unsupported claims to high-severity questions even when their confidence label is high, because board risk depends on whether a director can see proof, not only on the author's confidence.
- Kept the overall prep posture proof-first when any claim lacks a supporting artifact, because one unsupported assertion is enough to change how an operator should enter a board discussion.
- Added a stylesheet contract test that compares static React class names to `App.css`, because this compact portfolio app relies on plain CSS and stale selector names can silently degrade the whole reviewer surface while tests and builds still pass.
- Surfaced fixture open risks in the evidence-gap list so unresolved risks do not disappear behind otherwise valid metric and claim checks.
- Treat whitespace-only supporting evidence as missing proof so pasted or imported memo fixtures cannot accidentally make an unsupported claim look defensible.
- Trim metric-gap rationale text and name missing rationale explicitly so imported or pasted memo fixtures do not render blank evidence-gap explanations.
- Scope baseline backup artifacts to fixture content so empty or narrow scenarios do not ask reviewers to prepare irrelevant risk or metric appendices.
- Trim open-risk text and ignore blank imported risks so placeholder rows do not create empty evidence gaps or unnecessary risk-register requests.
- Trim metric labels and ignore blank imported metric rows so spreadsheet placeholders do not create unnamed evidence gaps or unnecessary metric appendices.

## Limitations And Next Improvements

- The app currently ships one synthetic memo. A next slice could add selectable scenarios for investor, operating review, and customer-advisory-board contexts.
- The question logic is deterministic. A future server-side version could add GPT-assisted phrasing while keeping the current rule output as an auditable baseline.
- There is no persistence because the first portfolio signal is the review workflow, not account management.
