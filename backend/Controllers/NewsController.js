import fetch from "node-fetch";

export const getPanchakarmaNews = async (req, res) => {
  try {
    if (!process.env.NEWS_API_KEY) return res.status(500).json({ message: "NEWS_API_KEY not configured" });

    const q = encodeURIComponent("Ayurveda OR Panchakarma OR Ayurvedic therapy");
    const url = `https://newsapi.org/v2/everything?q=${q}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`;

    const resp = await fetch(url);
    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ message: `News API error ${resp.status}`, error: text });
    }
    const data = await resp.json();
    const articles = (data?.articles || []).map(a => ({
      title: a.title,
      description: a.description,
      url: a.url,
      imageUrl: a.urlToImage,
      source: a.source?.name,
      publishedAt: a.publishedAt
    }));

    res.status(200).json({ articles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
