# Shared Hosting CI/CD

The GitHub Actions workflow in [`.github/workflows/ci-cd.yml`](../../.github/workflows/ci-cd.yml) now does three things:

1. Runs build and test verification on every push and pull request.
2. Runs advisory style checks without mutating the repository in CI.
3. Deploys automatically when `main` is pushed and the verification job passes.

## GitHub secrets required

Add these repository or environment secrets before the deploy job can work:

- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`

For this Hostinger setup, use the raw FTP host or IP in `FTP_SERVER`, not a URL with `ftp://`.

## Optional GitHub repository variables

These let you avoid editing the workflow for host-specific paths:

- `FTP_PORT`
- `FTP_SERVER_DIR`

For Hostinger root-domain deploys, the usual upload folder is `public_html/`.

## One-time production server requirements

Before enabling auto-deploy, make sure the host is ready for a Laravel 13 app:

- PHP `8.3+` with the usual Laravel extensions enabled.
- A production `.env` file inside `laravel-app/.env`.
- `APP_URL` should match your live site URL.
- Write permissions on `laravel-app/storage` and `laravel-app/bootstrap/cache`.
- Database credentials, mail settings, and any cache/session/queue settings configured in the production `.env`.

## Important for product and category uploads

This app stores admin-uploaded media on Laravel's `public` disk at `laravel-app/storage/app/public`.

To keep those images visible on the live site, create a public `storage` link in the web root that points to `laravel-app/storage/app/public`.

If your host does not allow symlinks, use one of these alternatives before relying on admin uploads in production:

- Switch uploads to S3 or another external object store.
- Expose `laravel-app/storage/app/public` through the hosting panel with an equivalent public alias.

The deploy workflow intentionally avoids destructive clean-slate syncs so existing uploads are not wiped on each release.
