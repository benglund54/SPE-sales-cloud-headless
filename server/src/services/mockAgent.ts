import type { ToolCallSummary } from '../types/index.js';

interface MockResult {
  content: string;
  toolResults: ToolCallSummary[];
}

const EXACT_DISTRIBUTION_DEAL_PROMPTS = new Set([
  'give me my active distribution deals',
  'give me my active disribution deals',
  'what distribution deals need my attention',
  'what disribution deals need my attention',
  'show my active distribution deals',
  'show my active disribution deals',
  'what are my current tv rights deals',
]);

const DISTRIBUTION_DEALS_INTENT =
  /(active|current|open).*(distribution|disribution|tv rights|rights).*(deals|renewals)|what.*(distribution|disribution) deals.*attention|show.*active.*(distribution|disribution) deals|current.*tv rights deals/;

const OPP_STAGES = ['Qualification', 'Perception Analysis', 'Value Proposition', 'Proposal/Price Quote', 'Negotiation/Review', 'Closed Won', 'Closed Lost'];

const OPP_DEFAULTS = {
  seComments: '',
  seNextSteps: '',
  productFit: '3 - Good Fit',
  seEngagement: 'Discovery',
  segment: '',
  seAttached: true,
  seInvolved: true,
  productFeedbacks: 0,
  functionalSelection: false,
  technicalSelection: false,
  solutionsJudgement: '',
  stages: OPP_STAGES,
};

function makeCardBlock(opp: Record<string, unknown>): string {
  return '```chart:record-card\n' + JSON.stringify({ ...OPP_DEFAULTS, ...opp }) + '\n```';
}

const ACME_OPP = {
  name: 'Acme Corp Enterprise License',
  accountName: 'Acme Corp',
  ownerName: 'Gerren Wang',
  amount: 450000,
  closeDate: 'Jun 15, 2026',
  stage: 'Negotiation/Review',
  forecastCategory: 'Commit',
  managerForecast: 'UP+',
  recordType: 'New Business',
  type: 'New Business',
  probability: 75,
  leadSource: 'Partner Referral',
  nextStep: 'Final pricing review with procurement',
  lastActivity: 'May 18, 2026',
  currentStageIndex: 4,
  seComments: 'GW 5/18/26 - Final pricing review scheduled with Mike Johnson. Sarah Chen confirmed engineering sign-off. Need to send security docs to Lisa Park.',
  seNextSteps: 'GW 5/18/26 - Trying to schedule pricing review with procurement (Mike Johnson)',
};

const GLOBEX_OPP = {
  name: 'Globex Platform Expansion',
  accountName: 'Globex Inc',
  ownerName: 'Gerren Wang',
  amount: 320000,
  closeDate: 'Jul 01, 2026',
  stage: 'Proposal/Price Quote',
  forecastCategory: 'Best Case',
  managerForecast: 'Steady',
  recordType: 'New Business / Add-On',
  type: 'Add-On Business',
  probability: 50,
  leadSource: 'Outbound',
  nextStep: 'Follow up on proposal sent May 12',
  lastActivity: 'May 12, 2026',
  currentStageIndex: 3,
};

const INITECH_OPP = {
  name: 'Initech Cloud Migration',
  accountName: 'Initech LLC',
  ownerName: 'Gerren Wang',
  amount: 275000,
  closeDate: 'Jun 30, 2026',
  stage: 'Value Proposition',
  forecastCategory: 'Pipeline',
  managerForecast: 'Steady',
  recordType: 'New Business',
  type: 'New Business',
  probability: 25,
  leadSource: 'Inbound',
  nextStep: 'Send ROI analysis',
  lastActivity: 'May 04, 2026',
  currentStageIndex: 2,
};

const STARK_OPP = {
  name: 'Stark Industries IoT Suite',
  accountName: 'Stark Industries',
  ownerName: 'Gerren Wang',
  amount: 210000,
  closeDate: 'Aug 15, 2026',
  stage: 'Perception Analysis',
  forecastCategory: 'Pipeline',
  managerForecast: 'Steady',
  recordType: 'New Business',
  type: 'New Business',
  probability: 10,
  leadSource: 'Trade Show',
  nextStep: 'Schedule discovery call with CTO',
  lastActivity: 'Apr 28, 2026',
  currentStageIndex: 1,
};

const WAYNE_OPP = {
  name: 'Wayne Enterprises Security Pkg',
  accountName: 'Wayne Enterprises',
  ownerName: 'Gerren Wang',
  amount: 185000,
  closeDate: 'Sep 01, 2026',
  stage: 'Qualification',
  forecastCategory: 'Omitted',
  managerForecast: 'Steady',
  recordType: 'New Business',
  type: 'New Business',
  probability: 5,
  leadSource: 'Web',
  nextStep: 'Qualify budget and timeline',
  lastActivity: 'May 06, 2026',
  currentStageIndex: 0,
};

const OPPORTUNITIES_RESPONSE: MockResult = {
  content: `Here are your **top 5 open opportunities**, sorted by amount:

${makeCardBlock(ACME_OPP)}

${makeCardBlock(GLOBEX_OPP)}

${makeCardBlock(INITECH_OPP)}

${makeCardBlock(STARK_OPP)}

${makeCardBlock(WAYNE_OPP)}

Your pipeline total is **$1,440,000.00** across these top deals. Click any card to view full details and edit fields.`,
  toolResults: [{ toolName: 'get_top_opportunities', input: { limit: 5, sortBy: 'Amount' }, summary: 'Queried top 5 opportunities sorted by Amount DESC' }],
};

const ACME_OPPORTUNITY_RESPONSE: MockResult = {
  content: `Here are the full details for **Acme Corp Enterprise License**:

${makeCardBlock(ACME_OPP)}

**Key Contacts**:
- **Sarah Chen** — VP of Engineering (sarah.chen@acme.com)
- **Mike Johnson** — Procurement Director (mike.j@acme.com)
- **Lisa Park** — CTO (lisa.park@acme.com)

This deal is in good shape. I'd recommend scheduling the pricing review with Mike Johnson in procurement before the June 15th close date. Click the card above to view and edit all fields.`,
  toolResults: [{ toolName: 'get_opportunity_details', input: { opportunityName: 'Acme Corp' }, summary: 'Retrieved opportunity details for Acme Corp Enterprise License' }],
};

const LEADS_RESPONSE: MockResult = {
  content: `Here are your **recent unconverted leads**:

| # | Name | Company | Title | Status | Source | Created |
|---|------|---------|-------|--------|--------|---------|
| 1 | **Amanda Torres** | Velocity Dynamics | Director of IT | Working - Contacted | Web | May 15, 2026 |
| 2 | **James Whitfield** | NovaTech Solutions | VP Operations | Open - Not Contacted | Trade Show | May 13, 2026 |
| 3 | **Rachel Kim** | Pinnacle Systems | Head of Engineering | Working - Contacted | Referral | May 10, 2026 |
| 4 | **David Okafor** | Meridian Group | CIO | Open - Not Contacted | Web | May 08, 2026 |
| 5 | **Sophie Laurent** | Atlas Manufacturing | IT Director | Nurturing | Campaign | May 05, 2026 |

**Amanda Torres** at Velocity Dynamics looks promising — she's already been contacted and is in a decision-making role. Would you like me to pull up her full details, or convert any of these leads?`,
  toolResults: [{ toolName: 'get_recent_leads', input: { limit: 5 }, summary: 'Queried 5 recent unconverted leads' }],
};

const LEAD_DETAIL_RESPONSE: MockResult = {
  content: `Here are the details for **Amanda Torres**:

- **Company**: Velocity Dynamics
- **Title**: Director of IT
- **Email**: a.torres@velocitydynamics.com
- **Phone**: (415) 555-0187
- **Status**: Working - Contacted
- **Lead Source**: Web
- **Industry**: Technology
- **Annual Revenue**: $85M
- **Employees**: 400
- **Location**: San Francisco, CA 94105

**Description**: Inquired about enterprise platform licensing for her team of 50 engineers. Expressed interest in cloud migration capabilities and API integrations. Budget approved for Q3.

This looks like a strong lead — budget is approved and she's in a decision-making role. Would you like me to **convert this lead** into an Account, Contact, and Opportunity?`,
  toolResults: [{ toolName: 'get_lead_details', input: { leadName: 'Amanda Torres' }, summary: 'Retrieved lead details for Amanda Torres' }],
};

const CONVERT_CONFIRM_RESPONSE: MockResult = {
  content: `I'll convert **Amanda Torres** from Velocity Dynamics. Here's what will be created:

- **Account**: Velocity Dynamics
- **Contact**: Amanda Torres (a.torres@velocitydynamics.com)
- **Opportunity**: Velocity Dynamics - New Business

Before I proceed, can you confirm:
1. Create a **new account** for Velocity Dynamics (or merge into an existing one)?
2. **Create an opportunity** for this conversion?

Just say **"yes, go ahead"** to confirm with defaults, or let me know if you'd like to adjust anything.`,
  toolResults: [],
};

const CONVERT_DONE_RESPONSE: MockResult = {
  content: `Lead successfully converted! Here's what was created:

- **Account**: Velocity Dynamics (ID: 001Dn00000Xk9mEIAR)
- **Contact**: Amanda Torres (ID: 003Dn00000Pk2nFIAR)
- **Opportunity**: Velocity Dynamics - New Business (ID: 006Dn00000Ql3oGIAR)

**Recommended next steps:**
1. Schedule an introductory meeting with Amanda Torres
2. Add key stakeholders from Velocity Dynamics to the opportunity
3. Set the opportunity amount based on the 50-engineer team size
4. Update the close date based on their Q3 budget timeline

Would you like me to look up the new account details, or is there anything else I can help with?`,
  toolResults: [{ toolName: 'convert_lead', input: { leadId: '00QDn00000Rm4pHIAR', convertedStatus: 'Closed - Converted' }, summary: 'Converted lead Amanda Torres' }],
};

const SEARCH_RESPONSE: MockResult = {
  content: `Here are the search results:

**Accounts:**
- **Acme Corp** — Technology (ID: 001Dn00000Xk9mEIAR)
- **Acme Financial Services** — Financial Services (ID: 001Dn00000Yl8nDIAR)

**Contacts:**
- **Sarah Chen** — VP of Engineering, Acme Corp (sarah.chen@acme.com)
- **Mike Johnson** — Procurement Director, Acme Corp (mike.j@acme.com)

**Opportunities:**
- **Acme Corp Enterprise License** — $450,000.00 (Negotiation/Review)
- **Acme Financial Data Analytics** — $120,000.00 (Qualification)

Would you like me to drill into any of these records?`,
  toolResults: [{ toolName: 'search_records', input: { searchTerm: 'Acme' }, summary: 'Searched for "Acme" across all objects' }],
};

const ACCOUNT_RESPONSE: MockResult = {
  content: `Here are the details for **Acme Corp**:

- **Industry**: Technology
- **Annual Revenue**: $500,000,000
- **Employees**: 2,500
- **Phone**: (650) 555-0100
- **Website**: www.acmecorp.com
- **Billing Address**: 100 Innovation Drive, San Jose, CA 95134

**Key Contacts** (5):
| Name | Title | Email |
|------|-------|-------|
| Sarah Chen | VP of Engineering | sarah.chen@acme.com |
| Mike Johnson | Procurement Director | mike.j@acme.com |
| Lisa Park | CTO | lisa.park@acme.com |
| Tom Bradley | CFO | tom.bradley@acme.com |
| Ana Rivera | Project Manager | ana.r@acme.com |

**Open Opportunities** (2):
| Opportunity | Amount | Stage | Close Date |
|------------|--------|-------|------------|
| Enterprise License | $450,000.00 | Negotiation/Review | Jun 15, 2026 |
| Support Renewal | $85,000.00 | Proposal/Price Quote | Jul 30, 2026 |

This is your largest account by deal size. Would you like to look at any of the contacts or opportunities in more detail?`,
  toolResults: [{ toolName: 'get_account_details', input: { accountName: 'Acme Corp' }, summary: 'Retrieved account details for Acme Corp' }],
};

function makeDealCard(deal: Record<string, unknown>): string {
  return '```chart:deal-card\n' + JSON.stringify(deal) + '\n```';
}

const TV_RIGHTS_RESPONSE: MockResult = {
  content: `Here are your **current open TV Rights deals:**\n\n` +
    makeDealCard({ company: 'QuantumStream Media', parent: 'Horizon Media Group', amount: '$42M', status: 'Active', content: 'Starfall Chronicles S3', territories: 18, rights: 'Theatrical + SVOD', risk: 'Low', licensing: 'Window holdback under review' }) + '\n\n' +
    makeDealCard({ company: 'Pinnacle Studios', parent: 'Constellation Media', amount: '$35M', status: 'At Risk', content: 'Neon Requiem S1-S3 Bundle', territories: 22, rights: 'SVOD + Linear', risk: 'High', licensing: 'Competing bid in-market' }) + '\n\n' +
    makeDealCard({ company: 'NovaBrand Entertainment', parent: 'Apex Partners', amount: '$28M', status: 'Renewal', content: 'Iron Dominion (full franchise)', territories: 12, rights: 'All Media', risk: 'Medium', licensing: 'Term and exclusivity unresolved' }) + '\n\n' +
    makeDealCard({ company: 'Crestline Digital', parent: 'Meridian Global', amount: '$15M', status: 'Prospect', content: 'Echo Protocol S1', territories: 8, rights: 'SVOD + AVOD', risk: 'Medium', licensing: 'Rights carve-outs pending' }) +
    `\n\n**Distribution view:** $120M in active rights pipeline across 60 territories, with **$35M currently high risk** and two renewals requiring partner alignment this week.\n\nWould you like a risk-by-partner summary, renewal watchlist, or territory windowing review?`,
  toolResults: [{ toolName: 'get_tv_rights_deals', input: { status: 'open' }, summary: 'Queried open TV rights deals' }],
};

const QUANTUM_RENEWAL_RISK_RESPONSE: MockResult = {
  content: `**QuantumStream Renewal Risk Brief**\n\n- **Deal:** Starfall Chronicles S3\n- **Current Structure:** $42M, 18 territories, Theatrical + SVOD, term **2026-09-01 to 2029-08-31**\n- **Risk Level:** **Medium**\n- **Primary Exposure:** QuantumStream continues to push for longer SVOD exclusivity than current contract terms.\n\n**What changed:** We held the SVOD term to 3 years while QuantumStream asked for 5 years.\n**Market signal:** Netflix previously signaled $36M for a 4-year exclusive model (no theatrical), confirming buyer appetite for longer control windows.\n\n**Recommended executive posture:** Preserve pricing discipline while preparing a conditional extension path (longer term only with higher minimum guarantee and tighter performance triggers).`,
  toolResults: [
    { toolName: 'get_deal_details', input: { company: 'QuantumStream Media' }, summary: 'Retrieved QuantumStream Media deal details' },
    { toolName: 'get_renewal_risk_analysis', input: { dealId: 'DEAL-QSM-2026' }, summary: 'Analyzed renewal risk for QuantumStream deal' },
  ],
};

const STARFALL_WINDOWS_RESPONSE: MockResult = {
  content: `**Starfall Chronicles Windowing Status**\n\n- **Availability:** Global across key windows\n- **Catalog Strength:** 3 seasons, 2.1B total streaming hours\n- **Current licensing guidance:** Protect premium SVOD economics by preserving holdback discipline before broad AVOD release.\n\nIf helpful, I can lay out a territory-by-territory window release sequence optimized for renewal leverage.`,
  toolResults: [
    { toolName: 'get_content_availability', input: { title: 'Starfall Chronicles' }, summary: 'Retrieved availability windows for Starfall Chronicles' },
  ],
};

const GREETING_RESPONSE: MockResult = {
  content: `Hi! I'm your Luminary distribution assistant. I can help your studio team run a focused rights workflow:

- **"Show TV rights deals by risk"** — value, status, and licensing exposure in one view
- **"Summarize renewal exposure"** — executive brief with top risks and mitigations
- **"Check Starfall windowing"** — availability and holdback posture by rights window
- **"Draft leadership update"** — board-ready summary of pipeline, risk, and actions
- **"What should we prioritize this week?"** — deal-by-deal operating plan

What should we review first?`,
  toolResults: [],
};

const FALLBACK_RESPONSE: MockResult = {
  content: `I can help with that. Try one of these:

- **"Show TV rights deals by risk"**
- **"Where are our licensing conflicts?"**
- **"Give me an executive summary for this week"**
- **"What is the renewal risk for QuantumStream?"**
- **"Show window availability for Starfall Chronicles"**

I can keep it concise for leadership or provide a detailed operator view.`,
  toolResults: [],
};

// Conversation state to track the lead conversion flow
let conversationState = 'idle';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function processMockChat(
  userMessage: string,
  _conversationHistory: unknown[]
): Promise<MockResult> {
  await sleep(1200);

  const msg = userMessage.toLowerCase().trim();
  const normalizedMsg = msg.replace(/[?!.,]/g, '').replace(/\s+/g, ' ').trim();

  // Lead conversion flow state machine
  if (conversationState === 'awaiting_convert_confirm') {
    if (msg.includes('yes') || msg.includes('go ahead') || msg.includes('confirm') || msg.includes('do it')) {
      conversationState = 'idle';
      return CONVERT_DONE_RESPONSE;
    }
    conversationState = 'idle';
    return { content: "No problem — I won't convert that lead. What else can I help with?", toolResults: [] };
  }

  // Greeting
  if (msg.match(/^(hi|hello|hey|good morning|good afternoon|help|start|what can you)/)) {
    return GREETING_RESPONSE;
  }

  // Starfall windows / availability
  if (msg.match(/starfall.*(window|available|rights)|window.*(starfall|available)/)) {
    return STARFALL_WINDOWS_RESPONSE;
  }

  // QuantumStream renewal risk
  if (msg.match(/renewal.*(quantum|risk)|quantum.*(renewal|risk)|risk.*(quantum|renewal)/)) {
    return QUANTUM_RENEWAL_RISK_RESPONSE;
  }

  // High-confidence distribution deals intent (must win over generic opportunities/deals routing)
  if (EXACT_DISTRIBUTION_DEAL_PROMPTS.has(normalizedMsg) || msg.match(DISTRIBUTION_DEALS_INTENT)) {
    return TV_RIGHTS_RESPONSE;
  }

  // TV Rights deals
  if (msg.match(/tv rights|rights deal|media deal|content deal|distribution deals?|active deals?/)) {
    return TV_RIGHTS_RESPONSE;
  }

  // Opportunities / pipeline
  if (msg.match(/opportunit|pipeline|deals|top deals|my deals|forecast/)) {
    return OPPORTUNITIES_RESPONSE;
  }

  // Specific opportunity detail (Acme or "tell me more" after opportunities)
  if (msg.match(/acme|tell me more|details|drill|more info/) && !msg.match(/lead|convert/)) {
    return ACME_OPPORTUNITY_RESPONSE;
  }

  // Account details (but not "account plan" which is handled later)
  if (msg.match(/account|company info|about (the )?company/) && !msg.match(/plan/)) {
    return ACCOUNT_RESPONSE;
  }

  // Leads
  if (msg.match(/lead|unconverted|new leads|recent leads/) && !msg.match(/convert/)) {
    return LEADS_RESPONSE;
  }

  // Lead detail (Amanda or "tell me more" in lead context)
  if (msg.match(/amanda|torres|velocity|lead detail/)) {
    return LEAD_DETAIL_RESPONSE;
  }

  // Convert lead
  if (msg.match(/convert/)) {
    conversationState = 'awaiting_convert_confirm';
    return CONVERT_CONFIRM_RESPONSE;
  }

  // Search
  if (msg.match(/search|find|look up|lookup/)) {
    return SEARCH_RESPONSE;
  }

  // Globex / other opportunity names
  if (msg.match(/globex|initech|stark|wayne/)) {
    return {
      content: `I found that opportunity in your pipeline. For this demo, I have detailed data for the **Acme Corp Enterprise License** deal. Try asking "tell me more about Acme" to see the full details, or ask about your **leads** to explore the conversion flow.`,
      toolResults: [],
    };
  }

  // Mutual close plan
  if (msg.match(/close plan|mutual|closing plan|close date plan|action plan|game plan/)) {
    return {
      content: `Here's a **Mutual Close Plan** for **Acme Corp Enterprise License** ($450,000 — Close Date: June 15, 2026):

---

### Week 1: May 19 – May 23
| Action | Owner | Due |
|--------|-------|-----|
| Send final pricing proposal with volume discount tiers | Gerren Wang | May 20 |
| Schedule technical deep-dive with Acme engineering team | Gerren Wang | May 21 |
| Acme to confirm user count and license tier | Sarah Chen (Acme) | May 23 |

### Week 2: May 26 – May 30
| Action | Owner | Due |
|--------|-------|-----|
| Technical deep-dive session (demo custom integrations) | Gerren Wang + SE | May 27 |
| Acme internal review — engineering sign-off | Sarah Chen (Acme) | May 29 |
| Share security & compliance documentation | Gerren Wang | May 28 |
| Acme security review kick-off | Lisa Park (Acme CTO) | May 30 |

### Week 3: June 2 – June 6
| Action | Owner | Due |
|--------|-------|-----|
| Address any security review findings | Gerren Wang | June 3 |
| Acme to complete procurement intake form | Mike Johnson (Acme) | June 4 |
| Negotiate final contract terms (legal redlines) | Gerren Wang + Legal | June 5 |
| Confirm budget approval with Acme CFO | Mike Johnson (Acme) | June 6 |

### Week 4: June 9 – June 13 (Close Week)
| Action | Owner | Due |
|--------|-------|-----|
| Send final contract for signature | Gerren Wang | June 9 |
| Acme legal review & approval | Acme Legal | June 11 |
| **Contract signed** | Mike Johnson (Acme) | June 12 |
| Kick-off onboarding & implementation planning | Gerren Wang + CS | June 13 |

---

**Key Risks & Mitigations:**
- **Risk**: Security review delays — *Mitigation*: Send docs proactively in Week 2, flag Lisa Park as priority reviewer
- **Risk**: Procurement bottleneck — *Mitigation*: Mike Johnson confirmed streamlined process for deals under $500K
- **Risk**: Legal redlines extend timeline — *Mitigation*: Share standard terms early, pre-approve common redlines with our legal

**Success Criteria**: Signed contract by **June 12** with onboarding scheduled for the following week.

Would you like me to create tasks for these action items, or adjust any of the dates?`,
      toolResults: [
        { toolName: 'get_opportunity_details', input: { opportunityName: 'Acme Corp' }, summary: 'Retrieved opportunity details for Acme Corp Enterprise License' },
      ],
    };
  }

  // Quarterly review / how's my quarter going
  if (msg.match(/quarter|how.*(am i|are we|is it) (doing|going|tracking|looking)|quota|attainment|qbr|quarterly|how.*(q2|q1|q3|q4)|performance review|numbers look/)) {
    return {
      content: `Here's your **Q2 2026 Performance Summary** (Apr 1 – Jun 30):

\`\`\`chart:gauge
{"value": 56, "label": "Annual Quota Attainment", "subLabel": "$1.96M of $3.5M"}
\`\`\`

\`\`\`chart:kpi
{"items": [{"label": "Closed-Won", "value": "$1.96M", "trend": "7 deals", "trendDirection": "up"}, {"label": "Win Rate", "value": "64%", "trend": "vs 58% last Q", "trendDirection": "up"}, {"label": "Avg Deal Size", "value": "$280K", "trend": "+14% QoQ", "trendDirection": "up"}, {"label": "Avg Sales Cycle", "value": "45 days", "trend": "-3 days", "trendDirection": "up"}, {"label": "Pipeline Gap", "value": "$1.54M", "trend": "1.6x coverage", "trendDirection": "down"}, {"label": "Days Left in Q", "value": "29", "trend": "", "trendDirection": "neutral"}]}
\`\`\`

---

### Forecast vs. Plan

\`\`\`chart:forecast
{"segments": [{"label": "Closed-Won", "value": 1960, "displayValue": "$1.96M", "color": "#22c55e"}, {"label": "Commit", "value": 626, "displayValue": "$626K", "color": "#3b82f6"}, {"label": "Best Case", "value": 283, "displayValue": "$283K", "color": "#93c5fd"}], "target": 3500, "targetLabel": "$3.5M Plan"}
\`\`\`

---

### Closed-Won Deals This Quarter

\`\`\`chart:hbar
{"title": "Won Deals by Amount", "items": [{"label": "Atlas Mfg IoT", "value": 425, "displayValue": "$425K · May 2"}, {"label": "Pinnacle Platform", "value": 380, "displayValue": "$380K · Apr 8"}, {"label": "Zenith Analytics", "value": 315, "displayValue": "$315K · May 9"}, {"label": "Meridian Cloud", "value": 290, "displayValue": "$290K · Apr 22"}, {"label": "Orion Dev Tools", "value": 195, "displayValue": "$195K · May 14"}, {"label": "Vertex Reporting", "value": 180, "displayValue": "$180K · Apr 15"}, {"label": "Cascade Compliance", "value": 175, "displayValue": "$175K · May 19"}]}
\`\`\`

---

### Open Pipeline by Stage

\`\`\`chart:funnel
{"stages": [{"stage": "Negotiation/Review", "deals": 2, "amount": "$835K", "amountNum": 835, "probability": "75%"}, {"stage": "Proposal/Price Quote", "deals": 2, "amount": "$565K", "amountNum": 565, "probability": "50%"}, {"stage": "Value Proposition", "deals": 2, "amount": "$465K", "amountNum": 465, "probability": "25%"}, {"stage": "Perception Analysis", "deals": 1, "amount": "$210K", "amountNum": 210, "probability": "10%"}, {"stage": "Qualification", "deals": 2, "amount": "$340K", "amountNum": 340, "probability": "5%"}]}
\`\`\`

**Total Open Pipeline**: $2,415,000 (9 deals) · **Weighted**: $1,063,000

---

### Account Spend & AOV

\`\`\`chart:hbar
{"title": "Q2 Account Spend", "items": [{"label": "Acme Corp (ARR)", "value": 535, "displayValue": "$535K · +10% YoY", "color": "#6366f1"}, {"label": "Atlas Manufacturing", "value": 425, "displayValue": "$425K · +12% YoY"}, {"label": "Pinnacle Systems", "value": 380, "displayValue": "$380K · +18% YoY"}, {"label": "Zenith Corp", "value": 315, "displayValue": "$315K · +7% YoY"}, {"label": "Meridian Group", "value": 290, "displayValue": "$290K · +15% YoY"}]}
\`\`\`

**Portfolio AOV**: $280K (up from $245K last quarter, **+14%**)

---

### Deals Needing Attention

\`\`\`chart:alerts
{"items": [{"severity": "critical", "title": "Pinnacle Systems — VP Escalation", "detail": "Case #00453: Performance degradation. Escalated by VP. Open 1 day.", "metric": "$380K at risk"}, {"severity": "critical", "title": "Atlas Manufacturing — SLA Breached", "detail": "Case #00447: Data sync failures. Open 3 days, no response.", "metric": "$425K at risk"}, {"severity": "warning", "title": "Acme Corp — Response Due Today", "detail": "Case #00451: API integration errors in production. High priority.", "metric": "$450K open"}, {"severity": "warning", "title": "Zenith Corp — Customer Waiting", "detail": "Case #00449: Billing discrepancy on renewal quote. Open 5 days.", "metric": "$315K at risk"}]}
\`\`\`

These are all accounts you've closed or are closing this quarter — unresolved issues put **$1,120,000** in renewal revenue at risk.

---

### Stale & Stuck Opportunities

\`\`\`chart:table
{"headers": ["Opportunity", "Amount", "Issue", "Days"], "rows": [["Initech Cloud Migration", "$275K", "No activity in 16 days", "16"], ["Quantum Dynamics CRM", "$190K", "No activity in 17 days", "17"], ["Stark Industries IoT", "$210K", "No activity in 22 days + stuck 40 days", "40"], ["Globex Platform Expansion", "$320K", "Stuck in Proposal 36 days", "36"], ["Wayne Enterprises Security", "$185K", "Stuck in Qualification 32 days", "32"]], "highlightColumn": 3}
\`\`\`

Combined value of at-risk pipeline: **$1,180,000**

---

### Recommended Actions

\`\`\`chart:alerts
{"items": [{"severity": "critical", "title": "Respond to Pinnacle Systems escalation", "detail": "VP-level escalation on $380K account — risks damaging champion relationship"}, {"severity": "critical", "title": "Address Atlas Manufacturing SLA breach", "detail": "3 days without response on your largest Q2 deal ($425K)"}, {"severity": "warning", "title": "Re-engage Initech LLC ($275K)", "detail": "16 days dark in Value Prop stage — schedule a call this week or risk losing momentum"}, {"severity": "warning", "title": "Push Globex past Proposal ($320K)", "detail": "Stuck 36 days — confirm if proposal was reviewed, ask for decision timeline"}, {"severity": "info", "title": "Build more pipeline — 1.6x coverage is thin", "detail": "Need ~$500K more to hit 3x coverage on $1.54M gap. Work Amanda Torres and James Whitfield leads."}, {"severity": "info", "title": "Push Acme Corp to close ($450K)", "detail": "Your biggest swing deal — closing this gets you to 69% of plan"}]}
\`\`\`

Would you like me to drill into any of these areas — the stale deals, the customer issues, or the pipeline gap?`,
      toolResults: [
        { toolName: 'get_top_opportunities', input: { ownerId: '005Dn000001XkYz', fiscalQuarter: 'Q2-2026', status: 'all' }, summary: 'Queried all Q2 2026 opportunities (open + closed-won)' },
        { toolName: 'search_records', input: { query: "SELECT Id, Subject, Priority, Status, AccountId, CreatedDate FROM Case WHERE OwnerId = '005Dn000001XkYz' AND Status != 'Closed' ORDER BY Priority DESC" }, summary: 'Queried open cases for current user' },
        { toolName: 'get_top_opportunities', input: { ownerId: '005Dn000001XkYz', lastActivityBefore: '2026-05-06' }, summary: 'Queried opportunities with no activity in past 14 days' },
      ],
    };
  }

  // Account plan
  if (msg.match(/account plan|annual plan|yearly plan|year plan|strategic plan|territory plan|growth plan/)) {
    return {
      content: `Here's a **2026 Annual Account Plan** for **Acme Corp**:

---

### Account Overview
| | |
|---|---|
| **Account** | Acme Corp |
| **Industry** | Technology |
| **Annual Revenue** | $500M |
| **Employees** | 2,500 |
| **Current ARR** | $535,000 |
| **Whitespace Potential** | $1.2M+ |
| **Executive Sponsor** | Lisa Park (CTO) |
| **Account Owner** | Gerren Wang |

---

### Strategic Objectives

| # | Objective | Target | Timeline |
|---|-----------|--------|----------|
| 1 | Close Enterprise License deal | $450K new ARR | Q2 2026 |
| 2 | Expand into Engineering org (API platform) | $280K new ARR | Q3 2026 |
| 3 | Renew Support & Success package | $85K renewal | Q3 2026 |
| 4 | Land Security & Compliance add-on | $180K new ARR | Q4 2026 |
| 5 | Upsell data analytics module to Finance team | $150K new ARR | Q4 2026 |

**Full-year target: $1,145,000** (2.1x current ARR)

---

### Relationship Map

| Stakeholder | Title | Relationship | Engagement Plan |
|------------|-------|--------------|-----------------|
| Lisa Park | CTO | Champion | Monthly exec briefing, invite to customer advisory board |
| Sarah Chen | VP Engineering | Champion | Bi-weekly technical syncs, beta program for new features |
| Mike Johnson | Procurement Dir | Neutral | Quarterly business reviews, simplify procurement process |
| Tom Bradley | CFO | Unknown | Intro via Lisa Park, present ROI analysis in Q3 |
| Ana Rivera | Project Manager | Supporter | Weekly implementation standups, success metrics dashboard |

---

### Quarterly Milestones

**Q2 (Apr–Jun 2026)**
- Close Enterprise License deal ($450K) — *In progress, Negotiation stage*
- Complete security review and legal redlines
- Kick off implementation and onboarding
- Schedule CTO executive briefing #1

**Q3 (Jul–Sep 2026)**
- Renew Support package ($85K) — renewal due July 30
- Present API Platform proposal to Sarah Chen's engineering team
- Get intro to CFO Tom Bradley via Lisa Park
- Host Acme team at annual customer summit (Sep)

**Q4 (Oct–Dec 2026)**
- Close API Platform expansion ($280K)
- Present Security & Compliance add-on to CTO ($180K)
- Pitch data analytics module to Finance team ($150K)
- Conduct annual business review with executive team

---

### Competitive Landscape

| Competitor | Footprint | Risk Level | Counter-Strategy |
|-----------|-----------|------------|-----------------|
| DataDog | Monitoring (Engineering) | Medium | Emphasize unified platform, reduce tool sprawl |
| ServiceNow | ITSM (IT Ops) | Low | Different use case, potential integration partner |
| Snowflake | Data warehouse (Analytics) | Medium | Position as complementary; build integration demo |

---

### Key Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| CTO departure or reorg | High | Build multi-threaded relationships across VP+ level |
| Budget cuts in H2 | Medium | Anchor ROI story early; get Q3/Q4 budget pre-approved in Q2 |
| Competitor displacement | Medium | Deliver measurable value in Q2 to lock in expansion |
| Slow implementation delays expansion | High | Dedicate CSM resource, weekly implementation standups |

---

**Bottom line:** Acme Corp is your largest account with significant whitespace. The Q2 Enterprise License deal is the gateway — closing it on time unlocks the Q3/Q4 expansion plays. Priority #1 is nailing the implementation to build momentum for the API Platform pitch.

Would you like me to dive into any of these objectives, or pull up details on another account?`,
      toolResults: [
        { toolName: 'get_account_details', input: { accountName: 'Acme Corp' }, summary: 'Retrieved account details for Acme Corp' },
        { toolName: 'get_top_opportunities', input: { accountId: '001Dn00000Xk9mEIAR', includeRenewals: true }, summary: 'Queried all opportunities for Acme Corp' },
      ],
    };
  }

  // Next steps
  if (msg.match(/next step|what should|recommend|action|todo/)) {
    return {
      content: `Based on current distribution pipeline, here are the **priority actions for this week**:

1. **Pinnacle Studios ($35M, At Risk)** — counter competitive bid before May 20 and lock preferred rights package.
2. **QuantumStream ($42M, Active)** — align extension strategy for SVOD term before renewal positioning starts.
3. **NovaBrand ($28M, Renewal)** — resolve exclusivity language and term length to protect margin.
4. **Crestline ($15M, Prospect)** — close rights carve-out questions to advance from prospect to structured bid.

If you want, I can convert this into an executive one-pager with owner, deadline, and risk impact.`,
      toolResults: [],
    };
  }

  return FALLBACK_RESPONSE;
}
