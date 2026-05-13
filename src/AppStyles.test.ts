/// <reference types="node" />

import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('App stylesheet contract', () => {
  it('styles every static class rendered by the app shell', () => {
    const appSource = readFileSync(new URL('./App.tsx', import.meta.url), 'utf8')
    const cssSource = readFileSync(new URL('./App.css', import.meta.url), 'utf8')

    const renderedClasses = new Set<string>()
    for (const match of appSource.matchAll(/className="([^"]+)"/g)) {
      for (const className of match[1].split(/\s+/)) {
        renderedClasses.add(className)
      }
    }

    const styledClasses = new Set(
      Array.from(cssSource.matchAll(/\.([_a-zA-Z]+[\w-]*)/g), (match) => match[1]),
    )

    const missingStyles = Array.from(renderedClasses).filter(
      (className) => !styledClasses.has(className),
    )

    expect(missingStyles).toEqual([])
  })
})
