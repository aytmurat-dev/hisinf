export type PeriodColor = 'ochre' | 'teal' | 'brick' | 'olive' | 'indigo' | 'sand'

export function periodColorVar(c?: string | null): string {
  const valid: PeriodColor[] = ['ochre', 'teal', 'brick', 'olive', 'indigo', 'sand']
  const color = c && valid.includes(c as PeriodColor) ? c : 'sand'
  return `var(--p-${color})`
}
