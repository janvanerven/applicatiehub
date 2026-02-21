# Authentik OAuth2/OIDC Setup

This guide explains how to configure an Authentik instance to authenticate with Applicatie Hub.

## Prerequisites

- A running Authentik instance
- Admin access to Authentik

---

## Steps

### 1. Create an OAuth2/OpenID Connect Provider

1. Go to **Admin → Applications → Providers**
2. Click **Create** and choose **OAuth2/OpenID Connect Provider**
3. Fill in:
   - **Name**: `Applicatie Hub`
   - **Client type**: `Confidential`
   - **Client ID**: *(note this — add to `.env` as `AUTHENTIK_CLIENT_ID`)*
   - **Client Secret**: *(note this — add to `.env` as `AUTHENTIK_CLIENT_SECRET`)*
   - **Redirect URIs**: `https://your-domain.com/auth/callback`
   - **Scopes**: `openid profile email`
   - **Subject mode**: `Based on the User's hashed ID` *(stable across username renames)*
4. Save

### 2. Create an Application

1. Go to **Admin → Applications → Applications**
2. Click **Create**
3. Fill in:
   - **Name**: `Applicatie Hub`
   - **Slug**: `applicatiehub`
   - **Provider**: select the provider created above
4. Save

### 3. Note the Issuer URL

The issuer URL follows the pattern:

```
https://your-authentik-domain.com/application/o/<slug>/
```

So for slug `applicatiehub`:

```
https://authentik.your-domain.com/application/o/applicatiehub/
```

Add this as `AUTHENTIK_ISSUER_URL` in your `.env`. The trailing slash is required.

You can verify the OIDC discovery document at:

```
{AUTHENTIK_ISSUER_URL}.well-known/openid-configuration
```

### 4. Restrict Access (Recommended)

By default, all Authentik users can authenticate. To limit access to specific admin users:

1. Open the Application you created
2. Go to **Policy Bindings**
3. Add a binding for a group or policy that only includes your admin users

This ensures no one can log in even if they have an Authentik account, unless they're in the allowed group.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Required — must match your public URL exactly (no trailing slash)
ORIGIN=https://your-domain.com

# Required — from the Authentik provider you created
AUTHENTIK_CLIENT_ID=your-client-id
AUTHENTIK_CLIENT_SECRET=your-client-secret
AUTHENTIK_ISSUER_URL=https://authentik.your-domain.com/application/o/applicatiehub/

# Optional — defaults shown
DATABASE_URL=./data/db.sqlite
UPLOAD_DIR=./uploads
```

> **No `SESSION_SECRET` is needed.** Session tokens are generated with `crypto.randomBytes(32)` and stored directly in SQLite. There is no server-side signing key.

---

## Docker Deployment

The `docker-compose.yml` handles volume mounts for the database and uploads. Set env vars either inline or via a `.env` file next to it:

```yaml
services:
  app:
    image: applicatiehub
    ports:
      - "3000:3000"
    volumes:
      - ./data:/app/data
      - ./uploads:/app/uploads
    environment:
      ORIGIN: https://your-domain.com
      AUTHENTIK_CLIENT_ID: your-client-id
      AUTHENTIK_CLIENT_SECRET: your-client-secret
      AUTHENTIK_ISSUER_URL: https://authentik.your-domain.com/application/o/applicatiehub/
```

The redirect URI is constructed automatically as `${ORIGIN}/auth/callback`. This must match exactly what you entered in the Authentik provider.

---

## Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name hub.your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name hub.your-domain.com;

    ssl_certificate     /etc/ssl/certs/your-cert.pem;
    ssl_certificate_key /etc/ssl/private/your-key.pem;

    # Allow large uploads (match BODY_SIZE_LIMIT in Dockerfile: 10 MB)
    client_max_body_size 11M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The `ORIGIN` env var **must** match the public URL (including `https://`) for SvelteKit's CSRF protection to work correctly. A mismatch will cause all form submissions to be rejected with a 403.
