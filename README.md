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

## Limitations And Next Improvements

- The app currently ships one synthetic memo. A next slice could add selectable scenarios for investor, operating review, and customer-advisory-board contexts.
- The question logic is deterministic. A future server-side version could add GPT-assisted phrasing while keeping the current rule output as an auditable baseline.
- There is no persistence because the first portfolio signal is the review workflow, not account management.
