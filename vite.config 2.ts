import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import { generateChatResponse } from './api/_chat';

const localChatApi = (apiKey: string | undefined, model: string | undefined): Plugin => ({
  name: 'local-gemini-chat-api',
  configureServer(server) {
    server.middlewares.use('/api/chat', async (request, response, next) => {
      if (request.method !== 'POST') {
        next();
        return;
      }

      try {
        const chunks: Buffer[] = [];
        for await (const chunk of request) chunks.push(Buffer.from(chunk));
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        const result = await generateChatResponse(body, apiKey, model);
        response.statusCode = result.status;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify(result.data));
      } catch {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'application/json; charset=utf-8');
        response.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), tailwindcss(), localChatApi(env.GEMINI_API_KEY, env.GEMINI_MODEL)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
