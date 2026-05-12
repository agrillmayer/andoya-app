export default function DatenschutzScreen({ onBack }) {
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
        <h1 className="text-2xl font-semibold text-andoya-ink">Datenschutzerklärung</h1>
        <div className="mt-6 space-y-5 text-sm leading-relaxed text-andoya-slate">
          <p>
            <strong className="text-andoya-ink">Verantwortliche Person:</strong>
            <br />
            Andrea Grillmayer, Bahnstr. 68, A-3550 Langenlois
            <br />
            E-Mail:{" "}
            <a href="mailto:hallo@andoya.app" className="font-medium text-[#835baf] hover:underline">
              hallo@andoya.app
            </a>
          </p>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Welche Daten wir erheben</h2>
            <p className="mt-2">
              Bei der Nutzung von Andoya erheben wir folgende personenbezogene Daten:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-andoya-ink">Registrierungsdaten:</strong> E-Mail-Adresse und Passwort
                (verschlüsselt gespeichert)
              </li>
              <li>
                <strong className="text-andoya-ink">Nutzungsdaten:</strong> Gewähltes Reiseziel, Lernfortschritt
                (Tag, letzte Lektion), gespeicherte Notizen
              </li>
              <li>
                <strong className="text-andoya-ink">Zahlungsdaten:</strong> Werden ausschließlich von Stripe
                verarbeitet. Andoya speichert keine Kreditkartendaten. Wir speichern lediglich die Stripe-Kunden-ID und
                den Abo-Status.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Zweck der Datenverarbeitung</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Bereitstellung der Lernplattform und personalisierten Lektionen</li>
              <li>Verwaltung von Benutzerkonten und Abonnements</li>
              <li>Kommunikation (z.B. E-Mail-Bestätigung, Passwort-Reset)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Rechtsgrundlage</h2>
            <p className="mt-2">
              Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung) sowie Art. 6 Abs. 1
              lit. f DSGVO (berechtigtes Interesse).
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Drittanbieter</h2>
            <p className="mt-2">Wir setzen folgende Drittanbieter ein:</p>
            <ul className="mt-2 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-andoya-ink">Supabase</strong> (Datenbank & Authentifizierung): Supabase Inc.,
                USA — Daten werden auf EU-Servern gespeichert. Datenschutzerklärung:{" "}
                <a
                  href="https://supabase.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#835baf] hover:underline"
                >
                  https://supabase.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-andoya-ink">Stripe</strong> (Zahlungsabwicklung): Stripe Inc., USA —
                Verarbeitung gemäß Stripe-Datenschutzrichtlinie:{" "}
                <a
                  href="https://stripe.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#835baf] hover:underline"
                >
                  https://stripe.com/privacy
                </a>
              </li>
              <li>
                <strong className="text-andoya-ink">Vercel</strong> (Hosting): Vercel Inc., USA — Datenschutzerklärung:{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#835baf] hover:underline"
                >
                  https://vercel.com/legal/privacy-policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Speicherdauer</h2>
            <p className="mt-2">
              Deine Daten werden gespeichert, solange dein Konto aktiv ist. Nach Kündigung und auf ausdrücklichen
              Wunsch werden alle personenbezogenen Daten innerhalb von 30 Tagen gelöscht.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Deine Rechte</h2>
            <p className="mt-2">Du hast jederzeit das Recht auf:</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong className="text-andoya-ink">Auskunft</strong> über deine gespeicherten Daten
              </li>
              <li>
                <strong className="text-andoya-ink">Berichtigung</strong> unrichtiger Daten
              </li>
              <li>
                <strong className="text-andoya-ink">Löschung</strong> deiner Daten
              </li>
              <li>
                <strong className="text-andoya-ink">Einschränkung</strong> der Verarbeitung
              </li>
              <li>
                <strong className="text-andoya-ink">Datenübertragbarkeit</strong>
              </li>
              <li>
                <strong className="text-andoya-ink">Widerspruch</strong> gegen die Verarbeitung
              </li>
            </ul>
            <p className="mt-3">
              Für die Ausübung dieser Rechte wende dich bitte an:{" "}
              <a href="mailto:hallo@andoya.app" className="font-medium text-[#835baf] hover:underline">
                hallo@andoya.app
              </a>
            </p>
            <p className="mt-2">
              Du hast außerdem das Recht, eine Beschwerde bei der österreichischen Datenschutzbehörde einzureichen:{" "}
              <a
                href="https://www.dsb.gv.at"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#835baf] hover:underline"
              >
                https://www.dsb.gv.at
              </a>
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">Cookies</h2>
            <p className="mt-2">
              Andoya verwendet ausschließlich technisch notwendige Cookies und lokale Speichermechanismen (Local
              Storage) für die Authentifizierung. Es werden keine Tracking- oder Werbe-Cookies eingesetzt.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
