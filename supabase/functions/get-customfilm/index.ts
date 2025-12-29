import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SwipeHistoryItem {
  id: number;
  title: string;
  action: "like" | "dislike";
}

interface RequestBody {
  mediaType: "movie" | "series";
  swipeHistory: SwipeHistoryItem[];
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const { mediaType, swipeHistory }: RequestBody = await req.json();

    // Build the preference string from swipe history
    const likedItems = swipeHistory.filter((item) => item.action === "like");
    const dislikedItems = swipeHistory.filter(
      (item) => item.action === "dislike"
    );

    const client = new OpenAI({
      apiKey: openaiApiKey,
    });

    const contentType = mediaType === "movie" ? "movies" : "TV series";

    // Create a more detailed prompt for better recommendations
    //     const prompt = `Based on user preferences, recommend 6 ${contentType} from The Movie Database (TMDb).
    // USER LIKED:
    // ${likedItems.map((item) => `- ${item.title} (ID: ${item.id})`).join("\n")}

    // USER DISLIKED:
    // ${dislikedItems.map((item) => `- ${item.title} (ID: ${item.id})`).join("\n")}

    // Analyze the patterns in liked vs disliked ${contentType} and recommend 6 similar ${contentType} the user would enjoy.
    // Return ONLY valid TMDb IDs as a JSON array.
    // Format: [123, 456, 789, 101112, 131415, 161718]`;

    // const response = await client.chat.completions.create({
    //   model: "gpt-3.5-turbo", // Changed from gpt-4 to gpt-3.5-turbo
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are a ${contentType} recommendation expert. Analyze user preferences and recommend ${contentType} from TMDb. Return only a JSON array of TMDb IDs.`,
    //     },
    //     {
    //       role: "user",
    //       content: prompt,
    //     },
    //   ],
    // });
    const preferenceSignal = [
      ...likedItems.map((item) => `+${item.id}`),
      ...dislikedItems.map((item) => `-${item.id}`),
    ].join(" ");
    console.log(preferenceSignal);

    const response = await client.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        {
          role: "system",
          content: `You are a recommendation engine.
            User preferences are TMDb IDs.
            +id = liked, -id = disliked.
            Infer taste and recommend similar ${contentType}.
            - DO NOT return any ID from LIKED or DISLIKED
            Return ONLY 6 TMDb IDs as a JSON array.
            Format: [id,id,id,id,id,id]`.trim(),
        },
        {
          role: "user",
          content: preferenceSignal,
        },
      ],
    });

    const output = response.choices?.[0]?.message?.content ?? "";
    console.log("OpenAI Response:", output);

    // Parse the JSON response
    let recommendedIds: number[] = [];
    try {
      // Try to parse as direct JSON array
      const parsed = JSON.parse(output);
      if (Array.isArray(parsed)) {
        recommendedIds = parsed.filter((id) => typeof id === "number");
      } else if (parsed.rec && Array.isArray(parsed.rec)) {
        recommendedIds = parsed.rec.filter((id) => typeof id === "number");
      }
    } catch (parseError) {
      console.log("JSON parse failed, trying regex extraction");
      // Try to extract IDs with regex as fallback
      const matches = output.match(/\d{3,}/g); // Match 3+ digit numbers (TMDb IDs are typically longer)
      if (matches) {
        recommendedIds = matches.slice(0, 6).map(Number);
      }
    }

    // Fallback recommendations if OpenAI fails
    if (recommendedIds.length === 0) {
      console.log("No IDs extracted, using fallback recommendations");
      // Popular movie IDs as fallback
      const fallbackMovies = [550, 13, 680, 155, 497, 284054]; // Fight Club, Forrest Gump, Pulp Fiction, etc.
      const fallbackSeries = [1399, 60735, 1668, 46648, 82856]; // Game of Thrones, Stranger Things, etc.
      recommendedIds = mediaType === "movie" ? fallbackMovies : fallbackSeries;
    }

    return new Response(
      JSON.stringify({
        success: true,
        recommendedIds: recommendedIds.slice(0, 6), // Ensure max 6 items
        rawResponse: output,
        fallbackUsed: recommendedIds.length === 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);

    // Return fallback recommendations on error
    const fallbackMovies = [550, 13, 680, 155, 497, 284054];
    const fallbackSeries = [1399, 60735, 1668, 46648, 82856];
    console.log("fallbackMovies", fallbackMovies);
    console.log("fallbackSeries", fallbackSeries);

    return new Response(
      JSON.stringify({
        success: true,
        recommendedIds:
          req.body?.mediaType === "movie" ? fallbackMovies : fallbackSeries,
        error: error.message,
        fallbackUsed: true,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200, // Still return 200 with fallback data
      }
    );
  }
});
