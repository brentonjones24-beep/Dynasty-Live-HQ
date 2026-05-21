import { useState } from "react";

const GOLD       = "#c9a84c";
const GOLD_MUTED = "rgba(201,168,76,0.75)";
const BG         = "#080808";

const NAV_LINKS = ["Features", "How It Works", "Waitlist"] as const;

const FEATURES = [
  { icon: "⚡", title: "Live Scoring", body: "Real-time match centre with live player scores, squad updates, and automatic late-out substitutions." },
  { icon: "🔄", title: "Trade Centre", body: "Full trade negotiation flow with counter-offers, draft pick trading, and commissioner approval." },
  { icon: "📋", title: "Draft Hub", body: "Live draft room, pick trading, and a complete history of every selection your league has ever made." },
  { icon: "📰", title: "The Wire", body: "League media hub — publish articles, classifieds, and trash talk under team personas." },
  { icon: "🏆", title: "Best & Fairest", body: "Club B&F voting auto-calculated each round. Full leaderboard and coach voting tools built in." },
  { icon: "📊", title: "Stats History", body: "Complete round-by-round player score history for every team. Track trends, spot value, win your league." },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Register your league", body: "Tell us your league name, number of teams, and competition format. We handle the setup." },
  { step: "02", title: "Invite your coaches", body: "Each coach gets their own login. Rosters, lineups, and trades are all locked to their account." },
  { step: "03", title: "Run your season", body: "Live scores, trades, draft, and media — all in one place, all season long." },
];

function CheckMark() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
      <circle cx="7.5" cy="7.5" r="7.5" fill={GOLD} fillOpacity="0.12" />
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

type FormStatus = "idle" | "loading" | "success" | "error";

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 6, fontSize: 14,
  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", outline: "none",
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [email, setEmail]   = useState("");
  const [league, setLeague] = useState("");
  const [teams, setTeams]   = useState("");
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
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
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
    submitForm({ type: "waitlist", email, league_name: league, team_count: teams || null }, setWlStatus);
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
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`}
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
              <a key={link} href={`#${link.toLowerCase().replace(/ /g, "-")}`}
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
          <div className="max-w-[620px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px w-10 flex-shrink-0" style={{ background: GOLD_MUTED }} />
              <span className="text-[11px] font-semibold tracking-[0.24em] uppercase" style={{ color: GOLD_MUTED }}>
                Built for competitive AFL leagues
              </span>
            </div>
            <h1 className="text-[50px] md:text-[72px] leading-[0.98] font-black tracking-[-0.025em] text-white mb-5">
              Run Your League<br />
              <span style={{ color: GOLD }}>Properly.</span>
            </h1>
            <p className="text-[16px] md:text-[18px] leading-[1.8] max-w-[480px] mb-10"
              style={{ color: "rgba(255,255,255,0.46)", fontWeight: 300 }}>
              The complete platform for dynasty and keeper AFL leagues — live scoring,
              trades, drafts, and real-time league management in one place.
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
              {["Live scoring & match centre", "Trade centre with negotiation", "Draft hub and pick trading", "League media — The Wire"].map((f, i) => (
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
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">Built for serious leagues</h2>
            <p className="text-[16px] max-w-[480px] mx-auto" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              Every feature your dynasty league needs — from round one to the grand final.
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

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: "100px 24px", background: BG }}>
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <SectionEyebrow text="Simple setup" />
            <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-white mb-4">Up and running in minutes</h2>
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
          <p className="text-[15px] mb-10" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
            Dynasty Live HQ launches for the 2027 AFL season. Register your league now and we'll be in touch before general release.
          </p>
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
                  {[8, 10, 12, 14, 16].map(n => (
                    <option key={n} value={n} style={{ background: "#1a1a1a" }}>{n} teams</option>
                  ))}
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
            Got a specific setup in mind or want to learn more? Send us a message.
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
