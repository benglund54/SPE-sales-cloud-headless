import {
  handleGetTopOpportunities,
  handleGetOpportunityDetails,
  handleGetAccountDetails,
  handleGetLeadDetails,
  handleGetRecentLeads,
  handleConvertLead,
  handleSearchRecords,
} from './handlers.js';
import { toolDefinitions } from './definitions.js';

export { toolDefinitions };

const handlerMap: Record<string, (input: any) => Promise<string>> = {
  get_top_opportunities: handleGetTopOpportunities,
  get_opportunity_details: handleGetOpportunityDetails,
  get_account_details: handleGetAccountDetails,
  get_lead_details: handleGetLeadDetails,
  get_recent_leads: handleGetRecentLeads,
  convert_lead: handleConvertLead,
  search_records: handleSearchRecords,
};

export async function executeTool(
  name: string,
  input: Record<string, unknown>
): Promise<{ result: string; summary: string }> {
  const handler = handlerMap[name];
  if (!handler) {
    return {
      result: JSON.stringify({ error: `Unknown tool: ${name}` }),
      summary: `Unknown tool: ${name}`,
    };
  }

  const result = await handler(input);

  const summaries: Record<string, string> = {
    get_top_opportunities: `Queried top ${input.limit || 5} opportunities`,
    get_opportunity_details: `Retrieved opportunity details`,
    get_account_details: `Retrieved account details`,
    get_lead_details: `Retrieved lead details`,
    get_recent_leads: `Queried ${input.limit || 10} recent leads`,
    convert_lead: `Converted lead ${input.leadId}`,
    search_records: `Searched for "${input.searchTerm}"`,
  };

  return { result, summary: summaries[name] || `Executed ${name}` };
}
