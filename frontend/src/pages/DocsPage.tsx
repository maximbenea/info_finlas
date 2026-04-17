import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('cpp', cpp)

const docSections = [
  { id: 'introducere', title: 'Introducere' },
  { id: 'memoizare', title: 'Accelerarea Fibonacci (Memoizare)' },
  { id: 'bottom-up', title: 'Programare Dinamica Bottom-Up' },
  { id: 'probleme-clasice', title: 'Probleme Clasice de DP' },
  { id: 'subiecte-adiacente', title: 'Subiecte Adiacente' },
  { id: 'exersare', title: 'Probleme de Exersare' },
]

function DocsPage() {
  useEffect(() => {
    const blocks = document.querySelectorAll('pre code')
    blocks.forEach((block) => hljs.highlightElement(block as HTMLElement))
  }, [])

  return (
    <div className="page">
      <header className="topbar">
        <h1>Programare Dinamica</h1>
        <div className="topbar-actions">
          <Link className="nav-btn" to="/submit">
            Pagina Submit
          </Link>
        </div>
      </header>

      <div className="layout">
        <div className="sidebar-shell">
          <aside className="sidebar">
            <p className="sidebar-title">Cuprins</p>
            <nav>
              <ul>
                {docSections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>

        <main className="content">
          <section id="introducere" className="doc-section">
            <h2>Introducere in Programarea Dinamica</h2>
            <p>
              Esenta programarii dinamice este evitarea calculelor repetate. Multe
              probleme de DP sunt natural rezolvabile recursiv: scrii mai intai
              solutia recursiva, apoi salvezi starile repetate intr-un tabel de
              cautare. Acest proces se numeste abordare <strong>top-down cu memoizare</strong>.
            </p>
            <p>
              Un exemplu clasic este sirul Fibonacci, definit prin formula:
              <code> f(n) = f(n - 1) + f(n - 2) </code> pentru <code>n &gt;= 2</code>, cu{' '}
              <code>f(0) = 0</code> si <code>f(1) = 1</code>.
            </p>
            <pre>
              <code className="language-cpp">{`int f(int n) {
  if (n == 0) return 0;
  if (n == 1) return 1;
  return f(n - 1) + f(n - 2);
}`}</code>
            </pre>
            <p>
              Timpul de rulare al acestei forme recursive este exponential, aproximativ{' '}
              <code>O(2^n)</code>, deoarece fiecare apel genereaza doua apeluri similare.
            </p>
          </section>

          <section id="memoizare" className="doc-section">
            <h2>Accelerarea Fibonacci cu Programare Dinamica (Memoizare)</h2>
            <p>
              Varianta recursiva simpla devine rapid prea lenta. De exemplu, pentru{' '}
              <code>f(29)</code> ajungem la peste 1 milion de apeluri.
            </p>
            <p>
              Observatia cheie este ca exista doar <code>O(n)</code> subprobleme distincte:
              avem nevoie de valorile <code>f(n-1), f(n-2), ..., f(0)</code>. Daca salvam
              rezultatele o singura data si le reutilizam, eliminam munca repetata.
            </p>
            <pre>
              <code className="language-cpp">{`const int MAXN = 100;
bool found[MAXN];
int memo[MAXN];

int f(int n) {
  if (found[n]) return memo[n];
  if (n == 0) return 0;
  if (n == 1) return 1;

  found[n] = true;
  return memo[n] = f(n - 1) + f(n - 2);
}`}</code>
            </pre>
            <p>
              In aceasta varianta, apelurile pentru <code>f(29)</code> scad la doar 57. In
              practica, vectorii/tablourile sunt de obicei cele mai rapide pentru memoizare (
              <code>O(1)</code> acces), dar se pot folosi si <code>unordered_map</code> sau{' '}
              <code>map</code> cand starea nu este usor indexabila.
            </p>
            <pre>
              <code className="language-cpp">{`unordered_map<int, int> memo;
int f(int n) {
  if (memo.count(n)) return memo[n];
  if (n == 0) return 0;
  if (n == 1) return 1;
  return memo[n] = f(n - 1) + f(n - 2);
}`}</code>
            </pre>
            <pre>
              <code className="language-cpp">{`map<int, int> memo;
int f(int n) {
  if (memo.count(n)) return memo[n];
  if (n == 0) return 0;
  if (n == 1) return 1;
  return memo[n] = f(n - 1) + f(n - 2);
}`}</code>
            </pre>
            <p>
              Regula practica pentru complexitate la memoizare este:
              <code> munca per subproblema * numarul de subprobleme</code>.
            </p>
            <p>
              Daca folosesti un arbore de cautare balansat (<code>map</code>), fiecare
              cautare/inserare costa <code>O(log n)</code>, iar pentru <code>O(n)</code>{' '}
              subprobleme timpul total devine <code>O(n log n)</code>. Abordarea se numeste
              top-down deoarece pornesti din valoarea ceruta si cobori spre cazurile de baza,
              facand scurtaturi prin memoizare.
            </p>
            <p>
              Observatie practica: dupa optimizarea numarului de apeluri, pentru Fibonacci
              limita ajunge adesea tipul de date; in int semnat pe 32 biti, <code>f(46)</code>{' '}
              este ultimul termen care incape.
            </p>
          </section>

          <section id="bottom-up" className="doc-section">
            <h2>Programare Dinamica Bottom-Up</h2>
            <p>
              Abordarea bottom-up este inversul top-down: pornim de la cazurile de baza si
              construim treptat raspunsul pentru valori mai mari.
            </p>
            <pre>
              <code className="language-cpp">{`const int MAXN = 100;
int fib[MAXN];

int f(int n) {
  fib[0] = 0;
  fib[1] = 1;
  for (int i = 2; i <= n; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib[n];
}`}</code>
            </pre>
            <p>
              Putem reduce memoria de la <code>O(n)</code> la <code>O(1)</code> pastrand doar
              ultimele valori necesare:
            </p>
            <pre>
              <code className="language-cpp">{`const int MAX_SAVE = 3;
int fib[MAX_SAVE];

int f(int n) {
  fib[0] = 0;
  fib[1] = 1;
  for (int i = 2; i <= n; i++) {
    fib[i % MAX_SAVE] = fib[(i - 1) % MAX_SAVE] + fib[(i - 2) % MAX_SAVE];
  }
  return fib[n % MAX_SAVE];
}`}</code>
            </pre>
            <p>Ideea centrala ramane aceeasi: nu recalcula ce ai rezolvat deja.</p>
          </section>

          <section id="probleme-clasice" className="doc-section">
            <h2>Probleme clasice de Programare Dinamica</h2>
            <ul className="doc-list">
              <li>
                <strong>Rucsac 0-1:</strong> maximizezi valoarea totala sub o constrangere de
                greutate.
              </li>
              <li>
                <strong>Subset Sum:</strong> verifici daca exista un subset cu suma exacta T.
              </li>
              <li>
                <strong>LIS (Longest Increasing Subsequence):</strong> cea mai lunga subsir
                crescator.
              </li>
              <li>
                <strong>Numarare de drumuri in grila:</strong> drumuri distincte de la (1,1) la
                (N,M) cu mutari la dreapta sau jos.
              </li>
              <li>
                <strong>LCS (Longest Common Subsequence):</strong> lungimea celui mai lung subsir
                comun pentru doua siruri.
              </li>
              <li>
                <strong>Cel mai lung drum intr-un DAG:</strong> varianta pe graf aciclic
                orientat.
              </li>
              <li>
                <strong>Longest Palindromic Subsequence:</strong> cel mai lung subsir palindrom.
              </li>
              <li>
                <strong>Taierea tijei (Rod Cutting):</strong> cost minim total pentru efectuarea
                taieturilor.
              </li>
              <li>
                <strong>Distanta de editare:</strong> minim de operatii Add/Remove/Replace pentru
                a transforma un sir in altul.
              </li>
            </ul>
          </section>

          <section id="subiecte-adiacente" className="doc-section">
            <h2>Subiecte adiacente</h2>
            <ul className="doc-list">
              <li>Programare Dinamica pe biti (Bitmask DP)</li>
              <li>Digit DP</li>
              <li>Programare Dinamica pe arbori</li>
            </ul>
          </section>

          <section id="exersare" className="doc-section">
            <h2>Probleme pentru exersare</h2>
            <ul className="doc-list">
              <li>LeetCode 1137 - N-th Tribonacci Number</li>
              <li>LeetCode 118 - Pascal&apos;s Triangle</li>
              <li>LeetCode 1025 - Divisor Game</li>
              <li>Codeforces - Vacations</li>
              <li>Codeforces - Hard problem</li>
              <li>Codeforces - Zuma</li>
              <li>LeetCode 221 - Maximal Square</li>
              <li>LeetCode 1039 - Minimum Score Triangulation of Polygon</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}

export default DocsPage
