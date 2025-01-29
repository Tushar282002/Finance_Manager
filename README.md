# Personal Finance Manager

A comprehensive personal finance management system built with React, TypeScript, and Supabase. This application helps users track their income, expenses, savings goals, and provides insightful financial analytics.

## Features

- **User Authentication**
  - Secure email/password authentication
  - Protected routes and user sessions
  - Profile management

- **Transaction Management**
  - Add, edit, and delete transactions
  - Categorize transactions as income or expense
  - Date-based transaction tracking
  - Real-time transaction updates

- **Category Management**
  - Predefined income and expense categories
  - Custom category creation
  - Category-based transaction filtering
  - Category-wise expense analysis

- **Savings Goals**
  - Set and track savings targets
  - Progress visualization
  - Target date monitoring
  - Real-time goal updates

- **Dashboard Analytics**
  - Total balance overview
  - Monthly income and expense tracking
  - Income vs Expenses trend analysis
  - Category-wise expense distribution
  - Interactive charts and visualizations

## Technology Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Recharts for data visualization
  - Lucide React for icons

- **Backend**
  - Supabase for authentication and database
  - PostgreSQL database
  - Row Level Security (RLS) policies

## Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Layout.tsx     # Main application layout
│   └── PrivateRoute.tsx # Route protection component
├── contexts/          # React contexts
│   └── AuthContext.tsx # Authentication context
├── lib/              # Utility functions and configurations
│   └── supabase.ts   # Supabase client configuration
├── pages/            # Application pages
│   ├── Dashboard.tsx  # Main dashboard
│   ├── Transactions.tsx # Transaction management
│   ├── Categories.tsx  # Category management
│   └── SavingsGoals.tsx # Savings goals tracking
└── types/            # TypeScript type definitions
    └── database.ts   # Database schema types
```

## Code Quality & Best Practices

1. **Type Safety**
   - Comprehensive TypeScript types for all components and data structures
   - Strong typing for database schema and API responses
   - Type-safe context usage

2. **Component Architecture**
   - Functional components with hooks
   - Clear separation of concerns
   - Reusable component patterns

3. **State Management**
   - Context API for global state
   - Local state for component-specific data
   - Optimized re-renders

4. **Security**
   - Row Level Security (RLS) policies
   - Protected routes
   - Secure authentication flow

5. **Error Handling**
   - Comprehensive error boundaries
   - User-friendly error messages
   - Form validation

6. **Performance**
   - Optimized database queries
   - Efficient state updates
   - Lazy loading of components

## Setup Instructions

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Supabase account

2. **Environment Setup**
   ```bash
   # Clone the repository
   git clone https://github.com/Tushar282002/Finance_Manager

   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env
   ```

3. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Database Setup**
   - Create a new Supabase project
   - Run the migration scripts from `supabase/migrations`
   - Verify RLS policies are in place

5. **Running the Application**
   ```bash
   # Start development server
   npm run dev

   # Build for production
   npm run build

   # Preview production build
   npm run preview
   ```

## Testing

The application implements various testing strategies:

- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for critical user flows
- End-to-end testing for complete user journeys

## Deployment

The application can be deployed to any static hosting service:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting service

3. Configure environment variables in your hosting platform

