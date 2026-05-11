import { describe, expect, it } from 'vitest'
import { syntheticBoardUpdate } from '../data/boardUpdate'
import { buildBoardPrep } from './anticipator'

describe('buildBoardPrep', () => {
  it('generates a skeptical question for each synthetic claim', () => {
    const prep = buildBoardPrep(syntheticBoardUpdate)

    expect(prep.questions).toHaveLength(syntheticBoardUpdate.claims.length)
    expect(prep.questions.map((question) => question.theme)).toContain('finance')
  })

  it('flags low-confidence or unsupported claims as weak claims', () => {
    const prep = buildBoardPrep(syntheticBoardUpdate)

    expect(prep.weakClaims.map((claim) => claim.claim)).toContain(
      'Gross margin will recover as implementations standardize.',
    )
    expect(prep.weakClaims).not.toContain(
      expect.objectContaining({
        claim: 'Enterprise expansion is becoming the main growth engine.',
      }),
    )
  })

  it('turns missing metric evidence into board prep gaps and backup artifacts', () => {
    const prep = buildBoardPrep(syntheticBoardUpdate)

    expect(prep.evidenceGaps.join(' ')).toContain('Implementation margin')
    expect(prep.artifactChecklist).toContain(
      'implementation-hours margin bridge reviewed by finance',
    )
    expect(prep.posture).toBe('Bring proof, not polish')
  })
})
