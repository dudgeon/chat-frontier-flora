# Chat Frontier Flora

A cross-platform chat application built with React Native, Expo, Supabase, and OpenAI.

## Project Structure

```
chat-frontier-flora/
├── apps/
│   ├── mobile/          # React Native + Expo mobile app
│   └── web/            # Web version of the app
├── packages/
│   └── shared/         # Shared code between web and mobile
└── netlify/            # Netlify edge functions
```

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account
- OpenAI API key
- Netlify account

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chat-frontier-flora.git
cd chat-frontier-flora
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:

For mobile:
```bash
npm run mobile
```

For web:
```bash
npm run web
```

## Development

- Mobile app is built with React Native and Expo
- Web version uses Vite
- Both versions share code through the shared package
- Backend uses Netlify Edge Functions with Deno runtime
- Database is hosted on Supabase
- AI features powered by OpenAI

## Deployment

### Mobile

1. Build the app:
```bash
cd apps/mobile
eas build
```

2. Submit to stores:
```bash
eas submit
```

### Web

Deploy to Netlify:
```bash
npm run deploy
```

## License

MIT
