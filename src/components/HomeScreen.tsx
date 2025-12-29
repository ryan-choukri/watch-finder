import { Film, Tv } from 'lucide-react';
import { MediaType } from '../App';

interface HomeScreenProps {
  onMediaSelect: (type: MediaType) => void;
}

export default function HomeScreen({ onMediaSelect }: HomeScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
          What I Watch?
        </h1>
        <p className="text-xl md:text-2xl text-slate-300">
          Find your next binge in seconds
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => onMediaSelect('movie')}
          className="group relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white rounded-3xl p-12 md:p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex flex-col items-center space-y-6">
            <Film size={80} className="md:w-24 md:h-24 drop-shadow-lg" />
            <span className="text-3xl md:text-4xl font-bold tracking-wide">
              Movies
            </span>
          </div>
        </button>

        <button
          onClick={() => onMediaSelect('series')}
          className="group relative overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white rounded-3xl p-12 md:p-16 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-xl"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative flex flex-col items-center space-y-6">
            <Tv size={80} className="md:w-24 md:h-24 drop-shadow-lg" />
            <span className="text-3xl md:text-4xl font-bold tracking-wide">
              Series
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}
