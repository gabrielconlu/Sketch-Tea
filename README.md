This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Render

This repository includes a [`render.yaml`](./render.yaml) Blueprint for a Node.js web service. In Render, choose **New > Blueprint**, connect this repository, and apply the Blueprint. Do not deploy it as a Python service or a static site. If you already created a Python service, create this Blueprint as a separate service; the YAML does not convert an existing service's runtime.

During the initial Blueprint setup, provide values for the prompted environment variables:

- `DB_PASSWORD`: the Aiven database password.
- `EMAIL_USER` and `EMAIL_PASS`: Gmail account credentials (use a Gmail app password).
- `RESEND_API_KEY`: the Resend API key used for order email.

Render generates `SESSION_SECRET` automatically. The Blueprint includes the existing database host, user, database name, and port. Confirm these match your database account before deploying. `ADMIN_EMAIL` is optional; if omitted, order notifications use `EMAIL_USER`.

The service uses `npm ci && npm run build` to build and `npm start` to run the Next.js server. Do not commit `.env.local` or secret values.
