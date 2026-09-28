# DuckOK

DuckOK is a browser-based image processing toolkit built from the open-source Pic Smaller codebase.

The project keeps the original local-first processing architecture while adapting the product experience for a public commercial service at **duckok.com**.

## Product direction

- Free core image compression and batch processing
- Local browser processing for the web workflow
- Clear, consumer-friendly UX instead of developer-first terminology
- SEO-ready landing page and localized metadata
- Reserved product surface for DuckOK Pro
- Future monetization paths: Pro features, API, team workflows, sponsorships and contextual advertising

## Current capabilities

- JPEG, PNG, WebP, GIF, SVG and AVIF compression
- HEIC/HEIF local input handling
- Batch files and folder input where supported by the browser
- Format conversion
- Resize and crop
- Before/after comparison
- ZIP batch download
- No account required

## Development

Requirements: Node.js 22 LTS or newer and npm 10 or newer.

```bash
npm ci
npm run dev
```

Production build:

```bash
npm run build
```

## Commercial deployment notes

The web compressor does not require an API key. If DuckOK later adds cloud services, accounts, AI processing, storage, API access or paid plans, keep secrets in the deployment platform's secret manager and do not put credentials into the repository.

The original project and this adaptation are distributed under the MIT License. Keep the upstream license and attribution when redistributing the code.
