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

// ─── TRADE DATA ───────────────────────────────────────────────────────────────

type TradeMove = { from: string; to: string; assets: string[] };
type HistoricalTrade = { id: number; date: string; parties: string[]; moves: TradeMove[]; message?: string };

const TRADE_HISTORY: HistoricalTrade[] = [
  {
    id: 1, date: "14 May 2025",
    parties: ["Dusty's Dirty Dozen", "Danger Danger"],
    moves: [
      { from: "Danger Danger",       to: "Dusty's Dirty Dozen", assets: ["P. Dangerfield"] },
      { from: "Dusty's Dirty Dozen", to: "Danger Danger",       assets: ["2026 R1 Pick (via Dusty's)", "B. Acres"] },
    ],
  },
  {
    id: 2, date: "2 Apr 2025",
    parties: ["Grundy's Grunt Squad", "The Mighty Ducks"],
    moves: [
      { from: "Grundy's Grunt Squad", to: "The Mighty Ducks",     assets: ["M. Gawn", "2026 R3 Pick (via Grundy's)"] },
      { from: "The Mighty Ducks",     to: "Grundy's Grunt Squad", assets: ["C. Oliver", "2026 R1 Pick (via Ducks)"] },
    ],
    message: "Stoked to finally get this one done. Go Grunt Squad.",
  },
  {
    id: 3, date: "18 Mar 2025",
    parties: ["Homer's Donut XI", "Ted Lasso United"],
    moves: [
      { from: "Homer's Donut XI",   to: "Ted Lasso United", assets: ["L. Neale"] },
      { from: "Ted Lasso United",   to: "Homer's Donut XI", assets: ["2026 R2 Pick (via Ted Lasso)", "T. Lynch"] },
    ],
  },
  {
    id: 4, date: "9 Jun 2025",
    parties: ["Riewoldt's Revenge", "Norm Smith Villains"],
    moves: [
      { from: "Riewoldt's Revenge", to: "Norm Smith Villains", assets: ["T. De Goey", "2026 R2 Pick (via Riewoldt's)"] },
      { from: "Norm Smith Villains", to: "Riewoldt's Revenge", assets: ["2026 R1 Pick (via Norm Smith)"] },
    ],
    message: "Rebuilding. Pain.",
  },
  {
    id: 5, date: "21 Feb 2025",
    parties: ["Steele Magnolias", "The Andre 3000s"],
    moves: [
      { from: "Steele Magnolias",  to: "The Andre 3000s", assets: ["T. Membrey"] },
      { from: "The Andre 3000s",   to: "Steele Magnolias", assets: ["2026 R4 Pick (via Andre 3000s)"] },
    ],
  },
];

const INBOX_TRADE = {
  from: "Homer's Donut XI",
  date: "2 hours ago",
  moves: [
    { from: "Homer's Donut XI",   to: "Dusty's Dirty Dozen", assets: ["L. Neale", "2026 R2 Pick (via Homer's)"] },
    { from: "Dusty's Dirty Dozen", to: "Homer's Donut XI",   assets: ["T. Martin"] },
  ],
  message: "Mmmm... T. Martin. Homer needs him. Will throw in a 2nd rounder.",
};

// ─── DRAFT DATA ───────────────────────────────────────────────────────────────

// Worst→best ladder order for pick ordering
const DRAFT_ORDER = [
  "Norm Smith Villains", "The Andre 3000s", "Riewoldt's Revenge", "Steele Magnolias",
  "Ted Lasso United", "Danger Danger", "Homer's Donut XI", "Grundy's Grunt Squad",
  "The Mighty Ducks", "Dusty's Dirty Dozen",
];

type DraftPick = { label: string; round: number; originalOwner: string; currentOwner: string };

function genPicks(): DraftPick[] {
  const short: Record<string, string> = {
    "Dusty's Dirty Dozen": "Dusty's", "The Mighty Ducks": "Ducks",
    "Grundy's Grunt Squad": "Grundy's", "Homer's Donut XI": "Homer's",
    "Danger Danger": "Danger", "Ted Lasso United": "Ted Lasso",
    "Steele Magnolias": "Steele", "Riewoldt's Revenge": "Riewoldt's",
    "The Andre 3000s": "Andre 3000s", "Norm Smith Villains": "Norm Smith",
  };
  const picks: DraftPick[] = [];
  for (let r = 1; r <= 5; r++) {
    const order = r % 2 === 1 ? DRAFT_ORDER : [...DRAFT_ORDER].reverse();
    order.forEach((team, i) => {
      picks.push({ label: `2026 R${r}.${String(i + 1).padStart(2, "0")} (${short[team]})`, round: r, originalOwner: team, currentOwner: team });
    });
  }
  // Apply some trades
  const traded: [string, string][] = [
    ["2026 R1.10 (Dusty's)", "Danger Danger"],
    ["2026 R1.09 (Ducks)",   "Grundy's Grunt Squad"],
    ["2026 R2.01 (Dusty's)", "Homer's Donut XI"],
    ["2026 R1.10 (Norm Smith)", "Riewoldt's Revenge"],
    ["2026 R2.10 (Norm Smith)", "Riewoldt's Revenge"],
    ["2026 R3.02 (Andre 3000s)", "Steele Magnolias"],
  ];
  for (const [label, newOwner] of traded) {
    const p = picks.find(p => p.label === label);
    if (p) p.currentOwner = newOwner;
  }
  return picks;
}

const ALL_PICKS = genPicks();

type FreeAgent = { name: string; club: string; positions: string[]; avg: number; gp: number };

const FREE_AGENTS: FreeAgent[] = [
  { name: "T. Taranto",      club: "Greater Western Sydney", positions: ["MID"],        avg: 107, gp: 13 },
  { name: "J. Dunkley",      club: "Brisbane Lions",         positions: ["MID"],        avg: 102, gp: 12 },
  { name: "L. Shiels",       club: "Hawthorn",               positions: ["MID"],        avg: 98,  gp: 13 },
  { name: "J. Worpel",       club: "Hawthorn",               positions: ["MID"],        avg: 94,  gp: 11 },
  { name: "C. Petracca",     club: "Melbourne",              positions: ["MID"],        avg: 112, gp: 10 },
  { name: "N. Daicos",       club: "Collingwood",            positions: ["MID"],        avg: 118, gp: 8  },
  { name: "S. Flanders",     club: "Collingwood",            positions: ["FWD"],        avg: 86,  gp: 13 },
  { name: "B. Close",        club: "St Kilda",               positions: ["FWD", "MID"], avg: 91,  gp: 12 },
  { name: "M. Hinge",        club: "Hawthorn",               positions: ["DEF"],        avg: 82,  gp: 13 },
  { name: "D. Hewett",       club: "Carlton",                positions: ["MID"],        avg: 96,  gp: 9  },
  { name: "R. Laird",        club: "Adelaide",               positions: ["DEF"],        avg: 104, gp: 13 },
  { name: "S. Durham",       club: "Geelong",                positions: ["DEF"],        avg: 79,  gp: 13 },
  { name: "J. Rankine",      club: "Greater Western Sydney", positions: ["FWD"],        avg: 88,  gp: 11 },
  { name: "I. Heeney",       club: "Sydney",                 positions: ["FWD", "MID"], avg: 109, gp: 7  },
  { name: "T. Stengle",      club: "Geelong",                positions: ["FWD"],        avg: 84,  gp: 12 },
  { name: "B. Frampton",     club: "Port Adelaide",          positions: ["DEF"],        avg: 77,  gp: 13 },
  { name: "S. Treloar",      club: "Greater Western Sydney", positions: ["MID"],        avg: 91,  gp: 10 },
  { name: "C. Constable",    club: "Geelong",                positions: ["MID"],        avg: 88,  gp: 12 },
  { name: "N. Bryan",        club: "Greater Western Sydney", positions: ["RUCK"],       avg: 74,  gp: 10 },
  { name: "B. Schmidt",      club: "North Melbourne",        positions: ["DEF"],        avg: 72,  gp: 13 },
  { name: "T. Phillipou",    club: "Richmond",               positions: ["FWD"],        avg: 69,  gp: 13 },
  { name: "K. Gillbee",      club: "Hawthorn",               positions: ["DEF"],        avg: 81,  gp: 13 },
];

type RosterPlayer = { name: string; club: string; positions: string[]; avg: number; designation?: "ltil" };

const MY_ROSTER: RosterPlayer[] = [
  { name: "D. Martin",       club: "Richmond",               positions: ["MID"],        avg: 132 },
  { name: "P. Lipinski",     club: "Carlton",                positions: ["MID"],        avg: 119 },
  { name: "P. Dangerfield",  club: "Geelong",                positions: ["MID"],        avg: 127 },
  { name: "T. Mitchell",     club: "Hawthorn",               positions: ["MID"],        avg: 124 },
  { name: "C. Mills",        club: "Sydney",                 positions: ["MID"],        avg: 116 },
  { name: "H. Cunnington",   club: "North Melbourne",        positions: ["MID"],        avg: 108 },
  { name: "M. Rowell",       club: "Gold Coast",             positions: ["MID"],        avg: 104 },
  { name: "J. Treloar",      club: "Collingwood",            positions: ["MID"],        avg: 99  },
  { name: "T. Xerri",        club: "North Melbourne",        positions: ["RUCK"],       avg: 112 },
  { name: "B. Preuss",       club: "Melbourne",              positions: ["RUCK"],       avg: 88  },
  { name: "N. Haynes",       club: "Greater Western Sydney", positions: ["DEF"],        avg: 97  },
  { name: "J. Ridley",       club: "Essendon",               positions: ["DEF"],        avg: 94  },
  { name: "S. Taylor",       club: "Greater Western Sydney", positions: ["DEF", "KPD"], avg: 91  },
  { name: "D. Moore",        club: "Collingwood",            positions: ["DEF", "KPD"], avg: 88  },
  { name: "H. Jones",        club: "North Melbourne",        positions: ["DEF"],        avg: 85  },
  { name: "T. Doedee",       club: "Adelaide",               positions: ["DEF"],        avg: 79, designation: "ltil" },
  { name: "J. Cameron",      club: "Greater Western Sydney", positions: ["FWD", "KPF"], avg: 113 },
  { name: "T. Hawkins",      club: "Geelong",                positions: ["FWD", "KPF"], avg: 96  },
  { name: "C. Curnow",       club: "Carlton",                positions: ["FWD"],        avg: 108 },
  { name: "T. Greene",       club: "Greater Western Sydney", positions: ["FWD"],        avg: 99  },
  { name: "H. Himmelberg",   club: "Greater Western Sydney", positions: ["FWD", "KPF"], avg: 87  },
  { name: "B. Smith",        club: "Geelong",                positions: ["FWD"],        avg: 91  },
];

// ─── TRADE CENTRE TAB ─────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  accepted: "#16a34a", declined: "#e11d48", pending: "#f59e0b", countered: "#7c3aed",
};

function TradeMoves({ moves }: { moves: TradeMove[] }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {moves.map((m, i) => (
        <div key={i} style={{ padding: "8px 10px", background: "#f8fafc", borderRadius: 7, marginBottom: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 5 }}>
            {m.from} → {m.to}
          </div>
          {m.assets.map((a, j) => (
            <div key={j} style={{ fontSize: 13, color: "#1e293b", marginBottom: 2 }}>
              {a.includes("Pick") ? `🎯 ${a}` : `👤 ${a}`}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TradeCentreTab() {
  const [sub, setSub] = useState<"history" | "inbox" | "propose">("history");
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState("");
  const [inboxState, setInboxState] = useState<"pending" | "accepted" | "declined" | "countered">("pending");

  const filteredHistory = TRADE_HISTORY.filter(t => {
    if (teamFilter && !t.parties.includes(teamFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      const allAssets = t.moves.flatMap(m => m.assets).join(" ").toLowerCase();
      if (!allAssets.includes(q) && !t.parties.join(" ").toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div>
      {/* Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
        <h2 style={{ margin: 0, color: TEXT, fontSize: 20 }}>Trade Centre</h2>
        <span style={{ background: "#e11d48", color: "#fff", borderRadius: 99, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>1 new</span>
      </div>

      {/* Sub-tabs — WSSC style: bottom border, blue active */}
      <div style={{ display: "flex", borderBottom: "2px solid #1e3a5f", marginBottom: 20, overflowX: "auto" }}>
        {([["inbox", "Inbox (1)"], ["history", "Trade History"], ["propose", "Propose Trade"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSub(key)} style={{
            padding: "10px 14px", background: "none", border: "none",
            borderBottom: sub === key ? `2px solid ${BLUE}` : "2px solid transparent",
            color: sub === key ? BLUE : DIM,
            fontWeight: sub === key ? 700 : 500,
            cursor: "pointer", marginBottom: -2, fontSize: 13,
            whiteSpace: "nowrap", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      {/* ── INBOX ── */}
      {sub === "inbox" && (
        <div>
          {inboxState === "pending" && (
            <div style={{ border: "1px solid #e2e8f0", borderLeft: "4px solid #f59e0b", borderRadius: 10, padding: 16, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>From: {INBOX_TRADE.from}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: "#f59e0b22", color: "#f59e0b" }}>PENDING</span>
              </div>
              <TradeMoves moves={INBOX_TRADE.moves} />
              <div style={{ fontSize: 13, fontStyle: "italic", background: "#f8fafc", color: "#475569", borderRadius: 6, padding: "6px 10px", marginBottom: 12 }}>
                &ldquo;{INBOX_TRADE.message}&rdquo;
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>{INBOX_TRADE.date}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setInboxState("accepted")} style={{ background: "#16a34a", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Accept</button>
                <button onClick={() => setInboxState("countered")} style={{ background: "#7c3aed", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Counter</button>
                <button onClick={() => setInboxState("declined")} style={{ background: "#e11d48", color: "#fff", border: "none", borderRadius: 7, padding: "7px 16px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Decline</button>
              </div>
            </div>
          )}
          {inboxState !== "pending" && (
            <div style={{ border: "1px solid #e2e8f0", borderLeft: `4px solid ${STATUS_COLOR[inboxState]}`, borderRadius: 10, padding: 16, background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#1e293b" }}>From: {INBOX_TRADE.from}</div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: STATUS_COLOR[inboxState] + "22", color: STATUS_COLOR[inboxState] }}>{inboxState.toUpperCase()}</span>
              </div>
              <TradeMoves moves={INBOX_TRADE.moves} />
              <div style={{ fontSize: 13, color: "#94a3b8" }}>{INBOX_TRADE.date}</div>
              <button onClick={() => setInboxState("pending")} style={{ marginTop: 12, background: "none", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: 7, padding: "6px 14px", cursor: "pointer", fontSize: 12 }}>Reset demo</button>
            </div>
          )}
        </div>
      )}

      {/* ── HISTORY ── */}
      {sub === "history" && (
        <div>
          <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" as const }}>
            <input
              placeholder="Search player or pick..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, minWidth: 160, padding: "7px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: TEXT, fontSize: 13, boxSizing: "border-box" as const }}
            />
            <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: TEXT, fontSize: 13 }}>
              <option value="">All Teams</option>
              {TEAMS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            {(search || teamFilter) && (
              <button onClick={() => { setSearch(""); setTeamFilter(""); }}
                style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", fontSize: 13, cursor: "pointer", color: DIM }}>
                Clear
              </button>
            )}
          </div>
          <div style={{ fontSize: 13, color: DIM, marginBottom: 12 }}>{filteredHistory.length} trade{filteredHistory.length !== 1 ? "s" : ""}</div>
          {filteredHistory.length === 0 && (
            <div style={{ textAlign: "center", color: DIM, padding: 60, fontSize: 15 }}>No trades found</div>
          )}
          {filteredHistory.map(trade => (
            <div key={trade.id} style={{ border: "1px solid #e2e8f0", borderLeft: "4px solid #16a34a", borderRadius: 10, padding: 16, marginBottom: 12, background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: "#1e293b", marginBottom: 2 }}>
                {trade.parties.join(" ↔ ")}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 10 }}>{trade.date}</div>
              <TradeMoves moves={trade.moves} />
              {trade.message && (
                <div style={{ fontSize: 12, fontStyle: "italic", color: "#64748b", borderRadius: 6, padding: "5px 10px", background: "#f8fafc" }}>
                  &ldquo;{trade.message}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── PROPOSE ── */}
      {sub === "propose" && (
        <div>
          <div style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 13, color: BLUE_MUT }}>
            🎮 Demo mode — the propose form is shown for preview only. In the live app coaches can send real trade proposals, counter-offers, and multi-team deals.
          </div>
          {/* Teams involved */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: TEXT }}>Teams involved</div>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {TEAMS.filter(t => t.name !== DEMO_TEAM.name).map(t => (
                <button key={t.id} style={{
                  padding: "6px 14px", borderRadius: 99, fontSize: 13, fontWeight: 600,
                  border: "2px solid #e2e8f0", background: "#fff", color: "#374151", cursor: "not-allowed", opacity: 0.7,
                }}>{t.name}</button>
              ))}
            </div>
          </div>
          {/* Asset builder placeholder */}
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: TEXT }}>Trade assets</div>
          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, padding: "10px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8, opacity: 0.6 }}>
            <select style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}><option>Player</option></select>
            <select style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}><option>From…</option></select>
            <select style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}><option>Select player…</option></select>
            <select style={{ padding: "5px 8px", borderRadius: 6, border: "1px solid #cbd5e1", fontSize: 13 }}><option>To…</option></select>
          </div>
          <button style={{ background: "#f1f5f9", border: "1px dashed #cbd5e1", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "#475569", width: "100%", marginBottom: 16, cursor: "not-allowed", opacity: 0.6 }}>+ Add player or pick</button>
          <textarea placeholder="Add a message (optional)..." rows={3} disabled style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #cbd5e1", fontSize: 13, resize: "vertical" as const, marginBottom: 14, boxSizing: "border-box" as const, opacity: 0.6 }} />
          <button disabled style={{ background: BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontWeight: 700, fontSize: 14, opacity: 0.4, cursor: "not-allowed" }}>Send Proposal</button>
        </div>
      )}
    </div>
  );
}

// ─── DRAFT HUB TAB ────────────────────────────────────────────────────────────

const POS_COLOR: Record<string, string> = {
  DEF: "#3b82f6", KPD: "#1d4ed8", MID: "#10b981", RUCK: "#8b5cf6", FWD: "#ef4444", KPF: "#b91c1c",
};

function DraftHubTab() {
  const [sub, setSub] = useState<"picks" | "freeagents" | "mylist">("picks");
  const [year, setYear] = useState(2026);
  const [teamFilter, setTeamFilter] = useState("");
  const [faSearch, setFaSearch] = useState("");
  const [faPosFilter, setFaPosFilter] = useState("ALL");

  const picks = ALL_PICKS; // only 2026 for demo
  const filtered = teamFilter ? picks.filter(p => p.currentOwner === teamFilter || p.originalOwner === teamFilter) : picks;
  const byRound = [1, 2, 3, 4, 5].map(r => ({ round: r, picks: filtered.filter(p => p.round === r) }));

  const tradedCount = picks.filter(p => p.originalOwner !== p.currentOwner).length;

  const filteredFa = FREE_AGENTS.filter(p => {
    if (faPosFilter !== "ALL" && !p.positions.includes(faPosFilter)) return false;
    if (faSearch) {
      const q = faSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q) || p.positions.join(" ").toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => b.avg - a.avg);

  const ltilCount = MY_ROSTER.filter(p => p.designation === "ltil").length;

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{ display: "flex", borderBottom: "2px solid #1e3a5f", marginBottom: 20, overflowX: "auto" }}>
        {([
          ["picks", "Draft Picks"],
          ["freeagents", `Free Agents (${FREE_AGENTS.length})`],
          ["mylist", `My List (${MY_ROSTER.length}/46${ltilCount > 0 ? ` +${ltilCount} LTI` : ""})`],
        ] as const).map(([key, label]) => (
          <button key={key} onClick={() => setSub(key)} style={{
            padding: "10px 20px", background: "none", border: "none",
            borderBottom: sub === key ? `2px solid ${BLUE}` : "2px solid transparent",
            color: sub === key ? BLUE : DIM,
            fontWeight: sub === key ? 700 : 500,
            cursor: "pointer", marginBottom: -2, fontSize: 13,
            whiteSpace: "nowrap", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      {/* ── PICKS ── */}
      {sub === "picks" && (
        <div>
          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", border: "1px solid #e2e8f0", borderRadius: 8, overflow: "hidden" }}>
              {[2026, 2027].map(y => (
                <button key={y} onClick={() => setYear(y)} style={{ padding: "7px 18px", border: "none", background: year === y ? BLUE : "#fff", color: year === y ? "#fff" : "#374151", fontWeight: year === y ? 700 : 500, cursor: "pointer", fontSize: 13 }}>{y}</button>
              ))}
            </div>
            <select value={teamFilter} onChange={e => setTeamFilter(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 13, color: "#374151" }}>
              <option value="">All Teams</option>
              {TEAMS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
            <div style={{ marginLeft: "auto", fontSize: 13, color: DIM }}>
              {filtered.length} picks{tradedCount > 0 && !teamFilter ? ` · ${tradedCount} via trade` : ""}
            </div>
          </div>

          {year === 2027 && (
            <div style={{ textAlign: "center", color: DIM, padding: "40px 0", fontSize: 14 }}>
              2027 picks will populate as the 2026 season progresses and trades are made.
            </div>
          )}

          {year === 2026 && (
            <>
              {/* Owner summary pills */}
              {!teamFilter && (
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8, marginBottom: 24, padding: 14, background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
                  {TEAMS.map(t => {
                    const count = picks.filter(p => p.currentOwner === t.name).length;
                    return (
                      <button key={t.id} onClick={() => setTeamFilter(t.name)} title={`${t.name}: ${count} picks`}
                        style={{ padding: "4px 10px", borderRadius: 99, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, color: count > 5 ? "#16a34a" : count < 5 ? "#e11d48" : "#374151" }}>
                        <span>{t.name}</span>
                        <span style={{ background: count > 5 ? "#dcfce7" : count < 5 ? "#fee2e2" : "#f1f5f9", color: count > 5 ? "#16a34a" : count < 5 ? "#e11d48" : "#374151", borderRadius: 99, padding: "1px 7px", fontWeight: 700, fontSize: 11 }}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              )}
              {teamFilter && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: TEXT }}>{teamFilter} — {year} picks ({filtered.length})</div>
                  <button onClick={() => setTeamFilter("")} style={{ fontSize: 12, color: DIM, background: "none", border: "1px solid #334155", borderRadius: 6, padding: "3px 10px", cursor: "pointer" }}>Clear</button>
                </div>
              )}
              {byRound.map(({ round, picks: rp }) => rp.length === 0 ? null : (
                <div key={round} style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: "#fff", background: "#1e293b", padding: "4px 14px", borderRadius: 99 }}>
                      Round {round}
                    </div>
                    <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
                    <div style={{ fontSize: 12, color: DIM }}>{rp.length} pick{rp.length !== 1 ? "s" : ""}</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8 }}>
                    {rp.map((pick, idx) => {
                      const isTraded = pick.originalOwner !== pick.currentOwner;
                      return (
                        <div key={idx} style={{ padding: "10px 12px", borderRadius: 8, border: isTraded ? "1px solid #7c3aed44" : "1px solid #e2e8f0", background: isTraded ? "#f5f3ff" : "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                          <div style={{ fontWeight: 600, fontSize: 12, color: "#1e293b", marginBottom: 4 }}>{pick.label}</div>
                          {isTraded ? (
                            <div style={{ fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                              <span style={{ background: "#7c3aed", color: "#fff", borderRadius: 99, padding: "1px 6px", fontWeight: 700, fontSize: 10 }}>TRADED</span>
                              <span style={{ color: "#5b21b6", fontWeight: 600, fontSize: 11 }}>→ {pick.currentOwner.split(" ")[0]}</span>
                            </div>
                          ) : (
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{pick.currentOwner.split(" ")[0]}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* ── FREE AGENTS ── */}
      {sub === "freeagents" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" as const }}>
            <input
              type="text" placeholder="Search by name or position..."
              value={faSearch} onChange={e => setFaSearch(e.target.value)}
              style={{ flex: 1, minWidth: 160, padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#1e293b", color: TEXT, fontSize: 13, boxSizing: "border-box" as const }}
            />
            <div style={{ display: "flex", gap: 4 }}>
              {["ALL", "DEF", "KPD", "MID", "RUCK", "FWD", "KPF"].map(pos => (
                <button key={pos} onClick={() => setFaPosFilter(pos)} style={{
                  padding: "6px 11px", border: "none", borderRadius: 20, fontSize: 12, cursor: "pointer",
                  fontWeight: faPosFilter === pos ? 700 : 500,
                  background: faPosFilter === pos ? BLUE : "#1e293b",
                  color: faPosFilter === pos ? "#fff" : MUTED,
                }}>{pos}</button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: 11, color: DIM, marginBottom: 8 }}>{filteredFa.length} free agent{filteredFa.length !== 1 ? "s" : ""} · sorted by avg score</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 14px", marginBottom: 4 }}>
            <span style={{ flex: 1, fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.05em" }}>Player</span>
            <span style={{ width: 50, textAlign: "right" as const, fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase" as const }}>Avg</span>
            <span style={{ width: 36, textAlign: "right" as const, fontSize: 11, color: "#475569", fontWeight: 600, textTransform: "uppercase" as const }}>GP</span>
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            {filteredFa.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 8, background: "#1e293b", border: "1px solid #334155" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: TEXT, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" as const }}>
                    <span style={{ fontSize: 11, color: DIM }}>{p.club}</span>
                    {p.positions.map(pos => (
                      <span key={pos} style={{ fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 99, background: POS_COLOR[pos] ?? "#475569", color: "#fff" }}>{pos}</span>
                    ))}
                  </div>
                </div>
                <div style={{ width: 50, textAlign: "right" as const, flexShrink: 0 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>{p.avg}</span>
                </div>
                <div style={{ width: 36, textAlign: "right" as const, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, color: MUTED }}>{p.gp}</span>
                </div>
              </div>
            ))}
            {filteredFa.length === 0 && <div style={{ padding: 40, textAlign: "center", color: DIM, fontSize: 14 }}>No free agents found</div>}
          </div>
        </div>
      )}

      {/* ── MY LIST ── */}
      {sub === "mylist" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #e2e8f0" }}>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{MY_ROSTER.length}/46</span>
              <span style={{ fontSize: 13, color: "#64748b" }}> players</span>
              {ltilCount > 0 && (
                <span style={{ marginLeft: 10, fontSize: 12, fontWeight: 700, background: "#fffbeb", color: "#d97706", border: "1px solid #fcd34d", borderRadius: 99, padding: "2px 9px" }}>
                  +{ltilCount} LTI slot
                </span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              {MY_ROSTER.filter(p => !p.designation).length} active · {ltilCount} LTIL
            </div>
          </div>
          <div style={{ display: "grid", gap: 4 }}>
            {[...MY_ROSTER].sort((a, b) => {
              const posOrder = ["DEF","KPD","MID","RUCK","FWD","KPF"];
              const pa = posOrder.indexOf(a.positions[0] ?? "");
              const pb = posOrder.indexOf(b.positions[0] ?? "");
              return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb) || a.name.localeCompare(b.name);
            }).map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 8, background: "#fff", border: p.designation === "ltil" ? "1px solid #fcd34d" : "1px solid #e2e8f0" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#1e293b" }}>{p.name}</span>
                    {p.designation === "ltil" && <span style={{ fontSize: 10, fontWeight: 700, background: "#fef3c7", color: "#d97706", border: "1px solid #fcd34d", borderRadius: 99, padding: "1px 7px" }}>LTIL</span>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{p.club}</span>
                    {p.positions.map(pos => (
                      <span key={pos} style={{ fontSize: 10, fontWeight: 700, padding: "1px 5px", borderRadius: 99, background: POS_COLOR[pos] ?? "#475569", color: "#fff" }}>{pos}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>{p.avg}</div>
                  <div style={{ fontSize: 10, color: "#94a3b8" }}>avg</div>
                </div>
              </div>
            ))}
          </div>
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
  { key: "trades",  label: "Trades" },
  { key: "draft",   label: "Draft Hub" },
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
        {tab === "trades"  && <TradeCentreTab />}
        {tab === "draft"   && <DraftHubTab />}
        {tab === "hq"      && <LeagueHQTab />}
      </div>

      {/* Footer */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px", borderTop: `1px solid ${BORDER}`, marginTop: 20, paddingTop: 20, fontSize: 12, color: "#2a3a5a", textAlign: "center" }}>
        This is a demo league. <strong style={{ color: "#3a4a6a" }}>Dynasty Live HQ</strong> — launching for the 2027 AFL season.
      </div>
    </div>
  );
}
