import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import LandingPage from "./LandingPage";
import MeineNotizen from "./MeineNotizen";
import {
  BookmarkPlus,
  BookOpen,
  Compass,
  Landmark,
  Leaf,
  Lightbulb,
  MapPin,
  MessageCircle,
  ScrollText,
  Sparkles,
  Users,
  UtensilsCrossed
} from "lucide-react";

const countries = ["Italien", "Spanien", "Griechenland", "Portugal", "Dänemark"];
const progressTable = "user_progress";
const notesTable = "notizen";
const subscriptionsTable = "subscriptions";

const stripeMonthlyPrice = import.meta.env.VITE_STRIPE_MONTHLY_PRICE || "";
const stripeYearlyPrice = import.meta.env.VITE_STRIPE_YEARLY_PRICE || "";
const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY || "";

const countryImageSlug = {
  Italien: "italien",
  Spanien: "spanien",
  Griechenland: "griechenland",
  Portugal: "portugal",
  Dänemark: "daenemark"
};

const categoryImageSlug = {
  Sprache: "sprache",
  Natur: "natur",
  Kultur: "kultur",
  Essen: "essen",
  "Insider-Tipps": "tipps",
  Geschichte: "geschichte",
  Menschen: "menschen"
};

function getCountryBaseImage(country) {
  const slug = countryImageSlug[country];
  return slug ? `/images/${slug}.jpg` : "";
}

function getCountryCategoryImage(country, category) {
  const countrySlug = countryImageSlug[country];
  const categorySlug = categoryImageSlug[category];
  if (!countrySlug || !categorySlug) return "";
  return `/images/${countrySlug}_${categorySlug}.jpg`;
}

function getCategoryIcon(category) {
  const icons = {
    Sprache: MessageCircle,
    Natur: Leaf,
    Kultur: Landmark,
    Essen: UtensilsCrossed,
    "Insider-Tipps": Compass,
    Geschichte: ScrollText,
    Menschen: Users
  };

  return icons[category] || BookOpen;
}
const categoryCycle = [
  "Sprache",
  "Natur",
  "Kultur",
  "Essen",
  "Insider-Tipps",
  "Geschichte",
  "Menschen"
];

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function normalizeLabel(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "");
}

function toDateOnlyValue(date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function safeDay(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 1;
  return Math.max(1, Math.floor(parsed));
}

function mapAuthErrorToGerman(message) {
  const text = String(message || "").toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "E-Mail oder Passwort ist nicht korrekt.";
  }
  if (text.includes("email not confirmed")) {
    return "Bitte bestaetige zuerst deine E-Mail-Adresse.";
  }
  if (text.includes("user already registered")) {
    return "Diese E-Mail-Adresse ist bereits registriert.";
  }
  if (text.includes("password should be at least")) {
    return "Das Passwort ist zu kurz. Bitte waehle ein sicheres Passwort.";
  }
  if (text.includes("unable to validate email address")) {
    return "Bitte gib eine gueltige E-Mail-Adresse ein.";
  }
  return "Anmeldung oder Registrierung fehlgeschlagen. Bitte pruefe deine Eingaben.";
}

function hasSubscriptionAccess(subscription) {
  if (!subscription) return false;
  return subscription.status === "trialing" || subscription.status === "active";
}

function AuthScreen({ initialMode = "login", onBack }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authInfo, setAuthInfo] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) {
      setAuthError("Supabase ist nicht konfiguriert.");
      setAuthInfo("");
      return;
    }

    setAuthError("");
    setAuthInfo("");
    setAuthLoading(true);

    const action =
      mode === "login"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;
    if (error) {
      setAuthError(mapAuthErrorToGerman(error.message));
      setAuthLoading(false);
      return;
    }

    if (mode === "register") {
      setAuthInfo("Fast geschafft! Bitte bestaetige deine E-Mail-Adresse um fortzufahren.");
    }

    setAuthLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-4xl bg-white p-8 shadow-soft">
        {onBack && (
          <div className="mb-3">
            <button
              type="button"
              onClick={onBack}
              className="rounded-full bg-andoya-cream px-3 py-1 text-xs font-medium text-[#835baf]"
            >
              Zurück
            </button>
          </div>
        )}
        <div className="flex flex-col items-center">
          <img src="/Logo_Andoya1.png" alt="Andoya Logo" className="h-20 w-auto" />
          <h1 className="mt-4 text-2xl font-semibold text-andoya-ink">Willkommen bei Andoya</h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-[#835baf]">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#835baf] bg-white px-3 py-2 text-sm text-andoya-ink outline-none ring-[#835baf] transition focus:ring-2"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-[#835baf]">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#835baf] bg-white px-3 py-2 text-sm text-andoya-ink outline-none ring-[#835baf] transition focus:ring-2"
            />
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full rounded-xl bg-andoya-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
          >
            {mode === "login" ? "Anmelden" : "Registrieren"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-andoya-slate">
          {mode === "login" ? "Noch kein Konto?" : "Schon ein Konto?"}{" "}
          <button
            type="button"
            className="font-semibold text-[#835baf]"
            onClick={() => {
              setMode((prev) => (prev === "login" ? "register" : "login"));
              setAuthError("");
              setAuthInfo("");
            }}
          >
            {mode === "login" ? "Registrieren" : "Anmelden"}
          </button>
        </p>

        {authError && <p className="mt-3 text-center text-sm text-[#c0392b]">{authError}</p>}
        {authInfo && <p className="mt-3 text-center text-sm text-[#4b7e76]">{authInfo}</p>}
      </section>
    </main>
  );
}

function UpgradeScreen({ session, subscription, onCheckout }) {
  const searchParams = new URLSearchParams(window.location.search);
  const checkoutSuccess = searchParams.get("success") === "true";
  const checkoutCanceled = searchParams.get("canceled") === "true";

  return (
    <main className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <div className="rounded-4xl bg-white p-8 shadow-soft md:p-10">
          <h1 className="text-3xl font-bold text-andoya-ink md:text-4xl">Andoya Premium</h1>
          <p className="mt-3 text-sm leading-relaxed text-andoya-slate md:text-base">
            Starte jetzt 7 Tage kostenlos - kein Risiko, jederzeit kündbar. Entdecke jeden Tag
            interessante Fakten zu deinem nächsten Reiseziel.
          </p>

          {subscription && (
            <p className="mt-4 text-sm text-[#4b7e76]">
              Aktueller Status: {subscription.status}
            </p>
          )}

          {checkoutSuccess && (
            <p className="mt-4 rounded-xl bg-[#e8f4f4] px-4 py-2 text-sm text-[#4b7e76]">
              Willkommen bei Andoya Premium!
            </p>
          )}

          {checkoutCanceled && (
            <p className="mt-4 rounded-xl bg-[#fef3e8] px-4 py-2 text-sm text-andoya-ink">
              Zahlung abgebrochen
            </p>
          )}

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <button
              type="button"
              onClick={() => onCheckout(stripeMonthlyPrice)}
              className="rounded-2xl bg-[#835baf] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Monatlich €4,99
            </button>
            <button
              type="button"
              onClick={() => onCheckout(stripeYearlyPrice)}
              className="rounded-2xl bg-andoya-ink px-5 py-3 text-sm font-semibold text-white transition hover:opacity-95"
            >
              Jährlich €39,99
            </button>
          </div>
          <p className="mt-4 text-xs text-andoya-slate">
            Eingeloggt als {session?.user?.email || "Unbekannt"}.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [activePage, setActivePage] = useState("main");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [noteInfo, setNoteInfo] = useState("");
  const [progressByCountry, setProgressByCountry] = useState({});
  const [subscription, setSubscription] = useState(null);
  const [subscriptionReady, setSubscriptionReady] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const todayDate = useMemo(() => toDateOnlyValue(new Date()), []);
  const currentDay = useMemo(() => {
    if (!selectedCountry) return 1;
    const progress = progressByCountry[selectedCountry];
    if (!progress) return 1;

    return safeDay(progress.aktueller_tag);
  }, [selectedCountry, progressByCountry]);
  const [viewedDay, setViewedDay] = useState(1);

  const getCategoryForDay = (day) => categoryCycle[(day - 1) % categoryCycle.length];
  const getDbWeekStartDay = (day) => Math.floor((day - 1) / 7) * 7 + 1;

  const viewedCategory = useMemo(
    () => getCategoryForDay(viewedDay),
    [viewedDay]
  );

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session ?? null);
      setAuthReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadSubscription() {
      if (!supabase || !session?.user?.id) {
        setSubscription(null);
        setSubscriptionReady(true);
        return;
      }

      setSubscriptionReady(false);
      const { data, error: subscriptionError } = await supabase
        .from(subscriptionsTable)
        .select("id,status,trial_end")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (subscriptionError) {
        setSubscription(null);
        setSubscriptionReady(true);
        return;
      }

      setSubscription(Array.isArray(data) && data.length > 0 ? data[0] : null);
      setSubscriptionReady(true);
    }

    loadSubscription();
  }, [session]);

  useEffect(() => {
    async function loadProgress() {
      if (!supabase || !session?.user?.id) {
        setProgressByCountry({});
        return;
      }

      const { data, error: progressError } = await supabase
        .from(progressTable)
        .select("id,land,aktueller_tag,letztes_datum")
        .eq("user_id", session.user.id);

      if (progressError) {
        return;
      }

      const nextProgress = {};
      for (const row of data ?? []) {
        if (row.land) {
          nextProgress[row.land] = {
            id: row.id,
            aktueller_tag: safeDay(row.aktueller_tag ?? 1),
            letztes_datum: row.letztes_datum ?? null
          };
        }
      }

      setProgressByCountry(nextProgress);
      if (!selectedCountry) {
        const firstCountry = Object.keys(nextProgress)[0] || "";
        setSelectedCountry(firstCountry);
      }
    }

    loadProgress();
  }, [session]);

  useEffect(() => {
    async function syncCountryProgress() {
      const user = session?.user;
      if (!supabase) return;
      if (!user?.id) return;
      if (!selectedCountry) return;

      const existing = progressByCountry[selectedCountry];
      if (!existing) {
        const { data, error } = await supabase
          .from(progressTable)
          .insert({
            user_id: user.id,
            land: selectedCountry,
            aktueller_tag: 1,
            letztes_datum: todayDate
          })
          .select("id,land,aktueller_tag,letztes_datum")
          .single();

        if (error) return;
        setProgressByCountry((prev) => ({
          ...prev,
          [selectedCountry]: {
            id: data.id,
            aktueller_tag: safeDay(data.aktueller_tag ?? 1),
            letztes_datum: data.letztes_datum ?? todayDate
          }
        }));
        return;
      }

      if (existing.letztes_datum && existing.letztes_datum < todayDate) {
        const nextDay = safeDay(existing.aktueller_tag) + 1;
        const { error: updateError } = await supabase
          .from(progressTable)
          .update({
            aktueller_tag: nextDay,
            letztes_datum: todayDate
          })
          .eq("id", existing.id)
          .eq("user_id", user.id);

        if (updateError) return;
        setProgressByCountry((prev) => ({
          ...prev,
          [selectedCountry]: {
            ...existing,
            aktueller_tag: nextDay,
            letztes_datum: todayDate
          }
        }));
      }
    }

    syncCountryProgress();
  }, [selectedCountry, session, progressByCountry, todayDate]);

  useEffect(() => {
    setViewedDay(currentDay);
  }, [selectedCountry, currentDay]);

  useEffect(() => {
    let active = true;

    async function fetchLessons() {
      if (!supabase || !selectedCountry) {
        setLessons([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("lessons")
        .select("*")
        .eq("country", selectedCountry)
        .order("day", { ascending: true });

      if (!active) return;
      if (fetchError) {
        setError(fetchError.message);
        setLessons([]);
        setIsLoading(false);
        return;
      }

      setLessons(Array.isArray(data) ? data : []);
      setIsLoading(false);
    }

    fetchLessons();
    return () => {
      active = false;
    };
  }, [selectedCountry]);

  const lessonForAppDay = (day) => {
    const categoryNormalized = normalizeLabel(getCategoryForDay(day));
    const weekStartDay = getDbWeekStartDay(day);
    return (
      lessons.find(
        (lesson) =>
          Number(lesson.day) === weekStartDay &&
          normalizeLabel(lesson.cat) === categoryNormalized
      ) || null
    );
  };

  const pastLessons = useMemo(
    () => {
      if (viewedDay <= 1) return [];
      return Array.from({ length: viewedDay - 1 }, (_, index) => index + 1)
        .map((day) => {
          const lesson = lessonForAppDay(day);
          if (!lesson) return null;
          return {
            ...lesson,
            appDay: day,
            appCategory: getCategoryForDay(day)
          };
        })
        .filter(Boolean)
        .reverse();
    },
    [lessons, viewedDay]
  );

  const selectedLesson = useMemo(() => lessonForAppDay(viewedDay), [lessons, viewedDay]);

  const heroImageSrc = useMemo(
    () => getCountryCategoryImage(selectedCountry, viewedCategory),
    [selectedCountry, viewedCategory]
  );
  const heroFallbackSrc = useMemo(
    () => getCountryBaseImage(selectedCountry),
    [selectedCountry]
  );

  if (!authReady) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-andoya-slate">Lade Andoya...</p>
      </main>
    );
  }

  if (!session) {
    if (authMode === "login" || authMode === "register") {
      return (
        <AuthScreen
          initialMode={authMode}
          onBack={() => setAuthMode(null)}
        />
      );
    }
    return (
      <LandingPage
        onLogin={() => setAuthMode("login")}
        onRegister={() => setAuthMode("register")}
      />
    );
  }

  if (!subscriptionReady) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-andoya-slate">Prüfe Abo-Status...</p>
      </main>
    );
  }

  async function handleCheckout(priceId) {
    if (!stripePublicKey) {
      setCheckoutError("Stripe Public Key fehlt.");
      return;
    }
    if (!priceId) {
      setCheckoutError("Preis ist nicht konfiguriert.");
      return;
    }
    setCheckoutError("");

    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user.id,
        email: session.user.email,
        priceId
      })
    });

    const result = await response.json();
    if (!response.ok || !result?.url) {
      setCheckoutError(result?.error || "Checkout konnte nicht gestartet werden.");
      return;
    }

    window.location.href = result.url;
  }

  if (!hasSubscriptionAccess(subscription)) {
    return (
      <>
        <UpgradeScreen session={session} subscription={subscription} onCheckout={handleCheckout} />
        {checkoutError && (
          <p className="pb-8 text-center text-sm text-red-600">{checkoutError}</p>
        )}
      </>
    );
  }

  if (activePage === "notes") {
    return (
      <MeineNotizen
        supabase={supabase}
        session={session}
        countries={countries}
        onBack={() => setActivePage("main")}
      />
    );
  }

  async function handleLogout() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setAuthMode(null);
    setActivePage("main");
    setSelectedCountry("");
    setProgressByCountry({});
    setLessons([]);
  }

  async function handleSaveNote(sectionLabel, content) {
    if (!supabase || !session?.user?.id || !selectedCountry || !content) return;

    const { error: noteError } = await supabase.from(notesTable).insert({
      user_id: session.user.id,
      land: selectedCountry,
      typ: "gespeichert",
      inhalt: content,
      quelle: `Tag ${viewedDay} · ${sectionLabel}`,
      erstellt_am: new Date().toISOString()
    });

    if (noteError) {
      setNoteInfo("Notiz konnte nicht gespeichert werden.");
      return;
    }

    setNoteInfo(`"${sectionLabel}" als Notiz gespeichert.`);
    window.setTimeout(() => setNoteInfo(""), 2500);
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setActivePage("notes")}
            className="mr-2 rounded-full bg-white px-3 py-1 text-xs font-medium text-[#835baf] shadow-soft"
          >
            Meine Notizen
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[#835baf] shadow-soft"
          >
            Logout
          </button>
        </div>

        <section className="space-y-4 pt-2">
          <h1 className="text-2xl font-semibold leading-tight text-andoya-ink md:text-3xl">
            Dein täglicher Fernweh-Moment
          </h1>

          <div className="max-w-md space-y-2">
            <label htmlFor="country" className="text-sm font-semibold text-[#835baf]">
              Reiseziel
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(event) => setSelectedCountry(event.target.value)}
              className="w-full rounded-2xl border border-andoya-violet bg-white px-4 py-2.5 text-sm font-medium text-andoya-ink outline-none ring-andoya-violet transition focus:ring-2"
            >
              <option value="">Wähle dein Reiseziel ✈</option>
              {countries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {selectedCountry && (
            <div className="relative mt-3 max-w-4xl overflow-hidden rounded-4xl shadow-soft md:aspect-[21/9] md:min-h-[200px] min-h-[180px]">
              <img
                src={heroImageSrc || heroFallbackSrc}
                alt={selectedCountry}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  if (heroFallbackSrc && event.currentTarget.src !== new URL(heroFallbackSrc, window.location.origin).href) {
                    event.currentTarget.src = heroFallbackSrc;
                  }
                }}
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)"
                }}
                aria-hidden
              />
              <div className="absolute inset-x-0 bottom-0 px-6 pb-5 pt-16 md:px-10 md:pb-7">
                <p className="text-3xl font-bold tracking-tight text-white drop-shadow-sm md:text-4xl">
                  {selectedCountry}
                </p>
              </div>
            </div>
          )}

          {selectedCountry && (
            <p className="text-sm font-medium text-[#835baf]">
              Tag {viewedDay} · {viewedCategory}
            </p>
          )}
        </section>

        <section className="space-y-5">
          <article className="rounded-4xl bg-white p-8 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#835baf]">
              Heutige Lektion
            </p>

            {isLoading ? (
              <p className="mt-4 text-sm text-andoya-slate">Lektionen werden geladen...</p>
            ) : error ? (
              <p className="mt-4 text-sm text-red-600">Fehler: {error}</p>
            ) : !selectedCountry ? (
              <p className="mt-4 text-sm text-andoya-slate">
                Wähle ein Reiseziel, um deine heutige Lektion zu sehen.
              </p>
            ) : selectedLesson ? (
              <div className="mt-5 space-y-5">
                <div>
                  <h2 className="text-3xl font-bold text-andoya-ink">{selectedLesson.title}</h2>
                </div>

                <div className="rounded-3xl bg-[#f0ebf8] p-4">
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={15} className="text-[#835baf]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                        Einstieg
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveNote("Einstieg", selectedLesson.hook)}
                      className="rounded-md p-1 text-[#835baf] transition hover:bg-white/60"
                      aria-label="Einstieg speichern"
                    >
                      <BookmarkPlus size={15} />
                    </button>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-andoya-slate">
                    {selectedLesson.hook}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <BookOpen size={15} className="text-[#835baf]" />
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                        Inhalt
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveNote("Inhalt", selectedLesson.main)}
                      className="rounded-md p-1 text-[#835baf] transition hover:bg-[#f0ebf8]"
                      aria-label="Inhalt speichern"
                    >
                      <BookmarkPlus size={15} />
                    </button>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-andoya-slate">
                    {selectedLesson.main}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-3xl bg-[#e8f4f4] p-4">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb size={15} className="text-[#835baf]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                          Fakt
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSaveNote("Fakt", selectedLesson.keyfact)}
                        className="rounded-md p-1 text-[#835baf] transition hover:bg-white/60"
                        aria-label="Fakt speichern"
                      >
                        <BookmarkPlus size={15} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-andoya-slate">
                      {selectedLesson.keyfact}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-[#c6d5e6] p-4">
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <MapPin size={15} className="text-[#835baf]" />
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                          Tipp
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSaveNote("Tipp", selectedLesson.tip)}
                        className="rounded-md p-1 text-[#835baf] transition hover:bg-white/50"
                        aria-label="Tipp speichern"
                      >
                        <BookmarkPlus size={15} />
                      </button>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-andoya-slate">
                      {selectedLesson.tip}
                    </p>
                  </div>
                </div>

                <p className="pt-2 text-center text-sm text-andoya-slate">
                  🌍 Deine nächste Lektion wartet morgen auf dich.
                </p>

                {noteInfo && (
                  <p className="text-sm font-medium text-[#4b7e76]">{noteInfo}</p>
                )}

                <div className="flex items-center justify-center gap-3 pt-2">
                  {viewedDay > 1 && (
                    <button
                      type="button"
                      onClick={() => setViewedDay((day) => Math.max(1, day - 1))}
                      className="rounded-full bg-[#4b7e76] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      ← Vorherige
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-andoya-slate">
                Keine passende Lektion für heute gefunden.
              </p>
            )}
          </article>

          {pastLessons.length > 0 && (
            <aside className="rounded-4xl bg-white p-8 shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#835baf]">
                Bisherige Lektionen
              </p>

              <div className="mt-5 max-h-[540px] space-y-3 overflow-auto pr-1">
                {pastLessons.map((lesson) => {
                  const CategoryIcon = getCategoryIcon(lesson.appCategory);
                  return (
                  <button
                    key={`${lesson.id}-${lesson.appDay}`}
                    type="button"
                    onClick={() => setViewedDay(lesson.appDay)}
                    className={`flex w-full items-center gap-3 rounded-3xl border px-4 py-3 text-left transition ${
                      viewedDay === lesson.appDay
                        ? "border-andoya-violet bg-andoya-mint"
                        : "border-transparent bg-andoya-cream hover:border-andoya-pink"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#f0ebf8]">
                      <CategoryIcon size={20} className="text-[#835baf]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#835baf]">
                        Tag {lesson.appDay} - {lesson.appCategory}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-andoya-ink">
                        {lesson.title}
                      </p>
                    </div>
                  </button>
                  );
                })}
              </div>
            </aside>
          )}
        </section>
      </div>
    </main>
  );
}
