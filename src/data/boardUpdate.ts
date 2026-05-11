export type BoardMetric = {
  label: string
  value: string
  context: string
  evidenceStatus: 'ready' | 'thin' | 'missing'
}

export type BoardClaim = {
  text: string
  category: 'growth' | 'retention' | 'execution' | 'finance'
  confidence: 'high' | 'medium' | 'low'
  supportingEvidence: string[]
}

export type BoardUpdate = {
  title: string
  summary: string
  metrics: BoardMetric[]
  claims: BoardClaim[]
  openRisks: string[]
}

export const syntheticBoardUpdate: BoardUpdate = {
  title: 'Q3 operating update for Northstar Fleet',
  summary:
    'Management says the mid-market fleet rollout is accelerating, enterprise expansion is improving, and support load is under control after the May onboarding redesign.',
  metrics: [
    {
      label: 'Pipeline coverage',
      value: '3.1x',
      context: 'Includes two verbal commitments without signed order forms.',
      evidenceStatus: 'thin',
    },
    {
      label: 'Net revenue retention',
      value: '114%',
      context: 'Enterprise cohort up, mid-market cohort still below plan.',
      evidenceStatus: 'ready',
    },
    {
      label: 'Support backlog',
      value: '-38%',
      context: 'Counts closed tickets, not unresolved escalation age.',
      evidenceStatus: 'thin',
    },
    {
      label: 'Implementation margin',
      value: 'Unknown',
      context: 'Finance has not separated services hours from product work.',
      evidenceStatus: 'missing',
    },
  ],
  claims: [
    {
      text: 'The rollout motion is repeatable across mid-market accounts.',
      category: 'growth',
      confidence: 'medium',
      supportingEvidence: ['Three pilots converted after the new kickoff template.'],
    },
    {
      text: 'Enterprise expansion is becoming the main growth engine.',
      category: 'retention',
      confidence: 'high',
      supportingEvidence: ['Two largest customers expanded driver-seat counts.'],
    },
    {
      text: 'Support load is structurally lower after onboarding changes.',
      category: 'execution',
      confidence: 'low',
      supportingEvidence: ['Ticket closure volume rose after a one-week triage push.'],
    },
    {
      text: 'Gross margin will recover as implementations standardize.',
      category: 'finance',
      confidence: 'low',
      supportingEvidence: [],
    },
  ],
  openRisks: [
    'Two pipeline deals are still procurement-dependent.',
    'Services effort is bundled into product roadmap reporting.',
    'The support backlog metric may hide aging escalations.',
  ],
}
