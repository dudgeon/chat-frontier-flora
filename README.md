# Chat Frontier Flora

A modern chat application built with Vite, OpenAI, and Netlify.

## Environment Setup

This project requires several environment variables to be configured:

1. Create a `.env` file in the root directory
2. Add your environment variables:
   ```
   # OpenAI API Key (Required)
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

⚠️ **Important**: Never commit your actual API keys to the repository. The `.env` file is gitignored for security.

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Deployment

This project is configured for automatic deployment to Netlify. The deployment is handled through GitHub Actions and requires the following repository secrets:

- `NETLIFY_AUTH_TOKEN`: Your Netlify authentication token
- `NETLIFY_SITE_ID`: Your Netlify site ID
- `OPENAI_API_KEY`: Your OpenAI API key (for server-side usage)

## License

MIT 