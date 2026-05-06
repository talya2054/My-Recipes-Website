const APP_KEY = "recipe_atlas_v2";
const CATEGORIES = ["Meal", "Dessert", "Breakfast", "Snack", "Soup", "Salad", "Bread", "Drink"];

init();

function init() {
  const store = loadStore();
  if (!store.recipes.length) seedStore(store);

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "recipes") initRecipes();
  if (page === "add") initAddRecipe();
  if (page === "detail") initDetail();
}

function loadStore() {
  const raw = localStorage.getItem(APP_KEY);
  if (raw) return JSON.parse(raw);
  return { recipes: [] };
}

function saveStore(store) {
  localStorage.setItem(APP_KEY, JSON.stringify(store));
}

function seedStore(store) {
  const recipe = {
    id: `r_${Date.now()}`,
    name: "Apple Pie",
    category: "Dessert",
    imageUrl: "",
    prepTimeMin: 45,
    totalTimeMin: 105,
    servingsBase: 8,
    sourceTitle: "Preppy Kitchen",
    sourceUrl: "https://preppykitchen.com/orange-cake/#recipe",
    modeLabel: "Baking",
    ingredientGroups: [
      {
        name: "Dough",
        items: [
          makeIngredient("500 g Flour"),
          makeIngredient("4 Eggs"),
          makeIngredient("250 ml Milk"),
          makeIngredient("200 g Butter"),
        ],
      },
      {
        name: "Filling",
        items: [makeIngredient("6 Smith apples"), makeIngredient("50 g Sugar"), makeIngredient("1 tsp Cinnamon")],
      },
    ],
    instructionGroups: [
      {
        name: "",
        steps: [{ text: "Preheat the oven to 180C.", timerMin: null }],
      },
      {
        name: "Dough",
        steps: [
          { text: "Mix Flour and Eggs until combined.", timerMin: null },
          { text: "Chill in the fridge.", timerMin: 20 },
        ],
      },
      {
        name: "Filling",
        steps: [
          { text: "Slice the apples.", timerMin: null },
          { text: "Boil mixture on ban-marie.", timerMin: 10 },
          { text: "Bake.", timerMin: 50 },
        ],
      },
    ],
    notes: ["Store in an air tight container.", "You can replace the apples with pears."],
    reviews: [],
    snapshots: [],
    createdAt: Date.now(),
  };
  store.recipes.push(recipe);
  saveStore(store);
}

function initHome() {
  const store = loadStore();
  const stats = [
    { label: "Total recipes", value: String(store.recipes.length) },
    { label: "Categories used", value: String(new Set(store.recipes.map((r) => r.category)).size) },
    { label: "Reviews", value: String(store.recipes.reduce((sum, r) => sum + (r.reviews || []).length, 0)) },
  ];
  document.querySelector("#statsGrid").innerHTML = stats
    .map((s) => `<article class="stat-card"><div class="stat-label">${escapeHtml(s.label)}</div><div class="stat-value">${s.value}</div></article>`)
    .join("");
  const recent = [...store.recipes].sort((a, b) => b.createdAt - a.createdAt).slice(0, 6);
  renderRecipeCards(recent, document.querySelector("#recentRecipes"));
  setupSyncControls();
}

function initRecipes() {
  const store = loadStore();
  const searchInput = document.querySelector("#searchInput");
  const categoryFilter = document.querySelector("#categoryFilter");
  const sortBy = document.querySelector("#sortBy");
  const allRecipes = document.querySelector("#allRecipes");

  categoryFilter.innerHTML = [`<option value="all">All categories</option>`]
    .concat(CATEGORIES.map((c) => `<option value="${c}">${c}</option>`))
    .join("");

  const draw = () => {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const filtered = [...store.recipes].filter((recipe) => {
      const inCategory = category === "all" || recipe.category === category;
      const ingredientText = flattenIngredients(recipe).map((i) => `${i.name} ${i.original}`).join(" ");
      const stepText = flattenSteps(recipe).map((s) => s.text).join(" ");
      const haystack = `${recipe.name} ${recipe.category} ${ingredientText} ${stepText}`.toLowerCase();
      return inCategory && haystack.includes(query);
    });

    if (sortBy.value === "name") filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy.value === "category") filtered.sort((a, b) => a.category.localeCompare(b.category));
    if (sortBy.value === "newest") filtered.sort((a, b) => b.createdAt - a.createdAt);
    renderRecipeCards(filtered, allRecipes);
  };

  [searchInput, categoryFilter, sortBy].forEach((el) => el.addEventListener("input", draw));
  draw();
}

function initAddRecipe() {
  const store = loadStore();
  const editId = new URLSearchParams(location.search).get("edit");
  const editingRecipe = editId ? store.recipes.find((r) => r.id === editId) : null;

  const titleInput = document.querySelector("#recipeTitle");
  const categoryInput = document.querySelector("#recipeCategory");
  const imageInput = document.querySelector("#recipeImage");
  const modeInput = document.querySelector("#recipeMode");
  const prepInput = document.querySelector("#prepTime");
  const totalInput = document.querySelector("#totalTime");
  const servingsInput = document.querySelector("#servingsBase");
  const sourceTitleInput = document.querySelector("#recipeSourceTitle");
  const sourceUrlInput = document.querySelector("#recipeUrl");
  const sourceTextInput = document.querySelector("#recipeSource");
  const ingredientsEditor = document.querySelector("#ingredientsEditor");
  const stepsEditor = document.querySelector("#stepsEditor");
  const notesEditor = document.querySelector("#notesEditor");
  const previewBtn = document.querySelector("#previewBtn");
  const saveBtn = document.querySelector("#saveBtn");
  const fetchBtn = document.querySelector("#fetchUrlBtn");
  const status = document.querySelector("#saveStatus");

  categoryInput.innerHTML = CATEGORIES.map((c) => `<option value="${c}">${c}</option>`).join("");

  if (editingRecipe) {
    titleInput.value = editingRecipe.name;
    categoryInput.value = editingRecipe.category;
    imageInput.value = editingRecipe.imageUrl || "";
    modeInput.value = editingRecipe.modeLabel || "Cooking";
    prepInput.value = editingRecipe.prepTimeMin || "";
    totalInput.value = editingRecipe.totalTimeMin || "";
    servingsInput.value = editingRecipe.servingsBase || 8;
    sourceTitleInput.value = editingRecipe.sourceTitle || "";
    sourceUrlInput.value = editingRecipe.sourceUrl || "";
    sourceTextInput.value = "";
    ingredientsEditor.value = groupsToEditor(editingRecipe.ingredientGroups, (item) => item.original || item.name);
    stepsEditor.value = instructionGroupsToEditor(editingRecipe.instructionGroups);
    notesEditor.value = (editingRecipe.notes || []).join("\n");
    saveBtn.textContent = "Update Recipe";
    status.textContent = "Editing existing recipe.";
  }

  previewBtn.addEventListener("click", () => {
    const parsed = parseRecipeLoose(sourceTextInput.value, categoryInput.value, titleInput.value.trim());
    if (!titleInput.value.trim()) titleInput.value = parsed.name;
    ingredientsEditor.value = groupsToEditor(parsed.ingredientGroups, (item) => item.original);
    stepsEditor.value = instructionGroupsToEditor(parsed.instructionGroups);
    status.textContent = "Parsed raw text into template fields. Adjust as needed.";
  });

  fetchBtn.addEventListener("click", async () => {
    const url = sourceUrlInput.value.trim();
    if (!url) return;
    status.textContent = "Importing text from URL...";
    try {
      const text = await fetchRecipeTextFromUrl(url);
      sourceTextInput.value = text.slice(0, 18000);
      if (!titleInput.value.trim()) titleInput.value = guessTitleFromText(text) || "";
      status.textContent = "Imported source text successfully.";
    } catch (err) {
      status.textContent = `Import failed: ${err.message}`;
    }
  });

  saveBtn.addEventListener("click", async () => {
    const recipe = buildRecipeFromTemplate({
      id: editingRecipe?.id,
      title: titleInput.value.trim(),
      category: categoryInput.value,
      imageUrl: imageInput.value.trim(),
      mode: modeInput.value,
      prepTimeMin: Number(prepInput.value || 0),
      totalTimeMin: Number(totalInput.value || 0),
      servingsBase: Number(servingsInput.value || 1),
      sourceTitle: sourceTitleInput.value.trim(),
      sourceUrl: sourceUrlInput.value.trim(),
      ingredientsText: ingredientsEditor.value,
      stepsText: stepsEditor.value,
      notesText: notesEditor.value,
      carry: editingRecipe,
    });

    if (editingRecipe) {
      const idx = store.recipes.findIndex((r) => r.id === editingRecipe.id);
      if (idx >= 0) store.recipes[idx] = recipe;
      else store.recipes.push(recipe);
    } else {
      store.recipes.push(recipe);
    }

    saveStore(store);
    status.textContent = "Recipe saved successfully!";
    try {
      await saveRecipeToFirestore(recipe);
      location.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
    } catch {
      location.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
    }
  });
}

function initDetail() {
  const store = loadStore();
  const id = new URLSearchParams(location.search).get("id");
  const recipe = store.recipes.find((r) => r.id === id);
  if (!recipe) {
    document.querySelector(".container").innerHTML = `<section class="panel"><div class="empty">Recipe not found.</div></section>`;
    return;
  }

  recipe.ingredientGroups = recipe.ingredientGroups || [{ name: "", items: recipe.ingredients || [] }];
  recipe.instructionGroups = recipe.instructionGroups || [{ name: "", steps: (recipe.steps || []).map((s) => ({ text: s, timerMin: null })) }];
  recipe.notes = recipe.notes || [];

  const nameNode = document.querySelector("#recipeName");
  const categoryNode = document.querySelector("#recipeCategoryTag");
  const imageNode = document.querySelector("#recipeImageView");
  const timeLine = document.querySelector("#timeLine");
  const servingsLine = document.querySelector("#servingsLine");
  const sourceLine = document.querySelector("#sourceLine");
  const servingsRange = document.querySelector("#servingsRange");
  const servingsValue = document.querySelector("#servingsValue");
  const unitView = document.querySelector("#unitView");
  const ingredientList = document.querySelector("#ingredientList");
  const stepList = document.querySelector("#stepList");
  const notesList = document.querySelector("#notesList");
  const scaleHint = document.querySelector("#scaleHint");
  const cookModeBtn = document.querySelector("#cookModeBtn");
  const printBtn = document.querySelector("#printBtn");
  const editBtn = document.querySelector("#editRecipeBtn");
  const snapshotBtn = document.querySelector("#snapshotBtn");
  const snapshotList = document.querySelector("#snapshotList");
  const reviewText = document.querySelector("#reviewText");
  const reviewRating = document.querySelector("#reviewRating");
  const reviewImage = document.querySelector("#reviewImage");
  const saveReviewBtn = document.querySelector("#saveReviewBtn");
  const reviewList = document.querySelector("#reviewList");

  nameNode.textContent = recipe.name;
  categoryNode.textContent = recipe.category;
  imageNode.src = recipe.imageUrl || "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80&auto=format&fit=crop";
  timeLine.textContent = `Prep Time ${formatMin(recipe.prepTimeMin)} | Total Time ${formatMin(recipe.totalTimeMin)}`;
  sourceLine.innerHTML = recipe.sourceUrl
    ? `Source <a href="${escapeAttr(recipe.sourceUrl)}" target="_blank" rel="noreferrer">${escapeHtml(recipe.sourceTitle || "Original recipe")}</a>`
    : "Source not provided";

  const base = Math.max(1, Number(recipe.servingsBase || 1));
  servingsRange.min = String(Math.max(1, Math.round(base / base)));
  servingsRange.max = String(Math.max(4 * base, base));
  servingsRange.value = String(base);
  let selectedServings = base;
  let wakeLock = null;

  function render() {
    const scale = selectedServings / base;
    servingsValue.textContent = String(selectedServings);
    servingsLine.textContent = `Servings ${base} (scale: ${Math.round(base / base)} to ${4 * base})`;
    scaleHint.textContent = scale === 1 ? "1x: metric plus original amounts." : `${strip(scale)}x: metric view only.`;

    ingredientList.innerHTML = renderIngredientGroups(recipe.ingredientGroups, scale, unitView.value);
    stepList.innerHTML = renderInstructionGroups(recipe.instructionGroups, recipe.ingredientGroups, scale);
    notesList.innerHTML = recipe.notes.length ? recipe.notes.map((n) => `<li>${escapeHtml(n)}</li>`).join("") : `<li>No notes yet.</li>`;
    renderSnapshots(recipe.snapshots || [], snapshotList);
    renderReviews(recipe.reviews || [], reviewList);
    wireStepTimers();
  }

  servingsRange.addEventListener("input", () => {
    selectedServings = Number(servingsRange.value);
    render();
  });
  unitView.addEventListener("change", render);

  cookModeBtn.addEventListener("click", async () => {
    if (!("wakeLock" in navigator)) {
      cookModeBtn.textContent = `${recipe.modeLabel || "Cooking"} Mode Unavailable`;
      return;
    }
    try {
      if (wakeLock) {
        await wakeLock.release();
        wakeLock = null;
        cookModeBtn.textContent = `${recipe.modeLabel || "Cooking"} Mode`;
      } else {
        wakeLock = await navigator.wakeLock.request("screen");
        cookModeBtn.textContent = `${recipe.modeLabel || "Cooking"} Mode On`;
      }
    } catch {
      cookModeBtn.textContent = `${recipe.modeLabel || "Cooking"} Mode Blocked`;
    }
  });

  printBtn.addEventListener("click", () => window.print());
  editBtn.addEventListener("click", () => {
    location.href = `add-recipe.html?edit=${encodeURIComponent(recipe.id)}`;
  });

  snapshotBtn.addEventListener("click", () => {
    recipe.snapshots = recipe.snapshots || [];
    recipe.snapshots.unshift({
      id: `s_${Date.now()}`,
      createdAt: Date.now(),
      servings: selectedServings,
      unitView: unitView.value,
    });
    saveStore(store);
    render();
  });

  saveReviewBtn.addEventListener("click", async () => {
    const text = reviewText.value.trim();
    if (!text) return;
    const image = await fileToDataUrl(reviewImage.files[0]);
    recipe.reviews = recipe.reviews || [];
    recipe.reviews.unshift({
      id: `rv_${Date.now()}`,
      text,
      rating: Number(reviewRating.value),
      image: image || "",
      createdAt: Date.now(),
    });
    saveStore(store);
    reviewText.value = "";
    reviewImage.value = "";
    render();
  });

  render();
}

function renderRecipeCards(recipes, target) {
  if (!recipes.length) {
    target.innerHTML = `<div class="empty">No recipes match this view yet.</div>`;
    return;
  }
  target.innerHTML = recipes
    .map((r) => {
      const img = r.imageUrl || "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop";
      return `<article class="recipe-card">
        <img class="card-image" src="${escapeAttr(img)}" alt="${escapeAttr(r.name)}" />
        <h3>${escapeHtml(r.name)}</h3>
        <p>${escapeHtml(r.category)}</p>
        <p class="hint">${flattenIngredients(r).length} ingredients</p>
        <a class="btn btn-secondary" href="recipe.html?id=${encodeURIComponent(r.id)}">Open</a>
      </article>`;
    })
    .join("");
}

function buildRecipeFromTemplate(input) {
  const ingredientGroups = parseIngredientGroups(input.ingredientsText);
  const instructionGroups = parseInstructionGroups(input.stepsText);
  return {
    id: input.id || `r_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: input.title || "Untitled Recipe",
    category: input.category || "Meal",
    imageUrl: input.imageUrl || "",
    prepTimeMin: Number(input.prepTimeMin || 0),
    totalTimeMin: Number(input.totalTimeMin || 0),
    servingsBase: Math.max(1, Number(input.servingsBase || 1)),
    sourceTitle: input.sourceTitle || "",
    sourceUrl: input.sourceUrl || "",
    modeLabel: input.mode || "Cooking",
    ingredientGroups,
    instructionGroups,
    notes: input.notesText.split("\n").map((v) => v.trim()).filter(Boolean),
    reviews: input.carry?.reviews || [],
    snapshots: input.carry?.snapshots || [],
    createdAt: input.carry?.createdAt || Date.now(),
  };
}

function parseRecipeLoose(text, category, title) {
  const lines = text.replace(/\r/g, "").split("\n").map((l) => l.trim()).filter(Boolean);
  let mode = "intro";
  const ingredientLines = [];
  const steps = [];
  lines.forEach((line, idx) => {
    if (idx === 0 && !title) return;
    if (/^ingredients?/i.test(line)) {
      mode = "ingredients";
      return;
    }
    if (/^instructions?|^method|^steps/i.test(line)) {
      mode = "steps";
      return;
    }
    if (mode === "ingredients") ingredientLines.push(line);
    if (mode === "steps") steps.push(line);
  });
  if (!ingredientLines.length) ingredientLines.push(...lines.filter((l) => /^\d|^[\d\/]+\s/.test(l)));
  if (!steps.length) steps.push(...lines.filter((l) => /\b(preheat|mix|stir|bake|cook|boil|chill)\b/i.test(l)));

  return {
    name: title || lines[0] || "Untitled Recipe",
    category: category || "Meal",
    ingredientGroups: [{ name: "", items: ingredientLines.map(makeIngredient) }],
    instructionGroups: [{ name: "", steps: steps.map(makeStep) }],
  };
}

function parseIngredientGroups(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  const groups = [];
  let current = { name: "", items: [] };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const match = line.match(/^\[(.+)\]$/);
    if (match) {
      if (current.items.length || current.name) groups.push(current);
      current = { name: match[1].trim(), items: [] };
      return;
    }
    current.items.push(makeIngredient(line));
  });
  if (current.items.length || current.name) groups.push(current);
  return groups.length ? groups : [{ name: "", items: [] }];
}

function parseInstructionGroups(text) {
  const lines = text.replace(/\r/g, "").split("\n");
  const groups = [];
  let current = { name: "", steps: [] };
  lines.forEach((raw) => {
    const line = raw.trim();
    if (!line) return;
    const header = line.match(/^\[(.+)\]$/);
    if (header) {
      if (current.steps.length || current.name) groups.push(current);
      current = { name: header[1].trim(), steps: [] };
      return;
    }
    current.steps.push(makeStep(line));
  });
  if (current.steps.length || current.name) groups.push(current);
  return groups.length ? groups : [{ name: "", steps: [] }];
}

function makeIngredient(line) {
  const parsed = parseAmount(line);
  const rest = line.replace(parsed.raw, "").trim();
  const name = rest || line;
  const isLiquid = /\b(milk|water|oil|juice|broth|cream)\b/i.test(name);
  const grams = parsed.value * resolveGramsPerUnit(parsed.unit, name);
  const ml = isLiquid ? parsed.value * resolveMlPerUnit(parsed.unit) : 0;
  return {
    name,
    original: line,
    grams: Math.max(1, round(grams)),
    ml: Math.max(0, round(ml)),
    isLiquid,
  };
}

function makeStep(line) {
  const text = line.replace(/^\d+[.)]\s*/, "").trim();
  const timerMatch = text.match(/timer:\s*(\d+)\s*min/i) || text.match(/(\d+)\s*min/i);
  return {
    text: convertFahrenheitTextToCelsius(text.replace(/\(.*timer:.*\)/i, "").trim() || text),
    timerMin: timerMatch ? Number(timerMatch[1]) : null,
  };
}

function renderIngredientGroups(groups, scale, unitView) {
  return groups
    .map((group) => {
      const name = group.name ? `<h3 class="group-title">${escapeHtml(group.name)}</h3>` : "";
      const items = group.items
        .map((item) => {
          const grams = round(item.grams * scale);
          const ml = round(item.ml * scale);
          const metric = item.isLiquid ? `${grams} g / ${ml} ml` : `${grams} g`;
          const text = unitView === "original"
            ? (scale === 1 ? item.original : metric)
            : metric;
          const original = unitView === "metric" && scale === 1 ? `<span class="original-amount">| original: ${escapeHtml(item.original)}</span>` : "";
          return `<li><strong>${escapeHtml(item.name)}</strong>: ${escapeHtml(text)} ${original}</li>`;
        })
        .join("");
      return `${name}<ul class="list">${items}</ul>`;
    })
    .join("");
}

function renderInstructionGroups(groups, ingredientGroups, scale) {
  const ingredients = ingredientGroups.flatMap((g) => g.items);
  return groups
    .map((group) => {
      const name = group.name ? `<h3 class="group-title">${escapeHtml(group.name)}</h3>` : "";
      const steps = group.steps
        .map((step) => {
          const text = injectIngredientAmountsIntoStep(step.text, ingredients, scale);
          const timer = step.timerMin
            ? `<span class="timer-actions"><button class="timer-chip start" type="button" data-minutes="${Math.max(1, Math.round(step.timerMin * scale))}">Start ${Math.max(1, Math.round(step.timerMin * scale))}m</button><button class="timer-chip reset" type="button" data-minutes="${Math.max(1, Math.round(step.timerMin * scale))}">Reset</button></span>`
            : "";
          return `<li class="step-item">${escapeHtml(text)} ${timer}</li>`;
        })
        .join("");
      return `${name}<ol class="list">${steps}</ol>`;
    })
    .join("");
}

function groupsToEditor(groups, formatter) {
  return groups
    .map((group) => {
      const lines = [];
      if (group.name) lines.push(`[${group.name}]`);
      group.items.forEach((item) => lines.push(formatter(item)));
      return lines.join("\n");
    })
    .join("\n");
}

function instructionGroupsToEditor(groups) {
  return groups
    .map((group) => {
      const lines = [];
      if (group.name) lines.push(`[${group.name}]`);
      group.steps.forEach((step, idx) => {
        const timer = step.timerMin ? ` (timer: ${step.timerMin} min)` : "";
        lines.push(`${idx + 1} ${step.text}${timer}`);
      });
      return lines.join("\n");
    })
    .join("\n");
}

function flattenIngredients(recipe) {
  const groups = recipe.ingredientGroups || [{ name: "", items: recipe.ingredients || [] }];
  return groups.flatMap((g) => g.items || []);
}

function flattenSteps(recipe) {
  const groups = recipe.instructionGroups || [{ name: "", steps: (recipe.steps || []).map((s) => ({ text: s, timerMin: null })) }];
  return groups.flatMap((g) => g.steps || []);
}

function renderSnapshots(snapshots, target) {
  if (!snapshots || !snapshots.length) {
    target.innerHTML = `<div class="empty">No snapshots yet.</div>`;
    return;
  }
  target.innerHTML = snapshots
    .map((snap) => `<article class="review-card"><p><strong>${escapeHtml(new Date(snap.createdAt).toLocaleString())}</strong> | servings ${snap.servings}</p></article>`)
    .join("");
}

function renderReviews(reviews, target) {
  if (!reviews || !reviews.length) {
    target.innerHTML = `<div class="empty">No reviews yet.</div>`;
    return;
  }
  target.innerHTML = reviews
    .map((r) => `<article class="review-card"><p><strong>Rating:</strong> ${r.rating}/5</p><p>${escapeHtml(r.text)}</p>${r.image ? `<img src="${r.image}" alt="Recipe result photo" />` : ""}</article>`)
    .join("");
}

function wireStepTimers() {
  document.querySelectorAll(".timer-chip.start").forEach((btn) => {
    btn.addEventListener("click", () => startCountdown(btn, Number(btn.dataset.minutes) * 60));
  });
  document.querySelectorAll(".timer-chip.reset").forEach((btn) => {
    btn.addEventListener("click", () => resetCountdown(btn, Number(btn.dataset.minutes)));
  });
}

function startCountdown(button, secondsLeft) {
  clearTimerForButton(button);
  button.disabled = true;
  const tick = () => {
    const m = Math.floor(secondsLeft / 60);
    const s = String(secondsLeft % 60).padStart(2, "0");
    button.textContent = `${m}:${s}`;
    if (secondsLeft === 0) {
      button.disabled = false;
      button.textContent = "Done";
      button.dataset.timerId = "";
      return;
    }
    secondsLeft -= 1;
    const id = setTimeout(tick, 1000);
    button.dataset.timerId = String(id);
  };
  tick();
}

function resetCountdown(resetButton, minutes) {
  const host = resetButton.parentElement;
  const startBtn = host ? host.querySelector(".timer-chip.start") : null;
  if (!startBtn) return;
  clearTimerForButton(startBtn);
  startBtn.disabled = false;
  startBtn.textContent = `Start ${minutes}m`;
}

function clearTimerForButton(button) {
  const timerId = Number(button.dataset.timerId || 0);
  if (timerId) clearTimeout(timerId);
  button.dataset.timerId = "";
}

async function saveRecipeToFirestore(recipe) {
  const cfg = getSyncConfig();
  if (!cfg.firebaseProjectId || !cfg.firebaseApiKey) throw new Error("Missing Firebase config");
  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(cfg.firebaseProjectId)}` +
    `/databases/(default)/documents/recipes/${encodeURIComponent(recipe.id)}?key=${encodeURIComponent(cfg.firebaseApiKey)}`;
  const doc = {
    fields: {
      id: { stringValue: recipe.id },
      name: { stringValue: recipe.name },
      category: { stringValue: recipe.category },
      payload: { stringValue: JSON.stringify(recipe) },
      updatedAt: { integerValue: String(Date.now()) },
    },
  };
  const response = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(doc),
  });
  if (!response.ok) throw new Error("Firestore save failed");
}

async function fetchRecipeTextFromUrl(url) {
  const attempts = [
    async () => {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return htmlToText(await res.text());
    },
    async () => {
      const proxyUrl = `https://r.jina.ai/http://${url.replace(/^https?:\/\//i, "")}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);
      return await res.text();
    },
  ];
  let lastError = "Unknown import error";
  for (const fn of attempts) {
    try {
      const text = await fn();
      if (text && text.trim().length > 20) return text;
      lastError = "Imported content was empty";
    } catch (err) {
      lastError = err.message || String(err);
    }
  }
  throw new Error(lastError);
}

function htmlToText(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body?.innerText || "";
}

function guessTitleFromText(text) {
  return text
    .split("\n")
    .map((v) => v.trim())
    .find((v) => v.length > 4 && v.length < 80);
}

function parseAmount(line) {
  const match = line.match(/^((?:\d+\s+)?\d+\/\d+|\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/);
  if (!match) return { value: 1, unit: "unit", raw: "" };
  return { value: numberFromText(match[1]), unit: (match[2] || "unit").toLowerCase(), raw: match[0] };
}

function numberFromText(text) {
  return text.split(/\s+/).reduce((sum, token) => {
    if (token.includes("/")) {
      const [a, b] = token.split("/").map(Number);
      return sum + a / b;
    }
    return sum + Number(token);
  }, 0);
}

function resolveGramsPerUnit(unit, ingredientName) {
  const u = String(unit || "").toLowerCase();
  if (u.startsWith("cup")) {
    if (/\bflour\b/i.test(ingredientName)) return 120;
    if (/\bsugar\b/i.test(ingredientName)) return 200;
    if (/\boil\b/i.test(ingredientName)) return 216;
    if (/\bmilk|water|juice|broth|cream\b/i.test(ingredientName)) return 240;
    return 180;
  }
  if (u.startsWith("tbsp")) return 15;
  if (u.startsWith("tsp")) return 5;
  if (u === "g" || u === "gram" || u === "grams") return 1;
  if (u === "kg") return 1000;
  if (u === "ml") return 1;
  if (u === "l") return 1000;
  if (u === "oz") return 28.35;
  return 50;
}

function resolveMlPerUnit(unit) {
  const u = String(unit || "").toLowerCase();
  if (u.startsWith("cup")) return 240;
  if (u.startsWith("tbsp")) return 15;
  if (u.startsWith("tsp")) return 5;
  if (u === "ml") return 1;
  if (u === "l") return 1000;
  if (u === "oz") return 29.57;
  return 0;
}

function ingredientMeasureText(item, scale) {
  const grams = round(item.grams * scale);
  if (item.isLiquid) return `${grams} g / ${round(item.ml * scale)} ml`;
  return `${grams} g`;
}

function injectIngredientAmountsIntoStep(step, ingredients, scale) {
  let result = step;
  const sorted = [...ingredients].sort((a, b) => b.name.length - a.name.length);
  sorted.forEach((item) => {
    const name = (item.name || "").trim();
    if (!name || name.length < 2) return;
    const pattern = new RegExp(`\\b${escapeRegExp(name)}\\b`, "i");
    if (pattern.test(result)) result = result.replace(pattern, `${name} (${ingredientMeasureText(item, scale)})`);
  });
  return result;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function convertFahrenheitTextToCelsius(line) {
  return String(line || "")
    .replace(/(\d+(?:\.\d+)?)\s*°?\s*F\b/gi, (m, f) => `${Math.round(((Number(f) - 32) * 5) / 9)}C`)
    .replace(/(\d+(?:\.\d+)?)\s*degrees?\s*fahrenheit\b/gi, (m, f) => `${Math.round(((Number(f) - 32) * 5) / 9)}C`);
}

function formatMin(value) {
  const v = Number(value || 0);
  if (!v) return "-";
  if (v < 60) return `${v} min`;
  const h = Math.floor(v / 60);
  const m = v % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

function strip(num) {
  return Number(num.toFixed(2));
}

function round(value) {
  return Math.round(value * 10) / 10;
}

function fileToDataUrl(file) {
  if (!file) return Promise.resolve("");
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

function getSyncConfig() {
  const raw = window.RECIPE_SYNC || {};
  const runtime = readRuntimeConfig();
  return {
    enabled: false,
    supabaseUrl: "",
    anonKey: "",
    table: "app_store",
    rowId: "main",
    firebaseProjectId: "",
    firebaseApiKey: "",
    ...raw,
    ...runtime,
  };
}

function readRuntimeConfig() {
  try {
    const raw = localStorage.getItem("recipe_runtime_config");
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function setupSyncControls() {
  const statusNode = document.querySelector("#syncStatus");
  const pullBtn = document.querySelector("#pullCloudBtn");
  const pushBtn = document.querySelector("#pushCloudBtn");
  if (!statusNode || !pullBtn || !pushBtn) return;
  statusNode.textContent = "Cloud sync disabled in template-first mode.";
  pullBtn.disabled = true;
  pushBtn.disabled = true;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[ch]));
}

function escapeAttr(text) {
  return escapeHtml(text);
}
