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

  const apiBase = "https://generativelanguage.googleapis.com";
  const versions = ["v1", "v1beta"];
  let lastError = "Unknown Gemini server error";

  for (const version of versions) {
    try {
      const model = await resolveModel(apiBase, version, apiKey);
      const endpoint = `${apiBase}/${version}/models/${model}:generateContent?key=${apiKey}`;
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
        lastError = `${version} ${response.status} ${errText}`;
        continue;
      }

      const payload = await response.json();
      const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        lastError = `${version} returned empty content`;
        continue;
      }

      const parsed = safeJson(text) || safeJson((text.match(/\{[\s\S]*\}/) || [])[0] || "");
      if (!parsed) {
        lastError = `${version} returned invalid JSON`;
        continue;
      }

      return res.status(200).json({
        title: String(parsed.title || "").trim(),
        category: String(parsed.category || "Meal").trim(),
        ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients.map((x) => String(x).trim()).filter(Boolean) : [],
        steps: Array.isArray(parsed.steps) ? parsed.steps.map((x) => String(x).trim()).filter(Boolean) : [],
      });
    } catch (err) {
      lastError = err?.message || String(err);
    }
  }
  return res.status(502).json({ error: lastError });
}

async function resolveModel(apiBase, version, apiKey) {
  const preferred = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash", "gemini-1.5-flash-latest"];
  const listUrl = `${apiBase}/${version}/models?key=${apiKey}`;
  const listResponse = await fetch(listUrl, { method: "GET" });
  if (!listResponse.ok) {
    const errText = await listResponse.text();
    throw new Error(`ListModels ${version} failed: ${listResponse.status} ${errText}`);
  }
  const payload = await listResponse.json();
  const models = Array.isArray(payload.models) ? payload.models : [];
  const supported = models
    .filter((m) => Array.isArray(m.supportedGenerationMethods) && m.supportedGenerationMethods.includes("generateContent"))
    .map((m) => String(m.name || "").replace(/^models\//, ""))
    .filter(Boolean);

  for (const wanted of preferred) {
    if (supported.includes(wanted)) return wanted;
  }
  if (supported.length) return supported[0];
  throw new Error(`No generateContent model is available for ${version}`);
}

function safeJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}
