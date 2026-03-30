export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Design system verification */}
      <h1
        className="text-6xl font-bold uppercase tracking-widest"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        VLACOVISION
      </h1>

      <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
        Premium video production — Bay Area and worldwide
      </p>

      <div
        className="w-full max-w-md p-8 rounded-lg"
        style={{ backgroundColor: 'var(--color-bg-card)' }}
      >
        <p className="text-sm uppercase tracking-widest mb-4">
          Design System Verification
        </p>
        <div className="flex gap-4 flex-wrap">
          <div
            className="w-10 h-10 rounded"
            style={{ backgroundColor: '#0A0A0A', border: '1px solid #333' }}
            title="bg-base #0A0A0A"
          />
          <div
            className="w-10 h-10 rounded"
            style={{ backgroundColor: '#111111' }}
            title="bg-card #111111"
          />
          <div
            className="w-10 h-10 rounded"
            style={{ backgroundColor: '#1A1A1A' }}
            title="bg-section #1A1A1A"
          />
          <div
            className="w-10 h-10 rounded"
            style={{ backgroundColor: '#F5F5F5' }}
            title="text-primary #F5F5F5"
          />
          <div
            className="w-10 h-10 rounded"
            style={{ backgroundColor: '#FF4400' }}
            title="accent #FF4400"
          />
        </div>
      </div>

      <span style={{ color: 'var(--color-accent)' }} className="text-xl font-bold">
        Burnt Orange Accent — #FF4400
      </span>

      <button
        className="px-8 py-3 font-bold uppercase tracking-widest transition-opacity hover:opacity-80"
        style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
      >
        Get in Touch
      </button>
    </main>
  );
}
