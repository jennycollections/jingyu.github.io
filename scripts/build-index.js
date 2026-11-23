// Builds projects/index.json and notes/index.json from the files you write.
// GitHub runs this automatically on every publish (see HOW-TO.md). Locally: node scripts/build-index.js
const fs = require("fs"), path = require("path");

// ---- projects: one .json file per project (files starting with _ are ignored) ----
const projects = [];
for (const f of fs.readdirSync("projects").filter(f => f.endsWith(".json") && f !== "index.json" && !f.startsWith("_"))) {
  try { projects.push(JSON.parse(fs.readFileSync(path.join("projects", f), "utf8"))); }
  catch (e) { console.error(`\n❌ Problem in projects/${f}: ${e.message}\n   Tip: look for a missing comma, a missing quote, or a comma after the last item.\n`); process.exit(1); }
}
fs.writeFileSync("projects/index.json", JSON.stringify(projects));
console.log(`✔ ${projects.length} projects`);

// ---- notes: one .md file per note (files starting with _ are ignored) ----
const notes = [];
for (const f of fs.readdirSync("notes").filter(f => f.endsWith(".md") && !f.startsWith("_"))) {
  const raw = fs.readFileSync(path.join("notes", f), "utf8").replace(/\r\n/g, "\n");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) { console.error(`\n❌ notes/${f}: the file must start with a --- block (copy notes/_template.md)\n`); process.exit(1); }
  const meta = {};
  for (const line of m[1].split("\n")) { const i = line.indexOf(":"); if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim(); }
  if (!meta.title || !meta.date) { console.error(`\n❌ notes/${f}: needs "title:" and "date:" (format YYYY-MM-DD)\n`); process.exit(1); }
  const [body, bodyDe] = m[2].split(/^=== DE ===$/m).map(x => x.trim());
  notes.push({ id: f.replace(/\.md$/, ""), ...meta, body, ...(bodyDe ? { bodyDe } : {}) });
}
fs.writeFileSync("notes/index.json", JSON.stringify(notes));
console.log(`✔ ${notes.length} notes`);
