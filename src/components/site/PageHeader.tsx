export function PageHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <section className="border-b border-border/60 gradient-hero">
      <div className="container-page py-16 md:py-24">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-balance max-w-3xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg text-muted-foreground text-balance">{description}</p>}
      </div>
    </section>
  );
}
