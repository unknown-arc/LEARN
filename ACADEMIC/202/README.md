# TROAL — Subject 202

## Layout

- `index.html`, `style.css`: subject directory page.
- `labs.js`, `labs.json`: render lab cards and open the shared playground.
- `playgrounds/`: reusable lab workspace embedded in the subject page.
- Each `LAB-x/index.json` manifest describes resources relative to that lab folder.

## Lab manifest example

```json
{
  "name": "Lab 3",
  "folder": "LAB-3",
  "description": "SQL practice lab.",
  "resources": {
    "migrations": [{"name":"001_create_schema.sql","path":"sql/migrations/001_create_schema.sql"}],
    "seeds": [{"name":"001_seed_data.sql","path":"sql/seeds/001_seed_data.sql"}],
    "queries": [{"name":"q_001.sql","path":"sql/queries/q_001.sql"}],
    "tasks": [],
    "other": []
  }
}
```

## Notes

- `labs.json` is an example with LAB-1, LAB-2, and LAB-3. Replace it or generate it automatically from your repository folders.
- Run via a local HTTP server or GitHub Pages; `fetch()` will not work reliably from a `file://` URL.
- The embedded SQL runner uses SQLite via sql.js. PostgreSQL-specific syntax may not run as expected.
- The database is temporary in the browser session. Reloading or rebuilding resets it.
