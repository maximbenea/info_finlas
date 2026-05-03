import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'

// Tabel cu caption/thead/th
function TabelePage() {
  return (
    <div className="page">
      <header className="topbar">
        <h1>Tabele comparative</h1>
        <SiteNav />
      </header>

      <main className="simple-page">
        <p id="sus">
          Tabel de sinteză pentru a alege rapid între memoizare, construcție bottom-up și optimizări de memorie.
        </p>
        <nav className="in-page-nav" aria-label="Secțiuni pagină">
          <a href="#comparatii">Tabel</a>
          <a href="#note">Note practice</a>
        </nav>

        <section id="comparatii" className="doc-section">
          <h2>Comparație abordări</h2>
          <table className="dp-table">
            <caption>Complexitate tipică și memorie pentru strategii DP uzuale</caption>
            <thead>
              <tr>
                <th scope="col">Abordare</th>
                <th scope="col">Timp</th>
                <th scope="col">Memorie</th>
                <th scope="col">Când o folosești</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Recursiv fără memo</th>
                <td>exponențial (ex. Fibonacci)</td>
                <td>O(adâncime stivă)</td>
                <td>Doar pentru prototipuri foarte mici</td>
              </tr>
              <tr>
                <th scope="row">Top-down + memo</th>
                <td>O(stări × cost stare)</td>
                <td>O(stări)</td>
                <td>Tranziții naturale din recurență</td>
              </tr>
              <tr>
                <th scope="row">Bottom-up</th>
                <td>O(stări × cost stare)</td>
                <td>O(stări), uneori O(1) cu rolling</td>
                <td>Iterație controlată, cache prietenos</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="note" className="doc-section">
          <h2>Note practice</h2>
          <p>
            Alege structura de date pentru stări în funcție de indexare: vector pentru stări dense, hărți pentru
            stări rare. Verifică întotdeauna marginile și inițializarea pentru a evita accesul neinițializat.
          </p>
          <p>
            <a href="#sus">Înapoi sus</a> (ancoră internă).
          </p>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

export default TabelePage
