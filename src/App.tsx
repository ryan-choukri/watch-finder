import { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import MediaTypeScreen from "./components/MediaTypeScreen";
import GenreScreen from "./components/GenreScreen";
import SwipeScreen from "./components/SwipeScreen";
import ResultsScreen from "./components/ResultsScreen";
import "./styles/design-system.css";

type Screen = "welcome" | "mediaType" | "genre" | "swipe" | "results";

interface SwipeHistoryItem {
  id: number;
  title: string;
  action: "like" | "dislike";
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [mediaType, setMediaType] = useState<"movie" | "series">("movie");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistoryItem[]>([]);

  const handleRestart = () => {
    setCurrentScreen("welcome");
    setMediaType("movie");
    setSelectedGenres([]);
    setSwipeHistory([]);
  };

  const handleMediaTypeSelect = (type: "movie" | "series") => {
    setMediaType(type);
    setCurrentScreen("genre");
  };

  const handleGenreSelect = (genres: string[]) => {
    setSelectedGenres(genres);
    setCurrentScreen("swipe");
  };

  const handleSwipeComplete = (history: SwipeHistoryItem[]) => {
    setSwipeHistory(history);
    setCurrentScreen("results");
  };

  // console.log(swipeHistory);

  return (
    <div className="app">
      {currentScreen === "welcome" && (
        <WelcomeScreen onStart={() => setCurrentScreen("mediaType")} />
      )}
      {currentScreen === "mediaType" && (
        <MediaTypeScreen
          onSelect={handleMediaTypeSelect}
          onBack={() => setCurrentScreen("welcome")}
        />
      )}
      {currentScreen === "genre" && (
        <GenreScreen
          mediaType={mediaType}
          onSelect={handleGenreSelect}
          onBack={() => setCurrentScreen("mediaType")}
        />
      )}
      {currentScreen === "swipe" && (
        <SwipeScreen
          mediaType={mediaType}
          genres={selectedGenres}
          onComplete={handleSwipeComplete}
          onBack={() => setCurrentScreen("genre")}
        />
      )}
      {currentScreen === "results" && (
        <ResultsScreen
          mediaType={mediaType}
          genres={selectedGenres}
          swipeHistory={swipeHistory}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
