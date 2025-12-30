import { ArrowLeft, X, Heart, SkipForward, Loader } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { fetchMedia, type MediaItem } from "../services/tmdb";

interface SwipeScreenProps {
  mediaType: "movie" | "series";
  genres: string[];
  onComplete: (
    history: Array<{ id: number; title: string; action: "like" | "dislike" }>
  ) => void;
  onBack: () => void;
}

const SWIPE_THRESHOLD = 80;
const ROTATION_FACTOR = 0.15;
const CARDS_TO_SWIPE = 12; // Number of cards before showing results

export default function SwipeScreen({
  mediaType,
  genres,
  onComplete,
  onBack,
}: SwipeScreenProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeHistory, setSwipeHistory] = useState<
    Array<{ id: number; title: string; action: "like" | "dislike" }>
  >([]);
  const [showSwipeHint, setShowSwipeHint] = useState(false);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragDelta, setDragDelta] = useState({ x: 0, y: 0 });

  // Exit animation state
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );

  // Fetch movies/series on mount
  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchMedia(mediaType, genres);
        setItems(data.slice(0, CARDS_TO_SWIPE)); // Limit to X cards
      } catch (err) {
        console.error("Failed to fetch media:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setIsLoading(false);

        // when loading is complete start an animation exemple movement like right to left to indicate to the user they can swipe
        setShowSwipeHint(true);
        setTimeout(() => setShowSwipeHint(false), 900); // hint duration
      }
    };

    loadMedia();
  }, [mediaType, genres]);

  const currentItem = items[currentIndex];
  const nextItem = items[currentIndex + 1];

  // Swipe indicators opacity
  const likeOpacity = Math.min(Math.max(dragDelta.x / SWIPE_THRESHOLD, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragDelta.x / SWIPE_THRESHOLD, 0), 1);

  const advanceCard = useCallback(
    (action: "like" | "dislike" | "skip", newHistory?: typeof swipeHistory) => {
      const historyToUse = newHistory || swipeHistory;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= items.length) {
        onComplete(historyToUse);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [currentIndex, items.length, onComplete, swipeHistory]
  );

  const triggerSwipe = useCallback(
    (action: "like" | "dislike") => {
      if (!currentItem || exitDirection) return;

      // Update history
      const newHistory = [
        ...swipeHistory,
        { id: currentItem.id, title: currentItem.title, action },
      ];
      setSwipeHistory(newHistory);

      // Start exit animation
      setExitDirection(action === "like" ? "right" : "left");
      setIsDragging(false);
      setDragDelta({ x: 0, y: 0 });

      // Advance after animation
      setTimeout(() => {
        setExitDirection(null);
        advanceCard(action, newHistory);
      }, 200);
    },
    [currentItem, exitDirection, swipeHistory, advanceCard]
  );

  // Drag handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    if (exitDirection) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragDelta({ x: 0, y: 0 });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || exitDirection) return;
    setDragDelta({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    if (!isDragging || exitDirection) return;
    setIsDragging(false);

    if (dragDelta.x > SWIPE_THRESHOLD) {
      triggerSwipe("like");
    } else if (dragDelta.x < -SWIPE_THRESHOLD) {
      triggerSwipe("dislike");
    } else {
      // Snap back
      setDragDelta({ x: 0, y: 0 });
    }
  };

  const handleSkip = () => {
    if (exitDirection) return;
    advanceCard("skip");
  };

  const handleRetry = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchMedia(mediaType, genres);
      setItems(data.slice(0, CARDS_TO_SWIPE));
      setCurrentIndex(0);
      setSwipeHistory([]);
    } catch (err) {
      console.error("Failed to fetch media:", err);
      setError("Failed to load content. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="screen">
        <header className="header">
          <div className="container header__inner">
            <button onClick={onBack} className="btn btn--small">
              <ArrowLeft size={16} />
              Back
            </button>
            <span className="label">Loading...</span>
          </div>
        </header>
        <div className="loading">
          <Loader
            className="loading__spinner"
            style={{ animation: "spin 1s linear infinite" }}
            size={32}
          />
          <span className="loading__text">
            Fetching {mediaType === "movie" ? "movies" : "series"}...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="screen">
        <header className="header">
          <div className="container header__inner">
            <button onClick={onBack} className="btn btn--small">
              <ArrowLeft size={16} />
              Back
            </button>
            <span className="label">Error</span>
          </div>
        </header>
        <main
          className="screen__body"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            className="frame"
            style={{ maxWidth: "400px", textAlign: "center" }}
          >
            <div className="frame__header">
              <span className="label">Error</span>
            </div>
            <div className="frame__body stack stack--lg">
              <h2 className="heading-3">Something Went Wrong</h2>
              <p className="body-text text-muted">{error}</p>
              <button onClick={handleRetry} className="btn btn--filled">
                Try Again
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // No items found
  if (items.length === 0) {
    return (
      <div className="screen">
        <header className="header">
          <div className="container header__inner">
            <button onClick={onBack} className="btn btn--small">
              <ArrowLeft size={16} />
              Back
            </button>
            <span className="label">No Results</span>
          </div>
        </header>
        <main
          className="screen__body"
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            className="frame"
            style={{ maxWidth: "400px", textAlign: "center" }}
          >
            <div className="frame__body stack stack--lg">
              <h2 className="heading-3">No Content Found</h2>
              <p className="body-text text-muted">
                We couldn't find any{" "}
                {mediaType === "movie" ? "movies" : "series"} matching your
                criteria.
              </p>
              <button onClick={onBack} className="btn btn--filled">
                Change Filters
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Check if complete
  if (currentIndex >= items.length) {
    return (
      <div className="screen">
        <div className="loading">
          <div className="loading__spinner" />
          <span className="loading__text">Preparing recommendations...</span>
        </div>
      </div>
    );
  }

  // Calculate transforms
  const rotation = dragDelta.x * ROTATION_FACTOR;

  const getCardTransform = () => {
    if (exitDirection) {
      const exitX =
        exitDirection === "right"
          ? window.innerWidth + 100
          : -window.innerWidth - 100;
      const exitRotation = exitDirection === "right" ? 20 : -20;
      return `translateX(${exitX}px) rotate(${exitRotation}deg)`;
    }
    return `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${rotation}deg)`;
  };

  return (
    <div className="screen">
      <header className="header">
        <div className="container header__inner">
          <button onClick={onBack} className="btn btn--small">
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="label">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </header>

      <main
        className="screen__body"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <div className="swipe-container">
          {/* Next card - always visible behind */}
          {nextItem && (
            <div
              className="swipe-card"
              style={{
                zIndex: 1,
                pointerEvents: "none",
              }}
            >
              <img
                src={nextItem.poster}
                alt={nextItem.title}
                className="swipe-card__image"
              />
              <div className="swipe-card__content">
                <div>
                  <div className="swipe-card__header">
                    <h2 className="swipe-card__title">{nextItem.title}</h2>
                    <span className="swipe-card__year">{nextItem.year}</span>
                  </div>
                  <div className="swipe-card__rating">★ {nextItem.rating}</div>
                  <div className="swipe-card__genres">
                    {nextItem.genres.map((genre) => (
                      <span key={genre} className="tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Current card - draggable */}
          {currentItem && !exitDirection && (
            <div
              className={`swipe-card ${
                showSwipeHint ? "swipe-card--hint" : ""
              }`}
              style={{
                transform: getCardTransform(),
                transition: isDragging ? "none" : "transform 0.3s ease-out",
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 2,
                touchAction: "none",
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {/* Like indicator */}
              <div
                className="swipe-indicator swipe-indicator--like"
                style={{
                  opacity: exitDirection === "right" ? 1 : likeOpacity,
                }}
              >
                LIKE
              </div>

              {/* Nope indicator */}
              <div
                className="swipe-indicator swipe-indicator--nope"
                style={{
                  opacity: exitDirection === "left" ? 1 : nopeOpacity,
                }}
              >
                NOPE
              </div>

              <img
                src={currentItem.poster}
                alt={currentItem.title}
                className="swipe-card__image"
                draggable={false}
              />

              <div className="swipe-card__content">
                <div>
                  <div className="swipe-card__header">
                    <h2 className="swipe-card__title">{currentItem.title}</h2>
                    <span className="swipe-card__year">{currentItem.year}</span>
                  </div>
                  <div className="swipe-card__rating">
                    ★ {currentItem.rating}
                  </div>
                  <div className="swipe-card__genres">
                    {currentItem.genres.map((genre) => (
                      <span key={genre} className="tag">
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="swipe-actions">
          <button
            onClick={() => triggerSwipe("dislike")}
            className="swipe-btn swipe-btn--nope"
            aria-label="Dislike"
            disabled={!!exitDirection}
          >
            <X size={28} strokeWidth={3} />
          </button>

          <button
            onClick={handleSkip}
            className="swipe-btn"
            aria-label="Skip"
            style={{
              borderColor: "var(--color-muted)",
              color: "var(--color-muted)",
            }}
            disabled={!!exitDirection}
          >
            <SkipForward size={24} />
          </button>

          <button
            onClick={() => triggerSwipe("like")}
            className="swipe-btn swipe-btn--like"
            aria-label="Like"
            disabled={!!exitDirection}
          >
            <Heart size={28} strokeWidth={2} fill="currentColor" />
          </button>
        </div>
      </main>

      <footer className="screen__footer">
        <div className="container">
          <div className="progress">
            <div className="progress__step progress__step--completed" />
            <div className="progress__step progress__step--completed" />
            <div className="progress__step progress__step--active" />
          </div>
        </div>
      </footer>
    </div>
  );
}
