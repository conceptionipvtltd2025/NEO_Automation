# Brand / dealer logos

Drop each dealer logo here using the **exact filename** below. The site loads
`/images/brands/<id>.png` automatically; if a file is missing it falls back to a
styled text wordmark, so you can add logos one at a time.

| Brand          | Required filename        | Status        |
| -------------- | ------------------------ | ------------- |
| Atlas Copco    | `atlas-copco.png`        | ✅ provided   |
| GESIPA         | `gesipa.png`             | ✅ provided   |
| eepos          | `eepos.png`              | ✅ provided   |
| GEDORE         | `gedore.png`             | ✅ provided   |
| CEJN           | `cejn.png`               | ✅ provided   |
| Hoffmann Group | `hoffmann-group.png`     | ✅ provided   |
| Legris         | `legris.png`             | ✅ provided   |
| Transair       | `transair.png`           | ✅ provided   |
| PFERD          | `pferd.png`              | ⬜ needed     |

**Recommendations**
- Use **transparent PNG** (or SVG — then update the `logo()` extension in
  `src/data/brands.ts`).
- Logos render on a white tile, so full-colour logos are fine.
- Aim for roughly 400–600 px wide, trimmed of extra whitespace.

The originals you supplied are vector files (`.ai` / `.eps` / `.cdr`) which
browsers can't display — please export them to PNG/SVG before dropping them here.
