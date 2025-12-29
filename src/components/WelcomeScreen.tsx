import { Film, Play } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="welcome">
      <div
        className="stack stack--lg"
        style={{ alignItems: "center", zIndex: 1 }}
      >
        <div className="animate-slide-up stagger-1">
          <span className="label">Est. 2024</span>
        </div>

        <h1 className="welcome__logo animate-slide-up stagger-2">
          WA.Itch
          <br />
          Finder
        </h1>

        <p className="welcome__tagline animate-slide-up stagger-3">
          Discover your next favorite film through the art of the swipe
        </p>
        <p className="welcome__tagline animate-slide-up stagger-3">
          And AI-powered curation cause resources are unlimited right?
        </p>

        <div
          className="animate-slide-up stagger-4"
          style={{
            display: "flex",
            gap: "var(--space-md)",
            marginTop: "var(--space-lg)",
          }}
        >
          <div
            className="frame"
            style={{
              padding: "var(--space-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
            }}
          >
            <Film size={20} />
            <span className="meta">Movies</span>
          </div>
          <div
            className="frame"
            style={{
              padding: "var(--space-md)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
            }}
          >
            <Play size={20} />
            <span className="meta">Series</span>
          </div>
        </div>

        <div className="welcome__cta animate-slide-up stagger-5">
          <button onClick={onStart} className="btn btn--large btn--filled">
            Begin Discovery
          </button>
        </div>

        <div
          className="animate-fade-in"
          style={{
            animationDelay: "0.8s",
            opacity: 0,
            marginTop: "var(--space-xl)",
          }}
        >
          <span className="label">Swipe · Like · Discover</span>
        </div>
      </div>
    </div>
  );
}
