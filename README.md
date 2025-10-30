# E-Commerce App with NextJS & TailwindCSS
A fully functional e-commerce demo project built with **Next.js App Router** that demonstrates **all three rendering strategies (SSG, ISR, SSR)**, along with protected admin routes, and a simple file-based JSON “database”.

To clone the repository and setup the project- execute the below command:
```bash
git clone https://github.com/ypavanr/NextJS-Ecommerce-Website.git
cd NextJS-Ecommerce-Website
npm i
cp .env.example .env.local
npm run dev
```

for production execute the below command:
```bash
npm run build
npm start
```

## rendering strategies:
### route: "/"- SSG(Static Site Generation)
Home page lists products, statically generated at build time for fast load. Client-side search for filtering.
### route: "/products/[slug ]"- ISR (Incremental Static Regeneration)
Each product detail page is pre-rendered and automatically revalidated every 60 seconds.### route: "/"- SSG(Static Site Generation)
### route: "/dashboard"- SSR (Server-Side Rendering)
Displays real-time inventory and stock data on every request.
### route: "/admin"- CSR (Client-Side Rendering)
Admin portal with login, product creation, and inventory updates, powered by client fetch calls to API routes.

## Data Flow
Frontend pages fetch or import data from /lib/products.ts.

The backend API routes read and write directly to data/products.json using fs/promises.

Admin actions (POST, PUT) are protected via a simple key-based auth which is x-admin-key header.

After an admin update, changes are instantly reflected in /dashboard (SSR) and within 60s on product pages (ISR revalidation).

## Authentication
Admin access is controlled using ADMIN_KEY stored in .env.local.
Admin panel stores the key in localStorage for persistent sessions.

## Styling
Used TailwindCSS to make a responsive page and UI.

