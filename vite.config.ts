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
              res.end(JSON.stringify({ success: false, error: 'Method not allowed. Only POST is accepted.' }));
              return;
            }

            let body = '';
            req.on('data', (chunk: Buffer) => {
              body += chunk.toString();
            });
            req.on('end', async () => {
              try {
                if (body.length > 15 * 1024) {
                  res.statusCode = 413;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Payload exceeds 15 KB limit.' }));
                  return;
                }

                let parsed: any = {};
                try {
                  parsed = JSON.parse(body || '{}');
                } catch {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
                  return;
                }

                const { name, email, subject, message, hp_website } = parsed;

                // Honeypot spam check
                if (hp_website && typeof hp_website === 'string' && hp_website.trim().length > 0) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Automated spam detected.' }));
                  return;
                }

                // Validation and length boundaries
                if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Name must be between 2 and 100 characters.' }));
                  return;
                }

                if (!email || typeof email !== 'string' || email.trim().length < 5 || email.trim().length > 254) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Email must be valid and under 254 characters.' }));
                  return;
                }

                if (subject && typeof subject === 'string' && subject.trim().length > 150) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Subject must not exceed 150 characters.' }));
                  return;
                }

                if (!message || typeof message !== 'string' || message.trim().length < 15 || message.trim().length > 3000) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Message must be between 15 and 3000 characters.' }));
                  return;
                }

                const resendKey = process.env.RESEND_API_KEY;
                const recipient =
                  process.env.NOTIFICATION_EMAIL ||
                  process.env.VITE_CONTACT_EMAIL ||
                  'muhammadsaleem.76588@gmail.com';

                if (resendKey) {
                  const fromAddress =
                    process.env.RESEND_FROM_EMAIL || 'GlobalEdu Contact <onboarding@resend.dev>';
                  const resendRes = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${resendKey}`,
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      from: fromAddress,
                      to: [recipient],
                      reply_to: email.trim(),
                      subject: `[GlobalEdu Dev] ${parsed.category || 'Report'}: ${parsed.subject || 'Submission'}`,
                      text: `From: ${name.trim()} (${email.trim()})\n\n${message.trim()}`,
                    }),
                  });

                  let resendData: any = {};
                  try {
                    resendData = await resendRes.json();
                  } catch {
                    // Non-JSON
                  }

                  if (resendRes.ok && resendData?.id) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(
                      JSON.stringify({
                        success: true,
                        message: 'Submission received and accepted into dispatch queue.',
                        dispatchId: resendData.id,
                        timestamp: new Date().toISOString(),
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
                res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
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
