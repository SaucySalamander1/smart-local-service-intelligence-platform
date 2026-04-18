const KEY = process.env.REACT_APP_UNSPLASH_KEY;

export const getImage = async (query) => {
  try {
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&client_id=${KEY}`
    );

    const data = await res.json();
    return data.results?.[0]?.urls?.regular || null;

  } catch (err) {
    console.error("Unsplash error:", err);
    return null;
  }
};