import { useEffect, useMemo, useState } from "react";

const subscriptionsTable = "subscriptions";

function formatDateDe(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("de-DE", { day: "2-digit", month: "long", year: "numeric" });
}

function buildAboLabel(row, monthlyPriceId, yearlyPriceId) {
  if (!row) return "Kein aktives Abo";
  const { status, trial_end, stripe_price_id: priceId } = row;

  if (status === "trialing") {
    const end = formatDateDe(trial_end);
    return end ? `Trial aktiv bis ${end}` : "Trial aktiv";
  }

  if (status === "active") {
    if (monthlyPriceId && priceId === monthlyPriceId) return "Monatliches Abo";
    if (yearlyPriceId && priceId === yearlyPriceId) return "Jährliches Abo";
    return "Abo aktiv";
  }

  return "Kein aktives Abo";
}

export default function KontoScreen({
  supabase,
  session,
  stripeMonthlyPrice,
  stripeYearlyPrice,
  onLogout
}) {
  const [row, setRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordInfo, setPasswordInfo] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function load() {
      if (!supabase || !session?.user?.id) {
        setRow(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setFetchError("");
      const { data, error } = await supabase
        .from(subscriptionsTable)
        .select("status, trial_end, stripe_customer_id, stripe_price_id")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setFetchError("Abo-Daten konnten nicht geladen werden.");
        setRow(null);
      } else {
        setRow(data || null);
      }
      setLoading(false);
    }
    load();
  }, [supabase, session]);

  const aboText = useMemo(
    () => buildAboLabel(row, stripeMonthlyPrice, stripeYearlyPrice),
    [row, stripeMonthlyPrice, stripeYearlyPrice]
  );

  async function handlePortal() {
    setPortalError("");
    if (!session?.user?.id) return;
    setPortalLoading(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session.user.id })
      });
      const result = await response.json();
      if (!response.ok || !result?.url) {
        setPortalError(result?.error || "Kundenportal konnte nicht geöffnet werden.");
        setPortalLoading(false);
        return;
      }
      window.open(result.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setPortalError("Kundenportal konnte nicht geöffnet werden.");
    }
    setPortalLoading(false);
  }

  async function handlePasswordReset() {
    if (!supabase || !session?.user?.email) return;
    setPasswordError("");
    setPasswordInfo("");
    setPasswordLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(session.user.email, {
      redirectTo: "https://andoya.app/reset-password"
    });
    setPasswordLoading(false);
    if (error) {
      setPasswordError(error.message || "E-Mail konnte nicht gesendet werden.");
      return;
    }
    setPasswordInfo(
      "Wir haben dir einen Link zum Zurücksetzen deines Passworts geschickt. Bitte prüfe dein Postfach."
    );
  }

  return (
    <div className="min-h-screen px-6 py-12 pb-28 md:px-10 md:pb-12">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <h1 className="text-2xl font-semibold text-andoya-ink md:text-3xl">Konto</h1>

        <section className="rounded-4xl bg-white p-8 shadow-soft">
          {loading ? (
            <p className="text-sm text-andoya-slate">Lade Kontodaten...</p>
          ) : (
            <>
              {fetchError && <p className="text-sm text-red-600">{fetchError}</p>}
              <p className="text-sm font-medium text-andoya-ink">Abo-Status</p>
              <p className="mt-1 text-sm leading-relaxed text-andoya-slate">{aboText}</p>
              {session?.user?.email && (
                <p className="mt-4 text-xs text-andoya-slate">
                  Eingeloggt als <span className="font-medium text-andoya-ink">{session.user.email}</span>
                </p>
              )}
            </>
          )}

          <div className="mt-6 flex flex-col gap-3">
            <button
              type="button"
              disabled={portalLoading || !row?.stripe_customer_id}
              onClick={() => void handlePortal()}
              className="w-full rounded-xl bg-[#835baf] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {portalLoading ? "Wird geöffnet…" : "Abo verwalten"}
            </button>
            {portalError && <p className="text-center text-xs text-red-600">{portalError}</p>}
            {!row?.stripe_customer_id && !loading && (
              <p className="text-center text-xs text-andoya-slate">
                Kundenportal ist verfügbar, sobald ein Stripe-Kunde verknüpft ist.
              </p>
            )}

            <button
              type="button"
              disabled={passwordLoading || !session?.user?.email}
              onClick={() => void handlePasswordReset()}
              className="w-full rounded-xl border border-[#835baf] bg-white px-4 py-2.5 text-sm font-semibold text-[#835baf] transition hover:bg-andoya-cream disabled:opacity-50"
            >
              {passwordLoading ? "Senden…" : "Passwort ändern"}
            </button>
            {passwordError && <p className="text-center text-xs text-red-600">{passwordError}</p>}
            {passwordInfo && <p className="text-center text-xs text-[#4b7e76]">{passwordInfo}</p>}

            <a
              href="mailto:hallo@andoya.app"
              className="block text-center text-sm font-semibold text-[#835baf] underline-offset-2 hover:underline"
            >
              Kontakt
            </a>

            <button
              type="button"
              onClick={() => void onLogout()}
              className="mt-2 w-full rounded-xl bg-andoya-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Abmelden
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
