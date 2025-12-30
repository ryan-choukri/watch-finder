import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, ExternalLink, Loader } from "lucide-react";
import { fetchMediaByIds, type MediaItem } from "../services/tmdb";

interface ResultsScreenProps {
  mediaType: "movie" | "series";
  genres: string[];
  swipeHistory: Array<{
    id: number;
    title: string;
    action: "like" | "dislike";
  }>;
  onRestart: () => void;
}

export default function ResultsScreen({
  mediaType,
  swipeHistory,
  onRestart,
}: ResultsScreenProps) {
  const [recommendations, setRecommendations] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Analyzing your taste...");

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(false);
      setStatusMessage("Analyzing your taste...");

      // Call the Supabase Edge Function to get AI recommendations
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/functions/v1/get-customfilm`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaType,
            swipeHistory,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get recommendations from AI");
      }

      const data = await response.json();

      if (!data.success || !data.recommendedIds?.length) {
        throw new Error("No recommendations returned");
      }

      // Log if fallback was used
      if (data.fallbackUsed) {
        console.log("Using fallback recommendations");
        setStatusMessage("Fetching popular titles...");
      } else {
        setStatusMessage("Fetching personalized recommendations...");
      }

      // Fetch full details for each recommended ID from TMDB
      const mediaDetails = await fetchMediaByIds(
        data.recommendedIds,
        mediaType
      );

      if (mediaDetails.length === 0) {
        throw new Error("Could not fetch movie details");
      }

      setRecommendations(mediaDetails);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 30); // Small delay for better UX
    }
  };

  const likedCount = swipeHistory.filter((s) => s.action === "like").length;

  if (loading) {
    return (
      <div className="screen">
        <div className="loading">
          <Loader
            className="loading__spinner"
            size={32}
            style={{ animation: "spin 1s linear infinite" }}
          />
          <span className="loading__text">{statusMessage}</span>
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
            Recommencer
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
            <h1 className="results__title">Votre Selection ! ✨</h1>
            <p className="results__subtitle">
              Actuelement connecté a l'IA la moins cher, les resultats sont
              comment ?.
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="results__grid">
              {recommendations.map((rec, index) => (
                <article
                  key={rec.id}
                  className="card animate-slide-up"
                  style={{
                    animationDelay: `${0.1 + index * 0.1}s`,
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
                        {rec.genres[0] && (
                          <>
                            <span>•</span>
                            <span>{rec.genres[0]}</span>
                          </>
                        )}
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
                      <a
                        href={`https://www.themoviedb.org/${
                          mediaType === "movie" ? "movie" : "tv"
                        }/${rec.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn--small btn--icon"
                        aria-label="View on TMDB"
                      >
                        <ExternalLink size={14} />
                      </a>
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
                Recommencer
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
