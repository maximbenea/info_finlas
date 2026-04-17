import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

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

const API_URL = 'http://127.0.0.1:8000/submit'

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
    formData.append('file', selectedFile)

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
        <div className="topbar-actions">
          <Link className="nav-btn" to="/">
            Pagina Studiu
          </Link>
        </div>
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
          <p>
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
                {response.results.map((test) => (
                  <article key={test.test_name} className="result-card">
                    <h4>{test.test_name}</h4>
                    <p>Status: {test.status}</p>
                    <p>Timp: {test.time_ms} ms</p>
                    <p>Memorie: {test.memory_kb} KB</p>
                    {test.stderr && <pre>{test.stderr}</pre>}
                  </article>
                ))}
              </div>
            </section>
          )}
        </section>
      </main>
    </div>
  )
}

function MoneySumsStatement() {
  return (
    <section id="problema-money-sums" className="doc-section">
      <h2>Problema: Money Sums (traducere in romana)</h2>
      <p>
        Ai <code>n</code> monede cu anumite valori. Sarcina ta este sa gasesti toate sumele de
        bani pe care le poti forma folosind aceste monede.
      </p>
      <h3>Date de intrare</h3>
      <p>
        Prima linie contine un intreg <code>n</code>, numarul de monede. A doua linie contine{' '}
        <code>n</code> numere intregi: <code>x1, x2, ..., xn</code>, valorile monedelor.
      </p>
      <h3>Date de iesire</h3>
      <p>
        Afiseaza mai intai un intreg <code>k</code>: numarul de sume distincte obtinute. Dupa
        aceea, afiseaza toate sumele posibile in ordine crescatoare.
      </p>
      <h3>Constrangeri</h3>
      <ul className="doc-list">
        <li>1 &lt;= n &lt;= 100</li>
        <li>1 &lt;= xi &lt;= 1000</li>
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
