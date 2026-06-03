import { useState } from "react";

const GOLD       = "#c9a84c";
const GOLD_MUTED = "rgba(201,168,76,0.75)";
const BG         = "#080808";

const NAV_LINKS = ["Features", "Screenshots", "Pricing", "Waitlist"] as const;

const FEATURES = [
  {
    icon: "⚡",
    title: "Live Match Centre",
    body: "Real-time player scores updated as games progress. Head-to-head match scoring with full player breakdowns — every point accounted for, round by round.",
  },
  {
    icon: "🔄",
    title: "Trade Centre",
    body: "Full trade negotiation with counter-offers, multi-team deals, and draft pick trading. Every accepted trade posts automatically to your league feed and is logged in the permanent trade history.",
  },
  {
    icon: "🎯",
    title: "Auction Room",
    body: "Silent auction system for player acquisition. Hosts list players or picks, rivals bid with their own assets, and the commissioner settles. Bonus auctions and weekly rotation built in.",
  },
  {
    icon: "📋",
    title: "Draft Hub",
    body: "Live draft room with a complete pick ownership tracker. Trade future picks, see who holds what across every round, and manage your primary and rookie lists in one place.",
  },
  {
    icon: "📊",
    title: "Stats & Trade History",
    body: "Round-by-round player score history for every team across the full season. Track averages, spot value, and browse a complete log of every trade your league has ever completed.",
  },
  {
    icon: "📰",
    title: "Custom Media Hub",
    body: "Your league's own news outlet with a custom masthead. Publish match reports, hot takes, and trade analysis under your team's persona. Full rich-text posting with images.",
  },
  {
    icon: "🏆",
    title: "Best & Fairest",
    body: "Club B&F votes auto-calculated each round from real AFL award data. Full leaderboard, coach voting tools, and season trophies built in.",
  },
  {
    icon: "📱",
    title: "Mobile App",
    body: "Install directly to your home screen on iPhone or Android — no App Store required. Push notifications for trades, auctions, and match events keep you in the loop all season.",
  },
  {
    icon: "🏈",
    title: "Real Squads. Real Positions.",
    body: "Your roster mirrors a real AFL list — primary and rookie designations, position-locked lineups (DEF, MID, RUC, FWD, KPD, KPF), and a bench structure that matches how the game is actually played.",
  },
  {
    icon: "⚙️",
    title: "Customisable Rules",
    body: "Bench size, scoring format, trade rules, draft structure — configure your league the way you've always run it. Dynasty Live HQ flexes to your rules, not the other way around.",
  },
  {
    icon: "🌐",
    title: "Custom Domain",
    body: "Your league runs on its own web address. Premium leagues get a fully branded URL (e.g. yourleague.com.au) so it feels like yours — because it is.",
  },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Register your league", body: "Tell us your league name, number of teams, and format. Already running a league elsewhere? Import your full roster with a CSV and we'll migrate everything — history and all." },
  { step: "02", title: "Invite your coaches", body: "Each coach gets their own login and team dashboard. Rosters, lineups, bids, and trades are locked to their account with role-based permissions." },
  { step: "03", title: "Run your season", body: "Live scores, trades, auctions, draft, media, and stats — all in one platform, all season long. Runs beautifully on mobile and desktop." },
];

const STANDARD_FEATURES = [
  "Live scoring & match centre",
  "Automatic late-out substitutions",
  "Trade centre with counter-offers & pick trading",
  "Trade history — permanent log of every deal",
  "Ladder, fixtures & head-to-head match view",
  "Roster management (primary & rookie lists)",
  "Round-by-round player stats & averages",
  "Player profiles with SC price & contract status",
  "Injury tracker & confirmed selection dots",
  "Push notifications (mobile & desktop)",
  "Mobile app — install to home screen",
  "League feed & activity log",
  "Shared Dynasty Live HQ subdomain",
];

const PREMIUM_FEATURES = [
  "Everything in Standard",
  "Auction Room — silent bidding system",
  "Custom media hub with your own masthead",
  "Draft Hub with live draft room",
  "Best & Fairest awards & leaderboard",
  "Custom domain (yourleague.com.au)",
  "Full league branding & colour scheme",
  "Priority onboarding & setup support",
];

type FormStatus = "idle" | "loading" | "success" | "error";

function CheckMark({ gold = false }: { gold?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={GOLD} fillOpacity={gold ? 0.18 : 0.1} />
      <path d="M4.5 7.5 6.5 9.5 10.5 5.5" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HamburgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <line x1="3" y1={open ? "11" : "6"} x2="19" y2={open ? "11" : "6"}
        stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"
        style={{ transformOrigin: "center", transform: open ? "rotate(45deg)" : "none", transition: "all 0.2s" }} />
      {!open && <line x1="3" y1="11" x2="19" y2="11" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />}
      <line x1="3" y1={open ? "11" : "16"} x2="19" y2={open ? "11" : "16"}
        stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round"
        style={{ transformOrigin: "center", transform: open ? "rotate(-45deg)" : "none", transition: "all 0.2s" }} />
    </svg>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 6, fontSize: 14,
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", outline: "none",
};

/* ── Screenshot placeholder — replace src with real images ── */
function DesktopFrame({ src, alt }: { src?: string; alt: string }) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 780 }}>
      {/* Monitor bezel */}
      <div style={{
        background: "linear-gradient(160deg, #1e1e1e 0%, #141414 100%)",
        borderRadius: 14, padding: "10px 10px 0", border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 80px rgba(0,0,0,0.7)",
      }}>
        {/* Browser chrome */}
        <div style={{
          background: "#0d0d0d", borderRadius: "6px 6px 0 0", height: 32,
          display: "flex", alignItems: "center", padding: "0 12px", gap: 6,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}>
          {["#ff5f57","#febc2e","#28c840"].map(c => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />
          ))}
          <div style={{
            flex: 1, height: 16, marginLeft: 10, borderRadius: 4,
            background: "rgba(255,255,255,0.06)", maxWidth: 240,
          }} />
        </div>
        {/* Screen */}
        <div style={{
          width: "100%", aspectRatio: "16/9", overflow: "hidden",
          background: src ? "transparent" : "#111827",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {src ? (
            <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8, opacity: 0.2 }}>🖥️</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                {alt}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Stand */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 60, height: 18, background: "#1a1a1a", borderRadius: "0 0 4px 4px", borderTop: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: 120, height: 6, background: "#1a1a1a", borderRadius: 3 }} />
      </div>
    </div>
  );
}

function PhoneFrame({ src, alt }: { src?: string; alt: string }) {
  return (
    <div style={{
      width: 200, flexShrink: 0,
      background: "linear-gradient(160deg, #1c1c1e 0%, #141414 100%)",
      borderRadius: 34, padding: "10px 6px",
      border: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
    }}>
      {/* Notch */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
        <div style={{ width: 70, height: 18, background: "#0d0d0d", borderRadius: 20 }} />
      </div>
      {/* Screen */}
      <div style={{
        width: "100%", aspectRatio: "9/19.5", borderRadius: 22, overflow: "hidden",
        background: src ? "transparent" : "#0f172a",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {src ? (
          <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div style={{ textAlign: "center", padding: 12 }}>
            <div style={{ fontSize: 22, marginBottom: 6, opacity: 0.2 }}>📱</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.6 }}>
              {alt}
            </div>
          </div>
        )}
      </div>
      {/* Home bar */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.15)", borderRadius: 2 }} />
      </div>
    </div>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail]   = useState("");
  const [league, setLeague] = useState("");
  const [teams, setTeams]   = useState("");
  const [tier, setTier]     = useState("");
  const [wlStatus, setWlStatus] = useState<FormStatus>("idle");
  const [ctName, setCtName]       = useState("");
  const [ctEmail, setCtEmail]     = useState("");
  const [ctMessage, setCtMessage] = useState("");
  const [ctStatus, setCtStatus]   = useState<FormStatus>("idle");

  async function submitForm(body: object, setStatus: (s: FormStatus) => void) {
    setStatus("loading");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/waitlist-signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm({ type: "waitlist", email, league_name: league, team_count: teams || null, tier: tier || null }, setWlStatus);
  };

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault();
    submitForm({ type: "contact", email: ctEmail, name: ctName, message: ctMessage }, setCtStatus);
  };

  const SectionEyebrow = ({ text }: { text: string }) => (
    <div className="flex items-center justify-center gap-3 mb-5">
      <div className="h-px w-8" style={{ background: GOLD_MUTED }} />
      <span className="text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color: GOLD_MUTED }}>{text}</span>
      <div className="h-px w-8" style={{ background: GOLD_MUTED }} />
    </div>
  );

  return (
    <div style={{ background: BG, color: "#fff", fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed inset-x-0 top-0 z-50" style={{
        background: "rgba(8,8,8,0.84)", backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div className="mx-auto max-w-7xl px-6 flex h-[62px] items-center justify-between gap-8">
          <a href="/" className="flex items-center flex-shrink-0">
            <img src="/DLHQ-logo.png" alt="Dynasty Live HQ" className="h-8 object-contain" />
          </a>
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="text-[13px] font-medium tracking-wide transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.38)", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.38)")}
              >{link}</a>
            ))}
          </div>
          <a href="#waitlist"
            className="hidden md:flex items-center px-5 py-2 rounded text-[13px] font-semibold tracking-wide transition-all hover:brightness-105 active:scale-[0.97]"
            style={{ background: GOLD, color: "#0a0a0a", flexShrink: 0, textDecoration: "none" }}
          >Join Waitlist</a>
          <button className="md:hidden p-1 -mr-1" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden px-6 pb-6 pt-2 space-y-1" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            {NAV_LINKS.map(link => (
              <a key={link} href={`#${link.toLowerCase()}`}
                className="block py-2.5 text-[14px] font-medium"
                style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}
              >{link}</a>
            ))}
            <div className="pt-3">
              <a href="#waitlist"
                className="block w-full py-3 rounded text-[14px] font-semibold tracking-wide text-center"
                style={{ background: GOLD, color: "#0a0a0a", textDecoration: "none" }}
                onClick={() => setMenuOpen(false)}
              >Join Waitlist</a>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center" style={{
        backgroundImage: "url(/DLHQ-banner.png)", backgroundSize: "cover",
        backgroundPosition: "center 30%", backgroundRepeat: "no-repeat",
      }}>
        <div className="absolute inset-0" style={{ background: "rgba(6,6,6,0.68)" }} />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(100deg, rgba(6,6,6,0.97) 0%, rgba(6,6,6,0.82) 38%, rgba(6,6,6,0.45) 65%, rgba(6,6,6,0.12) 100%)",
        }} />
        <div className="absolute bottom-0 inset-x-0 h-56 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${BG}, transparent)` }} />

        <div className="relative z-10 mx-auto max-w-7xl w-full px-6 pt-32 pb-36 md:pt-44 md:pb-48">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 flex-shrink-0" style={{ background: GOLD_MUTED }} />
              <span className="text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color: GOLD_MUTED }}>
                The home of serious AFL dynasty leagues
              </span>
            </div>
            <h1 className="text-[56px] md:text-[80px] leading-[0.95] font-black tracking-[-0.03em] text-white mb-6">
              Built for the<br />
              <span style={{ color: GOLD }}>Long Game.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.8] max-w-[500px] mb-10"
              style={{ color: "rgba(255,255,255,0.46)", fontWeight: 300 }}>
              Your league deserves better than a spreadsheet. Dynasty Live HQ is the complete platform
              for AFL dynasty and keeper leagues — real squads, real positions, your rules. Live scoring,
              trades, auctions, drafts, and a media hub your coaches will actually read. On your own
              domain, with an app on every phone.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-12">
              <a href="#waitlist"
                className="px-8 py-3 rounded text-[14px] font-semibold tracking-wide transition-all hover:brightness-108 active:scale-[0.975]"
                style={{ background: GOLD, color: "#0a0a0a", textDecoration: "none" }}
              >Join the Waitlist</a>
              <a href="#features"
                className="px-8 py-3 rounded text-[14px] font-semibold tracking-wide transition-all active:scale-[0.975]"
                style={{ color: "rgba(255,255,255,0.62)", border: "1px solid rgba(255,255,255,0.14)", textDecoration: "none" }}
                onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.88)"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.62)"; e.currentTarget.style.background = "transparent"; }}
              >See Features</a>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3">
              {[
                "Live scoring & head-to-head match centre",
                "Trade centre with full negotiation",
                "Auction room & draft hub",
                "Stats history & trade log",
                "Real squads, real positions & custom rules",
                "Mobile app & custom domain",
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckMark />
                  <span className="text-[13px] leading-[1.55]" style={{ color: "rgba(255,255,255,0.38)" }}>{f}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase" style={{ color: "rgba(255,255,255,0.18)" }}>
                Where leagues are won and lost
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: "100px 24px", background: "#0d0d0d" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <SectionEyebrow text="Everything you need" />
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">
              Built for serious leagues
            </h2>
            <p className="text-[16px] max-w-[520px] mx-auto" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              Real AFL squads. Real position rules. Your format, your scoring, your domain.
              Everything your league needs from selection night to the grand final — no spreadsheets, no group chats.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(f => (
              <div key={f.title} className="rounded-xl p-6" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <div className="text-2xl mb-4">{f.icon}</div>
                <div className="text-[15px] font-bold text-white mb-2">{f.title}</div>
                <p className="text-[13px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.38)" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCREENSHOTS ── */}
      <section id="screenshots" style={{ padding: "100px 24px", background: BG, overflow: "hidden" }}>
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <SectionEyebrow text="See it in action" />
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">
              Your league. Any device.
            </h2>
            <p className="text-[16px] max-w-[460px] mx-auto" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              A full desktop experience and a mobile app your coaches will have on their home screen
              by round one.
            </p>
          </div>

          {/* Desktop screenshot row */}
          <div className="mb-20">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 24 }}>
              Desktop — Match Centre &amp; Live Scoring
            </div>
            <div className="flex justify-center">
              {/* Replace the src prop with a real screenshot path, e.g. src="/screenshots/match-centre.png" */}
              <DesktopFrame alt="Match Centre — desktop screenshot" />
            </div>
          </div>

          <div className="mb-20">
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 24 }}>
              Desktop — Trade Centre
            </div>
            <div className="flex justify-center">
              <DesktopFrame alt="Trade Centre — desktop screenshot" />
            </div>
          </div>

          {/* Mobile screenshot row */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.2)", textAlign: "center", marginBottom: 32 }}>
              Mobile App — Install to Home Screen
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
              {/* Replace the src prop with real screenshot paths, e.g. src="/screenshots/mobile-home.png" */}
              <PhoneFrame alt="Home — live scores" />
              <PhoneFrame alt="Match Centre — mobile" />
              <PhoneFrame alt="Trade Centre — mobile" />
              <PhoneFrame alt="Auction Room — mobile" />
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.18)", marginTop: 28, lineHeight: 1.8 }}>
              Works on iPhone and Android. Install via the browser — no App Store required.
              Push notifications for trades, auctions, and match events.
            </p>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: "100px 24px", background: "#0d0d0d" }}>
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <SectionEyebrow text="Plans" />
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">
              Two tiers. One platform.
            </h2>
            <p className="text-[16px] max-w-[440px] mx-auto" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              Every league is different. Pick the tier that fits yours.
              Pricing announced before the 2027 season.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Standard */}
            <div className="rounded-2xl p-8 flex flex-col" style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.09)",
            }}>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
                  Standard
                </span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
                TBA
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 28, lineHeight: 1.6 }}>
                per league · per season<br />
                Pricing confirmed before launch
              </div>
              <div style={{ flex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 24, marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 16 }}>
                  What's included
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {STANDARD_FEATURES.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckMark />
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.55 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="#waitlist"
                className="block w-full py-3 rounded text-[14px] font-semibold tracking-wide text-center transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                Join Waitlist
              </a>
            </div>

            {/* Premium */}
            <div className="rounded-2xl p-8 flex flex-col relative overflow-hidden" style={{
              background: "rgba(201,168,76,0.05)",
              border: `1px solid ${GOLD}44`,
            }}>
              {/* Glow */}
              <div style={{
                position: "absolute", top: -60, right: -60, width: 220, height: 220,
                borderRadius: "50%", background: `radial-gradient(circle, ${GOLD}18 0%, transparent 70%)`,
                pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD_MUTED }}>
                  Premium
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase",
                  background: `${GOLD}22`, color: GOLD, borderRadius: 99, padding: "3px 10px",
                  border: `1px solid ${GOLD}44`,
                }}>
                  Recommended
                </span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
                TBA
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 28, lineHeight: 1.6 }}>
                per league · per season<br />
                Pricing confirmed before launch
              </div>
              <div style={{ flex: 1, borderTop: `1px solid ${GOLD}22`, paddingTop: 24, marginBottom: 28 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD_MUTED, marginBottom: 16 }}>
                  What's included
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {PREMIUM_FEATURES.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <CheckMark gold />
                      <span style={{ fontSize: 13, color: f === "Everything in Standard" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.65)", lineHeight: 1.55, fontWeight: f === "Everything in Standard" ? 400 : 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <a href="#waitlist"
                className="block w-full py-3 rounded text-[14px] font-semibold tracking-wide text-center transition-all hover:brightness-105 active:scale-[0.98]"
                style={{ background: GOLD, color: "#0a0a0a", textDecoration: "none" }}
              >
                Join Waitlist
              </a>
            </div>

          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.2)", marginTop: 32, lineHeight: 1.8 }}>
            All plans include the full setup, coach onboarding, and season-long support.
            Not sure which tier? Register your interest and we'll help you pick.
          </p>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: BG }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <SectionEyebrow text="Simple setup" />
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">Up and running in minutes</h2>
            <p className="text-[15px] max-w-[400px] mx-auto" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              We handle the setup. You run the league.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(item => (
              <div key={item.step} className="text-center">
                <div className="text-[48px] font-black mb-4 leading-none" style={{ color: "rgba(201,168,76,0.15)" }}>{item.step}</div>
                <div className="text-[16px] font-bold text-white mb-3">{item.title}</div>
                <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.38)" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section id="waitlist" style={{ padding: "100px 24px", background: "#0d0d0d" }}>
        <div className="mx-auto max-w-lg text-center">
          <SectionEyebrow text="Early access" />
          <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">Get early access</h2>
          <p className="text-[15px] mb-4" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
            Dynasty Live HQ launches for the 2027 AFL season. Register your league now and we'll
            be in touch before general release — including an early-access discount.
          </p>
          <div className="flex items-center gap-3 mb-10 justify-center">
            <div style={{ height: 1, width: 32, background: "rgba(201,168,76,0.3)" }} />
            <span className="text-[13px]" style={{ color: "rgba(201,168,76,0.7)" }}>
              Already running a league? Full CSV import — your rosters move with you.
            </span>
            <div style={{ height: 1, width: 32, background: "rgba(201,168,76,0.3)" }} />
          </div>
          {wlStatus === "success" ? (
            <div className="rounded-xl p-8" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="text-2xl mb-3">✓</div>
              <div className="text-[16px] font-semibold text-white mb-1">You're on the list</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>We'll be in touch before launch.</p>
            </div>
          ) : (
            <form onSubmit={handleWaitlist} className="text-left space-y-3">
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Email *</label>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>League Name</label>
                <input type="text" value={league} onChange={e => setLeague(e.target.value)} placeholder="e.g. Western Suburbs Supercoach" style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Number of Teams</label>
                <select value={teams} onChange={e => setTeams(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#1a1a1a" }}>Select…</option>
                  {[8, 10, 12, 14, 16, 18].map(n => (
                    <option key={n} value={n} style={{ background: "#1a1a1a" }}>{n} teams</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Interested in</label>
                <select value={tier} onChange={e => setTier(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="" style={{ background: "#1a1a1a" }}>Select a tier…</option>
                  <option value="standard" style={{ background: "#1a1a1a" }}>Standard</option>
                  <option value="premium" style={{ background: "#1a1a1a" }}>Premium</option>
                  <option value="unsure" style={{ background: "#1a1a1a" }}>Not sure yet</option>
                </select>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={wlStatus === "loading"}
                  className="w-full py-3 rounded text-[14px] font-semibold tracking-wide transition-all hover:brightness-105 active:scale-[0.98]"
                  style={{ background: GOLD, color: "#0a0a0a", opacity: wlStatus === "loading" ? 0.7 : 1, cursor: wlStatus === "loading" ? "default" : "pointer" }}>
                  {wlStatus === "loading" ? "Registering…" : "Register My League"}
                </button>
              </div>
              {wlStatus === "error" && (
                <p className="text-[13px] text-center pt-1" style={{ color: "#f87171" }}>Something went wrong — try again or email us directly.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: "100px 24px", background: BG }}>
        <div className="mx-auto max-w-lg text-center">
          <SectionEyebrow text="Get in touch" />
          <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">Questions?</h2>
          <p className="text-[15px] mb-10" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
            Have a specific format in mind, want a demo, or just want to know more?
            Send us a message.
          </p>
          {ctStatus === "success" ? (
            <div className="rounded-xl p-8" style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <div className="text-2xl mb-3">✓</div>
              <div className="text-[16px] font-semibold text-white mb-1">Message received</div>
              <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.4)" }}>We'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleContact} className="text-left space-y-3">
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Name</label>
                <input type="text" value={ctName} onChange={e => setCtName(e.target.value)} placeholder="Your name" style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Email *</label>
                <input type="email" required value={ctEmail} onChange={e => setCtEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </div>
              <div>
                <label className="block text-[12px] font-semibold tracking-wide mb-1.5 uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Message *</label>
                <textarea required rows={4} value={ctMessage} onChange={e => setCtMessage(e.target.value)}
                  placeholder="Tell us about your league…" style={{ ...inputStyle, resize: "vertical" }} />
              </div>
              <div className="pt-2">
                <button type="submit" disabled={ctStatus === "loading"}
                  className="w-full py-3 rounded text-[14px] font-semibold tracking-wide transition-all hover:brightness-105 active:scale-[0.98]"
                  style={{ background: GOLD, color: "#0a0a0a", opacity: ctStatus === "loading" ? 0.7 : 1, cursor: ctStatus === "loading" ? "default" : "pointer" }}>
                  {ctStatus === "loading" ? "Sending…" : "Send Message"}
                </button>
              </div>
              {ctStatus === "error" && (
                <p className="text-[13px] text-center pt-1" style={{ color: "#f87171" }}>Something went wrong — try again.</p>
              )}
            </form>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <img src="/DLHQ-logo.png" alt="Dynasty Live HQ" style={{ height: 28, objectFit: "contain" }} />
          <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} Dynasty Live HQ. All rights reserved.
          </span>
          <a href="mailto:hello@dynastylivehq.com" className="text-[12px]"
            style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
          >hello@dynastylivehq.com</a>
        </div>
      </footer>

    </div>
  );
}
