import { db } from '@/lib/db';

export async function About() {
  const config = await db.siteConfig.findFirst();
  const aboutText = config?.aboutText ?? '';

  // Split aboutText into paragraphs by double newline or single newline
  const paragraphs = aboutText
    .split(/\n\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="about" className="py-spacing-16 px-spacing-4 text-center">
      <h2
        className="text-4xl sm:text-6xl uppercase tracking-widest mb-8"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        CREATIVE VISION
      </h2>

      <div className="max-w-3xl mx-auto space-y-6">
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, i) => (
            <p key={i} className="text-lg text-text-muted leading-relaxed">
              {paragraph}
            </p>
          ))
        ) : (
          <p className="text-lg text-text-muted leading-relaxed">
            Crafting cinematic visual experiences for the world&apos;s most iconic brands.
          </p>
        )}
      </div>
    </section>
  );
}
