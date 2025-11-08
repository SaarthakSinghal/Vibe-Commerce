# Vibe Commerce

A production-like, minimal e-commerce shopping cart application built with React, Node.js, and MongoDB. Features a complete shopping experience from product browsing to checkout with mock payments.

![Vibe Commerce](https://via.placeholder.com/800x400?text=Vibe+Commerce+Screenshot)

## ✨ Features

- 🛍️ **Product Catalog** - Browse 8 premium tech products with images and descriptions
- 🛒 **Shopping Cart** - Add/remove items, update quantities, persistent cart state
- 💱 **Multi-Currency Support** - Real-time exchange rates with support for INR, USD, EUR, and GBP
- 🌐 **Currency Selector** - Global currency dropdown in navigation bar
- 🔢 **Smart Quantity Controls** - Product cards show quantity selector after adding to cart
- 📝 **Checkout Process** - Form validation with Zod + React Hook Form
- 🧾 **Receipt Generation** - Shareable order receipts with unique IDs
- 💾 **Database Persistence** - MongoDB with Mongoose ODM
- ✅ **Type Safety** - Full TypeScript implementation
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 🔔 **Toast Notifications** - User feedback for all actions
- ⚡ **Loading States** - Smooth UX with proper loading indicators
- 🧪 **Testing** - Jest backend tests + Vitest frontend tests

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Client-side routing
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Zustand** - State management
- **Sonner** - Toast notifications
- **Vite** - Build tool
- **Vitest** - Testing framework

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **Jest** - Testing framework
- **Supertest** - API testing

## 💱 Currency Conversion

The application includes a comprehensive multi-currency system that automatically converts prices based on real-time exchange rates:

### Supported Currencies
- **INR (₹)** - Indian Rupee (default source currency)
- **USD ($)** - US Dollar
- **EUR (€)** - Euro
- **GBP (£)** - British Pound

### How It Works
1. **Exchange Rate Fetching** - Uses the Frankfurter API (European Central Bank) for reliable, free exchange rates
2. **Smart Caching** - Exchange rates are cached for 30 minutes to optimize performance and reduce API calls
3. **Global State** - Currency selection is stored in a Zustand store and shared across all components
4. **Real-time Updates** - All prices (products, cart, checkout, receipts) update automatically when currency changes
5. **Loading States** - Shows "Loading..." while fetching exchange rates to ensure smooth UX

### Key Files
- `frontend/src/store/currencyStore.ts` - Global currency state management
- `frontend/src/hooks/useExchangeRate.ts` - Exchange rate fetching hook with caching
- `frontend/src/utils/currency.ts` - Currency formatting and rate fetching
- `frontend/src/components/CurrencySelector.tsx` - Currency dropdown component
- `frontend/src/components/ProductCard.tsx` - Dynamic pricing with quantity controls

### Usage
Users can change the display currency using the dropdown in the top navigation bar. All prices throughout the application (product pages, cart, checkout, and receipts) will automatically update to reflect the selected currency.

## 📁 Project Structure

```
vibe-commerce/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities
│   │   └── server.ts        # Entry point
│   ├── tests/               # Test files
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components (ProductCard, CurrencySelector, etc.)
│   │   ├── pages/           # Route pages (Products, Cart, Checkout, Receipt)
│   │   ├── store/           # Zustand store (cartStore, currencyStore)
│   │   ├── hooks/           # Custom hooks (useExchangeRate)
│   │   ├── utils/           # Utilities (currency formatting, API)
│   │   ├── lib/             # API client
│   │   ├── types/           # TypeScript types
│   │   ├── schemas/         # Zod schemas
│   │   └── main.tsx         # Entry point
│   ├── package.json
│   └── vite.config.ts
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vibe-commerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```

4. **Update the .env file with your MongoDB URI**
   ```
   MONGODB_URI=mongodb://localhost:27017/vibe-commerce
   ```

### Running the Application

**Start both frontend and backend in development mode:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001

**Build for production:**
```bash
npm run build
```

**Run tests:**
```bash
# All tests
npm test

# Backend only
npm run test -w backend

# Frontend only
npm run test -w frontend
```

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products

**Response:**
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "_id": "...",
        "name": "Wireless Headphones Pro",
        "price": 199.99,
        "imageUrl": "...",
        "description": "..."
      }
    ]
  }
}
```

### Cart
- `GET /api/cart` - Get cart
- `POST /api/cart` - Add item to cart
- `DELETE /api/cart/:productId` - Remove item from cart

**Add to Cart Request:**
```json
{
  "productId": "product_id",
  "qty": 2
}
```

**Get Cart Response:**
```json
{
  "success": true,
  "data": {
    "cart": {
      "items": [
        {
          "productId": "...",
          "name": "Product Name",
          "qty": 2,
          "unitPrice": 999.5,
          "lineTotal": 1999.0,
          "imageUrl": "..."
        }
      ],
      "total": 1999.0
    }
  }
}
```

### Checkout
- `POST /api/checkout` - Create order
- `GET /api/checkout/order/:orderId` - Get order by ID

**Checkout Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "cartItems": [
    {
      "productId": "product_id",
      "qty": 1
    }
  ]
}
```

**Checkout Response:**
```json
{
  "success": true,
  "data": {
    "receipt": {
      "orderId": "...",
      "total": 2499.0,
      "timestamp": "2025-11-07T12:34:56.000Z",
      "items": [
        {
          "name": "...",
          "qty": 1,
          "unitPrice": 999.5,
          "lineTotal": 999.5
        }
      ],
      "customer": {
        "name": "...",
        "email": "..."
      }
    }
  }
}
```

## 🧪 Testing

### Backend Tests
Located in `backend/tests/`

- **products.test.ts** - Product API tests
- **cart.test.ts** - Cart functionality tests
- **checkout.test.ts** - Checkout and order tests

Run with:
```bash
cd backend
npm test
```

### Frontend Tests
Located in `frontend/src/test/`

- **Products.test.tsx** - Products page tests
- **Cart.test.tsx** - Cart page tests
- **Checkout.test.tsx** - Checkout form tests

Run with:
```bash
cd frontend
npm test
```

## 💡 Implementation Details

### State Management
Cart state is managed using **Zustand** with local state synchronized with the backend API for persistence.

### Form Validation
All forms use **Zod** schemas for validation, both on the frontend (for UX) and backend (for security).

### Database Models
- **Product** - Stores product information
- **Cart** - Stores user's cart items (associated with `MOCK_USER_ID`)
- **Order** - Stores completed orders

### Error Handling
All API responses follow a consistent structure:
```json
{
  "success": true | false,
  "data": { ... } | undefined,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message"
  } | undefined
}
```

## 🎨 Design Decisions

1. **UI Library** - Used Tailwind CSS with custom component classes for flexibility
2. **State Management** - Zustand for minimal, simple state management (separate stores for cart and currency)
3. **Validation** - Zod for schema-based validation on both client and server
4. **API Design** - RESTful with structured JSON responses
5. **Money Handling** - Stored as numbers in source currency (INR), converted dynamically in UI
6. **Currency Conversion** - Real-time exchange rates via external API with 30-minute caching
7. **Quantity Controls** - Smart UI that shows quantity selector after adding items to cart
8. **Error Handling** - Graceful fallbacks showing "Loading..." during currency fetch

## 🔧 Development

### Adding New Products
Edit `backend/src/services/product.service.ts` and add products to `MOCK_PRODUCTS` array.

### Modifying Database Schema
1. Update the Mongoose model in `backend/src/models/`
2. Update TypeScript types in `frontend/src/types/`
3. Update validation schemas in both `backend/src/schemas/` and `frontend/src/schemas/`

### Adding New Currencies
1. Add the currency to the `Currency` type in `frontend/src/utils/currency.ts`
2. Add currency locale and formatting in `CURRENCY_LOCALE` object
3. The currency will automatically appear in the dropdown selector

### Currency Conversion Customization
- **Exchange Rate Source** - Currently uses Frankfurter API (https://www.frankfurter.app/)
- **Cache Duration** - Modify `TTL_MS` in `frontend/src/utils/currency.ts` (default: 30 minutes)
- **Source Currency** - All prices stored as INR in backend, conversion happens in frontend
- **Rate Fetching** - Customize in `useExchangeRate` hook and `fetchExchangeRate` function

### Environment Variables

**Backend (.env)**
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/vibe-commerce
MOCK_USER_ID=mock-user-123
CORS_ORIGIN=http://localhost:5173
USE_FAKE_STORE=false
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
