export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server Gemini key is not configured" });
  }

  const body = typeof req.body === "string" ? safeJson(req.body) : req.body;
  const recipeText = String(body?.recipeText || "").trim();
  if (!recipeText) {
    return res.status(400).json({ error: "recipeText is required" });
  }

  const prompt = [
    "You are a recipe parser.",
    "Return JSON only with keys: title, category, ingredients, steps.",
    "All output must be in English.",
    "Category must be one of: Meal, Dessert, Breakfast, Snack, Soup, Salad, Bread, Drink.",
    "ingredients must be an array of strings.",
    "steps must be an array of strings.",
    "All temperatures in steps must be in Celsius only (e.g. 180C).",
    "Recipe text:",
    recipeText,
  ].join("\n");

  const model = "gemini-1.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    return res.status(response.status).json({ error: errText });
  }

  const payload = await response.json();
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    return res.status(502).json({ error: "Gemini returned empty content" });
  }

  const parsed = safeJson(text) || safeJson((text.match(/\{[\s\S]*\}/) || [])[0] || "");
  if (!parsed) {
    return res.status(502).json({ error: "Gemini returned invalid JSON" });
  }

  return res.status(200).json({
    title: String(parsed.title || "").trim(),
    category: String(parsed.category || "Meal").trim(),
    ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.map((x) => String(x).trim()).filter(Boolean) : [],
    steps: Array.isArray(parsed.steps) ? parsed.steps.map((x) => String(x).trim()).filter(Boolean) : [],
  });
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
