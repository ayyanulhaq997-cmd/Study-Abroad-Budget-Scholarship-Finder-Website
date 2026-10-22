import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'api-contact-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/contact', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const { name, email, message, hp_website } = parsed;

                // Honeypot spam check
                if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Automated spam detected.' }));
                  return;
                }

                // Validation check
                if (!name || name.trim().length < 2 || !email || !message || message.trim().length < 15) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Validation failed.' }));
                  return;
                }

                const resendKey = process.env.RESEND_API_KEY;
                const recipient =
                  process.env.NOTIFICATION_EMAIL ||
                  process.env.VITE_CONTACT_EMAIL ||
                  'muhammadsaleem.76588@gmail.com';

                if (resendKey) {
                  const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${resendKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: 'GlobalEdu Contact <notifications@resend.dev>',
                      to: [recipient],
                      reply_to: email,
                      subject: `[GlobalEdu Dev] ${parsed.category || 'Report'}: ${parsed.subject || 'Submission'}`,
                      text: `From: ${name} (${email})\n\n${message}`,
                    }),
                  });
                  if (resendRes.ok) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: true,
                        message: 'Delivered successfully to editorial inbox.',
                      })
                    );
                    return;
                  }
                }

                // In dev without RESEND_API_KEY, return clear unconfigured status
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    error:
                      'Contact delivery service is unconfigured. Set RESEND_API_KEY or VITE_CONTACT_FORM_ENDPOINT to enable automated delivery, or contact the editorial team directly at ' +
                      recipient,
                    recipientEmail: recipient,
                  })
                );
              } catch (err: any) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('.', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
