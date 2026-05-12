import { useState } from "react";

export default function ResetPasswordScreen({ supabase, onSuccess }) {
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!supabase) {
      setError("Supabase ist nicht konfiguriert.");
      return;
    }

    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    if (password !== passwordRepeat) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message || "Passwort konnte nicht gesetzt werden.");
      return;
    }

    await supabase.auth.signOut();
    onSuccess();
  }

  return (
    <main className="flex min-h-0 flex-1 items-center justify-center bg-[radial-gradient(ellipse_90%_70%_at_50%_12%,#ede7f8_0%,#f5f0fb_42%,#ffffff_78%)] px-6 py-12">
      <section className="w-full max-w-md rounded-4xl bg-white p-8 shadow-soft">
        <div className="flex flex-col items-center">
          <img src="/Logo_Andoya1.png" alt="Andoya Logo" className="h-20 w-auto" />
        </div>
        <h1 className="mt-6 text-center text-2xl font-semibold text-andoya-ink">Neues Passwort setzen</h1>
        <p className="mt-2 text-center text-sm text-andoya-slate">
          Wähle ein neues Passwort für dein Andoya-Konto.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1">
            <label htmlFor="reset-password" className="text-sm font-medium text-[#835baf]">
              Neues Passwort
            </label>
            <input
              id="reset-password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#835baf] bg-white px-3 py-2 text-sm text-andoya-ink outline-none ring-[#835baf] transition focus:ring-2"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="reset-password-repeat" className="text-sm font-medium text-[#835baf]">
              Passwort wiederholen
            </label>
            <input
              id="reset-password-repeat"
              type="password"
              required
              value={passwordRepeat}
              onChange={(event) => setPasswordRepeat(event.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-[#835baf] bg-white px-3 py-2 text-sm text-andoya-ink outline-none ring-[#835baf] transition focus:ring-2"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-andoya-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            Passwort speichern
          </button>
        </form>

        {error && <p className="mt-3 text-center text-sm text-[#c0392b]">{error}</p>}
      </section>
    </main>
  );
}
