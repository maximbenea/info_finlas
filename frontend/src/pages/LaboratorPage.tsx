import { FormEvent, useEffect, useRef } from 'react'
import { renderStudyTips, runNudgeAnimation, summarizeProfile } from '../../js/interactions.js'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'

function LaboratorPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const tipsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    runNudgeAnimation(titleRef.current)
  }, [])

  const handlePlanSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const profile = summarizeProfile({
      name: String(data.get('nume') ?? ''),
      level: String(data.get('nivel') ?? 'incepator'),
      focus: String(data.get('focus') ?? 'fundamente'),
    })
    // Lista de sfaturi e construită în DOM de js/interactions.js (nu doar setState).
    renderStudyTips(tipsRef.current, profile)
    runNudgeAnimation(tipsRef.current)
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Laborator interactiv</h1>
        <SiteNav />
      </header>

      <main className="simple-page">
        <h2 ref={titleRef}>Plan personal de exersare</h2>
        <p>
          Completează formularul. Datele sunt procesate local în
          browser, fără trimitere către server.
        </p>

        <form className="laborator-form" onSubmit={handlePlanSubmit} noValidate>
          <label htmlFor="nume">Nume sau pseudonim</label>
          <input id="nume" name="nume" type="text" autoComplete="nickname" required />

          <label htmlFor="email">Email de contact</label>
          <input id="email" name="email" type="email" autoComplete="email" />

          <label htmlFor="nivel">Nivel</label>
          <select id="nivel" name="nivel" defaultValue="incepator">
            <option value="incepator">Începător</option>
            <option value="avansat">Avansat</option>
          </select>

          <label htmlFor="focus">Obiectiv principal</label>
          <select id="focus" name="focus" defaultValue="fundamente">
            <option value="fundamente">Înțelegere profundă</option>
            <option value="viteza">Viteză în concurs</option>
          </select>

          <label htmlFor="intrebare">Întrebare scurtă (textarea)</label>
          <textarea id="intrebare" name="intrebare" placeholder="Ex.: cum reduc memoria la LIS?" />

          <div className="checkbox-row">
            <input id="gdpr" name="gdpr" type="checkbox" required />
            <label htmlFor="gdpr">Confirm că folosesc această pagină doar pentru exerciții locale.</label>
          </div>

          <button type="submit">Generează recomandări</button>
        </form>

        <section className="doc-section" aria-live="polite">
          <h3>Recomandări dinamice</h3>
          <div ref={tipsRef} id="sfaturi-dinamice" />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default LaboratorPage
