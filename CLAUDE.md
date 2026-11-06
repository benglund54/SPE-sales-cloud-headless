# SPE Sales Cloud Headless — Project Instructions

## What this project is

A Sony Pictures Entertainment demonstration of **Salesforce Sales Cloud Headless**: a
multi-skin chat UI (currently themed as Claude, ChatGPT, Google Chat, Slack, and Microsoft
Teams) backed by a single Express/Anthropic agent that talks to a Salesforce CRM org. The
pitch is "one AI agent backend, any chat frontend" — the UI is a skin, the intelligence and
the Salesforce connection live in the backend.

## Origin and independence from IP360

This project is a **verified, independent git clone** of the existing Sony IP360
demonstration (`SPE-seller-demo-app`, deployed as the Heroku app `luminary-rights-demo`).

- **NEVER modify the original `SPE-seller-demo-app` project or push to it.** This checkout
  has no git remotes configured — keep it that way until a new remote is deliberately added
  with explicit approval (see Approval boundaries below).
- **NEVER deploy to the original `luminary-rights-demo` Heroku app.** Any Heroku app for
  this project must be newly created and independently named.
- To state it once, comprehensively: **never modify, commit to, push to, or deploy anything
  to the original `SPE-seller-demo-app` repository or the `luminary-rights-demo` Heroku app**,
  under any circumstance, for any reason.
- No Salesforce credentials or local auth caches were copied into this checkout. Treat the
  absence of `.env` and any cached SF CLI auth as intentional — don't try to "restore" them
  from the original project.
- Do not modify the existing IP360 demo's business scenarios (the Sony-themed scenes under
  `client/src/sony/`, `DEMO_SCRIPT.md`, the mock pipeline data) until explicitly asked. Early
  work on this project is additive (new backend capabilities, new UI surfaces) rather than
  a rewrite of what already works.

## Architecture

```
Microsoft-Teams-style React UI  →  Express backend (tool-calling agent)  →  Salesforce org
      (client/, Vite + TS)              (server/, Node + TS)              (jsforce / future
                                                                             Sales Cloud API)
```

- **npm workspaces monorepo**: `client` (React 18 + Vite 6 + TypeScript), `server` (Express +
  TypeScript, ESM), `shared` (types shared between client and server, no build step).
- **Chat agent**: `server/src/services/claude.ts` drives a tool-calling loop against the
  Anthropic API using `server/src/tools/definitions.ts` (tool schemas) and
  `server/src/tools/handlers.ts` (execution, backed by `services/salesforce.ts`).
- **Mock fallback**: `server/src/services/mockAgent.ts` is a large, deterministic
  mock-response agent used when `ANTHROPIC_API_KEY` is absent or Live/Mock mode is toggled
  off (`GET/POST /api/agent-mode`). **This fallback must keep working** as live connectivity
  is built out — it's the thing that makes the demo reliable when there's no network, no
  Salesforce access, or no API budget in the room.
- **Salesforce access today**: `server/src/services/salesforce.ts` authenticates via the
  Salesforce CLI (`sf org display --target-org headless --json`), not stored
  username/password credentials. This is a local-developer-machine placeholder only. **It
  must not be used for the new Heroku deployment** — a Heroku dyno has no local `sf` CLI
  session to read, and shelling out to a CLI is not an appropriate server auth strategy
  regardless. See Security boundaries below for the required replacement.
- **Sony-specific presentation layer**: `client/src/sony/` contains the IP360 demo's themed
  scenes (Claude/Slack/Teams scenes, activation links, presenter panel, scene navigator).
  Treat this as the existing, working demonstration layer — new Sales Cloud Headless UI work
  should generally live alongside it, not inside it, unless asked to extend it directly.
- **Optional live executive-brief path**: gated end-to-end behind `LIVE_EXEC_BRIEF=true`
  (see `server/src/config.ts`, `server/src/index.ts`). When unset, the route isn't even
  registered — no Anthropic call is possible. Follow this pattern (explicit env-gated
  router registration) for any other feature that should be off by default in a demo.

## Security boundaries (non-negotiable)

- **Salesforce credentials and any future CRM auth tokens stay server-side, always.** The
  React client must never hold a Salesforce session, access token, or credential.
- **Do not authenticate directly to Salesforce from React.** All CRM calls route through the
  Express backend's tool-calling layer.
- **Salesforce authentication for the new demo org must use a secure, server-side OAuth
  approach** (e.g. JWT bearer flow or a Connected App OAuth client-credentials/web-server
  flow) — credentials/keys held only in Heroku config vars, never in the repo. **Do not carry
  the existing CLI-passthrough approach (`sf org display`) into the Heroku deployment** — it
  depends on a local CLI session that doesn't exist on a dyno. **Do not blindly copy the
  legacy `SF_USERNAME`/`SF_PASSWORD`/`SF_SECURITY_TOKEN` fields from `.env.example`** into the
  new org's config without deliberately deciding they're the right auth mechanism — they're
  carried over from the original project's placeholder shape, not a recommendation.
- `SALESFORCE_ACTIVATION_URL` is the one intentional exception: a browser-visible *link
  destination* only, never accompanied by a credential, token, or session. Keep new
  browser-visible config to this same pattern — plain, inert-by-default, no secrets.
- Don't commit `.env`, SF credentials, or CLI auth caches. `.gitignore` already excludes
  `.env`; keep it that way and verify `git status`/`git diff` before any commit that touches
  config files.
- **Before any public-facing deployment of the new Heroku app, triage all `npm audit`
  findings (20 total as of Stage 2, including 6 critical) for production/runtime exposure** —
  i.e. determine which vulnerable packages are actually reachable at runtime (versus
  dev-only or transitively unused) before going live. Do not upgrade dependencies or make
  unrelated fixes to resolve these as a side effect of other work; triage and any remediation
  is its own explicit, approved task.

## Framing and claims (what this demo is and isn't)

- **Do not claim the mocked Teams/Slack/ChatGPT/Google Chat UI is a native integration** with
  those products. It's a themed skin over this app's own chat UI — say so if asked, and don't
  let demo copy imply otherwise.
- **Distinguish this app's Claude-powered tool-calling agent from actual Salesforce
  Agentforce.** They are different things built by different vendors. If/when real
  Agentforce integration is added, name it explicitly as Agentforce rather than folding it
  into the existing "Claude agent" framing.
- Any opportunity/task "update" or "create" action must require **explicit user confirmation**
  before it executes against live Salesforce — this is already the pattern for lead
  conversion in `SYSTEM_PROMPT` (`server/src/prompts/system.ts`) and should extend to new
  write actions (opportunity updates, task/activity creation).

## Development workflow

- **Branch**: work happens on `feature/sony-headless-360`, not `main`. Don't merge to `main`
  or create a `main` branch assumption in tooling/CI config — treat
  `feature/sony-headless-360` as the working trunk for this project until told otherwise.
- **Install**: `npm ci` from the repo root (workspaces-aware; installs `client`, `server`,
  and `shared` together).
- **Build**: `npm run build` (client `tsc && vite build`, then server `tsc`).
- **Dev servers**: `npm run dev` (concurrently runs `dev -w server` and `dev -w client`), or
  `npm run dev:server` / `npm run dev:client` individually.
- **Tests**: `npm test` runs the Node test runner (`node --import tsx --test tests/*.test.ts
  tests/*.test.tsx`) — currently ~299 tests covering UI scenes, activation links, and
  conversation behavior. Keep this suite green; it's the main regression guard for the
  existing IP360 presentation layer.
- **No lint script exists yet** in any workspace — don't assume `npm run lint` works.
- **Verify `npm run build` and `npm test` pass before starting a major implementation stage,
  and run the relevant checks again after making changes.** Treat an unexpected build or test
  failure as something to report, not silently route around — don't disable, skip, or loosen
  a test to make it pass.
- **Maintain a working mock/demo fallback (`server/src/services/mockAgent.ts` and the
  Live/Mock toggle) at all times while adding real CRM connectivity.** Real Salesforce
  integration work must not break or bypass the mock path — the demo must still run
  convincingly with no live Salesforce connection.

### Approval boundaries

- **Do not commit, push, create cloud resources (GitHub repos, Heroku apps, Salesforce
  connected apps, etc.), or deploy anything without my explicit approval.** This applies to
  every instance of each of these actions, not just the first.
- A prior approval authorizes only the specific action approved — do not treat it as
  blanket approval for a next, logically-following step (e.g. approval to create a GitHub
  repo does not imply approval to also push to it, or to then create a Heroku app).
- **Any Salesforce write action in the demo (opportunity update, task/activity creation,
  lead conversion, etc.) must require explicit user confirmation inside the running demo
  before it executes** — this is a product requirement, not just a dev-process one. See the
  Framing section above for where this is already implemented.
- **This confirmation must be enforced in backend application logic, not merely requested
  by the LLM system prompt.** A prompt instruction telling the model to ask first is not a
  safeguard — the model can skip it, and a user can rephrase around it. The backend must
  hold the specific proposed action (the exact record, fields, and new values) and refuse to
  execute it against Salesforce until the user has explicitly approved that specific action
  through an explicit confirmation step the backend itself checks — not be enforced solely by
  model prompting or by convention.

## Current gaps / known placeholders

- Salesforce auth is CLI-passthrough (dev-only), not a deployable auth strategy.
- "Headless" here means **headless Salesforce CRM**: a decoupled frontend (this app's
  multi-skin chat UI) talking to Salesforce only through APIs, with no native Salesforce UI
  in the loop. It is not a distinct "Sales Cloud Headless" product — don't describe it as
  one. Today that API access is standard SOQL/SOSL via `jsforce` plus a SOAP `convertLead`
  call; it is not yet Agentforce, MCP, or any future "Headless 360" integration. Keep these
  distinct in both code and demo narration:
  - **Current**: direct `jsforce` SOQL/SOSL/SOAP calls from the Express backend, described
    above.
  - **Future / not yet built**: Salesforce Agentforce (a Salesforce product, distinct from
    this app's Claude-powered agent — see Framing above), an MCP-based integration, and
    "Headless 360" as a named future capability. None of these exist in this codebase yet;
    don't imply otherwise in code comments, UI copy, or demo scripting.
- `npm audit` reports 20 vulnerabilities (6 critical) inherited from `jsforce`'s legacy
  dependency chain (deprecated `request`/`har-validator`). Known, pre-existing in the
  lockfile as of Stage 2. See the pre-deployment triage requirement under Security
  boundaries above — don't resolve this via `npm audit fix --force` or any dependency
  upgrade as a side effect of unrelated work.
