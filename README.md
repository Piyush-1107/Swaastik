# Swaastik Gems & Jewels

A modern e-commerce website for Swaastik Gems & Jewels, built with Next.js 14 and powered by Supabase. This elegant jewelry showcase features a comprehensive product catalog, user authentication, and a responsive design optimized for both desktop and mobile experiences.

## 🌟 Features

- **Modern Design**: Clean, responsive UI built with TailwindCSS
- **Product Showcase**: Featured products carousel and category grid
- **User Authentication**: Secure login/registration with NextAuth.js
- **Database Integration**: Powered by Supabase for scalable data management
- **Image Optimization**: Next.js Image component for optimal performance
- **Payment Ready**: Razorpay integration for secure transactions
- **Mobile Responsive**: Optimized for all device sizes
- **SEO Optimized**: Proper meta tags and structured data

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.5 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Tailwind Animate
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js + Supabase Auth
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Payments**: Razorpay (optional)
- **Testing**: Jest + React Testing Library
- **Deployment**: Vercel-ready

## 📦 Project Structure

```
swaastik/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── products/          # Product pages
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── auth/              # Authentication components
│   │   ├── home/              # Homepage components
│   │   ├── layout/            # Layout components
│   │   ├── products/          # Product components
│   │   └── ui/                # UI primitives
│   ├── lib/                   # Utility libraries
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Helper functions
├── public/                    # Static assets
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Piyush-1107/Swaastik.git
   cd swaastik
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables in `.env.local`:
   - Supabase project URL and keys
   - NextAuth secret and configuration
   - Payment gateway credentials (optional)

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase project:

   **Products Table:**
   ```sql
   CREATE TABLE products (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     description TEXT,
     price DECIMAL(10,2) NOT NULL,
     category VARCHAR(100),
     image_url TEXT,
     images TEXT[],
     in_stock BOOLEAN DEFAULT true,
     featured BOOLEAN DEFAULT false,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

   **Categories Table:**
   ```sql
   CREATE TABLE categories (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE,
     description TEXT,
     image_url TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

The following environment variables are required:

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXTAUTH_URL` | Base URL for NextAuth | ✅ |
| `NEXTAUTH_SECRET` | Secret for NextAuth sessions | ✅ |
| `RAZORPAY_KEY_ID` | Razorpay key ID | ❌ |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | ❌ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | ❌ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | ❌ |

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and API keys from the project dashboard
3. Set up Row Level Security (RLS) policies as needed
4. Create the required database tables using the SQL provided above

## 📱 Features Overview

### Homepage
- **Hero Section**: Eye-catching banner with call-to-action
- **Featured Products**: Carousel showcasing highlighted jewelry
- **Category Grid**: Visual category navigation with product images
- **About Preview**: Brief introduction to Swaastik Gems & Jewels

### Product Management
- **Product Catalog**: Grid view of all products with filtering
- **Product Details**: Detailed product pages with image galleries
- **Category Pages**: Products organized by jewelry categories
- **Search Functionality**: Find products by name or description

### User Experience
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Fast Loading**: Next.js Image optimization and lazy loading
- **Accessibility**: ARIA labels and keyboard navigation
- **SEO Friendly**: Proper meta tags and structured data

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables

2. **Set environment variables in Vercel**
   - Add all required environment variables from `.env.example`
   - Ensure production URLs are used

3. **Deploy**
   ```bash
   npm run build
   ```

### Deploy to Other Platforms

The project can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Business Information

**Swaastik Gems & Jewels**
- **Owner**: Abhishek Kumar Gupta
- **Contact**: +91 96169 99929
- **Email**: abhishek@swaastikgems.com
- **Address**: Nahar Road, Azad Chowk, Rustampur, Gorakhpur, Uttar Pradesh
- **Specialization**: Manufacturer of Gold and Diamond Jewellery

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage |

## 🐛 Troubleshooting

### Common Issues

1. **Supabase Connection Issues**
   - Verify your environment variables are correct
   - Check if your Supabase project is active
   - Ensure RLS policies allow the required operations

2. **Image Loading Problems**
   - Verify image URLs are accessible
   - Check Next.js Image configuration
   - Ensure proper domains are added to `next.config.js`

3. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check for TypeScript errors with `npm run lint`
   - Verify environment variables are set correctly

## 📄 License

This project is created for Swaastik Gems & Jewels. All rights reserved.

## 📞 Support

For any questions or support, please contact:
- **Email**: abhishek@swaastikgems.com
- **Phone**: +91 96169 99929
- **Address**: Nahar Road, Azad Chowk, Rustampur, Gorakhpur, Uttar Pradesh
- **GitHub Issues**: [Create an issue](https://github.com/Piyush-1107/Swaastik/issues)

---

Made with ❤️ for Swaastik Gems & Jewels
