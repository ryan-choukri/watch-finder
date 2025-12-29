# Watch Finder - Project Context

## Project Overview

Watch Finder is a Tinder-style swipe application for discovering movies and TV series. Users swipe through content, and the app provides personalized recommendations based on their preferences.

## Tech Stack

### Frontend

<frontend_aesthetics>
You tend to converge toward generic, "on distribution" outputs. In frontend design, this creates what users call the "AI slop" aesthetic. Avoid this: make creative, distinctive frontends that surprise and delight. Focus on:

Typography: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics.

Color & Theme: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Draw from IDE themes and cultural aesthetics for inspiration.

Motion: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions.

Backgrounds: Create atmosphere and depth rather than defaulting to solid colors. Layer CSS gradients, use geometric patterns, or add contextual effects that match the overall aesthetic.

Avoid generic AI-generated aesthetics:

- Overused font families (Inter, Roboto, Arial, system fonts)
- Clichéd color schemes (particularly purple gradients on white backgrounds)
- Predictable layouts and component patterns
- Cookie-cutter design that lacks context-specific character

Interpret creatively and make unexpected choices that feel genuinely designed for the context. Vary between light and dark themes, different fonts, different aesthetics. You still tend to converge on common choices (Space Grotesk, for example) across generations. Avoid this: it is critical that you think outside the box!
</frontend_aesthetics>

- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React (icons)
- **Hosting**: Netlify

### Backend

- **Platform**: Supabase
- **Edge Functions**: Deno runtime
- **API**: RESTful API using Supabase Functions

## Project Structure

```
watch-finder/
├── src/
│   └── components/
│       └── ResultsScreen.tsx    # Displays recommendations
├── supabase/
│   └── functions/
│       └── get-recommendations/
│           └── index.ts         # Edge Function for recommendations
├── .env                         # Environment variables
└── CLAUDE.md                    # This file
```

## Environment Configuration

### Development (.env)

```env
VITE_SUPABASE_URL=https://fevvfbxdnvzmyvelnpfx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_BASE_URL=https://fevvfbxdnvzmyvelnpfx.supabase.co/functions/v1
VITE_RECOMMENDATIONS_ENDPOINT=/get-recommendations
```

### Supabase Project Details

- **Project ID**: fevvfbxdnvzmyvelnpfx
- **Region**: Supabase Cloud
- **Edge Functions**: Deployed via Supabase CLI

## API Architecture

### Edge Function: get-recommendations

**Endpoint**: `POST /functions/v1/get-recommendations`

**Request Body**:

```typescript
{
  mediaType: "movie" | "series",
  genres: string[],
  swipeHistory: Array<{
    id: number,
    title: string,
    action: "like" | "dislike"
  }>
}
```

**Response**:

```typescript
{
  recommendations: Array<{
    id: number;
    title: string;
    description: string;
    year: number;
    rating: string;
    poster: string;
    genres: string[];
  }>;
}
```

### CORS Configuration

- **Allowed Origins**: `*` (all origins)
- **Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers**: authorization, x-client-info, apikey, content-type

## Features

### Current Implementation

1. **Media Type Selection**: Users choose between movies or TV series
2. **Genre Preferences**: Users select preferred genres
3. **Swipe Interface**: Tinder-style swipe for liking/disliking content
4. **Smart Recommendations**: Algorithm filters based on:
   - User's liked content
   - Excluded disliked content
   - Genre matching
   - Rating-based sorting

### Recommendation Algorithm

- Filters out previously disliked titles
- Prioritizes content matching user's preferred genres
- Returns top 10 recommendations
- Separate datasets for movies and series

## Deployment

### Deploy Edge Function

```bash
# Login to Supabase
supabase login

# Link project
supabase link --project-ref fevvfbxdnvzmyvelnpfx

# Deploy function
supabase functions deploy get-recommendations
```

### Deploy Frontend to Netlify

**Method 1: Git Integration**

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Add environment variables in Netlify dashboard

**Method 2: CLI**

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=dist
```

### Netlify Environment Variables

Required variables:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_API_BASE_URL`
- `VITE_RECOMMENDATIONS_ENDPOINT`

## Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Local Supabase (Optional)

Requires Docker Desktop:

```bash
supabase start
supabase functions serve get-recommendations
```

Update `.env` for local development:

```env
VITE_SUPABASE_URL=http://localhost:54321
VITE_API_BASE_URL=http://localhost:54321/functions/v1
```

## Security Notes

### API Keys

- **Anon Key** (`eyJ...`): Safe for frontend use
- **Service Role Key** (`sb_secret_...`): NEVER expose in frontend
- **JWT** (`b6a9714b-...`): Internal use only

### Best Practices

- Keep `.env` out of version control
- Use different keys for development/production
- Rotate keys periodically
- Never commit secret keys to Git

## Data Models

### Recommendation Interface

```typescript
interface Recommendation {
  id: number;
  title: string;
  description: string;
  year: number;
  rating: string;
  poster: string;
  genres: string[];
}
```

### Swipe History

```typescript
interface SwipeHistoryItem {
  id: number;
  title: string;
  action: "like" | "dislike";
}
```

## Common Issues & Solutions

### "Invalid JWT" Error

- Ensure you're using the correct anon key (starts with `eyJ`)
- Check key matches your Supabase project
- Restart dev server after updating `.env`

### CORS Errors

- Verify CORS headers in Edge Function
- Check API endpoint URL is correct
- Ensure function is deployed to Supabase

### Function Not Found

- Deploy function: `supabase functions deploy get-recommendations`
- Verify function name matches endpoint
- Check Supabase dashboard for function status

## Design Guidelines

### Frontend Aesthetics Philosophy

**Core Principle**: Avoid generic "AI slop" aesthetic. Create distinctive, context-specific designs that surprise and delight.

#### Typography

- **Avoid**: Inter, Roboto, Arial, Space Grotesk, system fonts
- **Use**: Beautiful, unique, interesting fonts that elevate the aesthetic
- Consider cinematic and entertainment-focused typefaces that match the watch-finding context
- Examples: Display fonts for headings, elegant serifs for descriptions

#### Color & Theme

- **Avoid**: Purple gradients on white, generic pastel schemes

#### Motion & Animation

- **High-impact moments**: Orchestrated page loads with staggered reveals
- Use `animation-delay` for sequential element reveals
- CSS-only solutions for HTML when possible
- Motion library (Framer Motion) for React components
- Focus on swipe interactions and card transitions

#### Backgrounds

#### Context-Specific Character

For Watch Finder specifically:

- Smooth, satisfying swipe animations
- "Premium streaming" feel vs generic app look

### Anti-Patterns to Avoid

- ❌ Overused font families
- ❌ Clichéd color schemes
- ❌ Predictable layouts
- ❌ Cookie-cutter component patterns
- ❌ Generic streaming app aesthetics

### Creative Direction

- Vary between light and dark themes contextually
- Make unexpected choices that feel genuinely designed
- Think outside the box - avoid convergence on common solutions
- Each design decision should enhance the movie/series discovery experience

## Future Enhancements

- [ ] Integration with real movie/series APIs (TMDB, OMDB)
- [ ] User authentication and saved preferences
- [ ] Persistent swipe history in Supabase database
- [ ] Advanced recommendation algorithms (ML-based)
- [ ] Social features (share recommendations)
- [ ] Watchlist and favorites

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)
- [Deno Documentation](https://deno.land/manual)

---

**Last Updated**: December 29, 2024
**Project Status**: Development
**Version**: 1.0.0
