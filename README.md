# Quickcar Transport

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quote Emails (Resend)

The final Submit step sends:
- An initial quote email to the customer (the email they entered)
- A lead copy to your company inbox

Set these environment variables (e.g. in `.env.local`):

- `RESEND_API_KEY` (keep secret; do not commit)
- `RESEND_FROM` (a verified sender in Resend)
- `LEADS_EMAIL` (optional; company inbox that receives leads — defaults to `henry@quickcartrucking.com`)

Important:
- To send emails *from* your own domain (e.g. `contact@quickcartrucking.com`), Resend requires verifying that domain in the Resend dashboard (Domains → Add domain → add DNS records).
- If your domain is not verified yet, you can temporarily set `RESEND_FROM=onboarding@resend.dev` and rely on `replyTo` for replies, but for production sending you should verify your domain.

Security note: if an API key was pasted into chat or otherwise exposed, treat it as compromised — revoke it in Resend and generate a new key.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
