This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This project uses Supabase for backend services. Before you start the
server, create a `.env.local` file in the root of the `team-jedi-app`
folder and define the following variables (replace the placeholders with
values from your Supabase project):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-api-key
```

The `NEXT_PUBLIC_` prefix ensures the values are exposed to the browser.
Once the environment variables are in place, run the development server:

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Missouri Medicaid Application System

## What it does
Web-based application for Medicaid applicants to submit employment verification documents, and for state employees to verify eligibility.

## Who will use it
- Medicaid applicants (submitting proof of employment)
- Missouri Medicaid employees (verifying applications)
- System administrators (managing the platform)

## Platform Requirements
- Node.js 18+ 
- Next.js 14+
- Supabase (PostgreSQL backend)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Deployment
\`\`\`bash
npm install
npm run build
npm start
\`\`\`

## Environment Variables
Create `.env.local`:
 - to add more steps for team