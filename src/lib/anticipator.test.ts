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

  it('ignores blank open risks from imported memo fixtures', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      metrics: [],
      claims: [],
      openRisks: ['  ', '\n\t', '  Services effort is unallocated.  '],
    })

    expect(prep.evidenceGaps).toEqual([
      'Open risk: Services effort is unallocated.',
    ])
    expect(prep.artifactChecklist).toEqual([
      'one-page risk register with owner and mitigation date',
    ])
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

  it('trims metric gap context and names missing rationale explicitly', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      metrics: [
        {
          label: 'Pipeline coverage',
          value: '3.1x',
          context: '  Includes verbal commitments.  ',
          evidenceStatus: 'thin',
        },
        {
          label: 'Implementation margin',
          value: 'Unknown',
          context: '   ',
          evidenceStatus: 'missing',
        },
      ],
      claims: [],
      openRisks: [],
    })

    expect(prep.evidenceGaps).toEqual([
      'Pipeline coverage: Includes verbal commitments.',
      'Implementation margin: No metric rationale supplied.',
    ])
  })

  it('ignores blank imported metric labels when building gap and artifact lists', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      metrics: [
        {
          label: '  ',
          value: 'Unknown',
          context: '  Spreadsheet row left blank during import.  ',
          evidenceStatus: 'missing',
        },
        {
          label: '  Renewal drag  ',
          value: '-4%',
          context: '  Needs logo-level bridge.  ',
          evidenceStatus: 'thin',
        },
      ],
      claims: [],
      openRisks: [],
    })

    expect(prep.evidenceGaps).toEqual([
      'Renewal drag: Needs logo-level bridge.',
    ])
    expect(prep.artifactChecklist).toEqual([
      'metric definition appendix showing inclusions and exclusions',
    ])
  })

  it('does not request a metric appendix for blank-only imported metric rows', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      metrics: [
        {
          label: '  ',
          value: 'Unknown',
          context: '  Spreadsheet row left blank during import.  ',
          evidenceStatus: 'missing',
        },
      ],
      claims: [],
      openRisks: [],
    })

    expect(prep.evidenceGaps).toEqual([])
    expect(prep.artifactChecklist).toEqual([])
  })

  it('only includes baseline artifacts when the fixture has matching content', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      metrics: [],
      claims: [],
      openRisks: [],
    })

    expect(prep.artifactChecklist).toEqual([])
  })

  it('keeps metric appendix without a risk register when only metrics exist', () => {
    const prep = buildBoardPrep({
      ...syntheticBoardUpdate,
      claims: [],
      openRisks: [],
    })

    expect(prep.artifactChecklist).toEqual([
      'metric definition appendix showing inclusions and exclusions',
    ])
  })
})
