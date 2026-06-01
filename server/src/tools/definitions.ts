import type Anthropic from '@anthropic-ai/sdk';

export const toolDefinitions: Anthropic.Tool[] = [
  {
    name: 'get_top_opportunities',
    description:
      "Retrieves the seller's top open opportunities, sorted by amount or close date. Use this when the user asks about their pipeline, top deals, or biggest opportunities.",
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of opportunities to return (default 5, max 20)',
        },
        sortBy: {
          type: 'string',
          enum: ['Amount', 'CloseDate'],
          description: 'Sort field (default Amount DESC)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_opportunity_details',
    description:
      'Gets full details of a specific opportunity by its Salesforce ID or name.',
    input_schema: {
      type: 'object' as const,
      properties: {
        opportunityId: {
          type: 'string',
          description: 'Salesforce Opportunity ID',
        },
        opportunityName: {
          type: 'string',
          description: 'Opportunity name to search for (used if ID not provided)',
        },
      },
      required: [],
    },
  },
  {
    name: 'get_account_details',
    description:
      'Retrieves details about a Salesforce account including key contacts and open opportunities.',
    input_schema: {
      type: 'object' as const,
      properties: {
        accountId: { type: 'string', description: 'Salesforce Account ID' },
        accountName: { type: 'string', description: 'Account name to search for' },
      },
      required: [],
    },
  },
  {
    name: 'get_lead_details',
    description:
      'Gets details about a specific lead. Use before converting a lead.',
    input_schema: {
      type: 'object' as const,
      properties: {
        leadId: { type: 'string', description: 'Salesforce Lead ID' },
        leadName: { type: 'string', description: 'Lead name to search for' },
      },
      required: [],
    },
  },
  {
    name: 'get_recent_leads',
    description:
      'Retrieves recent unconverted leads. Use when the user wants to see their lead pipeline or find leads to convert.',
    input_schema: {
      type: 'object' as const,
      properties: {
        limit: {
          type: 'number',
          description: 'Number of leads to return (default 10, max 25)',
        },
        status: {
          type: 'string',
          description: "Filter by lead status (e.g., 'Open - Not Contacted')",
        },
      },
      required: [],
    },
  },
  {
    name: 'convert_lead',
    description:
      'Converts a lead into an account, contact, and optionally an opportunity. ONLY call after the user confirms they want to convert.',
    input_schema: {
      type: 'object' as const,
      properties: {
        leadId: { type: 'string', description: 'The ID of the lead to convert' },
        convertedStatus: {
          type: 'string',
          description: "The converted lead status value (e.g., 'Closed - Converted')",
        },
        createOpportunity: {
          type: 'boolean',
          description: 'Whether to create an opportunity (default true)',
        },
        opportunityName: {
          type: 'string',
          description: 'Name for the new opportunity',
        },
        accountId: {
          type: 'string',
          description: 'Existing account ID to merge into (omit to create new)',
        },
      },
      required: ['leadId', 'convertedStatus'],
    },
  },
  {
    name: 'search_records',
    description:
      'Searches across Salesforce objects using a keyword search.',
    input_schema: {
      type: 'object' as const,
      properties: {
        searchTerm: {
          type: 'string',
          description: 'The keyword or phrase to search for',
        },
        objects: {
          type: 'array',
          items: {
            type: 'string',
            enum: ['Account', 'Contact', 'Lead', 'Opportunity'],
          },
          description: 'Which Salesforce objects to search (default: all four)',
        },
      },
      required: ['searchTerm'],
    },
  },
];
