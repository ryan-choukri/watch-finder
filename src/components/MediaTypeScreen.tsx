import { ArrowLeft, Film, Tv } from "lucide-react";

interface MediaTypeScreenProps {
  onSelect: (type: "movie" | "series") => void;
  onBack: () => void;
}

export default function MediaTypeScreen({
  onSelect,
  onBack,
}: MediaTypeScreenProps) {
  return (
    <div className="screen">
      <header className="header">
        <div className="container header__inner">
          <button onClick={onBack} className="btn btn--small">
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="label">Step 1 of 3</span>
        </div>
      </header>

      <main className="screen__body">
        <div className="container">
          <div className="text-center mb-xl animate-slide-up">
            <span className="label mb-md" style={{ display: "block" }}>
              Choose Your Medium
            </span>
            <h1 className="heading-2">
              What Are You
              <br />
              Looking For?
            </h1>
          </div>

          <div
            className="grid grid--2cols animate-slide-up stagger-2"
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              gap: "var(--space-lg)",
            }}
          >
            <button
              onClick={() => onSelect("movie")}
              className="flex frame frame--heavy"
              style={{
                padding: "var(--space-2xl) var(--space-lg)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all var(--transition-fast)",
                background: "var(--color-paper)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-ink)";
                e.currentTarget.style.color = "var(--color-paper)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-paper)";
                e.currentTarget.style.color = "var(--color-ink)";
              }}
            >
              <Film size={48} strokeWidth={1.5} />
              <h2 className="pl-3 heading-3 content-center">Movies</h2>
              <p className="meta text-muted mt-sm">Feature films & cinema</p>
            </button>

            <button
              onClick={() => onSelect("series")}
              className="flex frame frame--heavy"
              style={{
                padding: "var(--space-2xl) var(--space-lg)",
                cursor: "pointer",
                textAlign: "center",
                transition: "all var(--transition-fast)",
                background: "var(--color-paper)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-ink)";
                e.currentTarget.style.color = "var(--color-paper)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--color-paper)";
                e.currentTarget.style.color = "var(--color-ink)";
              }}
            >
              <Tv size={48} strokeWidth={1.5} />
              <h2 className="pl-3 heading-3 content-center">Series</h2>
              <p className="meta text-muted mt-sm">TV shows & episodic</p>
            </button>
          </div>
        </div>
      </main>

      <footer className="screen__footer">
        <div className="container">
          <div className="progress">
            <div className="progress__step progress__step--active" />
            <div className="progress__step" />
            <div className="progress__step" />
          </div>
        </div>
      </footer>
    </div>
  );
}
