# My Recipe Box 🍽

A personal recipe app hosted on GitHub Pages, powered by a Google Sheet as the database.

---

## Files in this project

```
recipe-app/
├── index.html      ← the app
├── style.css       ← design & layout
├── app.js          ← all the logic
├── config.js       ← YOUR SETTINGS (only file you edit)
├── manifest.json   ← makes it installable on your phone
└── README.md       ← this file
```

---

## Step 1 — Set up your Google Sheet

### 1a. Create the sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet
2. Name it **My Recipe Box** (or anything you like)
3. Set up the columns **exactly** in this order in Row 1:

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| category | name | subtitle | meta | ingredients | method | nutrition |

### 1b. Column guide

| Column | What to put | Example |
|---|---|---|
| **category** | One of: `meat` `fish` `veggie` `dessert` | `meat` |
| **name** | Recipe name | `Greek Chicken Pasta` |
| **subtitle** | Optional tagline | `Sweet tomato sauce, macaroni & grated halloumi` |
| **meta** | Serves + time | `Serves 8 · 1h 30min` |
| **ingredients** | List separated by **semicolons** `;` | `1kg chicken thighs; 500g frozen mixed veg; 2 tins plum tomatoes` |
| **method** | Full cooking instructions | `Brown the chicken...` |
| **nutrition** | Optional nutrition info | `566kcal · 19.5g fat · 40.5g protein · 60g carbs` |

> **Important:** Use semicolons `;` between ingredients, NOT commas.
> If your method text contains commas, that's fine — just don't use commas as separators in the ingredients column.

### 1c. Add your first recipe (Greek Chicken Pasta)

Paste this into row 2:

```
meat | Greek Chicken Pasta | Sweet tomato sauce, macaroni & grated halloumi | Serves 8 · 1h 30min | 1kg chicken thighs, skin on, bone in; 500g frozen chopped mixed onion, carrot and celery; 2 × 400g tins of plum tomatoes; 600g dried macaroni; 100g halloumi cheese; 2 tbsp olive oil; 2 tbsp red wine vinegar | Brown the chicken thighs all over in a large non-stick casserole pan on a high heat with 2 tablespoons of olive oil, then remove to a plate. Tip in the frozen mixed veg and soften for 5 minutes, then put the chicken back into the pan with 2 tablespoons of red wine vinegar and allow it to cook away. Scrunch in the tomatoes through clean hands, then pour in 1 tin's worth of water. Bring to the boil, then leave to blip away on a low heat for 1 hour, or until the chicken is falling off the bone, stirring occasionally. When the time's up, cook the pasta in a pan of boiling salted water, then drain. Strip all the chicken meat from the bones and shred apart with forks, returning it to the sauce. Taste and season. Stir the pasta into the sauce and grate in most of the halloumi. Finish with extra virgin olive oil and remaining halloumi grated over the top. | 566kcal · 19.5g fat · 40.5g protein · 60g carbs
```

### 1d. Publish the sheet as CSV

1. Click **File → Share → Publish to web**
2. In the first dropdown, select **Sheet1** (or your sheet name)
3. In the second dropdown, select **Comma-separated values (.csv)**
4. Click **Publish** → confirm
5. Copy the URL that appears — it looks like:
   `https://docs.google.com/spreadsheets/d/XXXXXXXXXX/pub?gid=0&single=true&output=csv`

Keep this URL — you'll need it in Step 3.

---

## Step 2 — Put the app on GitHub Pages

### 2a. Create a GitHub account
If you don't have one, sign up free at [github.com](https://github.com)

### 2b. Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Name it: `recipe-app` (or anything you like)
3. Set it to **Public**
4. Click **Create repository**

### 2c. Upload the files
1. On your new repo page, click **Add file → Upload files**
2. Drag and drop ALL files from this folder:
   - `index.html`
   - `style.css`
   - `app.js`
   - `config.js`  ← don't forget this one
   - `manifest.json`
3. Click **Commit changes**

### 2d. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages** (left sidebar)
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main**, Folder: **/ (root)**
4. Click **Save**
5. Wait ~60 seconds, then your app will be live at:
   `https://YOUR-GITHUB-USERNAME.github.io/recipe-app/`

---

## Step 3 — Connect your Google Sheet

### 3a. Edit config.js
Open `config.js` and replace `YOUR_GOOGLE_SHEET_CSV_URL_HERE` with the URL you copied in Step 1d:

```js
const CONFIG = {
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/XXXXXXXXXX/pub?gid=0&single=true&output=csv"
};
```

### 3b. Upload the updated config.js to GitHub
1. Go to your repo on GitHub
2. Click on `config.js`
3. Click the pencil ✏️ icon (Edit)
4. Paste in the updated content
5. Click **Commit changes**

Your app will update automatically within a minute.

---

## Step 4 — Install on your phone

### iPhone (Safari)
1. Open your GitHub Pages URL in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down → tap **Add to Home Screen**
4. Tap **Add** — it now appears as an app icon!

### Android (Chrome)
1. Open your GitHub Pages URL in Chrome
2. Tap the **three dots** menu
3. Tap **Add to Home screen**
4. Tap **Add**

---

## Adding new recipes

Just open your Google Sheet and add a new row. The app has a **↻ Refresh** button on the home screen that fetches the latest version of your sheet.

---

## Adding recipes from photos (via Claude)

1. Drop your recipe photo into the Claude chat
2. Claude extracts the name, ingredients and method
3. Copy the details into a new row in your Google Sheet
4. Tap **↻ Refresh** in the app

---

## Troubleshooting

**"Could not fetch recipes"**
- Check the URL in `config.js` is correct
- Make sure you published as CSV (not HTML)
- The sheet must be **Public** — check File → Share → Publish to web

**Recipes not updating**
- Tap the **↻ Refresh** button on the home screen
- Google Sheets can take up to 5 minutes to propagate changes

**App looks broken on phone**
- Make sure all 5 files are uploaded to GitHub
- Check GitHub Pages is enabled (Settings → Pages)
