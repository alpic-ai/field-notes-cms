# Field Notes

An open-source birdwatching magazine built with [Payload CMS](https://payloadcms.com/) and Next.js. It ships with five original articles, five public-domain bird photographs, a responsive site, an editorial admin, and a public content API. Everything runs locally with SQLite; no hosted CMS or account is needed.

This project adapts the [official Payload website template](https://github.com/payloadcms/payload/tree/v3.90.1/templates/website) (MIT). The sample magazine and seed content were written for this repository. The publication is fictional and contains no private company or customer data.

## Run locally

You need Node.js 20.9+ (Node 24 is tested) and pnpm 10+.

```bash
pnpm install
cp .env.example .env
```

Replace the three `replace-with-...` secrets in `.env` with independent random values. For example, run `openssl rand -hex 32` three times. Then:

```bash
pnpm seed
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the site and [http://localhost:3000/admin](http://localhost:3000/admin) to create your first admin user. The seed command deliberately creates **no user or password**; it imports public content only. It can be run again, but it replaces the existing posts, pages, categories and media in the local database.

For a production check, run `pnpm build && pnpm start`.
Run `pnpm test` after seeding to check the content model and imported records.

## What to explore

- Five illustrated articles across backyard birds, seabirds, birds of prey and wetlands
- Category relations, related posts, SEO fields, search, drafts, previews and a media library
- Public REST API and GraphQL API supplied by Payload
- Local SQLite database; uploaded media stored in `public/media`

Sample API calls:

```bash
curl 'http://localhost:3000/api/posts?limit=10&depth=1'
curl 'http://localhost:3000/api/categories'
curl 'http://localhost:3000/api/media?limit=10'
```

These endpoints give an external client realistic structured content to query. You can model tasks such as finding a bird by habitat, comparing two species, or recommending a story from a category. The CMS itself does not send analytics to any external service.

## Deploy on Railway

The included `railway.json` builds with Railpack and starts the site with `pnpm start`. Create a Railway service from this repository and attach **one persistent volume mounted at `/app/data`**. At runtime the app stores SQLite at `/app/data/field-notes.db` and uploaded media under `/app/data/media`. On an empty volume, startup imports the bundled articles and photos once; subsequent starts keep editorial changes and admin users.

Set `PAYLOAD_SECRET`, `CRON_SECRET`, and `PREVIEW_SECRET` to three independent random values, and set `NEXT_PUBLIC_SERVER_URL` to the service's public HTTPS URL. Railway supplies `PORT` and `RAILWAY_VOLUME_MOUNT_PATH`. The volume is mounted only at runtime, so the build uses a disposable local SQLite file. Public pages render from the live database after startup.

After the first successful deploy, visit `/admin` to create the first admin account. The demo is intentionally unauthenticated for **reading** published content through the public APIs; creating or editing content requires an admin login. Do not run `pnpm seed` against a volume with edits you want to keep: that command replaces the sample content.

## Images and licensing

The five bundled photos are marked **Public Domain** on their U.S. Fish & Wildlife Service source pages. See [IMAGE_CREDITS.md](IMAGE_CREDITS.md) for each photographer and source URL. Code and original editorial copy are MIT-licensed; the Payload-derived code retains its copyright notice in [LICENSE.md](LICENSE.md).

## Repository notes

Commit `pnpm-lock.yaml`, `src/payload-types.ts`, source files and `public/birds`. The `.env` file, SQLite database, build output and `public/media` are ignored. The image assets bundled in `public/birds` are the reproducible originals for the seed script.
