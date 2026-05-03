import katex from 'katex'
import 'katex/dist/katex.min.css'
import { useMemo } from 'react'

type MathTexProps = {
  children: string
  block?: boolean
  className?: string
}

// KaTeX produce HTML sigur pentru math; fallback la text dacă parse eșuează.
export function MathTex({ children, block = false, className }: MathTexProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(children.trim(), {
        displayMode: block,
        throwOnError: false,
        strict: 'ignore',
      })
    } catch {
      return children
    }
  }, [children, block])

  if (block) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />
  }
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />
}
