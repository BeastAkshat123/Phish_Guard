# Phishing Guard

A comprehensive phishing detection system built to help users identify and protect themselves from malicious emails and links.

## Project Overview

Phishing Guard is a web application that uses heuristic analysis to detect phishing attempts. The application provides real-time scanning capabilities, detailed scan history, and security statistics.

## Technologies Used

This project is built with:

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn-ui
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Analysis**: Heuristic-based phishing detection

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or bun

### Installation

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd phishing-guard

# Step 3: Install dependencies
npm install
# or with bun
bun install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/       # React components
│   ├── ui/          # shadcn-ui components
│   └── ...          # Custom components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── integrations/    # Third-party integrations (Supabase)
├── lib/             # Utility functions
└── main.tsx         # Entry point
```

## Development

### Code Style

This project uses ESLint for code linting. Run `npm run lint` to check for issues.

### Building

To create a production build:

```sh
npm run build
```

## Deployment

You can deploy this project to various platforms:

- Vercel
- Netlify
- GitHub Pages
- Docker
- Any Node.js hosting provider

## License

This project is licensed under the MIT License.

## Support

For questions or issues, please create an issue on GitHub or contact the development team.
