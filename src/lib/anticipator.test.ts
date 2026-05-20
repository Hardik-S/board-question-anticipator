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

  it('keeps open risks visible in the prep gap list', () => {
    const prep = buildBoardPrep(syntheticBoardUpdate)

    expect(prep.evidenceGaps).toContain(
      'Open risk: Two pipeline deals are still procurement-dependent.',
    )
  })

  it('escalates unsupported claims even when confidence is high', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      claims: [
        {
          text: 'The rollout motion is repeatable across mid-market accounts.',
          category: 'growth',
          confidence: 'high',
          supportingEvidence: [],
        },
      ],
    })

    expect(prep.questions).toEqual([
      expect.objectContaining({
        severity: 'High',
        whyItMatters:
          'A director can challenge this as an unsupported assertion unless the team brings a backup artifact.',
      }),
    ])
    expect(prep.weakClaims).toHaveLength(1)
  })

  it('uses a proof-first posture when any claim has no supporting artifact', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      claims: [
        {
          text: 'The rollout motion is repeatable across mid-market accounts.',
          category: 'growth',
          confidence: 'high',
          supportingEvidence: [],
        },
      ],
    })

    expect(prep.posture).toBe('Bring proof, not polish')
  })

  it('treats whitespace-only supporting evidence as missing proof', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      claims: [
        {
          text: 'The rollout motion is repeatable across mid-market accounts.',
          category: 'growth',
          confidence: 'high',
          supportingEvidence: ['   ', '\n\t'],
        },
      ],
    })

    expect(prep.questions[0]).toEqual(
      expect.objectContaining({
        severity: 'High',
        whyItMatters:
          'A director can challenge this as an unsupported assertion unless the team brings a backup artifact.',
      }),
    )
    expect(prep.weakClaims).toHaveLength(1)
    expect(prep.posture).toBe('Bring proof, not polish')
  })
})
