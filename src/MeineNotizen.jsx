import { useEffect, useMemo, useState } from "react";

const notesTable = "notizen";

export default function MeineNotizen({ supabase, session, countries, onBack, embedded = false }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [draftByCountry, setDraftByCountry] = useState({});
  const [savingCountry, setSavingCountry] = useState("");

  useEffect(() => {
    async function loadNotes() {
      if (!supabase || !session?.user?.id) return;
      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from(notesTable)
        .select("id, land, typ, inhalt, quelle, erstellt_am")
        .eq("user_id", session.user.id)
        .order("erstellt_am", { ascending: false });

      if (fetchError) {
        setError("Notizen konnten nicht geladen werden.");
        setLoading(false);
        return;
      }

      setNotes(Array.isArray(data) ? data : []);
      setLoading(false);
    }

    loadNotes();
  }, [supabase, session]);

  const notesByCountry = useMemo(() => {
    const grouped = {};
    for (const country of countries) grouped[country] = [];
    for (const note of notes) {
      if (!grouped[note.land]) grouped[note.land] = [];
      grouped[note.land].push(note);
    }
    return grouped;
  }, [notes, countries]);

  async function handleDelete(id) {
    if (!supabase || !session?.user?.id) return;

    const { error: deleteError } = await supabase
      .from(notesTable)
      .delete()
      .eq("id", id)
      .eq("user_id", session.user.id);

    if (deleteError) {
      setError("Notiz konnte nicht gelöscht werden.");
      return;
    }

    setNotes((prev) => prev.filter((note) => note.id !== id));
  }

  async function handleAddOwnNote(country) {
    if (!supabase || !session?.user?.id) return;
    const draft = (draftByCountry[country] || "").trim();
    if (!draft) return;

    setSavingCountry(country);
    const { data, error: insertError } = await supabase
      .from(notesTable)
      .insert({
        user_id: session.user.id,
        land: country,
        typ: "eigene",
        inhalt: draft,
        quelle: null,
        erstellt_am: new Date().toISOString()
      })
      .select("id, land, typ, inhalt, quelle, erstellt_am")
      .single();

    setSavingCountry("");

    if (insertError) {
      setError("Eigene Notiz konnte nicht gespeichert werden.");
      return;
    }

    setDraftByCountry((prev) => ({ ...prev, [country]: "" }));
    setNotes((prev) => [data, ...prev]);
  }

  return (
    <div className={`min-h-screen px-6 py-12 md:px-10 ${embedded ? "pb-20 md:pb-12" : ""}`}>
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className={`flex items-center ${embedded ? "justify-start" : "justify-between"}`}>
          <h1 className="text-2xl font-semibold text-andoya-ink md:text-3xl">Meine Notizen</h1>
          {!embedded && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#835baf] shadow-soft"
            >
              Zurück
            </button>
          )}
        </div>

        {loading && <p className="text-sm text-andoya-slate">Notizen werden geladen...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading &&
          countries.map((country) => (
            <section key={country} className="rounded-4xl bg-white p-6 shadow-soft">
              <h2 className="text-lg font-semibold text-[#835baf]">{country}</h2>

              <div className="mt-4 space-y-3">
                {(notesByCountry[country] || []).length === 0 ? (
                  <p className="text-sm text-andoya-slate">Noch keine Notizen für dieses Land.</p>
                ) : (
                  notesByCountry[country].map((note) => (
                    <article key={note.id} className="rounded-2xl bg-andoya-cream p-4">
                      <p className="text-sm leading-relaxed text-andoya-ink">{note.inhalt}</p>
                      <div className="mt-2 flex items-center justify-between gap-3">
                        <p className="text-xs font-medium text-andoya-slate">
                          {note.quelle || "Eigene Notiz"}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDelete(note.id)}
                          className="rounded-full bg-[#4b7e76] px-3 py-1 text-xs font-semibold text-white"
                        >
                          Löschen
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>

              <div className="mt-5 space-y-2">
                <label className="text-sm font-semibold text-[#835baf]">
                  Eigene Notiz hinzufügen
                </label>
                <textarea
                  value={draftByCountry[country] || ""}
                  onChange={(event) =>
                    setDraftByCountry((prev) => ({ ...prev, [country]: event.target.value }))
                  }
                  className="min-h-24 w-full rounded-xl border border-[#835baf] bg-white px-3 py-2 text-sm text-andoya-ink outline-none ring-[#835baf] transition focus:ring-2"
                  placeholder={`Deine Notiz zu ${country}...`}
                />
                <button
                  type="button"
                  onClick={() => handleAddOwnNote(country)}
                  disabled={savingCountry === country}
                  className="rounded-full bg-[#835baf] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  Speichern
                </button>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
