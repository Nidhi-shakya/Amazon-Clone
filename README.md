# ShopZone - Professional Amazon Clone E-Commerce Platform

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A complete, full-stack e-commerce web application inspired by Amazon's shopping experience, built with **React 18, Node.js, Express, MongoDB/Mongoose, and JWT authentication**.

ShopZone features realistic Indian e-commerce data (₹ INR pricing), an Amazon-style dark navy design system, server-verified shopping cart and checkout, real-time product search and multi-facet filtering, order tracking timelines, and zero-configuration database fallback for immediate testing.

---

## 🌟 Key Features

### 🛍️ Amazon-Inspired Shopping Experience
- **Header & Navigation:** Dark navy sticky header (`#131921`) with recognizable ShopZone smile branding, Delivery PIN modal, multi-category search selector, Language/Currency selector, and interactive Account & Lists popover.
- **Secondary SubNav:** Category navigation bar (`#232f3e`) with mobile drawer toggle, quick links (Mobiles, Deals, Electronics, Audio, Fashion, Books), and Prime delivery badge.
- **Hero Promotional Carousel:** Rotating multi-banner carousel with CTA buttons and Amazon's signature bottom gradient blend fading directly into the content grid.
- **Curated Category Cards:** 4-in-1 multi-product category showcase and single promotional tiles.
- **Horizontally Scrollable Rows:** Smooth arrow-scrolling product carousels for "Today's Deals", "Best Sellers", and "Customers Also Viewed".

### 🔎 Product Catalog, Search & Filtering
- **Dynamic Text Search:** Search by product title, brand, category, tags, and description.
- **Multi-Facet Sidebar Filters:**
  - Department / Category selector
  - Customer review star rating filters (4★ & above, 3★ & above)
  - Price range presets (Under ₹1,000, ₹1,000 - ₹5,000, ₹5,000 - ₹20,000, ₹20,000 & above) plus custom Min/Max inputs
  - Amazon Prime eligible filter
  - Today's Deals filter
  - In-stock availability filter
- **Dynamic Sorting:** Sort by Featured, Price (Low to High), Price (High to Low), Customer Rating, Newest Arrivals, and Discount %.
- **Pagination:** Clean numbered pagination with active state indicators.

### 📦 Product Details
- **Multi-Image Thumbnail Gallery:** Hover-to-preview image thumbnails and high-res main viewer.
- **Interactive Buy Box:**
  - Dynamic stock status indicator ("In Stock" / "Only X left")
  - Quantity selector (1 to 10 units)
  - "Add to Cart" and "Buy Now" one-click action
  - 100% Secure transaction SSL guarantee
- **Specifications Table:** Structured key-value technical details (e.g. Processor, Display, Battery, Camera).
- **Related Products:** Category-aware recommendations.

### 🛒 Shopping Cart & Free Delivery Engine
- **Session Persistence:** Authenticated carts sync directly with MongoDB; guest carts seamlessly persist in `localStorage`.
- **Free Delivery Engine:** Orders over ₹499 qualify for **FREE Delivery**, with a dynamic progress bar showing the exact amount needed to unlock free shipping.
- **Quantity Adjuster & Delete:** Real-time quantity selector and instant item removal.
- **Save for Later / Wishlist:** One-click move between Cart and Wishlist.

### 💳 Checkout & Order Processing
- **3-Step Checkout:**
  1. **Delivery Address:** Choose existing saved addresses or create a new address with real-time validation.
  2. **Payment Method:** Supports Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Mock Credit/Debit Cards, and Net Banking.
  3. **Item & Delivery Review:** Complete order snapshot preview.
- **Server-Side Security & Price Verification:** Never trusts prices or subtotals sent by the client. The Express backend recalculates item prices from database records, validates available inventory, and atomically deducts stock.

### 📦 Order History & Package Tracking
- **Order History:** Lists all previous orders with Order ID, placement date, total ₹, and purchased item thumbnails.
- **Package Tracker Timeline:** Visual multi-stage order tracking (Confirmed &rarr; Processing &rarr; Shipped &rarr; Delivered).
- **Buy It Again:** One-click re-order of previously purchased items.
- **Print Invoice:** Clean printable receipt view.

### 🔐 Authentication & Security
- **Bcrypt Password Hashing:** 10 salt rounds with pre-save mongoose middleware.
- **JWT Authentication:** Secure JSON Web Tokens with 30-day expiration and Bearer token headers.
- **Rate Limiting:** Protects `/api/auth` endpoints against brute-force attacks via `express-rate-limit`.
- **Protected Routes:** Guards checkout, account, and orders from unauthorized access.
- **One-Click Demo Logins:** Preloaded customer and admin credentials for instant portfolio evaluation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, Lucide React Icons, Axios |
| **Styling** | Modern CSS3 with custom properties (CSS variables), responsive flexbox/grid |
| **Backend** | Node.js (ES Modules), Express.js 4.19, Mongoose 8 |
| **Database** | MongoDB with automatic in-memory fallback (`mongodb-memory-server`) |
| **Auth & Security** | JSON Web Tokens (JWT), Bcrypt.js, Express Rate Limit, CORS |
| **Testing** | Node.js Built-in Test Runner (`node --test`) |

---

## 📂 Project Architecture

```
amazon/
├── client/                     # Frontend React + Vite application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Header.jsx      # Top dark navy header & search bar
│   │   │   ├── SubNav.jsx      # Secondary category navigation bar
│   │   │   ├── CategoryDrawer.jsx # Mobile & category hamburger drawer
│   │   │   ├── CategoryCard.jsx # 4-in-1 homepage feature card
│   │   │   ├── HeroCarousel.jsx # Amazon-style promotional carousel
│   │   │   ├── HorizontalScrollSection.jsx # Arrow-scrollable product row
│   │   │   ├── ProductCard.jsx # E-commerce product card with ₹ prices
│   │   │   ├── Rating.jsx      # Dynamic star rating visualization
│   │   │   ├── Pagination.jsx  # Numbered pagination controls
│   │   │   ├── ToastContainer.jsx # Floating action notifications
│   │   │   ├── ProtectedRoute.jsx # Route authentication guard
│   │   │   └── Footer.jsx      # Multi-column footer & copyright
│   │   ├── context/            # Global React Contexts
│   │   │   ├── AuthContext.jsx # User state, login, register, demo login
│   │   │   ├── CartContext.jsx # Cart items, totals, free delivery logic
│   │   │   ├── WishlistContext.jsx # Wishlist toggle and synchronization
│   │   │   └── ToastContext.jsx # Toast notification dispatcher
│   │   ├── pages/              # Application views
│   │   │   ├── HomePage.jsx
│   │   │   ├── ProductListingPage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrderSuccessPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── OrderDetailsPage.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios client & API methods
│   │   ├── App.jsx             # Route definitions & layout structure
│   │   ├── main.jsx            # React root mount & providers
│   │   └── index.css           # Amazon design system & variables
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend Node.js & Express API
│   ├── config/
│   │   └── db.js               # MongoDB connection + in-memory fallback
│   ├── controllers/
│   │   ├── authController.js   # User registration, login, profile, addresses
│   │   ├── productController.js# Query, search, filter, categories, deals
│   │   ├── cartController.js   # Cart management & verified server pricing
│   │   ├── wishlistController.js# Wishlist toggling & retrieval
│   │   └── orderController.js  # Server price recalculation, orders, history
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware & admin guard
│   │   ├── errorHandler.js     # Centralized error handler & 404 catcher
│   │   └── rateLimiter.js      # Auth route rate limiter
│   ├── models/
│   │   ├── User.js             # Mongoose user schema & password hashing
│   │   ├── Product.js          # Product schema with text indexes & specs
│   │   ├── Cart.js             # User shopping cart schema
│   │   ├── Wishlist.js         # Wishlist schema
│   │   └── Order.js            # Order snapshot schema with status tracking
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── wishlistRoutes.js
│   │   └── orderRoutes.js
│   ├── seeds/
│   │   ├── productsData.js     # 18+ high-res Indian e-commerce products
│   │   └── seeder.js           # CLI and automatic seeding script
│   ├── tests/
│   │   └── api.test.js         # Automated backend test suite
│   ├── server.js               # Express application entrypoint
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)
- Optional: Local MongoDB or MongoDB Atlas (If MongoDB is not installed locally, the server automatically starts an in-memory database with preloaded products!)

### 1. Install Dependencies

Install root, backend, and frontend dependencies:

```bash
# Root dependencies
npm install

# Backend dependencies
cd server && npm install && cd ..

# Frontend dependencies
cd client && npm install && cd ..
```

### 2. Environment Configuration

Copy `.env.example` to `.env` in the root (and `server/.env` if running backend independently):

```bash
cp .env.example .env
```

Default `.env` configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/shopzone
JWT_SECRET=shopzone_super_secret_jwt_key_2026_dev_secure
CLIENT_URL=http://localhost:5173
```

> **Note:** If `MONGODB_URI` cannot connect to a local MongoDB server, the backend **automatically starts an in-memory database** and pre-populates it with demo users and products.

### 3. Run the Application

Start both frontend and backend concurrently:

```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

Alternatively, run each service independently:
```bash
# In terminal 1 (Backend)
npm run server

# In terminal 2 (Frontend)
npm run client
```

### 4. Seed the Database (Optional)

To manually wipe and seed the database with fresh demo data:

```bash
npm run seed
```

---

## 🔑 Demonstration Credentials

For quick evaluation, you can log in using these pre-seeded accounts (or use the one-click demo login buttons on the Sign-In page):

| Role | Email | Password | Features |
|---|---|---|---|
| **Demo Customer** | `demo@shopzone.in` | `password123` | Pre-saved delivery addresses, order history, active cart |
| **Administrator** | `admin@shopzone.in` | `admin123password` | Administrator privileges & access |

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user account | Public |
| `POST` | `/api/auth/login` | Authenticate user & return JWT | Public |
| `GET` | `/api/auth/me` | Get current user profile | Private |
| `PUT` | `/api/auth/profile` | Update profile information | Private |
| `POST` | `/api/auth/address` | Add new delivery address | Private |

### Products (`/api/products`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/products` | Query products with filters, search, sort, pagination | Public |
| `GET` | `/api/products/categories` | Get all distinct categories with product counts | Public |
| `GET` | `/api/products/deals/featured`| Get deals and best sellers for homepage | Public |
| `GET` | `/api/products/:id` | Get single product by ID with related products | Public |

### Cart (`/api/cart`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/cart` | Get user's cart with calculated subtotal | Private |
| `POST` | `/api/cart/items` | Add item to cart (validates inventory) | Private |
| `PATCH`| `/api/cart/items/:productId` | Update item quantity | Private |
| `DELETE`| `/api/cart/items/:productId`| Remove item from cart | Private |
| `DELETE`| `/api/cart` | Clear entire cart | Private |

### Wishlist (`/api/wishlist`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/wishlist` | Get user's saved wishlist items | Private |
| `POST` | `/api/wishlist/toggle` | Toggle item in wishlist (add/remove) | Private |
| `DELETE`| `/api/wishlist/items/:productId`| Remove specific item from wishlist | Private |

### Orders (`/api/orders`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/orders` | Create order with server price & stock verification | Private |
| `GET` | `/api/orders/my-orders` | Get current user's past order history | Private |
| `GET` | `/api/orders/:id` | Get single order details and tracking status | Private |

---

## 🧪 Automated Testing

Execute the backend automated test suite:

```bash
npm test
```

The test suite validates:
- Health check availability
- Product querying and pagination
- Categories aggregation
- User registration validation and error handling
- Server-side inventory and pricing protection

---

## 🛡️ Security Implementation

- **Server-Side Price Validation:** Client-submitted prices and subtotals are completely ignored. All order prices are recalculated on the server using verified database values.
- **Inventory Check & Atomic Updates:** Available stock is verified before order creation and atomically decremented.
- **Password Protection:** Plain text passwords are never stored. Passwords are salted and hashed with `bcryptjs`.
- **JWT Protection:** Private routes verify Bearer tokens and protect sensitive user data.
- **Rate Limiting:** Protects against credential-stuffing and brute force attacks on authentication routes.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

