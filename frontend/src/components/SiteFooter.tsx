import { Link } from 'react-router-dom'
import catGif from '../../img/cat.gif?url'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-copy">
          <p>
            Legătură internă către începutul materialului de studiu:{' '}
            <Link to={{ pathname: '/', hash: 'introducere' }}>salt la Introducere</Link>
          </p>
          <p>
            Resursă externă folosită:{' '}
            <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer">
              MDN Web Docs — JavaScript
            </a>{' '}
          </p>
        </div>
        {/* Pisică decorativă; alt gol*/}
        <div className="site-footer-mascot" aria-hidden="true">
          <img src={catGif} alt="" className="site-footer-cat" width={80} />
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
