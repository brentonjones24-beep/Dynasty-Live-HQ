import { useState } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const TEAMS = [
  { id: 1, name: "Dusty's Dirty Dozen",     owner: "Marcus Webb",    wins: 10, losses: 3, pf: 1842, pa: 1601, streak: "W3" },
  { id: 2, name: "The Mighty Ducks",         owner: "Carla Nguyen",   wins: 9,  losses: 4, pf: 1790, pa: 1644, streak: "W1" },
  { id: 3, name: "Grundy's Grunt Squad",     owner: "Tom Elliot",     wins: 8,  losses: 5, pf: 1755, pa: 1698, streak: "L1" },
  { id: 4, name: "Homer's Donut XI",         owner: "Jay Kowalski",   wins: 8,  losses: 5, pf: 1720, pa: 1703, streak: "W2" },
  { id: 5, name: "Danger Danger",            owner: "Priya Sharma",   wins: 7,  losses: 6, pf: 1688, pa: 1711, streak: "L2" },
  { id: 6, name: "Ted Lasso United",         owner: "Ben Christou",   wins: 7,  losses: 6, pf: 1672, pa: 1699, streak: "W1" },
  { id: 7, name: "Steele Magnolias",         owner: "Amy Lawson",     wins: 6,  losses: 7, pf: 1641, pa: 1720, streak: "L1" },
  { id: 8, name: "Riewoldt's Revenge",       owner: "Dave Tran",      wins: 5,  losses: 8, pf: 1599, pa: 1755, streak: "L3" },
  { id: 9, name: "The Andre 3000s",          owner: "Sam Okoye",      wins: 4,  losses: 9, pf: 1548, pa: 1800, streak: "L2" },
  { id: 10, name: "Norm Smith Villains",     owner: "Kelly Park",     wins: 3,  losses: 10, pf: 1480, pa: 1842, streak: "L4" },
];

const FIXTURES = [
  { round: 13, home: "Dusty's Dirty Dozen", homeScore: 148, away: "Homer's Donut XI", awayScore: 122 },
  { round: 13, home: "The Mighty Ducks", homeScore: 139, away: "Danger Danger", awayScore: 131 },
  { round: 13, home: "Grundy's Grunt Squad", homeScore: 144, away: "Ted Lasso United", awayScore: 137 },
  { round: 13, home: "Steele Magnolias", homeScore: 128, away: "Riewoldt's Revenge", awayScore: 115 },
  { round: 13, home: "The Andre 3000s", homeScore: 109, away: "Norm Smith Villains", awayScore: 98 },
  { round: 12, home: "Homer's Donut XI", homeScore: 155, away: "Dusty's Dirty Dozen", awayScore: 141 },
  { round: 12, home: "Danger Danger", homeScore: 127, away: "Grundy's Grunt Squad", awayScore: 143 },
  { round: 12, home: "Ted Lasso United", homeScore: 134, away: "The Mighty Ducks", awayScore: 148 },
  { round: 12, home: "Riewoldt's Revenge", homeScore: 119, away: "Steele Magnolias", awayScore: 122 },
  { round: 12, home: "Norm Smith Villains", homeScore: 101, away: "The Andre 3000s", awayScore: 118 },
];

const ARTICLES = [
  {
    id: 1,
    type: "NEWS",
    title: "Dusty's Dirty Dozen Eye Back-to-Back Premierships",
    author: "Marcus Webb",
    date: "2 days ago",
    body: `After a dominant Round 13 performance, Dusty's Dirty Dozen sit atop the ladder with a commanding three-game buffer. Captain Dustin Martin's namesake squad posted 148 points off the back of a stunning 167-point haul from their premium midfielder — the second-highest individual score of the season.\n\n"We're not looking past anyone," Webb told The Wire this week. "But honestly, if we keep getting these kinds of scores from the engine room, it's hard to see who stops us."\n\nThe Dozen have now won 10 of 13 and boast the competition's highest points for. Finals are a formality. The question is whether they can hold form when it matters most.`,
    comments: [
      { author: "Carla Nguyen", text: "Enjoy it while it lasts, Marcus. The Ducks are coming. 🦆" },
      { author: "Dave Tran", text: "Riewoldt's Revenge will have something to say about this in the finals." },
      { author: "Jay Kowalski", text: "Homer would like a word. Mmmm... premiership." },
    ],
  },
  {
    id: 2,
    type: "ANALYSIS",
    title: "The Curse of Round 9: Why Mid-Season Form Collapses Happen",
    author: "Commissioner",
    date: "5 days ago",
    body: `Every season, without fail, at least two teams who looked like premiership contenders find themselves in freefall by Round 9. This year's victims? Norm Smith Villains and Riewoldt's Revenge — both sitting inside the top four at the halfway mark, now languishing in the bottom three.\n\nThe data is telling. Both teams went heavy on Richmond defenders in their draft, a strategy that paid early dividends but has since unravelled as the Tigers' back six shed premium scorers to injury and form loss.\n\nThe lesson, as always: never build your squad around a single club's defensive structure. Diversify or die.`,
    comments: [
      { author: "Kelly Park", text: "Villains have had the worst injury run I've ever seen. Three premium defenders gone in four weeks." },
      { author: "Sam Okoye", text: "The Andre 3000s are in rebuilding mode. We'll be back. Three thousand strong." },
      { author: "Amy Lawson", text: "Steele Magnolias quietly climbing. Just saying." },
    ],
  },
  {
    id: 3,
    type: "RECAP",
    title: "Round 13 Wrap: Ducks Fly High, Donut XI Stung",
    author: "Commissioner",
    date: "1 day ago",
    body: `Round 13 is in the books and the ladder is starting to take shape with three rounds remaining.\n\nThe headline result was The Mighty Ducks' narrow 139-131 victory over Danger Danger — a match that was in doubt until the final siren. Carla Nguyen's squad had four players score 110+ which proved the difference.\n\nHomer's Donut XI suffered a reality check, going down to Dusty's Dirty Dozen by 26 points despite posting a respectable 122. "The donuts are stale this week," Kowalski admitted.\n\nSteele Magnolias continued their quiet finals push, defeating Riewoldt's Revenge by 13 in what was a grind of a contest. Amy Lawson's team has now won three of their last four.`,
    comments: [
      { author: "Ben Christou", text: "Ted Lasso would say: 'Taking on a challenge is a lot like riding a horse. If you're comfortable while you're doing it, you're probably doing it wrong.'" },
      { author: "Priya Sharma", text: "Danger Danger will bounce back. Mark my words." },
      { author: "Marcus Webb", text: "148 points. Just leaving that there. 😎" },
    ],
  },
];

const CLASSIFIEDS = [
  {
    id: 1,
    type: "FOR SALE",
    team: "Riewoldt's Revenge",
    title: "Premium Ruck Available — Serious Offers Only",
    body: "Looking to offload a top-3 ruck averaging 118 SC. Injuries have forced a rebuild. Will consider players + picks. No tyre kickers. DM Dave.",
    date: "3 days ago",
  },
  {
    id: 2,
    type: "WANTED",
    team: "Norm Smith Villains",
    title: "Desperate for a Genuine Midfielder",
    body: "Kelly's team is in crisis. Will give up two first-round picks for a midfielder averaging 110+. Yes, I'm that desperate. Please help.",
    date: "4 days ago",
  },
  {
    id: 3,
    type: "FOR SALE",
    team: "The Andre 3000s",
    title: "Wholesale Clearance — Rebuilding Mode Activated",
    body: "Everything must go. Forwards, mids, even my pride. Sam is going full tank for 2026 picks. Make an offer, any offer. Three thousand points of pain.",
    date: "6 days ago",
  },
  {
    id: 4,
    type: "TRADE IDEA",
    team: "Homer's Donut XI",
    title: "Anyone Interested in a Forward Swap?",
    body: "Have a forward averaging 95 who I think is undervalued. Looking for similar value back or mid. Jay is open to creative packages. Mmmm... trade bait.",
    date: "1 day ago",
  },
];

const BANDF = [
  { pos: 1, player: "T. Martin", team: "Dusty's Dirty Dozen", votes: 28 },
  { pos: 2, player: "C. Oliver", team: "The Mighty Ducks", votes: 24 },
  { pos: 3, player: "P. Dangerfield", team: "Danger Danger", votes: 21 },
  { pos: 4, player: "M. Gawn", team: "Grundy's Grunt Squad", votes: 19 },
  { pos: 5, player: "Z. Merrett", team: "Ted Lasso United", votes: 17 },
  { pos: 6, player: "L. Neale", team: "Homer's Donut XI", votes: 15 },
  { pos: 7, player: "J. Steele", team: "Steele Magnolias", votes: 14 },
  { pos: 8, player: "T. De Goey", team: "Riewoldt's Revenge", votes: 11 },
];

const HISTORY = [
  { season: 2024, premiers: "The Mighty Ducks", runnerUp: "Dusty's Dirty Dozen", pf: "Homer's Donut XI", bf: "C. Oliver (The Mighty Ducks)" },
  { season: 2023, premiers: "Grundy's Grunt Squad", runnerUp: "Danger Danger", pf: "Grundy's Grunt Squad", bf: "M. Gawn (Grundy's Grunt Squad)" },
  { season: 2022, premiers: "Riewoldt's Revenge", runnerUp: "Norm Smith Villains", pf: "Dusty's Dirty Dozen", bf: "T. Lynch (Riewoldt's Revenge)" },
  { season: 2021, premiers: "Dusty's Dirty Dozen", runnerUp: "Ted Lasso United", pf: "Dusty's Dirty Dozen", bf: "T. Martin (Dusty's Dirty Dozen)" },
  { season: 2020, premiers: "Homer's Donut XI", runnerUp: "The Andre 3000s", pf: "Homer's Donut XI", bf: "L. Neale (Homer's Donut XI)" },
];

const RULES = `**Competition Format**
The league consists of 10 teams competing across a 16-round home-and-away season, followed by a four-team finals series. Rounds align with the AFL Premiership Season schedule via the round mapping system.

**Scoring**
SuperCoach scoring applies. The captain's score is doubled. Teams select an interchange bench of 5 players. Emergencies replace any player who does not register a score.

**Rosters**
Each team holds a list of 30 players across FWD, MID, RUC, and DEF positions. Trades are conducted via the in-app trade system and require acceptance from all parties. The Commissioner has final say on disputed trades.

**Draft**
The annual draft is conducted via the live Draft Hub. Pick order for the first round is determined by reverse ladder order from the previous season. Subsequent rounds snake. Draft picks may be traded.

**Auctions**
The Auction Room operates on a silent bid format. The hosting team selects items to auction; all other teams submit blind bids. The highest bid wins. Hosting order follows ladder position (worst first).

**Late Outs**
Players confirmed as late outs before match commencement are replaced by the nominated emergency. It is the team owner's responsibility to set lineups and emergencies before the relevant AFL match begins.

**Conduct**
All members are expected to conduct themselves with respect. Sledging is encouraged; abuse is not. The Commissioner reserves the right to remove any member who brings the competition into disrepute. This is a dynasty competition — we're here for the long haul.`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const typeColors = {
  NEWS: "#e8b84b",
  ANALYSIS: "#5b9cf6",
  RECAP: "#6bcb77",
  "FOR SALE": "#e8b84b",
  WANTED: "#f87171",
  "TRADE IDEA": "#a78bfa",
};

function Badge({ type }) {
  return (
    <span style={{
      background: typeColors[type] || "#888",
      color: "#0a0e1a",
      fontSize: "0.6rem",
      fontWeight: 800,
      letterSpacing: "0.12em",
      padding: "2px 8px",
      borderRadius: 3,
      textTransform: "uppercase",
    }}>{type}</span>
  );
}

function Ladder() {
  return (
    <div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e2640", color: "#5b7199", fontSize: "0.72rem", letterSpacing: "0.08em" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600 }}>#</th>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600 }}>TEAM</th>
            <th style={{ padding: "6px 8px", fontWeight: 600 }}>W</th>
            <th style={{ padding: "6px 8px", fontWeight: 600 }}>L</th>
            <th style={{ padding: "6px 8px", fontWeight: 600 }}>PF</th>
            <th style={{ padding: "6px 8px", fontWeight: 600 }}>PA</th>
            <th style={{ padding: "6px 8px", fontWeight: 600 }}>STREAK</th>
          </tr>
        </thead>
        <tbody>
          {TEAMS.map((t, i) => (
            <tr key={t.id} style={{
              borderBottom: "1px solid #111827",
              background: i < 4 ? "rgba(91,156,246,0.04)" : "transparent",
              transition: "background 0.15s",
            }}>
              <td style={{ padding: "9px 8px", color: i < 4 ? "#5b9cf6" : "#5b7199", fontWeight: 700 }}>{i + 1}</td>
              <td style={{ padding: "9px 8px" }}>
                <div style={{ fontWeight: 600, color: "#e8eaf0" }}>{t.name}</div>
                <div style={{ fontSize: "0.7rem", color: "#5b7199" }}>{t.owner}</div>
              </td>
              <td style={{ padding: "9px 8px", textAlign: "center", color: "#6bcb77", fontWeight: 700 }}>{t.wins}</td>
              <td style={{ padding: "9px 8px", textAlign: "center", color: "#f87171", fontWeight: 700 }}>{t.losses}</td>
              <td style={{ padding: "9px 8px", textAlign: "center", color: "#9ca3af" }}>{t.pf}</td>
              <td style={{ padding: "9px 8px", textAlign: "center", color: "#9ca3af" }}>{t.pa}</td>
              <td style={{ padding: "9px 8px", textAlign: "center" }}>
                <span style={{
                  color: t.streak.startsWith("W") ? "#6bcb77" : "#f87171",
                  fontWeight: 700, fontSize: "0.75rem",
                }}>{t.streak}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 8, fontSize: "0.68rem", color: "#5b7199", paddingLeft: 8 }}>
        <span style={{ color: "#5b9cf6" }}>■</span> Top 4 — Finals qualified
      </div>
    </div>
  );
}

function Results() {
  const rounds = [...new Set(FIXTURES.map(f => f.round))].sort((a, b) => b - a);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {rounds.map(r => (
        <div key={r}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", color: "#5b7199", marginBottom: 10, textTransform: "uppercase" }}>Round {r}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {FIXTURES.filter(f => f.round === r).map((f, i) => {
              const homeWon = f.homeScore > f.awayScore;
              return (
                <div key={i} style={{
                  display: "grid", gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center", gap: 12,
                  background: "#0d1120", borderRadius: 8, padding: "10px 14px",
                  border: "1px solid #1a2035",
                }}>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontWeight: homeWon ? 700 : 400, color: homeWon ? "#e8eaf0" : "#5b7199", fontSize: "0.82rem" }}>{f.home}</span>
                  </div>
                  <div style={{ textAlign: "center", fontFamily: "monospace", fontWeight: 800, fontSize: "1rem", color: "#e8b84b", whiteSpace: "nowrap" }}>
                    {f.homeScore} – {f.awayScore}
                  </div>
                  <div style={{ textAlign: "left" }}>
                    <span style={{ fontWeight: !homeWon ? 700 : 400, color: !homeWon ? "#e8eaf0" : "#5b7199", fontSize: "0.82rem" }}>{f.away}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ArticleCard({ article, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: "#0d1120", border: "1px solid #1a2035", borderRadius: 10,
      padding: "18px 20px", cursor: "pointer", transition: "border-color 0.2s, transform 0.15s",
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = "#2a3a6a"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a2035"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <Badge type={article.type} />
        <span style={{ fontSize: "0.7rem", color: "#5b7199" }}>{article.date}</span>
      </div>
      <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#e8eaf0", marginBottom: 6, lineHeight: 1.4 }}>{article.title}</div>
      <div style={{ fontSize: "0.75rem", color: "#5b7199" }}>By {article.author} · {article.comments.length} comments</div>
    </div>
  );
}

function ArticleView({ article, onBack }) {
  return (
    <div>
      <button onClick={onBack} style={{
        background: "none", border: "1px solid #1a2035", color: "#5b9cf6",
        padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: "0.78rem",
        marginBottom: 20, fontFamily: "inherit",
      }}>← Back</button>
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <Badge type={article.type} />
        <span style={{ fontSize: "0.72rem", color: "#5b7199" }}>{article.date} · By {article.author}</span>
      </div>
      <h2 style={{ margin: "0 0 18px", fontSize: "1.2rem", color: "#e8eaf0", lineHeight: 1.4 }}>{article.title}</h2>
      {article.body.split("\n\n").map((p, i) => (
        <p key={i} style={{ color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.75, marginBottom: 14 }}>{p}</p>
      ))}
      <div style={{ marginTop: 28, borderTop: "1px solid #1a2035", paddingTop: 20 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#5b7199", marginBottom: 14, textTransform: "uppercase" }}>
          {article.comments.length} Comments
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {article.comments.map((c, i) => (
            <div key={i} style={{ background: "#0d1120", borderRadius: 8, padding: "12px 14px", border: "1px solid #1a2035" }}>
              <div style={{ fontWeight: 700, fontSize: "0.75rem", color: "#5b9cf6", marginBottom: 5 }}>{c.author}</div>
              <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{c.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MediaRoom() {
  const [selected, setSelected] = useState(null);
  if (selected) return <ArticleView article={selected} onBack={() => setSelected(null)} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {ARTICLES.map(a => <ArticleCard key={a.id} article={a} onClick={() => setSelected(a)} />)}
    </div>
  );
}

function Classifieds() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {CLASSIFIEDS.map(c => (
        <div key={c.id} style={{
          background: "#0d1120", border: "1px solid #1a2035", borderRadius: 10, padding: "16px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Badge type={c.type} />
            <span style={{ fontSize: "0.7rem", color: "#5b7199" }}>{c.team} · {c.date}</span>
          </div>
          <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#e8eaf0", marginBottom: 6 }}>{c.title}</div>
          <div style={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.6 }}>{c.body}</div>
        </div>
      ))}
    </div>
  );
}

function BandF() {
  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", color: "#5b7199", marginBottom: 4, textTransform: "uppercase" }}>2025 Season — After Round 13</div>
        <div style={{ fontSize: "0.82rem", color: "#9ca3af" }}>Votes are cast on a 5-4-3-2-1 system by each team after every round.</div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #1e2640", color: "#5b7199", fontSize: "0.7rem", letterSpacing: "0.08em" }}>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600 }}>#</th>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600 }}>PLAYER</th>
            <th style={{ textAlign: "left", padding: "6px 8px", fontWeight: 600 }}>TEAM</th>
            <th style={{ textAlign: "right", padding: "6px 8px", fontWeight: 600 }}>VOTES</th>
          </tr>
        </thead>
        <tbody>
          {BANDF.map((b) => (
            <tr key={b.pos} style={{ borderBottom: "1px solid #111827" }}>
              <td style={{ padding: "10px 8px", color: b.pos === 1 ? "#e8b84b" : "#5b7199", fontWeight: 700 }}>
                {b.pos === 1 ? "🏆" : b.pos}
              </td>
              <td style={{ padding: "10px 8px", fontWeight: 600, color: "#e8eaf0" }}>{b.player}</td>
              <td style={{ padding: "10px 8px", color: "#9ca3af", fontSize: "0.78rem" }}>{b.team}</td>
              <td style={{ padding: "10px 8px", textAlign: "right" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                  <div style={{
                    height: 6, borderRadius: 3, background: "#5b9cf6",
                    width: `${(b.votes / 28) * 80}px`, minWidth: 4,
                  }} />
                  <span style={{ fontWeight: 700, color: "#e8b84b", minWidth: 24, textAlign: "right" }}>{b.votes}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeagueHistory() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {HISTORY.map(h => (
        <div key={h.season} style={{
          background: "#0d1120", border: "1px solid #1a2035", borderRadius: 10, padding: "16px 20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#e8b84b" }}>{h.season}</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", color: "#5b7199", textTransform: "uppercase" }}>Season</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "🏆 Premiers", value: h.premiers },
              { label: "🥈 Runner-Up", value: h.runnerUp },
              { label: "📊 Pts For Leader", value: h.pf },
              { label: "🎖 B&F Winner", value: h.bf },
            ].map(item => (
              <div key={item.label}>
                <div style={{ fontSize: "0.68rem", color: "#5b7199", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e8eaf0" }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RulesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {RULES.split("\n\n").map((block, i) => {
        const lines = block.split("\n");
        const heading = lines[0].replace(/\*\*/g, "");
        const body = lines.slice(1).join(" ");
        return (
          <div key={i} style={{ background: "#0d1120", border: "1px solid #1a2035", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#5b9cf6", marginBottom: 8 }}>{heading}</div>
            <div style={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.75 }}>{body}</div>
          </div>
        );
      })}
    </div>
  );
}

function LeagueHQ() {
  const [sub, setSub] = useState("rules");
  const subTabs = [
    { key: "rules", label: "Rules & Guidelines" },
    { key: "bandf", label: "B&F Votes" },
    { key: "history", label: "League History" },
  ];
  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {subTabs.map(t => (
          <button key={t.key} onClick={() => setSub(t.key)} style={{
            background: sub === t.key ? "#1a2a50" : "transparent",
            border: `1px solid ${sub === t.key ? "#5b9cf6" : "#1a2035"}`,
            color: sub === t.key ? "#5b9cf6" : "#5b7199",
            padding: "6px 14px", borderRadius: 6, cursor: "pointer",
            fontSize: "0.78rem", fontWeight: 600, fontFamily: "inherit",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>
      {sub === "rules" && <RulesView />}
      {sub === "bandf" && <BandF />}
      {sub === "history" && <LeagueHistory />}
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

const TABS = [
  { key: "ladder", label: "Ladder" },
  { key: "results", label: "Results" },
  { key: "media", label: "Media Room" },
  { key: "wire", label: "Classifieds" },
  { key: "hq", label: "League HQ" },
];

export default function DemoLeague() {
  const [tab, setTab] = useState("ladder");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#070b14",
      color: "#e8eaf0",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a0f1e 0%, #0d1530 100%)",
        borderBottom: "1px solid #1a2035",
        padding: "28px 20px 20px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background glow */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(91,156,246,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ position: "relative", maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: "1.4rem" }}>🏆</span>
                <span style={{
                  fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.18em",
                  color: "#e8b84b", textTransform: "uppercase",
                }}>Dynasty Live HQ — Demo League</span>
              </div>
              <h1 style={{
                margin: 0, fontSize: "clamp(1.3rem, 5vw, 1.8rem)",
                fontWeight: 800, color: "#e8eaf0", lineHeight: 1.2,
                letterSpacing: "-0.02em",
              }}>The Premier Fantasy<br />Football Experience</h1>
              <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#5b7199", lineHeight: 1.5 }}>
                10 teams · Season 2025 · Round 13 of 16
              </p>
            </div>
            <div style={{
              background: "#0d1530", border: "1px solid #1a2a50",
              borderRadius: 10, padding: "10px 14px", textAlign: "center", flexShrink: 0,
            }}>
              <div style={{ fontSize: "0.6rem", color: "#5b7199", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>Leader</div>
              <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "#e8b84b", lineHeight: 1.3 }}>Dusty's<br />Dirty Dozen</div>
              <div style={{ fontSize: "0.7rem", color: "#6bcb77", marginTop: 4, fontWeight: 600 }}>10W – 3L</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        borderBottom: "1px solid #1a2035",
        background: "#070b14",
        position: "sticky", top: 0, zIndex: 10,
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", maxWidth: 680, margin: "0 auto", padding: "0 12px" }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              background: "none",
              border: "none",
              borderBottom: `2px solid ${tab === t.key ? "#5b9cf6" : "transparent"}`,
              color: tab === t.key ? "#5b9cf6" : "#5b7199",
              padding: "14px 14px 12px",
              cursor: "pointer",
              fontSize: "0.78rem",
              fontWeight: tab === t.key ? 700 : 500,
              fontFamily: "inherit",
              whiteSpace: "nowrap",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "24px 16px" }}>
        {tab === "ladder" && <Ladder />}
        {tab === "results" && <Results />}
        {tab === "media" && <MediaRoom />}
        {tab === "wire" && <Classifieds />}
        {tab === "hq" && <LeagueHQ />}
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: 680, margin: "0 auto", padding: "0 16px",
        borderTop: "1px solid #1a2035", marginTop: 20, paddingTop: 20,
        fontSize: "0.72rem", color: "#2a3a5a", textAlign: "center",
      }}>
        This is a demo league. <strong style={{ color: "#3a4a6a" }}>Dynasty Live HQ</strong> — launching soon.
      </div>
    </div>
  );
}
