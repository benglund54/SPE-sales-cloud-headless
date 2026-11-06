import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { chatRouter } from './routes/chat.js';
import { activationRouter } from './routes/activation.js';
import { loadDemoAuthConfig, createDemoAuthMiddleware } from './demoAuth.js';

// Fail closed: in production this throws (and the process exits) if
// DEMO_AUTH_USER / DEMO_AUTH_PASS are missing, rather than serving unprotected.
const demoAuth = loadDemoAuthConfig(process.env);

const app = express();
// Heroku terminates TLS at its router; trust exactly one proxy hop so
// req.secure reflects X-Forwarded-Proto (needed to enforce HTTPS for Basic Auth).
if (config.nodeEnv === 'production') app.set('trust proxy', 1);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// Lightweight liveness check. Intentionally makes no Salesforce call (no CLI,
// no network) so it is cheap and cannot be used to trigger outbound work.
// Registered BEFORE the auth gate: it is the only unauthenticated route and
// returns nothing sensitive.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Access control gate: everything below (API routes, static assets, SPA
// fallback) requires the shared demo credentials. Runs before body parsing so
// unauthenticated requests are rejected before any payload is read.
app.use(createDemoAuthMiddleware(demoAuth));

// No CORS middleware: the React client is served from this same origin, so
// cross-origin browser access is intentionally not enabled.
app.use(express.json());

app.use('/api', chatRouter);
app.use('/api', activationRouter);

// Optional live executive-brief route — mounted ONLY when explicitly enabled.
// When LIVE_EXEC_BRIEF is not 'true' (the default), the router is never created
// or registered, so POST /api/executive-brief does not exist and is not
// callable. No Anthropic request is made in this build.
if (config.sony.liveExecBriefEnabled) {
  const { createLiveBriefRouter } = await import('./routes/liveBrief.js');
  app.use('/api', createLiveBriefRouter());
  console.log('[server] Live executive-brief route ENABLED (LIVE_EXEC_BRIEF=true)');
}

app.use(express.static(clientDistPath));

app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
