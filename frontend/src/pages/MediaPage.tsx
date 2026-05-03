// Fișiere din img/: sufixul ?url îi dă lui Vite să expună URL-ul public după build.
import audioTrack from '../../img/red-hot-chili-peppers_can-t-stop.mp3?url'
import dpMemoPng from '../../img/new-dp-memo.png?url'
import recursionVideo from '../../img/recursion_tree_visualisation.webm?url'
import SiteFooter from '../components/SiteFooter'
import SiteNav from '../components/SiteNav'

function MediaPage() {
  return (
    <div className="page">
      <header className="topbar">
        <h1>Media</h1>
        <SiteNav />
      </header>

      <main className="simple-page">
        <p id="top-media">
          Vizualizare a arborelui recursiv și resurse audio / imagine pentru
          tema programării dinamice.
        </p>

        <nav className="in-page-nav" aria-label="Secțiuni media">
          <a href="#clip-video">Video</a>
          <a href="#clip-audio">Audio</a>
          <a href="#diagrama-dp">Diagramă</a>
        </nav>

        <div className="media-grid">
          <section id="clip-video" className="media-card">
            <h2>Video — vizualizare arbore recursiv</h2>
            
            <video autoPlay loop muted playsInline controls preload="auto">
              <source src={recursionVideo} type="video/webm" />
              Browserul tău nu redă video WebM.
            </video>
          </section>

          <section id="clip-audio" className="media-card">
            <h2>Audio</h2>
            <p>Red Hot Chili Peppers - Can't Stop</p>
            <audio controls preload="metadata">
              <source src={audioTrack} type="audio/mpeg" />
            </audio>
          </section>

          <section id="diagrama-dp" className="media-card">
            <h2>Diagramă memoizare (DP)</h2>
          
            <figure className="figure-dp">
              <img
                src={dpMemoPng}
                alt="Diagramă memoizare pentru programare dinamică: vizualizare a tabloului de stări și a refolosirii rezultatelor memoizate"
              />
              <figcaption>Doua metode de vizualizare a tabloului de stări</figcaption>
            </figure>
          </section>
        </div>

        <p className="back-to-top">
          <a href="#top-media">Înapoi la începutul paginii</a>
        </p>
      </main>

      <SiteFooter />
    </div>
  )
}

export default MediaPage
