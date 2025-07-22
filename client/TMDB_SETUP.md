# TMDB API Setup Guide

This application uses The Movie Database (TMDB) API to fetch movie and TV show information. To run the application successfully, you need to configure the TMDB API key.

## Getting a TMDB API Key

1. **Create a TMDB account**: Go to [TMDB website](https://www.themoviedb.org/) and sign up for a free account
2. **Request API access**: Navigate to [Settings > API](https://www.themoviedb.org/settings/api)
3. **Choose "Developer"** if asked about the type of use
4. **Fill out the application form** with basic information about your use case
5. **Copy your API key** once approved (usually instant for personal use)

## Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace `your_tmdb_api_key_here` with your actual API key:
   ```
   THEMOVIEDB_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Testing Your API Key

Run the test script to verify your API key is working:
```bash
node test-tmdb-api.js
```

## Error Messages

If you see error messages like "TMDB API key is invalid or missing", it means:
- Your API key is not set in `.env.local`
- Your API key is incorrect
- Your API key has not been approved yet (wait a few minutes and try again)

## API Usage

The application fetches:
- Trending movies and TV shows
- Movie/TV show details
- Cast and crew information
- Search results

All API calls include proper error handling and user-friendly error messages.