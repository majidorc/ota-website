# OTA Website

A modern Online Travel Agency website built with Next.js, Prisma, and PostgreSQL.

## Features

- Activity management system
- Booking system
- User authentication
- Admin dashboard
- AI-powered content generation
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI**: OpenAI GPT-3.5
- **Deployment**: Vercel

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ota-website.git
   cd ota-website
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     DATABASE_URL="your-neon-database-url"
     NEXTAUTH_URL="http://localhost:3000"
     NEXTAUTH_SECRET="your-secret-key"
     OPENAI_API_KEY="your-openai-api-key"
     ```

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Get your connection string from the dashboard
4. Add it to your `.env` file as `DATABASE_URL`

## Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## Admin Access

Default admin credentials:
- Email: admin@example.com
- Password: admin123

## License

MIT 