# Invoicing Platform

A full-stack invoicing system built with React, Node.js, Express, PostgreSQL, and Stripe integration.

## Features

- **User Authentication & Roles**
  - JWT-based authentication
  - Role-based access control (Admin & Staff)
  - Admin: Full access to all features
  - Staff: Limited access (create/view invoices)

- **Clients Module**
  - CRUD operations for clients
  - Fields: name, email, phone, address, companyName (optional)

- **Invoices Module**
  - Create and manage invoices
  - Auto-generated invoice numbers
  - Fields: amount, currency, issueDate, dueDate, status
  - Status: Pending, Paid, Overdue

- **Stripe Integration**
  - Stripe Checkout (test mode)
  - "Pay Now" button on invoice details
  - Automatic status update to "Paid" after successful payment

- **Dashboard**
  - Summary statistics (Total, Paid, Pending, Overdue invoices)
  - Total revenue display

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL with Sequelize ORM
- JWT authentication
- Stripe API

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn
- Stripe account (for test mode)

## Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd invoicing-platform
```

### 2. Install dependencies

```bash
npm run install:all
```

Or install separately:

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database:

```sql
CREATE DATABASE invoicing_db;
```

2. Update backend environment variables:

```bash
cd backend
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=invoicing_db
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

PORT=5000
NODE_ENV=development

STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
FRONTEND_URL=http://localhost:5173
```

### 4. Stripe Setup

1. Sign up for a Stripe account at https://stripe.com
2. Get your test API keys from the Stripe Dashboard
3. Add the secret key to your `.env` file
4. For webhook testing, use Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/stripe/webhook
```

Copy the webhook signing secret to your `.env` file.

### 5. Seed Database

Run the seed script to create an admin user:

```bash
cd backend
npm run seed
```

Default admin credentials:
- Email: `admin@example.com`
- Password: `admin123`

### 6. Start the Application

#### Development Mode

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Project Structure

```
invoicing-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── clientController.ts
│   │   │   ├── invoiceController.ts
│   │   │   └── stripeController.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Client.ts
│   │   │   ├── Invoice.ts
│   │   │   └── index.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── clientRoutes.ts
│   │   │   ├── invoiceRoutes.ts
│   │   │   └── stripeRoutes.ts
│   │   ├── scripts/
│   │   │   └── seed.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.tsx
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Clients.tsx
│   │   │   ├── Invoices.tsx
│   │   │   └── InvoiceDetails.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get client by ID
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client (Admin only)
- `DELETE /api/clients/:id` - Delete client (Admin only)

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get invoice by ID
- `GET /api/invoices/stats` - Get dashboard statistics
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice (Admin only)
- `DELETE /api/invoices/:id` - Delete invoice (Admin only)

### Stripe
- `POST /api/stripe/create-checkout-session` - Create Stripe checkout session
- `POST /api/stripe/webhook` - Stripe webhook handler

## Usage

### Login
1. Navigate to http://localhost:5173/login
2. Use the default admin credentials or create a new user

### Create a Client
1. Go to the Clients page
2. Click "Add Client"
3. Fill in the required information
4. Click "Create"

### Create an Invoice
1. Go to the Invoices page
2. Click "Create Invoice"
3. Select a client and fill in invoice details
4. Click "Create"

### Pay an Invoice
1. Navigate to an invoice detail page
2. Click "Pay Now" button (for Pending invoices)
3. You'll be redirected to Stripe Checkout
4. Use test card: `4242 4242 4242 4242`
5. After successful payment, invoice status updates to "Paid"

## Stripe Test Cards

For testing payments, use these test card numbers:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

## Environment Variables

### Backend (.env)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - JWT signing secret
- `JWT_EXPIRES_IN` - JWT expiration time
- `PORT` - Server port
- `NODE_ENV` - Environment (development/production)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `FRONTEND_URL` - Frontend URL for redirects

## Security Notes

- Change the default JWT_SECRET in production
- Use strong passwords for database
- Enable HTTPS in production
- Keep Stripe keys secure
- Implement rate limiting for production
- Add input validation and sanitization

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

### Stripe Webhook Issues
- Use Stripe CLI for local testing
- Verify webhook secret in `.env`
- Check webhook endpoint is accessible

### CORS Issues
- Ensure frontend URL matches in backend CORS config
- Check API_URL in frontend environment

## License

ISC

## Support

For issues and questions, please open an issue in the repository.

