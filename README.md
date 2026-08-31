# Deal Nova 🌟

Deal Nova is a premium, quiet luxury-inspired affiliate marketing platform designed to discover and compare high-value fashion, sneakers, gadgets, watches, and daily lifestyle deals. It aggregates and compares real-time pricing across major retailers like **Amazon, Flipkart, and Myntra** to drive high affiliate conversions.

---

## 🎨 Design & Aesthetics
Deal Nova uses a curated, luxury-inspired color palette tailored for visual excellence:
* **Background Light:** Sand/Beige (`#FDFBF7`)
* **Secondary Light:** Soft Cream (`#F5F2EB`)
* **Primary Brand:** Deep Bronze/Brown (`#8B5A2B`)
* **Dark Contrast:** Charcoal Slate (`#111111`)
* **Typography:** Elegant Playfair Display (Serif headings) paired with Montserrat (Sans-serif body).
* **Responsive Layout:** Responsive mobile drawer and masonry-inspired product grids.

---

## ⚙️ Tech Stack
* **Framework:** Next.js 15 (App Router, dynamic metadata, routing)
* **Styling:** Tailwind CSS (Custom color theme variables config)
* **Animations:** Framer Motion (Fades, layouts, hover transformations)
* **Database & ORM:** PostgreSQL with Prisma ORM
* **Authentication:** NextAuth (Hashed credentials login & Google Provider support)
* **State Management:** Zustand (Persistent client-side wishlist & recently viewed products)
* **Data Fetching:** TanStack React Query (Cached bulk product retrieval)

---

## 🚀 Installation & Local Run

### 1. Clone the repository and install dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root folder (referenced in `.env.example`):
```env
DATABASE_URL="your_database_url_here"
NEXTAUTH_SECRET="your_secret_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Deploy Schema & Seed Database
Deploy your PostgreSQL database tables and populate the store with categories, products, blogs, and test user accounts:
```bash
# Push schema to database
npx prisma db push

# Run the seeding script
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔐 Auth & Admin Panel

Test users are pre-configured in the database via the seed script:

### A. Admin Account
* **Email:** `your email`
* **Password:** `your password`
* **Features:** Accesses the **Admin Dashboard** (`/admin`) to run product cataloging, edit active countdown deals, draft articles, and track click logs metrics.

### B. Customer Account
* **Email:** `alex@dealnova.com`
* **Password:** `userpass`
* **Features:** Saves items to wishlists, views history, and tracks discount comparisons.
