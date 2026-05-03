import { NavLink } from 'react-router-dom'

// end pe / evită marcat activ și pe sub-rute inexistente
const navItems: { to: string; label: string; end?: boolean }[] = [
  { to: '/', label: 'Studiu', end: true },
  { to: '/submit', label: 'Submit' },
  { to: '/tabele', label: 'Tabele' },
  { to: '/media', label: 'Media' },
  { to: '/laborator', label: 'Laborator' },
]

function SiteNav() {
  return (
    <nav className="site-nav" aria-label="Navigare principală">
      {navItems.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.end ?? false} className="nav-btn">
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default SiteNav
