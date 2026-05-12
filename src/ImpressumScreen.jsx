export default function ImpressumScreen({ onBack }) {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full bg-andoya-cream px-3 py-1 text-xs font-medium text-[#835baf]"
      >
        Zurück
      </button>
      <section className="mt-6 rounded-4xl bg-white p-8 shadow-soft">
        <h1 className="text-2xl font-semibold text-andoya-ink">Impressum</h1>
        <div className="mt-6 space-y-4 text-sm leading-relaxed text-andoya-slate">
          <p>
            <strong className="text-andoya-ink">Angaben gemäß § 5 ECG (E-Commerce-Gesetz)</strong>
          </p>
          <p>
            Andrea Grillmayer
            <br />
            Bahnstr. 68
            <br />
            A-3550 Langenlois
            <br />
            Österreich
          </p>
          <p>
            E-Mail:{" "}
            <a href="mailto:hallo@andoya.app" className="font-medium text-[#835baf] hover:underline">
              hallo@andoya.app
            </a>
            <br />
            Website:{" "}
            <a
              href="https://andoya.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#835baf] hover:underline"
            >
              https://andoya.app
            </a>
          </p>
          <p>UID-Nummer: ATU68671528</p>
          <p>
            <strong className="text-andoya-ink">Unternehmensgegenstand:</strong> Betrieb einer digitalen
            Lernplattform für Reisende
          </p>
          <p>
            <strong className="text-andoya-ink">Aufsichtsbehörde:</strong> Bezirkshauptmannschaft Krems an der Donau
          </p>
          <p>
            <strong className="text-andoya-ink">Verbraucherstreitbeilegung:</strong>
            <br />
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
            <a
              href="https://ec.europa.eu/consumers/odr"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#835baf] hover:underline"
            >
              https://ec.europa.eu/consumers/odr
            </a>
            <br />
            Wir sind nicht verpflichtet und nicht bereit, an einem Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </section>
    </div>
  );
}
