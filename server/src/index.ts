import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { chatRouter } from './routes/chat.js';
import { activationRouter } from './routes/activation.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDistPath = path.resolve(__dirname, '../../client/dist');

// No CORS middleware: the React client is served from this same origin, so
// cross-origin browser access is intentionally not enabled.
app.use(express.json());

// Lightweight liveness check. Intentionally makes no Salesforce call (no CLI,
// no network) so it is cheap and cannot be used to trigger outbound work.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

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
