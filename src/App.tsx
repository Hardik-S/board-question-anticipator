import './App.css'
import { syntheticBoardUpdate } from './data/boardUpdate'
import { buildBoardPrep } from './lib/anticipator'

const prep = buildBoardPrep(syntheticBoardUpdate)

function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Narrative risk review</p>
          <h1>Board Question Anticipator</h1>
          <p className="hero-copy">
            Pressure-test a synthetic executive update before investors or
            directors ask the hard questions. This first slice turns one memo
            into skeptical questions, weak-claim flags, evidence gaps, and a
            backup artifact checklist.
          </p>
        </div>
        <aside className="brief-card" aria-label="Board prep summary">
          <span className="brief-label">Prep posture</span>
          <strong>{prep.posture}</strong>
          <p>{prep.executiveBrief}</p>
        </aside>
      </section>

      <section className="memo-grid">
        <article className="memo-card">
          <p className="eyebrow">Synthetic update memo</p>
          <h2>{syntheticBoardUpdate.title}</h2>
          <p>{syntheticBoardUpdate.summary}</p>
          <dl className="metric-list">
            {syntheticBoardUpdate.metrics.map((metric) => (
              <div key={metric.label}>
                <dt>{metric.label}</dt>
                <dd>
                  {metric.value}
                  <span>{metric.context}</span>
                </dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="memo-card evidence-card">
          <p className="eyebrow">Evidence gaps</p>
          <h2>{prep.evidenceGaps.length} gaps to close</h2>
          <ul>
            {prep.evidenceGaps.map((gap) => (
              <li key={gap}>
                <span aria-hidden="true">!</span>
                {gap}
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="section-band">
        <div className="section-heading">
          <p className="eyebrow">Question bank</p>
          <h2>Skeptical questions the room is likely to ask</h2>
        </div>
        <div className="question-grid">
          {prep.questions.map((question) => (
            <article className="question-card" key={question.question}>
              <div className="question-meta">
                <span>{question.theme}</span>
                <strong>{question.severity}</strong>
              </div>
              <h3>{question.question}</h3>
              <p>{question.whyItMatters}</p>
              <small>Bring: {question.backupArtifact}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="review-grid">
        <article>
          <p className="eyebrow">Weak-claim flags</p>
          <h2>Claims that need tighter proof</h2>
          {prep.weakClaims.map((claim) => (
            <div className="claim-row" key={claim.claim}>
              <strong>{claim.claim}</strong>
              <p>{claim.reason}</p>
              <span>{claim.repairAction}</span>
            </div>
          ))}
        </article>
        <article>
          <p className="eyebrow">Backup artifact checklist</p>
          <h2>Artifacts to have ready before the meeting</h2>
          <ol className="artifact-list">
            {prep.artifactChecklist.map((artifact) => (
              <li key={artifact}>{artifact}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  )
}

export default App
