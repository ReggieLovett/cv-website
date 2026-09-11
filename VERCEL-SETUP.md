# Deploying this site to Vercel

## Why `vercel.json` was removed

It contained:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install"
}
```

`buildCommand` and `installCommand` were already Vercel's defaults, so they did nothing.

`outputDirectory: ".next"` is the harmful one. Vercel's Next.js preset manages the
build output itself; naming `.next` explicitly tells Vercel to treat the project as
having a *static* output folder, which is a well-known cause of a deployed site
returning 404 on every route. For a standard Next.js app the correct configuration
is **no `vercel.json` at all** — Vercel detects the framework from `package.json`.

## Connecting the project

1. https://vercel.com/new → **Import Git Repository** → `ReggieLovett/cv-website`
2. Framework Preset must read **Next.js**. If it says "Other", the deploy will
   produce a site that 404s — change it.
3. Root Directory: `./` (leave alone)
4. Build/Output/Install: leave all three on their defaults. Do not override.
5. Deploy.

## Environment variable

Set this so metadata, `sitemap.xml` and `robots.txt` point at the real domain
instead of the placeholder in the code:

```
NEXT_PUBLIC_SITE_URL = https://<your-actual-domain>
```

Without it the code falls back to `https://reggielovett.vercel.app`, which is not
a live deployment.

## Checks after deploying

- `/` and `/certificates` both return 200
- Certificate and badge images load (they are served through the Next.js image
  optimizer — see the comment in `next.config.js` about why `unoptimized` must
  stay off)

## Note on Netlify

`netlify.toml` and `@netlify/plugin-nextjs` are still in the repo. They are
harmless on Vercel but they mean this project is configured for two hosts at
once. If Vercel is the real target, both can be removed — `@netlify/plugin-nextjs`
is currently in `dependencies`, so Vercel installs it on every build for nothing.
