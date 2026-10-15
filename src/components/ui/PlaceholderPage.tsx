import { Construction } from 'lucide-react'

/** Honest Stage 0 placeholder. Shows what is planned and when, never fake data. */
export function PlaceholderPage({
  title,
  stage,
  description,
}: {
  title: string
  stage: number
  description?: string
}) {
  return (
    <section className="mx-auto max-w-2xl rounded-card border border-line bg-surface-1 p-8 shadow-panel">
      <Construction className="mb-3 size-8 text-brand" aria-hidden />
      <h1 className="text-2xl font-semibold">{title}</h1>
      {description && <p className="mt-2 text-muted">{description}</p>}
      <p className="mt-4 inline-block rounded-full bg-surface-3 px-3 py-1 text-xs text-muted">
        Planned for Stage {stage}. Not built yet.
      </p>
    </section>
  )
}
