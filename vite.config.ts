import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

// Load local environment variables for dev serverless simulation
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Clean local dev plugin to emulate /api/submit serverless function
 * Eliminates need for duplicate Express servers, conflicting ports, or separate processes.
 */
function localApiPlugin(): Plugin {
  return {
    name: 'shuruq-local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/submit') {
          if (req.method !== 'POST') {
            res.statusCode = 405;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, message: 'Method Not Allowed. Use POST.' }));
            return;
          }

          let bodyBuffer = '';
          req.on('data', (chunk) => {
            bodyBuffer += chunk;
            if (bodyBuffer.length > 100000) {
              res.statusCode = 413;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: 'Payload Too Large' }));
              req.destroy();
            }
          });

          req.on('end', async () => {
            try {
              let parsedBody = {};
              if (bodyBuffer) {
                parsedBody = JSON.parse(bodyBuffer);
              }

              // Hot-reload handler in Vite dev environment
              const { processSubmission } = await server.ssrLoadModule('/src/lib/submissionHandler.ts');
              const clientIp = req.socket.remoteAddress || '127.0.0.1';
              const result = await processSubmission(parsedBody, clientIp);

              res.statusCode = result.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.body));
            } catch (err: unknown) {
              const error = err as Error;
              console.error('[DEV_API_ERROR]', error.message);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: false,
                message: 'Local API execution error: ' + error.message,
              }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
  },
});
