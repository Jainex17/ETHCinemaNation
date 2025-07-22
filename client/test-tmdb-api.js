require('dotenv').config({ path: '.env.local' });

async function testTMDBAPI() {
  const apiKey = process.env.THEMOVIEDB_API_KEY;
  
  if (!apiKey) {
    console.error('❌ THEMOVIEDB_API_KEY is not set in environment variables');
    console.log('Please create a .env.local file with your TMDB API key');
    return;
  }

  if (apiKey === 'test_api_key' || apiKey === 'your_tmdb_api_key_here') {
    console.error('❌ TMDB API key is not properly configured');
    console.log('Please replace the placeholder with your actual TMDB API key in .env.local');
    return;
  }

  console.log('🔑 Testing TMDB API with key:', apiKey.substring(0, 8) + '...');

  try {
    const url = `https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKey}&language=en-US&page=1`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      console.log('✅ TMDB API is working correctly!');
      console.log(`📽️  Found ${data.results.length} trending movies`);
      console.log(`🎬 Example movie: "${data.results[0].title}"`);
    } else {
      console.log('⚠️  API responded but no movies found');
    }
  } catch (error) {
    console.error('❌ TMDB API test failed:', error.message);
    if (error.message.includes('401')) {
      console.log('This usually means your API key is invalid');
    }
  }
}

testTMDBAPI();