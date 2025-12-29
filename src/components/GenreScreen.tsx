import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface GenreScreenProps {
  mediaType: "movie" | "series";
  onSelect: (genres: string[]) => void;
  onBack: () => void;
}

const GENRES = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Documentary",
  "Animation",
  "Crime",
  "Fantasy",
  "Mystery",
];

export default function GenreScreen({
  mediaType,
  onSelect,
  onBack,
}: GenreScreenProps) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const handleContinue = () => {
    if (selectedGenres.length > 0) {
      onSelect(selectedGenres);
    }
  };

  return (
    <div className="screen">
      <header className="header">
        <div className="container header__inner">
          <button onClick={onBack} className="btn btn--small">
            <ArrowLeft size={16} />
            Back
          </button>
          <span className="label">Step 2 of 3</span>
        </div>
      </header>

      <main className="screen__body">
        <div className="container">
          <div className="text-center mb-xl animate-slide-up">
            <span className="label mb-md" style={{ display: "block" }}>
              {mediaType === "movie" ? "Films" : "Series"} Selected
            </span>
            <h1 className="heading-2">Select Your Genres</h1>
            <p className="body-text text-muted mt-md">
              Choose at least one to continue
            </p>
          </div>

          <div
            className="selection-grid animate-slide-up stagger-2"
            style={{ maxWidth: "700px", margin: "0 auto" }}
          >
            {GENRES.map((genre, index) => (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`selection-item ${
                  selectedGenres.includes(genre)
                    ? "selection-item--selected"
                    : ""
                }`}
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                {genre}
                {selectedGenres.includes(genre) && (
                  <span
                    className="counter"
                    style={{
                      marginLeft: "var(--space-sm)",
                      display: "inline-flex",
                    }}
                  >
                    ✓
                  </span>
                )}
              </button>
            ))}
          </div>

          {selectedGenres.length > 0 && (
            <div className="text-center mt-xl animate-fade-in">
              <div className="tag-group" style={{ justifyContent: "center" }}>
                {selectedGenres.map((genre) => (
                  <span key={genre} className="tag tag--filled">
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="screen__footer">
        <div className="container">
          <div className="stack stack--lg">
            <button
              onClick={handleContinue}
              disabled={selectedGenres.length === 0}
              className={`btn btn--large btn--block ${
                selectedGenres.length > 0 ? "btn--filled" : ""
              }`}
              style={{ opacity: selectedGenres.length === 0 ? 0.5 : 1 }}
            >
              Continue
              <ArrowRight size={20} />
            </button>
            <div className="progress">
              <div className="progress__step progress__step--completed" />
              <div className="progress__step progress__step--active" />
              <div className="progress__step" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
