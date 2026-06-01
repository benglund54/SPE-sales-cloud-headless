import { querySalesforce, searchSalesforce, convertLead } from '../services/salesforce.js';

function escapeSOQL(value: string): string {
  return value.replace(/'/g, "\\'");
}

function isValidSFId(id: string): boolean {
  return /^[a-zA-Z0-9]{15,18}$/.test(id);
}

export async function handleGetTopOpportunities(input: {
  limit?: number;
  sortBy?: string;
}): Promise<string> {
  const limit = Math.min(input.limit || 5, 20);
  const sortBy = input.sortBy === 'CloseDate' ? 'CloseDate ASC' : 'Amount DESC';

  const records = await querySalesforce(
    `SELECT Id, Name, Amount, StageName, CloseDate, Account.Name, Probability
     FROM Opportunity
     WHERE IsClosed = false
     ORDER BY ${sortBy}
     LIMIT ${limit}`
  );

  return JSON.stringify(records, null, 2);
}

export async function handleGetOpportunityDetails(input: {
  opportunityId?: string;
  opportunityName?: string;
}): Promise<string> {
  let whereClause: string;

  if (input.opportunityId) {
    if (!isValidSFId(input.opportunityId)) return JSON.stringify({ error: 'Invalid Opportunity ID format' });
    whereClause = `WHERE Id = '${input.opportunityId}'`;
  } else if (input.opportunityName) {
    whereClause = `WHERE Name LIKE '%${escapeSOQL(input.opportunityName)}%'`;
  } else {
    return JSON.stringify({ error: 'Provide either opportunityId or opportunityName' });
  }

  const records = await querySalesforce(
    `SELECT Id, Name, Amount, StageName, CloseDate, Probability, Description,
            Account.Name, Account.Id, Owner.Name, NextStep, LeadSource, Type,
            ForecastCategory, LastActivityDate, CreatedDate
     FROM Opportunity
     ${whereClause}
     LIMIT 5`
  );

  return JSON.stringify(records, null, 2);
}

export async function handleGetAccountDetails(input: {
  accountId?: string;
  accountName?: string;
}): Promise<string> {
  let whereClause: string;

  if (input.accountId) {
    if (!isValidSFId(input.accountId)) return JSON.stringify({ error: 'Invalid Account ID format' });
    whereClause = `WHERE Id = '${input.accountId}'`;
  } else if (input.accountName) {
    whereClause = `WHERE Name LIKE '%${escapeSOQL(input.accountName)}%'`;
  } else {
    return JSON.stringify({ error: 'Provide either accountId or accountName' });
  }

  const records = await querySalesforce(
    `SELECT Id, Name, Industry, AnnualRevenue, NumberOfEmployees,
            BillingCity, BillingState, Phone, Website, Description,
            (SELECT Id, Name, Title, Email, Phone FROM Contacts LIMIT 5),
            (SELECT Id, Name, Amount, StageName, CloseDate FROM Opportunities WHERE IsClosed = false LIMIT 5)
     FROM Account
     ${whereClause}
     LIMIT 3`
  );

  return JSON.stringify(records, null, 2);
}

export async function handleGetLeadDetails(input: {
  leadId?: string;
  leadName?: string;
}): Promise<string> {
  let whereClause: string;

  if (input.leadId) {
    if (!isValidSFId(input.leadId)) return JSON.stringify({ error: 'Invalid Lead ID format' });
    whereClause = `WHERE Id = '${input.leadId}'`;
  } else if (input.leadName) {
    whereClause = `WHERE Name LIKE '%${escapeSOQL(input.leadName)}%'`;
  } else {
    return JSON.stringify({ error: 'Provide either leadId or leadName' });
  }

  const records = await querySalesforce(
    `SELECT Id, Name, FirstName, LastName, Company, Title, Email, Phone,
            Status, LeadSource, Industry, AnnualRevenue, NumberOfEmployees,
            Street, City, State, PostalCode, Description,
            IsConverted, ConvertedAccountId, ConvertedContactId, ConvertedOpportunityId
     FROM Lead
     ${whereClause}
     LIMIT 5`
  );

  return JSON.stringify(records, null, 2);
}

export async function handleGetRecentLeads(input: {
  limit?: number;
  status?: string;
}): Promise<string> {
  const limit = Math.min(input.limit || 10, 25);
  const statusFilter = input.status
    ? `AND Status = '${escapeSOQL(input.status)}'`
    : '';

  const records = await querySalesforce(
    `SELECT Id, Name, Company, Title, Status, LeadSource, CreatedDate, Email, Phone
     FROM Lead
     WHERE IsConverted = false ${statusFilter}
     ORDER BY CreatedDate DESC
     LIMIT ${limit}`
  );

  return JSON.stringify(records, null, 2);
}

export async function handleConvertLead(input: {
  leadId: string;
  convertedStatus: string;
  createOpportunity?: boolean;
  opportunityName?: string;
  accountId?: string;
}): Promise<string> {
  if (!isValidSFId(input.leadId)) {
    return JSON.stringify({ error: 'Invalid Lead ID format' });
  }

  const result = await convertLead({
    leadId: input.leadId,
    convertedStatus: input.convertedStatus,
    createOpportunity: input.createOpportunity,
    opportunityName: input.opportunityName,
    accountId: input.accountId,
  });

  return JSON.stringify(result, null, 2);
}

export async function handleSearchRecords(input: {
  searchTerm: string;
  objects?: string[];
}): Promise<string> {
  const escapedTerm = input.searchTerm.replace(/[\\{}()|^~*?:"'&!]/g, '\\$&');
  const objects = input.objects || ['Account', 'Contact', 'Lead', 'Opportunity'];

  const returning = objects
    .map((obj) => {
      switch (obj) {
        case 'Account':
          return 'Account(Id, Name, Industry)';
        case 'Contact':
          return 'Contact(Id, Name, Email, Account.Name)';
        case 'Lead':
          return 'Lead(Id, Name, Company, Status)';
        case 'Opportunity':
          return 'Opportunity(Id, Name, Amount, StageName)';
        default:
          return null;
      }
    })
    .filter(Boolean)
    .join(', ');

  const sosl = `FIND {${escapedTerm}} IN ALL FIELDS RETURNING ${returning}`;
  const results = await searchSalesforce(sosl);

  return JSON.stringify(results, null, 2);
}
