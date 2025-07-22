import { toast } from "react-toastify";

/**
 * Utility function to handle TMDB API errors consistently
 * @param {Response} response - The fetch response
 * @param {Error} error - Any error that occurred during fetch
 * @returns {string} - User-friendly error message
 */
export const handleTMDBError = (response, error) => {
  if (error) {
    console.error("TMDB API Error:", error);
    return "Network error. Please check your internet connection.";
  }

  switch (response?.status) {
    case 401:
      console.error("TMDB API: Invalid or missing API key");
      return "TMDB API key is invalid or missing. Please check your configuration.";
    case 404:
      return "Content not found.";
    case 429:
      return "Too many requests. Please try again later.";
    case 500:
    case 502:
    case 503:
      return "TMDB service is temporarily unavailable.";
    default:
      return "Something went wrong. Please try again.";
  }
};

/**
 * Makes a request to the TMDB API with consistent error handling
 * @param {string} url - The TMDB API URL
 * @param {object} options - Fetch options
 * @returns {Promise<object|null>} - The API response data or null if error
 */
export const fetchTMDBData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorMessage = handleTMDBError(response);
      toast.error(errorMessage);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    const errorMessage = handleTMDBError(null, error);
    toast.error(errorMessage);
    return null;
  }
};

/**
 * Builds a TMDB API URL with the API key
 * @param {string} endpoint - The API endpoint
 * @param {object} params - Additional query parameters
 * @returns {string} - Complete API URL
 */
export const buildTMDBUrl = (endpoint, params = {}) => {
  const apiKey = process.env.THEMOVIEDB_API_KEY;
  
  if (!apiKey || apiKey === 'test_api_key' || apiKey === 'your_tmdb_api_key_here') {
    console.warn('TMDB API key is not properly configured');
  }

  const url = new URL(`https://api.themoviedb.org/3/${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  
  // Add additional parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};