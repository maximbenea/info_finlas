import { useMemo, useState } from 'react'
import { MathTex } from '../components/MathTex'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'

type TestResult = {
  test_name: string
  status: string
  time_ms: number
  memory_kb: number
  expected: string
  actual: string
  stderr: string
}

type SubmissionResponse = {
  status: string
  compile_stderr: string
  compile_stdout: string
  results: TestResult[]
}

const API_URL = 'https://fastapi-judge.onrender.com/submit'

// Clasificare la texte de judge; „greșit” verificat înainte de „acceptat” (not_accepted etc.).
function toneFromJudgeStatus(status: string): 'accepted' | 'wrong' | 'other' {
  const s = status.trim().toLowerCase().replace(/[\s-]+/g, '_')

  const isWrong =
    s === 'wa' ||
    s === 'wrong_answer' ||
    s.includes('wrong') ||
    s === 'incorrect' ||
    s === 'fail' ||
    s === 'failed' ||
    s === 'not_accepted' ||
    s.includes('not_accepted')

  const isAccepted =
    !isWrong &&
    (s === 'accepted' ||
      s === 'ac' ||
      s === 'ok' ||
      s === 'passed' ||
      s === 'success' ||
      s === 'corect' ||
      s === 'all_accepted')

  if (isWrong) return 'wrong'
  if (isAccepted) return 'accepted'
  return 'other'
}

function SubmitPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<SubmissionResponse | null>(null)

  const statusLabel = useMemo(() => {
    if (!response) return 'No submission yet'
    return response.status.replace(/_/g, ' ').toUpperCase()
  }, [response])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setResponse(null)
    setError(null)
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a .cpp file first.')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile) // API-ul așteaptă câmpul file, nu JSON.

    setIsSubmitting(true)
    setError(null)
    setResponse(null)

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const maybeJson = await res.json().catch(() => null)
        throw new Error(maybeJson?.detail ?? `Server error: ${res.status}`)
      }

      const data = (await res.json()) as SubmissionResponse
      setResponse(data)
    } catch (submissionError) {
      setError(
        submissionError instanceof Error ? submissionError.message : 'Unexpected request error',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1>Submit Solutie</h1>
        <SiteNav />
      </header>

      <main className="submit-page">
        <MoneySumsStatement />
        <section className="submit-shell">
          <h2>Trimite solutia C++ pentru verificare</h2>
          <p>
            Incarca fisierul <code>.cpp</code> si ruleaza verificarea automata pe
            testcase-urile backend.
          </p>
          <div className="upload-box">
            <label htmlFor="cpp-upload" className="upload-label">
              Alege fisier .cpp
            </label>
            <input id="cpp-upload" type="file" accept=".cpp" onChange={handleFileChange} />
            <button onClick={handleSubmit} disabled={isSubmitting || !selectedFile}>
              {isSubmitting ? 'Rulez...' : 'Trimite'}
            </button>
          </div>

          <p>
            <strong>Fisier selectat:</strong> {selectedFile ? selectedFile.name : 'Niciun fisier'}
          </p>
          <p
            className={
              response
                ? `submission-status-line submission-status-line--${toneFromJudgeStatus(response.status)}`
                : undefined
            }
          >
            <strong>Status:</strong> {statusLabel}
          </p>

          {error && <p className="error">{error}</p>}

          {response?.compile_stderr && (
            <section>
              <h3>Erori de compilare</h3>
              <pre>{response.compile_stderr}</pre>
            </section>
          )}

          {!!response?.results.length && (
            <section>
              <h3>Rezultate teste</h3>
              <div className="results-list">
                {/* Clasa cardului urmează toneFromJudgeStatus (stringuri). */}
                {response.results.map((test) => {
                  const tone = toneFromJudgeStatus(test.status)
                  return (
                  <article key={test.test_name} className={`result-card result-card--${tone}`}>
                    <h4>{test.test_name}</h4>
                    <p className="result-status">
                      Status: {test.status}
                    </p>
                    <p>Timp: {test.time_ms} ms</p>
                    <p>Memorie: {test.memory_kb} KB</p>
                    {test.stderr && <pre>{test.stderr}</pre>}
                  </article>
                  )
                })}
              </div>
            </section>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

// Enunț static; MathTex pentru indici/inegalități
function MoneySumsStatement() {
  return (
    <section id="problema-money-sums" className="doc-section">
      <h2>Problema: Money Sums</h2>
      <p>
        Ai <MathTex>n</MathTex> monede cu anumite valori. Sarcina ta este să găsești toate sumele de
        bani pe care le poți forma folosind aceste monede.
      </p>
      <h3>Date de intrare</h3>
      <p>
        Prima linie conține un întreg <MathTex>n</MathTex>, numărul de monede. A doua linie conține{' '}
        <MathTex>n</MathTex> numere întregi: <MathTex>{'x_1, x_2, \\ldots, x_n'}</MathTex>, valorile
        monedelor.
      </p>
      <h3>Date de ieșire</h3>
      <p>
        Afișează mai întâi un întreg <MathTex>k</MathTex>: numărul de sume distincte obținute. După
        aceea, afișează toate sumele posibile în ordine crescătoare.
      </p>
      <h3>Constrângeri</h3>
      <ul className="doc-list">
        <li>
          <MathTex>{'1 \\le n \\le 100'}</MathTex>
        </li>
        <li>
          <MathTex>{'1 \\le x_i \\le 1000'}</MathTex>
        </li>
      </ul>
      <h3>Exemplu</h3>
      <pre>
        <code className="language-plaintext">{`Intrare:
4
4 2 5 2

Iesire:
9
2 4 5 6 7 8 9 11 13`}</code>
      </pre>
      <p>
        Enunt original:{' '}
        <a href="https://cses.fi/problemset/task/1745/" target="_blank" rel="noreferrer">
          CSES - Money Sums
        </a>
      </p>
    </section>
  )
}

export default SubmitPage
