// Funcții pure + DOM minim din React.

export function buildFibonacciTerms(n) {
  const cap = Math.max(0, Math.min(32, Math.floor(Number(n)) || 0))
  if (cap === 0) return []
  if (cap === 1) return [0]
  const out = [0, 1]
  for (let i = 2; i < cap; i += 1) {
    out.push(out[i - 1] + out[i - 2])
  }
  return out
}

export function summarizeProfile(raw) {
  const level = raw.level === 'avansat' ? 'avansat' : 'incepator'
  const focus = raw.focus === 'viteza' ? 'viteza' : 'fundamente'
  return { level, focus, name: String(raw.name || '').trim() || 'student' }
}

export function renderStudyTips(container, profile) {
  if (!container) return
  container.innerHTML = ''
  const tips = []
  if (profile.level === 'incepator') {
    tips.push('Începe cu Fibonacci memoizat și verifică manual primele valori.')
    tips.push('Desenează recurența pe hârtie înainte de a codifica stările.')
  } else {
    tips.push('Combină structuri (deque, BIT) cu stări DP când problema o cere.')
    tips.push('Încearcă întâi varianta O(stări) înainte de optimizări agresive.')
  }
  if (profile.focus === 'viteza') {
    tips.push('Cronometrează 45 de minute pe probleme clasice pentru ritm de concurs.')
  } else {
    tips.push('Notează invariantele și marginile cazurilor de bază după fiecare problemă.')
  }
  const ul = document.createElement('ul')
  ul.className = 'dynamic-tips'
  for (const t of tips) {
    const li = document.createElement('li')
    li.textContent = t
    ul.appendChild(li)
  }
  container.appendChild(ul)
}

export function runNudgeAnimation(element) {
  if (!element) return
  element.animate(
    [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-7px)' },
      { transform: 'translateX(7px)' },
      { transform: 'translateX(0)' },
    ],
    { duration: 480, easing: 'ease-in-out' },
  )
}
