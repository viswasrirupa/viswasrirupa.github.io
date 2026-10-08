# Rupa Anne — personal website

Static GitHub Pages site. All content lives in `data/site-data.json`; the HTML pages are shells rendered by `script.js`.

Files:
- `index.html` — About (hero, impact stats, experience, featured projects, skills, featured research, awards, education, teaching, contact)
- `research.html`, `projects.html`
- `styles.css`, `script.js`, `data/site-data.json`
- `assets/` — images, `Rupa_Anne_Resume.pdf` (linked from the nav "Resume" button), `CV.pdf`

## Editing content (data/site-data.json)
- `profile` — `name`, `title`, `availability` (pill above your name; delete the field to hide it), `headline`, `hero` (paragraphs; `**bold**` and `*italic*` supported), `links`
- `stats` — `{ "value": "10,000+", "label": "..." }` tiles in "Impact at a Glance"
- `experience` — `role`, `place`, `advisor`, `when`, `items`
- `skills` — `{ "group": "...", "items": [...] }`
- `education`, `teaching`, `contact`
- `publications` — `id`, `type` (`journal` | `conference` | `report`), `year`, `title`, `authors`, `venue`, optional `featured`, `status`, `links`, `abstract`
- `projects` — `id`, `title`, `summary`, optional `featured`, `impact` (one-line result shown in bold), `advisor`, `tags`, `items`, `gallery`, `links`, `details`
- `awards` — `title`, `image`, `imageAlt`, `description`

To update the resume, replace `assets/Rupa_Anne_Resume.pdf` with a file of the same name.

## Local preview
The site loads JSON with `fetch()`, so serve it rather than double-clicking:

```bash
python3 -m http.server 8000
```
Then open http://localhost:8000
