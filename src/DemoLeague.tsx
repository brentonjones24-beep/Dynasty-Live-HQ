import { useState } from "react";

// ─── PALETTE (matches WSSC exactly) ──────────────────────────────────────────
const BG       = "#0a1628";
const CARD     = "#0f2137";
const BORDER   = "#1e3a5f";
const BLUE     = "#2563eb";
const BLUE_LT  = "#3b82f6";
const BLUE_MUT = "#60a5fa";
const WIN      = "#00ff87";
const LOSS     = "#ff4d4d";
const DRAW     = "#fbbf24";
const TEXT     = "#e2e8f0";
const MUTED    = "#94a3b8";
const DIM      = "#64748b";
const GOLD     = "#e8b84b";

// ─── DATA ─────────────────────────────────────────────────────────────────────

type Team = {
  id: number;
  name: string;
  owner: string;
  wins: number;
  losses: number;
  pf: number;
  pa: number;
  form: string[];
};

const TEAMS: Team[] = [
  { id: 1,  name: "Dusty's Dirty Dozen",    owner: "Marcus Webb",    wins: 10, losses: 3,  pf: 1842, pa: 1601, form: ["W","W","L","W","W"] },
  { id: 2,  name: "The Mighty Ducks",        owner: "Carla Nguyen",   wins: 9,  losses: 4,  pf: 1790, pa: 1644, form: ["L","W","W","L","W"] },
  { id: 3,  name: "Grundy's Grunt Squad",    owner: "Tom Elliot",     wins: 8,  losses: 5,  pf: 1755, pa: 1698, form: ["W","W","L","W","L"] },
  { id: 4,  name: "Homer's Donut XI",        owner: "Jay Kowalski",   wins: 8,  losses: 5,  pf: 1720, pa: 1703, form: ["W","L","W","W","L"] },
  { id: 5,  name: "Danger Danger",           owner: "Priya Sharma",   wins: 7,  losses: 6,  pf: 1688, pa: 1711, form: ["W","L","L","W","L"] },
  { id: 6,  name: "Ted Lasso United",        owner: "Ben Christou",   wins: 7,  losses: 6,  pf: 1672, pa: 1699, form: ["L","W","W","L","W"] },
  { id: 7,  name: "Steele Magnolias",        owner: "Amy Lawson",     wins: 6,  losses: 7,  pf: 1641, pa: 1720, form: ["L","W","W","W","L"] },
  { id: 8,  name: "Riewoldt's Revenge",      owner: "Dave Tran",      wins: 5,  losses: 8,  pf: 1599, pa: 1755, form: ["L","L","L","W","L"] },
  { id: 9,  name: "The Andre 3000s",         owner: "Sam Okoye",      wins: 4,  losses: 9,  pf: 1548, pa: 1800, form: ["L","L","W","L","L"] },
  { id: 10, name: "Norm Smith Villains",     owner: "Kelly Park",     wins: 3,  losses: 10, pf: 1480, pa: 1842, form: ["L","L","L","L","L"] },
];

type Fixture = {
  round: number;
  home: string;
  homeScore: number | null;
  away: string;
  awayScore: number | null;
};

const FIXTURES: Fixture[] = [
  // Round 13 — complete
  { round: 13, home: "Dusty's Dirty Dozen",   homeScore: 148, away: "Homer's Donut XI",      awayScore: 122 },
  { round: 13, home: "The Mighty Ducks",       homeScore: 139, away: "Danger Danger",         awayScore: 131 },
  { round: 13, home: "Grundy's Grunt Squad",   homeScore: 144, away: "Ted Lasso United",      awayScore: 137 },
  { round: 13, home: "Steele Magnolias",       homeScore: 128, away: "Riewoldt's Revenge",    awayScore: 115 },
  { round: 13, home: "The Andre 3000s",        homeScore: 109, away: "Norm Smith Villains",   awayScore: 98  },
  // Round 14 — upcoming
  { round: 14, home: "Homer's Donut XI",       homeScore: null, away: "Dusty's Dirty Dozen",  awayScore: null },
  { round: 14, home: "Danger Danger",          homeScore: null, away: "Grundy's Grunt Squad", awayScore: null },
  { round: 14, home: "Ted Lasso United",       homeScore: null, away: "The Mighty Ducks",     awayScore: null },
  { round: 14, home: "Riewoldt's Revenge",     homeScore: null, away: "Steele Magnolias",     awayScore: null },
  { round: 14, home: "Norm Smith Villains",    homeScore: null, away: "The Andre 3000s",      awayScore: null },
];

type FeedItem = {
  id: number;
  type: "message" | "trade" | "list_move" | "auction";
  content: string;
  author: string;
  time: string;
  isCommissioner?: boolean;
};

const FEED: FeedItem[] = [
  { id: 1,  type: "trade",    content: "Trade completed — Dusty's Dirty Dozen receives P. Dangerfield; Danger Danger receives 2027 R1 Pick + B. Acres", author: "", time: "1h ago" },
  { id: 2,  type: "message",  content: "Round 13 wrap — what a week. That Ducks vs Danger match was an absolute classic. Four 110+ scores from Carla's side. See you all on Thursday 🏆", author: "Commissioner", time: "2h ago", isCommissioner: true },
  { id: 3,  type: "message",  content: "I want everyone to know that 148 points is the second-highest score of the season. Just saying. 😎", author: "Marcus Webb", time: "3h ago" },
  { id: 4,  type: "message",  content: "Enjoy it while it lasts Marcus. The Ducks are coming for that top spot 🦆", author: "Carla Nguyen", time: "4h ago" },
  { id: 5,  type: "auction",  content: "Auction opened — Norm Smith Villains lists: M. Gawn, 2027 R2 Pick. Bidding closes Friday 9pm.", author: "", time: "5h ago" },
  { id: 6,  type: "list_move", content: "Riewoldt's Revenge moves T. De Goey to rookie list. C. Weightman elevated to primary list.", author: "", time: "1d ago" },
  { id: 7,  type: "message",  content: "Homer would like a word with whoever scheduled him against the Dozen this week. Mmmm... bad draw.", author: "Jay Kowalski", time: "1d ago" },
  { id: 8,  type: "message",  content: "Steele Magnolias quietly in 7th but we've won 3 of our last 4. Ignore us at your peril.", author: "Amy Lawson", time: "2d ago" },
];

type Article = {
  id: number;
  type: "NEWS" | "ANALYSIS" | "RECAP";
  title: string;
  author: string;
  time: string;
  body: string;
  comments: { author: string; text: string }[];
};

const ARTICLES: Article[] = [
  {
    id: 1, type: "RECAP", title: "Round 13 Wrap: Ducks Fly High, Donut XI Stung",
    author: "Commissioner", time: "1 day ago",
    body: `Round 13 is in the books and the ladder is taking shape with three rounds remaining.\n\nThe headline result was The Mighty Ducks' narrow 139-131 victory over Danger Danger — a match in doubt until the final siren. Carla Nguyen's squad had four players score 110+ which proved the difference.\n\nHomer's Donut XI suffered a reality check, going down to Dusty's Dirty Dozen by 26 points despite posting a respectable 122.\n\nSteele Magnolias continued their quiet finals push, defeating Riewoldt's Revenge by 13. Amy Lawson's team has now won three of their last four.`,
    comments: [
      { author: "Ben Christou", text: "Ted Lasso would say: taking on a challenge is a lot like riding a horse." },
      { author: "Priya Sharma", text: "Danger Danger will bounce back. Mark my words." },
      { author: "Marcus Webb", text: "148 points. Just leaving that there. 😎" },
    ],
  },
  {
    id: 2, type: "NEWS", title: "Dusty's Dirty Dozen Eye Back-to-Back Premierships",
    author: "Marcus Webb", time: "2 days ago",
    body: `After a dominant Round 13 performance, Dusty's Dirty Dozen sit atop the ladder with a commanding three-game buffer. Their premium midfielder posted a season-high 167 — the second-highest individual score of 2025.\n\n"We're not looking past anyone," Webb said. "But honestly, if we keep getting these kinds of scores from the engine room, it's hard to see who stops us."\n\nThe Dozen have now won 10 of 13 and boast the competition's highest points for. Finals are a formality.`,
    comments: [
      { author: "Carla Nguyen", text: "Enjoy it while it lasts, Marcus. The Ducks are coming. 🦆" },
      { author: "Jay Kowalski", text: "Homer would like a word. Mmmm... premiership." },
    ],
  },
  {
    id: 3, type: "ANALYSIS", title: "The Curse of Round 9: Why Mid-Season Form Collapses Happen",
    author: "Commissioner", time: "5 days ago",
    body: `Every season, without fail, at least two teams who looked like contenders find themselves in freefall by Round 9. This year's victims? Norm Smith Villains and Riewoldt's Revenge — both inside the top four at the halfway mark, now in the bottom three.\n\nBoth teams went heavy on Richmond defenders in their draft — a strategy that paid early dividends but unravelled as the Tigers' back six shed premium scorers to injury.\n\nThe lesson, as always: never build your squad around a single club's defensive structure.`,
    comments: [
      { author: "Kelly Park", text: "Villains have had the worst injury run I've ever seen. Three premium defenders gone in four weeks." },
      { author: "Sam Okoye", text: "The Andre 3000s are in rebuilding mode. We'll be back." },
    ],
  },
];

type Classified = {
  id: number;
  type: "Offering" | "Seeking" | "Announcement";
  team: string;
  title: string;
  body: string;
  time: string;
};

const CLASSIFIEDS: Classified[] = [
  { id: 1, type: "Offering",     team: "Riewoldt's Revenge",  title: "Premium Ruck Available — Serious Offers Only", body: "Looking to offload a top-3 ruck averaging 118 SC. Injuries have forced a rebuild. Will consider players + picks. No tyre kickers.", time: "3 days ago" },
  { id: 2, type: "Seeking",      team: "Norm Smith Villains", title: "Desperate for a Genuine Midfielder",            body: "Will give up two first-round picks for a midfielder averaging 110+. Yes, I'm that desperate. Please help.", time: "4 days ago" },
  { id: 3, type: "Offering",     team: "The Andre 3000s",     title: "Wholesale Clearance — Rebuilding Mode Activated", body: "Everything must go. Forwards, mids, even my pride. Sam is going full tank for 2026 picks. Make an offer, any offer.", time: "6 days ago" },
  { id: 4, type: "Announcement", team: "Commissioner",        title: "Trade Deadline — Round 15 Friday 9pm",         body: "Reminder: the trade deadline for the 2025 season is Round 15, Friday at 9pm AEST. All trades must be accepted before that time to count.", time: "1 day ago" },
];

const BANDF = [
  { pos: 1, player: "T. Martin",      team: "Dusty's Dirty Dozen",  votes: 28 },
  { pos: 2, player: "C. Oliver",      team: "The Mighty Ducks",     votes: 24 },
  { pos: 3, player: "P. Dangerfield", team: "Danger Danger",        votes: 21 },
  { pos: 4, player: "M. Gawn",        team: "Grundy's Grunt Squad", votes: 19 },
  { pos: 5, player: "Z. Merrett",     team: "Ted Lasso United",     votes: 17 },
  { pos: 6, player: "L. Neale",       team: "Homer's Donut XI",     votes: 15 },
  { pos: 7, player: "J. Steele",      team: "Steele Magnolias",     votes: 14 },
  { pos: 8, player: "T. De Goey",     team: "Riewoldt's Revenge",   votes: 11 },
];

const HISTORY = [
  { season: 2024, premiers: "The Mighty Ducks",     runnerUp: "Dusty's Dirty Dozen",  bf: "C. Oliver (The Mighty Ducks)" },
  { season: 2023, premiers: "Grundy's Grunt Squad", runnerUp: "Danger Danger",        bf: "M. Gawn (Grundy's Grunt Squad)" },
  { season: 2022, premiers: "Riewoldt's Revenge",   runnerUp: "Norm Smith Villains",  bf: "T. Lynch (Riewoldt's Revenge)" },
  { season: 2021, premiers: "Dusty's Dirty Dozen",  runnerUp: "Ted Lasso United",     bf: "T. Martin (Dusty's Dirty Dozen)" },
];

const RULES = `Competition Format
The league consists of 10 teams competing across a 16-round home-and-away season, followed by a four-team finals series. Rounds align with the AFL Premiership Season schedule.

Scoring
SuperCoach scoring applies. The captain's score is doubled. Teams select 18 from their squad each round plus a 5-player interchange bench. Emergencies replace any player who does not register a score.

Rosters
Each team holds a primary list of 25 players and a rookie list of 5, across FWD, MID, RUC, and DEF positions. Trades are conducted via the in-app trade centre and require acceptance from all parties.

Draft
The annual draft is conducted via the live Draft Hub. Pick order for Round 1 is determined by reverse ladder order from the previous season. Subsequent rounds snake. Draft picks may be traded at any time.

Auctions
The Auction Room operates on a silent bid format. The hosting team selects items to auction; all other teams submit blind bids. The highest bid wins.

Late Outs
Players confirmed as late outs before match commencement are replaced by the nominated emergency. It is the team owner's responsibility to set lineups and emergencies before the relevant AFL match begins.

Conduct
All members are expected to conduct themselves with respect. Sledging is encouraged; abuse is not. The Commissioner reserves the right to remove any member who brings the competition into disrepute.`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const DEMO_TEAM = TEAMS[0]; // Dusty's Dirty Dozen as the "logged-in" user

const ladderSorted = [...TEAMS].sort((a, b) =>
  b.wins * 4 - a.wins * 4 || b.pf - a.pf
).map((t, i) => ({ ...t, pos: i + 1, ladderPoints: t.wins * 4, percentage: t.pa > 0 ? (t.pf / t.pa) * 100 : 0 }));

function ordinal(n: number) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

// ─── STYLE CONSTANTS ─────────────────────────────────────────────────────────

const card: React.CSSProperties = { background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" };
const sectionLabel: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: DIM, textTransform: "uppercase", letterSpacing: "0.9px", marginBottom: 10 };
const td: React.CSSProperties = { padding: "6px 8px", whiteSpace: "nowrap" };

// ─── CLASSIFIED COLOURS ───────────────────────────────────────────────────────

const CL_COLORS: Record<string, { bg: string; color: string }> = {
  Offering:     { bg: "#dcfce7", color: "#16a34a" },
  Seeking:      { bg: "#dbeafe", color: "#2563eb" },
  Announcement: { bg: "#fef3c7", color: "#b45309" },
};

// ─── HOME TAB ─────────────────────────────────────────────────────────────────

function HomeTab() {
  const myRow = ladderSorted.find(r => r.id === DEMO_TEAM.id)!;
  const nextFixture = FIXTURES.find(f => f.round === 14 && (f.home === DEMO_TEAM.name || f.away === DEMO_TEAM.name))!;
  const isHome = nextFixture?.home === DEMO_TEAM.name;
  const nextOpp = isHome ? nextFixture?.away : nextFixture?.home;

  return (
    <div style={{ color: TEXT, paddingBottom: 8 }}>

      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: DIM, fontWeight: 500 }}>Good afternoon</div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, marginTop: 2 }}>
          🏆 {DEMO_TEAM.name}
        </div>
      </div>

      {/* My Season Card */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabel}>My Season</div>
        <div style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)", borderRadius: 16, padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 4 }}>Position</div>
              <div style={{ fontSize: 44, fontWeight: 900, lineHeight: 1, color: "#fff" }}>
                {myRow.pos}<span style={{ fontSize: 20 }}>{ordinal(myRow.pos)}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
              {[["W", myRow.wins], ["L", myRow.losses], ["PTS", myRow.ladderPoints]].map(([label, val]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>{val}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
          {nextFixture && (
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Next Up · Round 14
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{isHome ? "vs" : "@"}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{nextOpp}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* League Feed */}
      <div style={{ marginBottom: 20 }}>
        <div style={sectionLabel}>League Feed</div>
        <div style={card}>
          <div>
            {FEED.map(item => {
              const isSystem = item.type !== "message";
              const timeStr = item.time;
              const systemStyle: Record<string, React.CSSProperties> = {
                trade:     { background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" },
                list_move: { background: "rgba(99,102,241,0.10)", border: "1px solid rgba(99,102,241,0.25)" },
                auction:   { background: "rgba(220,38,38,0.10)",  border: "1px solid rgba(220,38,38,0.25)" },
              };
              const systemIcon: Record<string, string> = { trade: "🚨", list_move: "📋", auction: "🔨" };
              return (
                <div key={item.id} style={{ padding: "10px 14px", borderBottom: `1px solid ${BG}` }}>
                  {isSystem ? (
                    <div style={{ borderRadius: 8, padding: "8px 12px", ...systemStyle[item.type] }}>
                      <div style={{ fontSize: 13, color: TEXT, lineHeight: 1.5 }}>
                        {systemIcon[item.type]} {item.content}
                      </div>
                      <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{timeStr}</div>
                    </div>
                  ) : (
                    <div style={item.isCommissioner ? { background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 8, padding: "8px 12px" } : undefined}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: 12, color: item.isCommissioner ? BLUE_MUT : MUTED, display: "flex", alignItems: "center", gap: 5 }}>
                          {item.isCommissioner && <span style={{ fontSize: 10 }}>🛡️</span>}
                          {item.author}
                        </span>
                        <span style={{ fontSize: 11, color: "#475569" }}>{timeStr}</span>
                      </div>
                      <div style={{ fontSize: 14, color: TEXT, lineHeight: 1.5 }}>{item.content}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: `1px solid ${BORDER}`, padding: 12, opacity: 0.5 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1, padding: "8px 10px", borderRadius: 8, border: `1px solid ${BORDER}`, background: "#0a1628", color: DIM, fontSize: 13 }}>
                Write something… (demo — not interactive)
              </div>
              <button style={{ padding: "8px 14px", background: BLUE, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "default", opacity: 0.5 }}>Post</button>
            </div>
          </div>
        </div>
      </div>

      {/* Ladder preview */}
      <div>
        <div style={sectionLabel}>Ladder</div>
        <div style={card}>
          <div style={{ display: "grid", gridTemplateColumns: "28px 1fr 36px 36px 36px", gap: 4, padding: "8px 14px", borderBottom: `1px solid ${BORDER}`, fontSize: 10, fontWeight: 700, color: DIM, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>
            <span>#</span><span>Team</span>
            <span style={{ textAlign: "center" as const }}>W</span>
            <span style={{ textAlign: "center" as const }}>L</span>
            <span style={{ textAlign: "center" as const }}>Pts</span>
          </div>
          {ladderSorted.slice(0, 5).map(row => {
            const isMe = row.id === DEMO_TEAM.id;
            return (
              <div key={row.id} style={{ display: "grid", gridTemplateColumns: "28px 1fr 36px 36px 36px", gap: 4, padding: "10px 14px", alignItems: "center", background: isMe ? "rgba(37,99,235,0.18)" : "transparent", borderBottom: `1px solid ${BG}`, borderLeft: isMe ? `3px solid ${BLUE_LT}` : "3px solid transparent" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: isMe ? BLUE_MUT : DIM }}>{row.pos}</span>
                <span style={{ fontSize: 13, fontWeight: isMe ? 700 : 500, color: isMe ? "#93c5fd" : "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{row.name}</span>
                <span style={{ textAlign: "center" as const, fontSize: 13, fontWeight: 600, color: isMe ? "#93c5fd" : MUTED }}>{row.wins}</span>
                <span style={{ textAlign: "center" as const, fontSize: 13, fontWeight: 600, color: isMe ? "#93c5fd" : MUTED }}>{row.losses}</span>
                <span style={{ textAlign: "center" as const, fontSize: 13, fontWeight: 700, color: isMe ? "#fff" : TEXT }}>{row.ladderPoints}</span>
              </div>
            );
          })}
          <div style={{ padding: "8px 14px", fontSize: 11, color: DIM, textAlign: "center" as const }}>Full ladder in Matches tab</div>
        </div>
      </div>
    </div>
  );
}

// ─── MATCHES TAB ─────────────────────────────────────────────────────────────

function MatchesTab() {
  const [activeRound, setActiveRound] = useState(13);
  const [view, setView] = useState<"matches" | "ladder">("matches");
  const [sortBy, setSortBy] = useState<"ladder" | "points">("ladder");

  const rounds = [12, 13, 14, 15, 16];
  const roundFixtures = FIXTURES.filter(f => f.round === activeRound);

  const sortedLadder = sortBy === "points"
    ? [...ladderSorted].sort((a, b) => b.pf - a.pf)
    : ladderSorted;

  function positionFor(name: string) {
    return ladderSorted.find(t => t.name === name)?.pos ?? 0;
  }

  return (
    <div>
      {/* Round strip */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 12 }}>
        {rounds.map(r => (
          <button key={r} onClick={() => setActiveRound(r)} style={{
            flexShrink: 0, padding: "6px 14px", borderRadius: 20,
            background: activeRound === r ? BLUE_LT : "#1e293b",
            color: activeRound === r ? "#fff" : MUTED,
            border: "none", cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
          }}>R{r}</button>
        ))}
      </div>

      {/* View toggle */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {(["matches", "ladder"] as const).map(v => (
          <button key={v} onClick={() => setView(v)} style={{
            padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            background: view === v ? BLUE_LT : "#1e293b",
            color: view === v ? "#fff" : MUTED,
          }}>{v === "matches" ? "Matches" : "Ladder"}</button>
        ))}
      </div>

      {view === "matches" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {roundFixtures.map((f, i) => {
            const played = f.homeScore !== null && f.awayScore !== null;
            const homeWon = played && f.homeScore! > f.awayScore!;
            const awayWon = played && f.awayScore! > f.homeScore!;
            const homePos = positionFor(f.home);
            const awayPos = positionFor(f.away);
            const isFirst = i === 0;

            return (
              <div key={i} style={{
                background: "linear-gradient(135deg, #0f1f3d 0%, #0d1a35 100%)",
                border: `1px solid ${BORDER}`,
                borderRadius: 12, padding: "12px 14px", position: "relative",
              }}>
                {isFirst && (
                  <div style={{ position: "absolute", top: -1, left: 14, background: GOLD, color: "#0a0a0a", fontSize: 9, fontWeight: 800, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: "0 0 6px 6px", textTransform: "uppercase" }}>
                    MOTR
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, marginTop: isFirst ? 6 : 0 }}>
                  {/* Home */}
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 10, color: DIM, marginBottom: 3 }}>#{homePos}</div>
                    <div style={{ fontSize: 14, fontWeight: homeWon ? 700 : 500, color: homeWon ? TEXT : MUTED, lineHeight: 1.2 }}>{f.home}</div>
                  </div>
                  {/* Score */}
                  <div style={{ textAlign: "center", minWidth: 80 }}>
                    {played ? (
                      <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 22, color: GOLD, letterSpacing: 1 }}>
                        {f.homeScore} – {f.awayScore}
                      </div>
                    ) : (
                      <div style={{ fontSize: 11, fontWeight: 700, color: DIM, letterSpacing: "0.1em", textTransform: "uppercase" }}>vs</div>
                    )}
                    {!played && <div style={{ fontSize: 10, color: "#334155", marginTop: 4 }}>Round {f.round}</div>}
                  </div>
                  {/* Away */}
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 10, color: DIM, marginBottom: 3 }}>#{awayPos}</div>
                    <div style={{ fontSize: 14, fontWeight: awayWon ? 700 : 500, color: awayWon ? TEXT : MUTED, lineHeight: 1.2 }}>{f.away}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "ladder" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            {(["ladder", "points"] as const).map(s => (
              <button key={s} onClick={() => setSortBy(s)} style={{
                padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
                fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                background: sortBy === s ? BLUE_LT : "#1e293b",
                color: sortBy === s ? "#fff" : MUTED,
              }}>{s === "ladder" ? "Ladder" : "Total Points"}</button>
            ))}
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", color: "#fff", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #475569", color: MUTED, textAlign: "left" }}>
                  <th style={td}>#</th>
                  <th style={td}>Team</th>
                  <th style={td}>P</th>
                  <th style={td}>W</th>
                  <th style={td}>L</th>
                  <th style={{ ...td, color: sortBy === "points" ? "#fff" : MUTED, fontWeight: sortBy === "points" ? 700 : 400 }}>PF</th>
                  <th style={td}>PA</th>
                  <th style={td}>Pts</th>
                  <th style={td}>%</th>
                  <th style={td}>Form</th>
                </tr>
              </thead>
              <tbody>
                {sortedLadder.map((t, i) => {
                  const isTop4 = i < 4;
                  const isMe = t.id === DEMO_TEAM.id;
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #333", background: isMe ? "#1e3a5f" : isTop4 ? "#1e293b" : "#0f172a", fontWeight: isMe ? 600 : 400 }}>
                      <td style={td}>{i + 1}</td>
                      <td style={{ ...td, fontWeight: 600 }}>{t.name} {isMe ? "⭐" : ""}</td>
                      <td style={td}>{t.wins + t.losses}</td>
                      <td style={td}>{t.wins}</td>
                      <td style={td}>{t.losses}</td>
                      <td style={{ ...td, fontWeight: sortBy === "points" ? 700 : 400 }}>{t.pf}</td>
                      <td style={td}>{t.pa}</td>
                      <td style={td}><b>{t.ladderPoints}</b></td>
                      <td style={td}>{t.percentage.toFixed(1)}</td>
                      <td style={{ ...td }}>
                        <div style={{ display: "flex", gap: 3 }}>
                          {t.form.map((r, idx) => (
                            <span key={idx} style={{ color: r === "W" ? WIN : r === "L" ? LOSS : DRAW, fontWeight: 700 }}>{r}</span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: DIM, paddingLeft: 8 }}>
            <span style={{ color: BLUE_LT }}>■</span> Top 4 — Finals qualified
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WIRE TAB ─────────────────────────────────────────────────────────────────

function WireTab() {
  const [tab, setTab] = useState<"news" | "classifieds">("news");
  const [selected, setSelected] = useState<Article | null>(null);

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: `1px solid ${BORDER}`, color: BLUE_MUT, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13, marginBottom: 20, fontFamily: "inherit" }}>← Back</button>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
          <span style={{ background: "#e8b84b", color: "#0a0e1a", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase" as const }}>{selected.type}</span>
          <span style={{ fontSize: 12, color: DIM }}>{selected.time} · By {selected.author}</span>
        </div>
        <h2 style={{ margin: "0 0 18px", fontSize: "1.15rem", color: TEXT, lineHeight: 1.4 }}>{selected.title}</h2>
        {selected.body.split("\n\n").map((p, i) => (
          <p key={i} style={{ color: MUTED, fontSize: 14, lineHeight: 1.75, marginBottom: 14 }}>{p}</p>
        ))}
        <div style={{ marginTop: 24, borderTop: `1px solid ${BORDER}`, paddingTop: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: DIM, marginBottom: 14, textTransform: "uppercase" as const }}>{selected.comments.length} Comments</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {selected.comments.map((c, i) => (
              <div key={i} style={{ background: BG, borderRadius: 8, padding: "10px 14px", border: `1px solid ${BORDER}` }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: BLUE_MUT, marginBottom: 4 }}>{c.author}</div>
                <div style={{ fontSize: 13, color: MUTED }}>{c.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const typeColor: Record<string, string> = { NEWS: GOLD, ANALYSIS: BLUE_MUT, RECAP: "#6bcb77" };

  return (
    <div>
      {/* Masthead */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>📡</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: TEXT }}>The Wire</div>
          <div style={{ fontSize: 11, color: DIM }}>League news & classifieds</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {(["news", "classifieds"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 600, fontFamily: "inherit",
            background: tab === t ? BLUE_LT : "#1e293b",
            color: tab === t ? "#fff" : MUTED,
          }}>{t === "news" ? "News" : "Classifieds"}</button>
        ))}
      </div>

      {tab === "news" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {ARTICLES.map(a => (
            <div key={a.id} onClick={() => setSelected(a)} style={{ ...card, padding: "16px 18px", cursor: "pointer", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#2a3a6a")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: typeColor[a.type] || "#888", color: "#0a0e1a", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase" as const }}>{a.type}</span>
                <span style={{ fontSize: 11, color: DIM }}>{a.time}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 5, lineHeight: 1.4 }}>{a.title}</div>
              <div style={{ fontSize: 12, color: DIM }}>By {a.author} · {a.comments.length} comments</div>
            </div>
          ))}
        </div>
      )}

      {tab === "classifieds" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CLASSIFIEDS.map(c => (
            <div key={c.id} style={{ ...card, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ background: CL_COLORS[c.type]?.bg || "#ddd", color: CL_COLORS[c.type]?.color || "#333", fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.12em", padding: "2px 8px", borderRadius: 3, textTransform: "uppercase" as const }}>{c.type}</span>
                <span style={{ fontSize: 11, color: DIM }}>{c.team} · {c.time}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: TEXT, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6 }}>{c.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── LEAGUE HQ TAB ────────────────────────────────────────────────────────────

function LeagueHQTab() {
  const [sub, setSub] = useState<"rules" | "bandf" | "history">("rules");

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" as const }}>
        {([["rules", "Rules"], ["bandf", "B&F Votes"], ["history", "History"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSub(key)} style={{
            padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
            fontSize: 13, fontWeight: 600, transition: "all 0.15s",
            background: sub === key ? "#1a2a50" : "transparent",
            border: `1px solid ${sub === key ? BLUE_LT : BORDER}`,
            color: sub === key ? BLUE_LT : DIM,
          }}>{label}</button>
        ))}
      </div>

      {sub === "rules" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {RULES.split("\n\n").map((block, i) => {
            const lines = block.split("\n");
            return (
              <div key={i} style={{ ...card, padding: "16px 18px" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: BLUE_MUT, marginBottom: 8 }}>{lines[0]}</div>
                <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.75 }}>{lines.slice(1).join(" ")}</div>
              </div>
            );
          })}
        </div>
      )}

      {sub === "bandf" && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: DIM, marginBottom: 4, textTransform: "uppercase" as const }}>2025 Season — After Round 13</div>
            <div style={{ fontSize: 13, color: MUTED }}>Votes cast on a 5-4-3-2-1 system by each team after every round.</div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${BORDER}`, color: DIM, fontSize: 11, letterSpacing: "0.08em", textAlign: "left" }}>
                <th style={{ padding: "6px 8px", fontWeight: 600 }}>#</th>
                <th style={{ padding: "6px 8px", fontWeight: 600 }}>PLAYER</th>
                <th style={{ padding: "6px 8px", fontWeight: 600 }}>TEAM</th>
                <th style={{ padding: "6px 8px", fontWeight: 600, textAlign: "right" as const }}>VOTES</th>
              </tr>
            </thead>
            <tbody>
              {BANDF.map(b => (
                <tr key={b.pos} style={{ borderBottom: "1px solid #111827" }}>
                  <td style={{ padding: "10px 8px", color: b.pos === 1 ? GOLD : DIM, fontWeight: 700 }}>{b.pos === 1 ? "🏆" : b.pos}</td>
                  <td style={{ padding: "10px 8px", fontWeight: 600, color: TEXT }}>{b.player}</td>
                  <td style={{ padding: "10px 8px", color: MUTED, fontSize: 12 }}>{b.team}</td>
                  <td style={{ padding: "10px 8px", textAlign: "right" as const }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                      <div style={{ height: 6, borderRadius: 3, background: BLUE_LT, width: `${(b.votes / 28) * 80}px`, minWidth: 4 }} />
                      <span style={{ fontWeight: 700, color: GOLD, minWidth: 24, textAlign: "right" as const }}>{b.votes}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === "history" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {HISTORY.map(h => (
            <div key={h.season} style={{ ...card, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontWeight: 800, fontSize: "1.1rem", color: GOLD }}>{h.season}</span>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: DIM, textTransform: "uppercase" as const }}>Season</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {[["🏆 Premiers", h.premiers], ["🥈 Runner-Up", h.runnerUp], ["🎖 B&F Winner", h.bf]].map(([label, value]) => (
                  <div key={label as string}>
                    <div style={{ fontSize: 11, color: DIM, marginBottom: 3 }}>{label}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const TABS = [
  { key: "home",    label: "Home" },
  { key: "matches", label: "Matches" },
  { key: "wire",    label: "Wire" },
  { key: "hq",      label: "League HQ" },
] as const;

type TabKey = typeof TABS[number]["key"];

export default function DemoLeague() {
  const [tab, setTab] = useState<TabKey>("home");

  return (
    <div style={{ minHeight: "100vh", background: BG, color: TEXT, fontFamily: "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI',Roboto,sans-serif", paddingBottom: 60 }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0a0f1e 0%, #0d1530 100%)", borderBottom: `1px solid ${BORDER}`, padding: "24px 20px 18px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ maxWidth: 680, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 4 }}>Dynasty Live HQ — Demo League</div>
              <h1 style={{ margin: 0, fontSize: "clamp(1.25rem,5vw,1.7rem)", fontWeight: 800, color: TEXT, letterSpacing: "-0.02em", lineHeight: 1.2 }}>The Premier Fantasy<br />Football Experience</h1>
              <p style={{ margin: "6px 0 0", fontSize: 12, color: DIM }}>10 teams · Season 2025 · Round 13 of 16</p>
            </div>
            <div style={{ background: "#0d1530", border: `1px solid #1a2a50`, borderRadius: 10, padding: "10px 14px", textAlign: "center", flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: DIM, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Leader</div>
              <div style={{ fontWeight: 800, fontSize: 12, color: GOLD, lineHeight: 1.3 }}>Dusty's<br />Dirty Dozen</div>
              <div style={{ fontSize: 12, color: WIN, marginTop: 4, fontWeight: 600 }}>10W – 3L</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ borderBottom: `1px solid ${BORDER}`, background: BG, position: "sticky", top: 0, zIndex: 10, overflowX: "auto" }}>
        <div style={{ display: "flex", maxWidth: 680, margin: "0 auto", padding: "0 12px" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${tab === t.key ? BLUE_LT : "transparent"}`,
              color: tab === t.key ? BLUE_LT : DIM,
              padding: "14px 14px 12px", cursor: "pointer",
              fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
              fontFamily: "inherit", whiteSpace: "nowrap", transition: "all 0.15s",
              letterSpacing: "0.02em",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "home"    && <HomeTab />}
        {tab === "matches" && <MatchesTab />}
        {tab === "wire"    && <WireTab />}
        {tab === "hq"      && <LeagueHQTab />}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px", borderTop: `1px solid ${BORDER}`, marginTop: 20, paddingTop: 20, fontSize: 12, color: "#2a3a5a", textAlign: "center" }}>
        This is a demo league. <strong style={{ color: "#3a4a6a" }}>Dynasty Live HQ</strong> — launching for the 2027 AFL season.
      </div>
    </div>
  );
}
