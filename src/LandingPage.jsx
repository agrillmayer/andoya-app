export default function LandingPage({ onLogin, onRegister }) {
  return (
    <main className="min-h-screen px-6 py-10 md:px-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12">
        <header className="flex items-center justify-between">
          <img src="/Logo_Andoya1.png" alt="Andoya Logo" className="h-14 w-auto" />
          <button
            type="button"
            onClick={onLogin}
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#835baf] shadow-soft"
          >
            Login
          </button>
        </header>

        <section className="grid items-center gap-8 rounded-4xl bg-white p-8 shadow-soft md:grid-cols-2 md:p-12">
          <div>
            <h1 className="text-4xl font-bold leading-tight text-andoya-ink md:text-5xl">
              Deine Reise beginnt heute.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-andoya-slate md:text-lg">
              Jeden Tag eine neue Lektion zu deinem nächsten Reiseziel. Sprache,
              Kultur, Essen, Geheimtipps - in 3 Minuten.
            </p>
            <button
              type="button"
              onClick={onRegister}
              className="mt-6 rounded-full bg-[#835baf] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              7 Tage gratis testen
            </button>
          </div>
          <div className="overflow-hidden rounded-3xl shadow-soft">
            <img
              src="/images/image_startseite.jpg"
              alt="Inspiration fuer deine naechste Reise"
              className="h-full w-full object-cover"
            />
          </div>
        </section>

        <section className="rounded-4xl bg-white p-8 shadow-soft md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#835baf]">
            Wie es funktioniert
          </p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <article className="rounded-3xl bg-[#f0ebf8] p-5">
              <p className="text-sm font-semibold text-andoya-ink">1. Reiseziel wählen</p>
              <p className="mt-2 text-sm leading-relaxed text-andoya-slate">
                Wähle das Land, das du als Nächstes entdecken willst.
              </p>
            </article>
            <article className="rounded-3xl bg-[#e8f4f4] p-5">
              <p className="text-sm font-semibold text-andoya-ink">
                2. Jeden Tag eine neue Lektion erhalten
              </p>
              <p className="mt-2 text-sm leading-relaxed text-andoya-slate">
                Täglich ein kurzes Lernformat mit genau den Themen, die unterwegs zählen.
              </p>
            </article>
            <article className="rounded-3xl bg-[#fef3e8] p-5">
              <p className="text-sm font-semibold text-andoya-ink">
                3. Tipps speichern und mitnehmen
              </p>
              <p className="mt-2 text-sm leading-relaxed text-andoya-slate">
                Sammle Highlights und nimm deine Notizen direkt auf die nächste Reise mit.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-4xl bg-white p-8 shadow-soft md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#835baf]">
            Beispiel-Lektion
          </p>
          <article className="mt-4 rounded-3xl bg-andoya-cream p-6">
            <p className="text-sm font-semibold text-[#835baf]">Tag 3 - Kultur</p>
            <h2 className="mt-1 text-2xl font-bold text-andoya-ink">
              Rom entdecken: Dolce Vita im Alltag
            </h2>
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl bg-[#f0ebf8] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                  Einstieg
                </p>
                <p className="mt-1 text-sm text-andoya-slate">
                  In Italien beginnt der Abend oft später - und viel entspannter.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                  Inhalt
                </p>
                <p className="mt-1 text-sm text-andoya-slate">
                  Italiens Kultur lebt von Begegnungen, kleinen Ritualen und
                  einem starken Gemeinschaftsgefühl. In vielen Städten beginnt
                  der Tag mit einem schnellen Espresso an der Bar, wo man
                  miteinander spricht statt nur vorbeizulaufen. Mittags treffen
                  sich Familien oft zum Essen, und am Abend füllen sich Plätze
                  mit Menschen, die den Alltag draußen genießen. Kunst und
                  Geschichte sind überall sichtbar - von Kirchen und
                  Kopfsteinpflaster bis zu modernen Vierteln mit kreativen
                  Cafes. Gleichzeitig prägen regionale Unterschiede das Leben:
                  Im Norden wirkt vieles strukturierter, im Süden spontaner und
                  lauter. Wer Italien wirklich erleben will, sollte sich Zeit
                  für Gespräche nehmen, lokale Märkte besuchen und auf die
                  kleinen Gesten achten. Genau dort zeigt sich das echte Dolce
                  Vita.
                </p>
              </div>
              <div className="rounded-2xl bg-[#e8f4f4] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                  Fakt
                </p>
                <p className="mt-1 text-sm text-andoya-slate">
                  Viele Restaurants in Rom füllen sich erst ab 20 Uhr.
                </p>
              </div>
              <div className="rounded-2xl bg-[#c6d5e6] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                  Tipp
                </p>
                <p className="mt-1 text-sm text-andoya-slate">
                  Plane dein Abendessen später ein und genieße vorher einen Spaziergang.
                </p>
              </div>
            </div>
          </article>
        </section>

        <footer className="flex justify-center pb-3">
          <button
            type="button"
            onClick={onRegister}
            className="rounded-full bg-[#835baf] px-7 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Jetzt starten
          </button>
        </footer>
      </div>
    </main>
  );
}
