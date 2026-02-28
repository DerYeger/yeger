export function ensureVueHImport(script: string): string {
  if (/import\s*{[^}]*\bh\b[^}]*}\s*from\s*['"]vue['"]/.test(script)) {
    return script
  }

  return `import { h } from 'vue'\n${script}`
}
