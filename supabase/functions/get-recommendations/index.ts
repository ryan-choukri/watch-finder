const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  mediaType: string;
  genres: string[];
  swipeHistory: Array<{ id: number; title: string; action: string }>;
}

interface Recommendation {
  id: number;
  title: string;
  description: string;
  year: number;
  rating: string;
  poster: string;
  genres: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { mediaType, genres, swipeHistory }: RequestBody = await req.json();

    const likedTitles = swipeHistory
      .filter((item) => item.action === "like")
      .map((item) => item.title);
    const dislikedTitles = swipeHistory
      .filter((item) => item.action === "dislike")
      .map((item) => item.title);

    const recommendations: Recommendation[] = generateRecommendations(
      mediaType,
      genres,
      likedTitles,
      dislikedTitles
    );

    return new Response(JSON.stringify({ recommendations }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get recommendations" }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});

function generateRecommendations(
  mediaType: string,
  genres: string[],
  likedTitles: string[],
  dislikedTitles: string[]
): Recommendation[] {
  const movieRecommendations: Recommendation[] = [
    {
      id: 1,
      title: "Blade Runner 2049",
      description:
        "A visually stunning sci-fi masterpiece that explores humanity and consciousness.",
      year: 2017,
      rating: "8.0/10",
      genres: ["Sci-Fi", "Drama", "Thriller"],
      poster:
        "https://images.pexels.com/photos/7991339/pexels-photo-7991339.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 2,
      title: "The Grand Budapest Hotel",
      description:
        "A whimsical comedy-drama with stunning visuals and quirky characters.",
      year: 2014,
      rating: "8.1/10",
      genres: ["Comedy", "Drama", "Crime"],
      poster:
        "https://images.pexels.com/photos/7991447/pexels-photo-7991447.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 3,
      title: "Parasite",
      description:
        "A gripping thriller that masterfully blends genres and social commentary.",
      year: 2019,
      rating: "8.5/10",
      genres: ["Thriller", "Drama", "Dark Comedy"],
      poster:
        "https://images.pexels.com/photos/7991505/pexels-photo-7991505.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 4,
      title: "Mad Max: Fury Road",
      description:
        "An adrenaline-fueled action spectacle with stunning practical effects.",
      year: 2015,
      rating: "8.1/10",
      genres: ["Action", "Adventure", "Sci-Fi"],
      poster:
        "https://images.pexels.com/photos/7991558/pexels-photo-7991558.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 5,
      title: "Arrival",
      description: "A thought-provoking sci-fi drama about language and time.",
      year: 2016,
      rating: "7.9/10",
      genres: ["Sci-Fi", "Drama", "Mystery"],
      poster:
        "https://images.pexels.com/photos/7991366/pexels-photo-7991366.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const seriesRecommendations: Recommendation[] = [
    {
      id: 6,
      title: "Breaking Bad",
      description:
        "A chemistry teacher turned meth kingpin in this intense crime drama.",
      year: 2008,
      rating: "9.5/10",
      genres: ["Crime", "Drama", "Thriller"],
      poster:
        "https://images.pexels.com/photos/7991401/pexels-photo-7991401.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 7,
      title: "Stranger Things",
      description:
        "80s nostalgia meets supernatural horror in this thrilling series.",
      year: 2016,
      rating: "8.7/10",
      genres: ["Horror", "Sci-Fi", "Drama"],
      poster:
        "https://images.pexels.com/photos/7991419/pexels-photo-7991419.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 8,
      title: "The Crown",
      description:
        "An elegant drama chronicling the reign of Queen Elizabeth II.",
      year: 2016,
      rating: "8.6/10",
      genres: ["Drama", "History", "Biography"],
      poster:
        "https://images.pexels.com/photos/7991515/pexels-photo-7991515.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 9,
      title: "The Mandalorian",
      description: "A lone bounty hunter navigates the Star Wars universe.",
      year: 2019,
      rating: "8.7/10",
      genres: ["Sci-Fi", "Action", "Adventure"],
      poster:
        "https://images.pexels.com/photos/7991601/pexels-photo-7991601.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      id: 10,
      title: "Succession",
      description:
        "A powerful family battles for control of their media empire.",
      year: 2018,
      rating: "8.9/10",
      genres: ["Drama", "Comedy-Drama"],
      poster:
        "https://images.pexels.com/photos/7991384/pexels-photo-7991384.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ];

  const allRecommendations =
    mediaType === "movie" ? movieRecommendations : seriesRecommendations;

  return allRecommendations
    .filter((item) => !dislikedTitles.includes(item.title))
    .sort((a, b) => {
      const aMatches = a.genres.some((genre) => genres.includes(genre));
      const bMatches = b.genres.some((genre) => genres.includes(genre));

      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return 0;
    })
    .slice(0, 10);
}
