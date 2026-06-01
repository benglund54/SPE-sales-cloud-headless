# Demo Script: Headless Agent — Day in the Life of a Seller

> **Total time**: ~15 minutes with talking points, ~8 minutes moving fast
>
> **Setup**: Open `localhost:5173` in your browser. Start on the **Claude** theme.

---

## Act 1: The Hook (2 min)

**What to say:**

> "What if one AI agent backend could power any chat frontend? Same brain, different skin. Let me show you."

**What to do:** Click through all 5 themes in the bottom theme bar — Claude → ChatGPT → Google Chat → Slack → Teams — pausing 2-3 seconds on each.

**What to say:**

> "Same backend, same data, same Salesforce connection — five completely different user experiences. The intelligence lives in the backend. The frontend is just a skin. Let's see what this agent can actually do."

**Switch back to Claude** for the rest of the demo.

---

## Act 2: Morning Pipeline Check (3 min)

> "Let's start the way a seller starts their day — checking how the quarter is going."

### Type: `How's my quarter g`oing?

**What they see:** A rich analytics dashboard streams in — quota gauge showing 56% attainment, 6 KPI cards, a forecast-vs-plan stacked bar, won deals bar chart, pipeline funnel by stage, account spend chart, color-coded alert cards for customer issues and stale deals, and a prioritized action list.

**What to say:**

> "The agent pulled my full Q2 performance in one shot. I'm at 56% of my $3.5 million annual plan — $1.96 million closed across 7 deals this quarter. My win rate is 64%, up from 58% last quarter, and my average deal size grew 14% to $280K."
>
> "But there are problems. Three deals have gone dark — no activity in over two weeks. And I've got four open customer cases on accounts I've already closed, putting $1.1 million in renewal revenue at risk. The agent prioritized what I should do — respond to the Pinnacle Systems VP escalation first, then address the Atlas SLA breach."
>
> "Notice this isn't just text — the agent rendered gauges, bar charts, a pipeline funnel, and color-coded alerts right in the conversation."

---

## Act 3: Pipeline Deep Dive (2 min)

> "Let me drill into my open pipeline."

### Type: `Show me my top opportunities`

**What they see:** 5 Salesforce-style opportunity record cards appear — each showing opportunity name, owner, account, close date, amount, forecast category, and record type.

**What to say:**

> "These are interactive record cards — not just text. Each one shows the key fields at a glance. Acme Corp is my biggest deal at $450K in Negotiation, followed by Globex at $320K in Proposal. Let me click into the Acme deal."

### Action: Click the **Acme Corp Enterprise License** card

**What they see:** A detail panel slides in from the right with a stage progress bar (colored dots showing completed and current stages), and all the opportunity fields — owner, name, account, amount, close date, opportunity type badge, forecast judgement badge, SE comments textarea, checkboxes for SE Attached/Involved, dropdowns for Segment and Solutions Judgement.

**What to say:**

> "I get the full Salesforce record right here in the conversation — stage progress at the top, all the key fields, and I can edit anything inline. Let me update the SE comments..."

### Action: Click into the **SE Comments** textarea, type something. Toggle the **Technical Selection** checkbox. Then click **X** or the overlay to close.

> "Everything I'd normally do in Salesforce — I can do right here without leaving the conversation."

---

## Act 4: Deal Strategy (2 min)

> "The Acme deal is my biggest opportunity this quarter. Let me ask the agent to help me close it."

### Type: `Build me a close plan for Acme`

**What they see:** A detailed 4-week mutual close plan with weekly action tables — each row has an action item, owner (seller or customer), and due date. Followed by key risks and mitigations.

**What to say:**

> "The agent built a week-by-week close plan working backward from the June 15th close date. Week 1: send the final pricing proposal and schedule the technical deep dive. Week 2: engineering sign-off and security review. Week 3: procurement and legal. Week 4: contract signed."
>
> "It also flagged three risks — security review delays, procurement bottlenecks, and legal redlines — with specific mitigations for each. This would normally take 30 minutes to put together. The agent did it in seconds."

---

## Act 5: Strategic Planning (2 min)

> "Now let's zoom out from the deal level to the account level."

### Type: `Generate an account plan for Acme`

**What they see:** A full annual account plan — account overview with current ARR and whitespace potential, 5 strategic objectives totaling $1.14M, a relationship map with engagement plans per stakeholder, quarterly milestones for Q2-Q4, competitive landscape with counter-strategies, and key risks.

**What to say:**

> "From a tactical close plan to a full-year strategic plan in one prompt. The agent identified $1.2 million in whitespace across the account and laid out five objectives — close the Enterprise License in Q2, expand into the API platform in Q3, land the security add-on in Q4."
>
> "It mapped all five stakeholders with their relationship status and engagement plans — Lisa Park the CTO is our champion, Tom Bradley the CFO is unknown, we need an intro through Lisa. It even analyzed the competitive landscape — DataDog and Snowflake are the threats."

---

## Act 6: Lead Conversion (3 min)

> "Let's shift from existing accounts to new business. Let me check my lead pipeline."

### Type: `Show me my recent leads`

**What they see:** A table of 5 unconverted leads with name, company, title, status, source, and created date.

**What to say:**

> "I've got 5 unconverted leads. Amanda Torres at Velocity Dynamics looks promising — she's a Director of IT and she's already been contacted. Let me pull up her details."

### Type: `Tell me about Amanda Torres`

**What they see:** Full lead detail — company info, contact details, status, industry, revenue ($85M), employee count (400), and a description mentioning 50 engineers, interest in cloud migration, and budget approved for Q3.

**What to say:**

> "Budget approved for Q3, 50-engineer team, interested in cloud migration and API integrations. This is exactly our sweet spot. Let's convert her."

### Type: `Convert this lead`

**What they see:** A confirmation dialog showing what will be created — Account (Velocity Dynamics), Contact (Amanda Torres), and Opportunity (Velocity Dynamics - New Business).

### Type: `Yes, go ahead`

**What they see:** Conversion success with new Salesforce record IDs for the Account, Contact, and Opportunity, plus 4 recommended next steps.

**What to say:**

> "In four messages, we went from a lead list to a fully converted opportunity. Account, Contact, and Opportunity created in Salesforce. The agent even recommended next steps — schedule an intro meeting, add stakeholders, set the amount based on team size, and update the close date for Q3."
>
> "This is the same lead conversion process that normally takes a seller 5 minutes of clicking through Salesforce screens — done conversationally in 30 seconds."

---

## Act 7: The Theme Switch Moment (1 min)

> "Now here's the real point of everything we just saw."

### Action: Switch through all 5 themes — Claude → ChatGPT → Google Chat → Slack → Teams — pausing 3-4 seconds on each.

**What to say:**

> "Every single thing we just did — the quarterly review with charts, the interactive opportunity cards, the close plan, the account strategy, the lead conversion — it all works identically across Claude, ChatGPT, Google Chat, Slack, and Microsoft Teams."
>
> "One agent backend. Any frontend. That's the power of a headless architecture."

---

## Act 8: Wrap-up (1 min)

**What to say:**

> "What we showed today: a single AI agent grounded in your Salesforce data that can power any conversational interface. It checks your pipeline with rich analytics. It builds strategic plans. It converts leads. It renders interactive record cards you can edit inline. And it does all of this through natural language — no clicking through screens, no navigating menus."
>
> "The frontend is just a skin. The intelligence — the tools, the data grounding, the reasoning — lives in the backend. Build it once, deploy it anywhere."

---

## Quick Reference Card

Keep this open on a second screen during the demo.

| Step | What to Type | What You Get |
|------|-------------|--------------|
| 1 | *(switch themes)* | Show 5 UIs |
| 2 | `How's my quarter going?` | Quarterly review with charts and alerts |
| 3 | `Show me my top opportunities` | 5 opportunity record cards |
| 4 | *(click Acme card)* | Slide-out detail panel with editable fields |
| 5 | `Build me a close plan for Acme` | 4-week mutual close plan |
| 6 | `Generate an account plan for Acme` | Annual strategic account plan |
| 7 | `Show me my recent leads` | 5 unconverted leads |
| 8 | `Tell me about Amanda Torres` | Full lead detail |
| 9 | `Convert this lead` | Conversion confirmation |
| 10 | `Yes, go ahead` | Conversion success |
| 11 | *(switch themes again)* | The big finale |

## Bonus Prompts (if you have time or get questions)

| What to Type | What You Get |
|-------------|--------------|
| `Show me the Acme account` | Account details with contacts and open opps |
| `Search for Acme` | Cross-object search results |
| `What should I do next?` | Prioritized recommended actions |

## Tips

- **Start on Claude** — cleanest, most neutral starting point
- **Let the streaming play** — the word-by-word build effect sells the "agent is thinking" feel
- **Click the cards** — the slide-out panel is the most impressive interactive moment
- **Save the theme switch for the end** — it's your closer, the "aha" moment
- **If something breaks**, type `hello` to reset and start a fresh flow
