import type { BoardClaim, BoardMetric, BoardUpdate } from '../data/boardUpdate'

export type AnticipatedQuestion = {
  theme: string
  severity: 'High' | 'Medium'
  question: string
  whyItMatters: string
  backupArtifact: string
}

export type WeakClaim = {
  claim: string
  reason: string
  repairAction: string
}

export type BoardPrep = {
  posture: string
  executiveBrief: string
  questions: AnticipatedQuestion[]
  weakClaims: WeakClaim[]
  evidenceGaps: string[]
  artifactChecklist: string[]
}

const artifactByCategory: Record<BoardClaim['category'], string> = {
  growth: 'signed pipeline-by-stage export with procurement status',
  retention: 'cohort expansion bridge with logo-level notes',
  execution: 'aged escalation report split by severity and owner',
  finance: 'implementation-hours margin bridge reviewed by finance',
}

const questionByCategory: Record<BoardClaim['category'], string> = {
  growth:
    'Which part of the rollout motion is proven by signed behavior rather than pipeline optimism?',
  retention:
    'How much of expansion comes from durable product pull versus one-time commercial pressure?',
  execution:
    'Are we measuring a real support-load reduction or a temporary ticket-closing push?',
  finance:
    'What proof shows standardization improves margin instead of hiding services cost?',
}

export function buildBoardPrep(update: BoardUpdate): BoardPrep {
  const openRisks = getUsableOpenRisks(update)
  const metrics = getUsableMetrics(update)
  const claims = getUsableClaims(update)
  const hasUnsupportedClaim = claims.some((claim) => !hasUsableEvidence(claim))
  const hasMetricEvidenceGap = metrics.some(
    (metric) => metric.evidenceStatus !== 'ready',
  )
  const weakClaims = claims
    .filter((claim) => claim.confidence !== 'high' || !hasUsableEvidence(claim))
    .map(toWeakClaim)

  const questions = claims.map((claim) => ({
    theme: claim.category,
    severity: getQuestionSeverity(claim),
    question: questionByCategory[claim.category],
    whyItMatters: explainRisk(claim),
    backupArtifact: artifactByCategory[claim.category],
  })) satisfies AnticipatedQuestion[]

  const evidenceGaps = [
    ...metrics
      .filter((metric) => metric.evidenceStatus !== 'ready')
      .map(
        (metric) =>
          `${metric.label}: ${formatMetricGapContext(metric.context)}`,
      ),
    ...weakClaims.map((claim) => `Claim repair needed: ${claim.claim}`),
    ...openRisks.map((risk) => `Open risk: ${risk}`),
  ]

  const artifactChecklist = Array.from(
    new Set([
      ...questions.map((question) => question.backupArtifact),
      ...getBaselineArtifacts(metrics, openRisks),
    ]),
  )

  return {
    posture:
      hasUnsupportedClaim || hasMetricEvidenceGap || weakClaims.length >= 2
        ? 'Bring proof, not polish'
        : 'Narrative is mostly defensible',
    executiveBrief:
      'The memo has a clear growth story, but the board will likely challenge repeatability, support-quality measurement, and margin recovery until backup artifacts are ready.',
    questions,
    weakClaims,
    evidenceGaps,
    artifactChecklist,
  }
}

function getQuestionSeverity(claim: BoardClaim): AnticipatedQuestion['severity'] {
  return claim.confidence === 'low' || !hasUsableEvidence(claim)
    ? 'High'
    : 'Medium'
}

function toWeakClaim(claim: BoardClaim): WeakClaim {
  const noEvidence = !hasUsableEvidence(claim)
  return {
    claim: claim.text,
    reason: noEvidence
      ? 'The memo asserts this without a cited artifact.'
      : `The cited proof is directional but still ${claim.confidence}-confidence.`,
    repairAction: `Attach ${artifactByCategory[claim.category]} before sharing the board packet.`,
  }
}

function explainRisk(claim: BoardClaim): string {
  if (!hasUsableEvidence(claim)) {
    return 'A director can challenge this as an unsupported assertion unless the team brings a backup artifact.'
  }

  if (claim.confidence === 'low') {
    return 'The supporting evidence may reflect a short-term operating push rather than a durable trend.'
  }

  return 'This is directionally credible, but the room will still ask what could falsify the claim.'
}

function hasUsableEvidence(claim: BoardClaim): boolean {
  return claim.supportingEvidence.some((evidence) => evidence.trim().length > 0)
}

function getBaselineArtifacts(
  metrics: BoardMetric[],
  openRisks: string[],
): string[] {
  return [
    ...(openRisks.length > 0
      ? ['one-page risk register with owner and mitigation date']
      : []),
    ...(metrics.length > 0
      ? ['metric definition appendix showing inclusions and exclusions']
      : []),
  ]
}

function formatMetricGapContext(context: string): string {
  const trimmedContext = context.trim()
  return trimmedContext.length > 0
    ? trimmedContext
    : 'No metric rationale supplied.'
}

function getUsableOpenRisks(update: BoardUpdate): string[] {
  return update.openRisks
    .map((risk) => risk.trim())
    .filter((risk) => risk.length > 0)
}

function getUsableClaims(update: BoardUpdate): BoardClaim[] {
  return update.claims
    .map((claim) => ({
      ...claim,
      text: claim.text.trim(),
    }))
    .filter((claim) => claim.text.length > 0)
}

function getUsableMetrics(update: BoardUpdate): BoardMetric[] {
  return update.metrics
    .map((metric) => ({
      ...metric,
      label: metric.label.trim(),
    }))
    .filter((metric) => metric.label.length > 0)
}
