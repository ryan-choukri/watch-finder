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
              Plutôt 2h, c'est fait <br />
              Ou Binge watching toute la nuit ? ?
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
              className="frame frame--heavy"
              style={{
                padding: "var(--space-xl) var(--space-lg)",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-sm)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                <Film size={32} strokeWidth={1.5} />
                <h2 className="heading-3" style={{ margin: 0 }}>
                  Films
                </h2>
              </div>
              <p className="meta text-muted" style={{ margin: 0 }}>
                Longs métrages & cinéma
              </p>
            </button>

            <button
              onClick={() => onSelect("series")}
              className="frame frame--heavy"
              style={{
                padding: "var(--space-xl) var(--space-lg)",
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-sm)",
                  marginBottom: "var(--space-sm)",
                }}
              >
                <Tv size={32} strokeWidth={1.5} />
                <h2 className="heading-3" style={{ margin: 0 }}>
                  Séries
                </h2>
              </div>
              <p className="meta text-muted" style={{ margin: 0 }}>
                Séries TV & épisodiques
              </p>
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
