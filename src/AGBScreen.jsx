export default function AGBScreen({ onBack }) {
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
        <h1 className="text-2xl font-semibold text-andoya-ink">Allgemeine Geschäftsbedingungen (AGB)</h1>
        <p className="mt-2 text-sm text-andoya-slate">
          <strong className="text-andoya-ink">Stand: Mai 2026</strong>
        </p>
        <p className="mt-4 text-sm leading-relaxed text-andoya-slate">
          <strong className="text-andoya-ink">Betreiber:</strong> Andrea Grillmayer, Bahnstr. 68, A-3550 Langenlois{" "}
          {`(nachfolgend „Andoya")`}
        </p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-andoya-slate">
          <div>
            <h2 className="text-base font-semibold text-andoya-ink">1. Geltungsbereich</h2>
            <p className="mt-2">
              Diese AGB gelten für alle Verträge zwischen Andoya und Nutzern der Plattform andoya.app. Abweichende
              Bedingungen des Nutzers werden nicht anerkannt.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">2. Leistungsbeschreibung</h2>
            <p className="mt-2">
              Andoya ist eine digitale Micro-Learning-Plattform für Reisende. Registrierte Nutzer erhalten täglich eine
              neue Lernlektion zu ihrem gewählten Reiseziel (Sprache, Kultur, Essen, Insider-Tipps). Die Plattform ist
              als Progressive Web App (PWA) verfügbar.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">3. Registrierung und Konto</h2>
            <p className="mt-2">
              Die Nutzung von Andoya setzt eine Registrierung mit einer gültigen E-Mail-Adresse voraus. Der Nutzer ist
              für die Sicherheit seines Passworts selbst verantwortlich. Die Weitergabe von Zugangsdaten an Dritte ist
              nicht gestattet.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">4. Abonnement und Preise</h2>
            <p className="mt-2">
              <strong className="text-andoya-ink">Kostenloser Testzeitraum:</strong> Bei der Registrierung erhält jeder
              Nutzer einen kostenlosen Testzeitraum von 7 Tagen. Eine Kündigung während des Testzeitraums ist jederzeit
              möglich, ohne dass Kosten entstehen.
            </p>
            <p className="mt-3">
              <strong className="text-andoya-ink">Bezahlte Abonnements:</strong>
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Monatliches Abo: € 4,99 / Monat</li>
              <li>Jährliches Abo: € 39,99 / Jahr</li>
            </ul>
            <p className="mt-3">
              Die Abonnements verlängern sich automatisch um den jeweiligen Zeitraum, sofern sie nicht rechtzeitig
              gekündigt werden.
            </p>
            <p className="mt-3">
              <strong className="text-andoya-ink">Zahlungsabwicklung</strong> erfolgt über Stripe. Es gelten die
              Zahlungsbedingungen von Stripe.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">5. Kündigung</h2>
            <p className="mt-2">
              Das Abonnement kann jederzeit über den Bereich {`„Konto"`} in der App gekündigt werden. Die Kündigung
              wird zum Ende des aktuellen Abrechnungszeitraums wirksam. Bis dahin bleibt der Zugang zur Plattform
              bestehen.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">6. Widerrufsrecht</h2>
            <p className="mt-2">
              Als Verbraucher hast du das Recht, diesen Vertrag binnen 14 Tagen ohne Angabe von Gründen zu widerrufen.
              Die Widerrufsfrist beträgt 14 Tage ab dem Tag des Vertragsabschlusses.
            </p>
            <p className="mt-3">
              Um dein Widerrufsrecht auszuüben, teile uns (Andrea Grillmayer,{" "}
              <a href="mailto:hallo@andoya.app" className="font-medium text-[#835baf] hover:underline">
                hallo@andoya.app
              </a>
              ) mittels einer eindeutigen Erklärung deine Entscheidung mit, diesen Vertrag zu widerrufen.
            </p>
            <p className="mt-3">
              <strong className="text-andoya-ink">Hinweis:</strong> Mit Beginn der Nutzung des digitalen Inhalts (erste
              Lektion) stimmst du zu, dass das Widerrufsrecht erlischt, sofern du ausdrücklich zustimmst, dass wir mit
              der Ausführung des Vertrags beginnen.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">7. Verfügbarkeit</h2>
            <p className="mt-2">
              Andoya ist bemüht, eine hohe Verfügbarkeit der Plattform zu gewährleisten. Ein Anspruch auf ununterbrochene
              Verfügbarkeit besteht nicht. Wartungsarbeiten werden nach Möglichkeit angekündigt.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">8. Inhalte und Urheberrecht</h2>
            <p className="mt-2">
              Alle Inhalte auf Andoya (Lektionen, Texte, Bilder) sind urheberrechtlich geschützt. Eine Vervielfältigung
              oder Weitergabe ohne ausdrückliche Genehmigung ist nicht gestattet.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">9. Haftungsbeschränkung</h2>
            <p className="mt-2">
              Andoya haftet nicht für die inhaltliche Richtigkeit der bereitgestellten Informationen. Die Lektionen
              dienen der allgemeinen Reisevorbereitung und ersetzen keine professionelle Reise- oder
              Sicherheitsberatung.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">10. Anwendbares Recht und Gerichtsstand</h2>
            <p className="mt-2">
              Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Krems an der Donau,
              sofern gesetzlich zulässig.
            </p>
          </div>

          <div>
            <h2 className="text-base font-semibold text-andoya-ink">11. Kontakt</h2>
            <p className="mt-2">
              Bei Fragen zu diesen AGB wende dich an:{" "}
              <a href="mailto:hallo@andoya.app" className="font-medium text-[#835baf] hover:underline">
                hallo@andoya.app
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
