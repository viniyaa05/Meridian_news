import React, { useState } from "react";

const ARTICLES = [
  {
    id: 1,
    section: "Technology",
    headline: "The Quiet Return of the Physical Button",
    dek: "After a decade of glass slabs, carmakers and phone designers are rediscovering what your thumb already knew.",
    byline: "Aiko Nishimura",
    date: "Sept 5, 2026",
    readMins: 7,
    body: [
      "For most of the last decade, the story of consumer hardware was a story of subtraction. Buttons vanished from car dashboards. Keys thinned to nothing on laptops. Even the humble volume rocker seemed, for a moment, like it might not survive the century.",
      "That trend has quietly reversed. In the last eighteen months, three of the five largest automakers have reintroduced physical climate controls after customer complaints about touchscreen menus. Phone makers have followed with textured side buttons that do real, mappable work instead of standing in for a home screen icon.",
      "The reason isn't nostalgia, designers say — it's error rates. A button you can find without looking is a button you don't crash your car reaching for. Touch interfaces are wonderful for browsing and terrible for anything that needs to happen in under a second.",
      "What's emerging instead is a hybrid vocabulary: screens for information, physical controls for anything urgent or repeated. It's a lesson industrial designers learned decades ago and briefly forgot in the rush toward minimalism.",
    ],
  },
  {
    id: 2,
    section: "Economy",
    headline: "Small Ports, Big Bottleneck",
    dek: "Regional shipping hubs are becoming the unexpected chokepoint in global trade recovery.",
    byline: "Marcus Webb",
    date: "Sept 5, 2026",
    readMins: 5,
    body: [
      "While attention has stayed fixed on the world's largest container ports, a quieter capacity crunch has been building in the mid-sized harbors that feed them.",
      "These secondary ports, often handling regional distribution rather than transoceanic freight, were built for a smaller and slower era of trade. Volume has roughly doubled at a dozen such facilities since 2019, without matching investment in cranes, rail spurs, or warehouse space.",
      "The result is a lag that doesn't show up in headline shipping statistics but adds days to delivery times for everything from auto parts to produce.",
    ],
  },
  {
    id: 3,
    section: "Science",
    headline: "Deep-Sea Microbes May Explain Ancient Mass Extinction",
    dek: "A newly modeled feedback loop links ocean methane, oxygen collapse, and a die-off 250 million years old.",
    byline: "Priya Raman",
    date: "Sept 4, 2026",
    readMins: 6,
    body: [
      "Researchers modeling ocean chemistry at the end of the Permian period believe they've identified a mechanism that could explain how a mass extinction, once thought to unfold over millennia, may have accelerated in a geological blink.",
      "The model centers on methane-producing microbes that thrived as ocean temperatures rose, consuming oxygen faster than it could be replenished and triggering a cascading collapse in marine life.",
      "If correct, the finding has uncomfortable implications for how quickly modern oceans could shift under similar warming pressure.",
    ],
  },
  {
    id: 4,
    section: "Culture",
    headline: "The Used Bookstore Is Having a Moment, Again",
    dek: "Independent booksellers report their strongest year in over a decade — and it isn't just nostalgia.",
    byline: "Devon Ashworth",
    date: "Sept 3, 2026",
    readMins: 4,
    body: [
      "Foot traffic at independent bookstores is up sharply this year, according to two separate trade surveys, reversing a decline that many assumed was permanent.",
      "Owners point to a generation of younger readers using stores as a filter against algorithmic recommendation, preferring a curated shelf to an infinite feed.",
      "Whatever the cause, the numbers are hard to argue with: several stores report waitlists for their in-store book clubs for the first time in memory.",
    ],
  },
  {
    id: 5,
    section: "Technology",
    headline: "Why Your Next Software Update Might Ask Permission Twice",
    dek: "New consent standards are reshaping how apps request access to your data — for better and worse.",
    byline: "Aiko Nishimura",
    date: "Sept 2, 2026",
    readMins: 5,
    body: [
      "A new wave of platform policy is forcing apps to separate 'can we have this' from 'can we use this for that,' splitting what used to be a single permission dialog into two distinct asks.",
      "Privacy advocates call it overdue. Developers call it friction. Early data suggests users are more likely to grant narrow, specific permissions than broad ones — even when the end result is functionally similar.",
    ],
  },
  {
    id: 6,
    section: "Economy",
    headline: "The Four-Day Week, Three Years Later",
    dek: "Companies that ran early trials share what actually changed — and what didn't.",
    byline: "Marcus Webb",
    date: "Sept 1, 2026",
    readMins: 6,
    body: [
      "Long enough time has passed since the first wave of four-day-week trials that companies now have real, multi-year data instead of pilot-program enthusiasm.",
      "The consistent finding: productivity per hour rises, but not always enough to offset the lost day outright. The companies that stuck with the model tend to be those that redesigned meetings and handoffs, not just compressed the calendar.",
    ],
  },
];

const SECTIONS = ["All", "Technology", "Economy", "Science", "Culture"];

export default function NewsApp() {
  const [section, setSection] = useState("All");
  const [query, setQuery] = useState("");
  const [openArticle, setOpenArticle] = useState(null);
  const [view, setView] = useState("front"); // "front" | "saved"
  const [savedIds, setSavedIds] = useState([]);
  const [savedLoaded, setSavedLoaded] = useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("saved-article-ids");
      if (raw) setSavedIds(JSON.parse(raw));
    } catch (e) {
      // no saved articles yet
    } finally {
      setSavedLoaded(true);
    }
  }, []);

  const toggleSave = (id) => {
    const next = savedIds.includes(id)
      ? savedIds.filter((x) => x !== id)
      : [...savedIds, id];
    setSavedIds(next);
    try {
      localStorage.setItem("saved-article-ids", JSON.stringify(next));
    } catch (e) {
      console.error("Could not save", e);
    }
  };

  const bySection =
    section === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.section === section);

  const q = query.trim().toLowerCase();
  const filtered = q
    ? bySection.filter(
        (a) =>
          a.headline.toLowerCase().includes(q) ||
          a.dek.toLowerCase().includes(q) ||
          a.byline.toLowerCase().includes(q)
      )
    : bySection;

  const savedArticles = ARTICLES.filter((a) => savedIds.includes(a.id));

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        background: "#F6F4EF",
        color: "#1A1A1F",
        minHeight: "100vh",
      }}
    >
      {openArticle ? (
        <ArticleView
          article={openArticle}
          onBack={() => setOpenArticle(null)}
          isSaved={savedIds.includes(openArticle.id)}
          onToggleSave={() => toggleSave(openArticle.id)}
        />
      ) : view === "saved" ? (
        <SavedPage
          section={section}
          setSection={setSection}
          query={query}
          setQuery={setQuery}
          view={view}
          setView={setView}
          savedCount={savedIds.length}
          savedLoaded={savedLoaded}
          articles={savedArticles}
          onOpen={setOpenArticle}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
      ) : (
        <FrontPage
          section={section}
          setSection={setSection}
          query={query}
          setQuery={setQuery}
          view={view}
          setView={setView}
          savedCount={savedIds.length}
          featured={featured}
          rest={rest}
          onOpen={setOpenArticle}
          savedIds={savedIds}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
}

function Masthead({
  section,
  setSection,
  query,
  setQuery,
  view,
  setView,
  savedCount,
}) {
  const today = new Date("2026-09-07").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header
      style={{
        borderBottom: "2px solid #1A1A1F",
        maxWidth: 960,
        margin: "0 auto",
        padding: "28px 24px 0",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "'Inter', sans-serif",
          fontSize: 12,
          color: "#5B5F6B",
          letterSpacing: "0.02em",
          marginBottom: 18,
        }}
      >
        <span>{today}</span>
        <span>Vol. 4, No. 214</span>
      </div>
      <h1
        onClick={() => setView("front")}
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontWeight: 700,
          fontSize: "clamp(40px, 7vw, 64px)",
          textAlign: "center",
          margin: "0 0 22px",
          letterSpacing: "-0.01em",
          cursor: "pointer",
        }}
      >
        The Meridian
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setView("front");
          }}
          placeholder="Search articles, authors…"
          style={{
            width: "100%",
            maxWidth: 420,
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            padding: "9px 14px",
            border: "1px solid #DCD8CE",
            background: "#FFFFFF",
            color: "#1A1A1F",
            outline: "none",
          }}
        />
      </div>

      <nav
        style={{
          display: "flex",
          gap: 28,
          justifyContent: "center",
          alignItems: "baseline",
          paddingBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {SECTIONS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSection(s);
              setView("front");
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: 14,
              fontWeight: view === "front" && section === s ? 700 : 500,
              color: view === "front" && section === s ? "#B3122B" : "#1A1A1F",
              padding: "4px 0",
              borderBottom:
                view === "front" && section === s
                  ? "2px solid #B3122B"
                  : "2px solid transparent",
            }}
          >
            {s}
          </button>
        ))}
        <span style={{ color: "#DCD8CE" }}>|</span>
        <button
          onClick={() => setView("saved")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: 14,
            fontWeight: view === "saved" ? 700 : 500,
            color: view === "saved" ? "#B3122B" : "#1A1A1F",
            padding: "4px 0",
            borderBottom: view === "saved" ? "2px solid #B3122B" : "2px solid transparent",
          }}
        >
          Saved{savedCount > 0 ? ` (${savedCount})` : ""}
        </button>
      </nav>
    </header>
  );
}

function FrontPage({
  section,
  setSection,
  query,
  setQuery,
  view,
  setView,
  savedCount,
  featured,
  rest,
  onOpen,
  savedIds,
  onToggleSave,
}) {
  const mastheadProps = { section, setSection, query, setQuery, view, setView, savedCount };

  if (!featured) {
    return (
      <div>
        <Masthead {...mastheadProps} />
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "80px 24px",
            textAlign: "center",
            color: "#5B5F6B",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {query.trim()
            ? `No stories match "${query.trim()}".`
            : "Nothing filed under this section yet."}
        </div>
      </div>
    );
  }

  return (
    <div>
      <Masthead {...mastheadProps} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 80px" }}>
        {/* Featured story */}
        <article
          style={{
            paddingBottom: 36,
            borderBottom: "1px solid #DCD8CE",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <SectionTag>{featured.section}</SectionTag>
            <SaveButton saved={savedIds.includes(featured.id)} onClick={() => onToggleSave(featured.id)} />
          </div>
          <h2
            onClick={() => onOpen(featured)}
            style={{
              cursor: "pointer",
              fontFamily: "'Source Serif 4', serif",
              fontWeight: 700,
              fontSize: "clamp(28px, 4vw, 42px)",
              lineHeight: 1.1,
              margin: "10px 0 14px",
              maxWidth: 680,
            }}
          >
            {featured.headline}
          </h2>
          <p
            onClick={() => onOpen(featured)}
            style={{
              cursor: "pointer",
              fontFamily: "'Source Serif 4', serif",
              fontSize: 19,
              lineHeight: 1.5,
              color: "#3A3D44",
              maxWidth: 620,
              margin: "0 0 14px",
            }}
          >
            {featured.dek}
          </p>
          <Byline article={featured} />
        </article>

        {/* River of remaining stories */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            columnGap: 40,
          }}
        >
          {rest.map((a) => (
            <article
              key={a.id}
              style={{
                paddingBottom: 24,
                marginBottom: 24,
                borderBottom: "1px solid #DCD8CE",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <SectionTag>{a.section}</SectionTag>
                <SaveButton saved={savedIds.includes(a.id)} onClick={() => onToggleSave(a.id)} />
              </div>
              <h3
                onClick={() => onOpen(a)}
                style={{
                  cursor: "pointer",
                  fontFamily: "'Source Serif 4', serif",
                  fontWeight: 600,
                  fontSize: 22,
                  lineHeight: 1.25,
                  margin: "8px 0 10px",
                }}
              >
                {a.headline}
              </h3>
              <p
                onClick={() => onOpen(a)}
                style={{
                  cursor: "pointer",
                  fontFamily: "'Source Serif 4', serif",
                  fontSize: 16,
                  lineHeight: 1.5,
                  color: "#3A3D44",
                  margin: "0 0 12px",
                }}
              >
                {a.dek}
              </p>
              <Byline article={a} small />
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function SavedPage({
  section,
  setSection,
  query,
  setQuery,
  view,
  setView,
  savedCount,
  savedLoaded,
  articles,
  onOpen,
  savedIds,
  onToggleSave,
}) {
  const mastheadProps = { section, setSection, query, setQuery, view, setView, savedCount };

  return (
    <div>
      <Masthead {...mastheadProps} />
      <main style={{ maxWidth: 960, margin: "0 auto", padding: "36px 24px 80px" }}>
        <h2
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontWeight: 700,
            fontSize: 28,
            margin: "0 0 24px",
          }}
        >
          Saved for later
        </h2>

        {!savedLoaded ? (
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#5B5F6B" }}>Loading…</p>
        ) : articles.length === 0 ? (
          <p style={{ fontFamily: "'Inter', sans-serif", color: "#5B5F6B", fontSize: 15 }}>
            Nothing saved yet. Tap the bookmark on any story to keep it here.
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              columnGap: 40,
            }}
          >
            {articles.map((a) => (
              <article
                key={a.id}
                style={{
                  paddingBottom: 24,
                  marginBottom: 24,
                  borderBottom: "1px solid #DCD8CE",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <SectionTag>{a.section}</SectionTag>
                  <SaveButton saved={savedIds.includes(a.id)} onClick={() => onToggleSave(a.id)} />
                </div>
                <h3
                  onClick={() => onOpen(a)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "'Source Serif 4', serif",
                    fontWeight: 600,
                    fontSize: 22,
                    lineHeight: 1.25,
                    margin: "8px 0 10px",
                  }}
                >
                  {a.headline}
                </h3>
                <p
                  onClick={() => onOpen(a)}
                  style={{
                    cursor: "pointer",
                    fontFamily: "'Source Serif 4', serif",
                    fontSize: 16,
                    lineHeight: 1.5,
                    color: "#3A3D44",
                    margin: "0 0 12px",
                  }}
                >
                  {a.dek}
                </p>
                <Byline article={a} small />
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function SaveButton({ saved, onClick }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title={saved ? "Remove from Saved" : "Save for later"}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0 0 0 12px",
        color: saved ? "#B3122B" : "#5B5F6B",
        fontSize: 18,
        lineHeight: 1,
      }}
    >
      {saved ? "★" : "☆"}
    </button>
  );
}

function SectionTag({ children }) {
  return (
    <span
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 12,
        fontWeight: 700,
        color: "#B3122B",
      }}
    >
      {children}
    </span>
  );
}

function Byline({ article, small }) {
  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: small ? 12 : 13,
        color: "#5B5F6B",
      }}
    >
      By {article.byline} · {article.date} · {article.readMins} min read
    </div>
  );
}

function ArticleView({ article, onBack, isSaved, onToggleSave }) {
  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#B3122B",
            padding: 0,
          }}
        >
          ← Front Page
        </button>
        <button
          onClick={onToggleSave}
          style={{
            background: "none",
            border: "1px solid #DCD8CE",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: isSaved ? "#B3122B" : "#1A1A1F",
            padding: "6px 12px",
          }}
        >
          {isSaved ? "★ Saved" : "☆ Save for later"}
        </button>
      </div>

      <SectionTag>{article.section}</SectionTag>
      <h1
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontWeight: 700,
          fontSize: "clamp(32px, 5vw, 46px)",
          lineHeight: 1.1,
          margin: "12px 0 16px",
        }}
      >
        {article.headline}
      </h1>
      <p
        style={{
          fontFamily: "'Source Serif 4', serif",
          fontStyle: "italic",
          fontSize: 20,
          lineHeight: 1.5,
          color: "#3A3D44",
          margin: "0 0 18px",
        }}
      >
        {article.dek}
      </p>

      <div
        style={{
          borderTop: "1px solid #DCD8CE",
          borderBottom: "1px solid #DCD8CE",
          padding: "14px 0",
          marginBottom: 32,
        }}
      >
        <Byline article={article} />
      </div>

      {article.body.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: 19,
            lineHeight: 1.7,
            color: "#1A1A1F",
            marginBottom: 22,
          }}
        >
          {para}
        </p>
      ))}
    </main>
  );
}
