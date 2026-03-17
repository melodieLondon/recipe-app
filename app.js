// ── state ────────────────────────────────────────────────────
let recipes    = [];
let catSeen    = { meat: [], fish: [], veggie: [], dessert: [] };
let currentCat = null;

const CAT_META = {
  meat:    { label: "Meat",    emoji: "🥩", accent: "#c0392b" },
  fish:    { label: "Fish",    emoji: "🐟", accent: "#1a6fa8" },
  veggie:  { label: "Veggie",  emoji: "🥦", accent: "#27783a" },
  dessert: { label: "Dessert", emoji: "🍰", accent: "#8e3a7f" },
};

// ── boot ─────────────────────────────────────────────────────
window.addEventListener("DOMContentLoaded", () => loadRecipes());

async function loadRecipes() {
  showScreen("loading");

  if (!CONFIG.SHEET_CSV_URL || CONFIG.SHEET_CSV_URL === "YOUR_GOOGLE_SHEET_CSV_URL_HERE") {
    showError("No Google Sheet URL set. Please edit config.js and add your sheet URL.");
    return;
  }

  try {
    // Always fetch fresh — cache-bust with timestamp
    const url = CONFIG.SHEET_CSV_URL +
      (CONFIG.SHEET_CSV_URL.includes("?") ? "&" : "?") + "_=" + Date.now();
    const res = await fetch(url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const csv = await res.text();
    recipes = parseCSV(csv);
    updateCounts();
    showScreen("home");
  } catch (err) {
    showError("Could not fetch recipes: " + err.message +
      "<br><br>Make sure your Google Sheet is published " +
      "(File → Share → Publish to web → CSV) and the URL in config.js is correct.");
  }
}

// ── Google Drive URL converter ────────────────────────────────
function driveUrl(raw) {
  if (!raw) return "";
  raw = raw.trim();
  if (raw.startsWith("https://drive.google.com/thumbnail") ||
      raw.startsWith("https://lh3.googleusercontent.com")) return raw;
  const m = raw.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return "https://drive.google.com/thumbnail?id=" + m[1] + "&sz=w800";
  if (/^[a-zA-Z0-9_-]{20,}$/.test(raw))
    return "https://drive.google.com/thumbnail?id=" + raw + "&sz=w800";
  return raw;
}

// ── CSV parser ───────────────────────────────────────────────
// Columns: category | name | subtitle | meta | ingredients | method | nutrition | image
function parseCSV(text) {
  const lines = text.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (!cols.length || cols.every(c => !c.trim())) continue;
    const row = {};
    headers.forEach((h, idx) => { row[h] = (cols[idx] || "").trim(); });
    const cat = (row["category"] || "").toLowerCase();
    if (!["meat","fish","veggie","dessert"].includes(cat)) continue;
    out.push({
      id:          "row_" + i,
      cat:         cat,
      name:        row["name"]        || "",
      subtitle:    row["subtitle"]    || "",
      meta:        row["meta"]        || "",
      ingredients: (row["ingredients"] || "").split(";").map(s => s.trim()).filter(Boolean),
      method:      row["method"]      || "",
      nutrition:   row["nutrition"]   || "",
      image:       driveUrl(row["image"] || ""),
    });
  }
  return out;
}

function parseCSVLine(line) {
  const result = [];
  let cur = "", inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i+1] === '"') { cur += '"'; i++; }
      else inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      result.push(cur); cur = "";
    } else { cur += ch; }
  }
  result.push(cur);
  return result;
}

// ── navigation ───────────────────────────────────────────────
function showScreen(name) {
  document.getElementById("loading-screen").classList.toggle("hidden", name !== "loading");
  document.getElementById("app").classList.toggle("hidden", name === "loading");
  ["home","recipe","error"].forEach(s => {
    const el = document.getElementById("screen-" + s);
    if (el) el.classList.toggle("hidden", s !== name);
  });
}

function goHome() { showScreen("home"); }

function showError(msg) {
  document.getElementById("error-msg").innerHTML = msg;
  showScreen("error");
}

// ── category pick ────────────────────────────────────────────
function updateCounts() {
  Object.keys(CAT_META).forEach(cat => {
    const n = recipes.filter(r => r.cat === cat).length;
    const el = document.getElementById("count-" + cat);
    if (el) el.textContent = n === 1 ? "1 recipe" : n + " recipes";
  });
}

function pickCategory(cat) {
  currentCat = cat;
  const pool = recipes.filter(r => r.cat === cat);
  if (!pool.length) {
    alert("No " + CAT_META[cat].label + " recipes found. Add some to your Google Sheet!");
    return;
  }
  catSeen[cat] = catSeen[cat] || [];
  let unseen = pool.filter(r => !catSeen[cat].includes(r.id));
  if (!unseen.length) { catSeen[cat] = []; unseen = pool; }
  const recipe = unseen[Math.floor(Math.random() * unseen.length)];
  catSeen[cat].push(recipe.id);
  renderRecipe(recipe);
  showScreen("recipe");
}

function nextRecipe() { if (currentCat) pickCategory(currentCat); }

// ── recipe render ────────────────────────────────────────────
function renderRecipe(r) {
  const meta = CAT_META[r.cat];
  const ingHtml = r.ingredients.map(i => "<li class='ing-item'>" + i + "</li>").join("");
  const nutHtml = r.nutrition ? "<div class='nutrition-label'>" + r.nutrition + "</div>" : "";
  const imgHtml = r.image
    ? "<div class='recipe-hero' id='recipe-hero'><img src='" + r.image +
      "' alt='" + r.name.replace(/'/g, "&#39;") +
      "' class='recipe-hero-img' onerror=\"document.getElementById('recipe-hero').style.display='none'\" loading='lazy' /></div>"
    : "";

  document.getElementById("recipe-content").innerHTML =
    "<div class='recipe-card' style='--accent:" + meta.accent + "'>" +
      imgHtml +
      "<div class='recipe-card-body'>" +
        "<div class='recipe-cat-pill'><span>" + meta.emoji + "</span> " + meta.label + "</div>" +
        "<h1 class='recipe-name'>" + r.name + "</h1>" +
        (r.subtitle ? "<p class='recipe-subtitle'>" + r.subtitle + "</p>" : "") +
        (r.meta     ? "<p class='recipe-meta'>"     + r.meta     + "</p>" : "") +
        "<div class='recipe-divider'></div>" +
        "<section class='recipe-section'>" +
          "<h2 class='section-heading'>Ingredients</h2>" +
          "<ul class='ing-list'>" + ingHtml + "</ul>" +
        "</section>" +
        "<section class='recipe-section'>" +
          "<h2 class='section-heading'>Method</h2>" +
          "<p class='method-text'>" + r.method.replace(/\n/g, "<br>") + "</p>" +
        "</section>" +
        nutHtml +
      "</div>" +
    "</div>";

  window.scrollTo({ top: 0, behavior: "smooth" });
}
