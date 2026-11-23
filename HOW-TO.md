# How your portfolio site works

## What is where

```
index.html        the page structure only (menu, sections, footer)
jenny.jpg         your photo (replace the file to change it)
css/style.css     colours, sizes, layout
js/settings.js    author name, "years of experience" start date, optional views/comments
js/text.js        every word on the site, English and German (About text, buttons, menu)
js/filters.js     the filter menus on the Projects page
js/app.js         the program (you normally never touch this)
projects/         ONE FILE PER PROJECT  <- you work here
notes/            ONE FILE PER NOTE     <- you work here
scripts/          the helper that builds the lists (runs by itself)
```

`index.html` never changes when you add a project or a note.

## Add a project (5 minutes)

1. Open `projects/_template.json` and copy its content.
2. Create a new file in `projects/`, named after the project, for example `customer-churn.json`, and paste.
3. Replace the placeholder texts. Rules for this file type (called JSON):
   - Every text is inside "double quotes".
   - Lists use [square brackets], items separated by commas: `["EDA", "Python"]`.
   - A comma after every line, but NOT after the last line before a closing } or ].
   - Do not use the double quote character inside a text. Use ' instead.
4. `id` must be the same as the file name without `.json`.
5. Upload the file to GitHub (Add file, Upload files). Wait one or two minutes.

What updates by itself: the project card, the "Data projects" number, the "Methods & techniques" number and the toolkit.
To show a result in the rotating card on the About page, keep the `highlight` block. Delete it if you have no number.

If your project uses a method, tool or industry that is not in `js/filters.js`, the project still shows, but it can't be filtered by that term. Add the term to the right group in `js/filters.js` (and its German name in `js/text.js` under TERM_DE).

To delete a project: delete its file.

## Add a note (2 minutes)

1. Copy `notes/_template.md`, rename it, for example `2026-12-01-my-first-note.md`.
2. Fill in the block between the two `---` lines: title, date (YYYY-MM-DD), author, excerpt.
3. Write the note under it. One blank line between paragraphs.
4. Optional German version: add a line `=== DE ===` and write the German text below it.
5. Upload to GitHub. The note appears on the Notes page, newest first.

## Change other things

| I want to change | Edit |
|---|---|
| The About text or slogan | `js/text.js` (search for `about1` and `aboutTitle`) |
| My photo | replace `jenny.jpg` with a new photo of the same name |
| The date years of experience count from | `js/settings.js` (`START_DATE`) |
| Colours | top of `css/style.css` (`:root`) |
| Menu names, button labels | `js/text.js` |

## One-time GitHub setup (needed once, so the lists build automatically)

Open your repository, then `.github/workflows/`, then the file that deploys your site (a `.yml` file). Under the `actions/checkout` step, add these two lines (keep the same indentation as the other steps):

```yaml
      - name: Build project and note lists
        run: node scripts/build-index.js
```

Also change the versions of the actions to `actions/checkout@v5`, and use the latest versions of `actions/configure-pages` and `actions/upload-pages-artifact` to remove the Node.js 20 warning.

Without this step, new files are not added to the lists.

Prefer copy-paste? `_workflow-example.yml` in this folder is a complete workflow. Open your existing workflow file on GitHub, click the pencil, replace all its text with the content of `_workflow-example.yml`, and commit. Do not add it as a second workflow. If your branch is not called `main`, change that word in the file.

## Preview before publishing (optional)

The page loads its data with `fetch`, so double-clicking `index.html` shows empty lists. Instead, open Terminal in the site folder and run:

```
node scripts/build-index.js
python3 -m http.server
```

Then open http://localhost:8000 in your browser. (If `node` is not installed, skip the first line and just publish; GitHub builds it.)

## If something does not show up

- The GitHub Actions tab shows a red cross: open it. The message names the file and the problem (usually a missing or extra comma).
- A new project or note is missing: check the Action step above was added, and that the file name does not start with `_`.
- Old content appears: do a hard refresh (Cmd + Shift + R).
