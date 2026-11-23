# ADR-0008: Host on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-11-23

## Context

The app is a static SPA (ADR-0002) in a public GitHub repository. It needs a public HTTPS URL, at little or no cost, so that links can be shared and the app tried on real phones.

## Options considered

1. **GitHub Pages** — free for public repositories, no new account, deploys from GitHub Actions. Served from a sub-path unless a custom domain is added; no PR previews; soft traffic limit (about 100 GB a month).
2. **Cloudflare** — free tier, fast worldwide, PR previews; needs a new account.
3. **Vercel / Netlify** — free tiers with limits, PR previews; needs a new account. Vercel's free plan is for non-commercial use.
4. **AWS S3 + CloudFront** — flexible and scales well; needs the most setup (bucket, CloudFront for HTTPS, permissions, deploy credentials) and is billed by use.

## Decision

Host on GitHub Pages at `https://roymwxuk.github.io/mwx-sengoku-app/`. A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and publishes every push to `master`.

## Consequences

- Every merge to `master` updates the public site.
- Production builds use the base path `/mwx-sengoku-app/` (`vite.config.ts`), so data must be loaded relative to `import.meta.env.BASE_URL`. A custom domain would change the base path to `/`.
- The workflow only builds and deploys. Tests and other checks stay separate until CI is added.
- Large map files (e.g., terrain, see ADR-0004) may need separate storage.
