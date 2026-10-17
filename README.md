# Harbor

A mini applicant tracking system for a small hiring desk. It keeps candidates, hiring stages, search, and dashboard metrics in one place.

- Live app: https://jahnvi2204.github.io/mini-ats/
- Demo (about 1 minute): https://jahnvi2204.github.io/mini-ats/demo/
- Source: https://github.com/jahnvi2204/mini-ats

## What you can do

- Review the hiring desk: candidate count, active pipeline, hires, time to hire, open seats, and who has been waiting.
- Read the stage funnel, including how many people reached each stage and the conversion from the stage before it.
- Move people through Applied, Screening, Interview, Offer, Hired, and Rejected. Drag a card on the pipeline, or change the stage from a profile.
- Search by name, email, skill, city, or role, and filter by stage, source, and opening.
- Add and edit candidates, write notes, and export the current list as CSV.
- See who belongs to each role, including roles that are already closed.

## Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

The sample desk is loaded the first time you open Harbor in a browser. Edits stay in that browser. **Reset sample data** in the sidebar puts the original desk back, with dates counted from today.

## Stack

Next.js, React, TypeScript, and Tailwind CSS. There is no server database: the desk is stored in `localStorage`, so the deployed site works without extra services.

## Publishing

The live site is a static export on the `gh-pages` branch. To publish a new version:

```bash
GITHUB_PAGES=true npm run build
```

Copy the `out/` folder to `gh-pages` and keep a `.nojekyll` file in that branch so GitHub Pages serves the `_next` assets.
