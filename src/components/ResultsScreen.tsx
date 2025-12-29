import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, ExternalLink } from "lucide-react";

interface Recommendation {
  id: number;
  title: string;
  description: string;
  year: number;
  rating: string;
  poster: string;
  genres: string[];
}

interface ResultsScreenProps {
  mediaType: string;
  genres: string[];
  swipeHistory: Array<{ id: number; title: string; action: string }>;
  onRestart: () => void;
}

export default function ResultsScreen({
  mediaType,
  genres,
  swipeHistory,
  onRestart,
}: ResultsScreenProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(false);

      const apiUrl = `${
        import.meta.env.VITE_SUPABASE_URL
      }/functions/v1/get-recommendations`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaType,
          genres,
          swipeHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const likedCount = swipeHistory.filter((s) => s.action === "like").length;

  if (loading) {
    return (
      <div className="screen">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Curating your selection...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div
          className="screen__body"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            className="frame animate-slide-up"
            style={{ maxWidth: "400px", textAlign: "center" }}
          >
            <div className="frame__header">
              <span className="label">Error</span>
            </div>
            <div className="frame__body stack stack--lg">
              <h2 className="heading-3">Something Went Wrong</h2>
              <p className="body-text text-muted">
                We couldn't fetch your recommendations. Please try again.
              </p>
              <button
                onClick={fetchRecommendations}
                className="btn btn--filled"
              >
                <RotateCcw size={18} />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <header className="header">
        <div className="container header__inner">
          <button onClick={onRestart} className="btn btn--small">
            <ArrowLeft size={16} />
            Start Over
          </button>
          <span className="label">Watch Finder</span>
        </div>
      </header>

      <main className="screen__body">
        <div className="container">
          <div className="results__header animate-slide-up">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "var(--space-md)",
                marginBottom: "var(--space-lg)",
              }}
            >
              <span className="tag tag--filled">{likedCount} Likes</span>
              <span className="tag">
                {mediaType === "movie" ? "Films" : "Series"}
              </span>
            </div>
            <h1 className="results__title">Your Picks</h1>
            <p className="results__subtitle">
              Curated selections tailored to your taste
            </p>
          </div>

          <div className="divider divider--thick" />

          {recommendations.length > 0 ? (
            <div className="results__grid">
              {recommendations.map((rec, index) => (
                <article
                  key={rec.id}
                  className="card animate-slide-up"
                  style={{
                    animationDelay: `${0.1 + index * 0.1}s`,
                    opacity: 0,
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <img
                      src={rec.poster}
                      alt={rec.title}
                      className="card__image"
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "var(--space-sm)",
                        right: "var(--space-sm)",
                      }}
                    >
                      <span className="tag tag--accent">★ {rec.rating}</span>
                    </div>
                  </div>
                  <div className="card__content">
                    <div>
                      <h3 className="card__title">{rec.title}</h3>
                      <div className="card__meta">
                        <span>{rec.year}</span>
                        <span>•</span>
                        <span>{rec.genres[0]}</span>
                      </div>
                    </div>
                    <p className="card__description">{rec.description}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                      }}
                    >
                      <div className="tag-group">
                        {rec.genres.slice(0, 2).map((genre) => (
                          <span key={genre} className="tag">
                            {genre}
                          </span>
                        ))}
                      </div>
                      <button
                        className="btn btn--small btn--icon"
                        aria-label="View details"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="results__empty animate-fade-in">
              <span className="label mb-md" style={{ display: "block" }}>
                No Results
              </span>
              <h3 className="heading-3 mb-md">No Recommendations Yet</h3>
              <p className="body-text text-muted mb-lg">
                Try swiping on more titles to get personalized suggestions.
              </p>
              <button onClick={onRestart} className="btn">
                Start Over
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="screen__footer">
        <div className="container text-center">
          <button onClick={onRestart} className="btn btn--large btn--filled">
            <RotateCcw size={20} />
            Discover More
          </button>
        </div>
      </footer>
    </div>
  );
}
