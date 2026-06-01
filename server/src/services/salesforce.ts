import jsforce from 'jsforce';
import { exec } from 'child_process';

let connection: jsforce.Connection | null = null;

function fetchCliCredentials(): Promise<{
  accessToken: string;
  refreshToken: string;
  instanceUrl: string;
  clientId: string;
}> {
  return new Promise((resolve, reject) => {
    exec('sf org display --target-org headless --json', { timeout: 60000 }, (err, stdout) => {
      if (err) return reject(new Error(`SF CLI failed: ${err.message}`));
      const result = JSON.parse(stdout).result;
      resolve({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        instanceUrl: result.instanceUrl,
        clientId: result.clientId || 'PlatformCLI',
      });
    });
  });
}

export async function getSalesforceConnection(): Promise<jsforce.Connection> {
  if (connection?.accessToken) {
    return connection;
  }

  console.log('Fetching Salesforce credentials from CLI (one-time)...');
  const creds = await fetchCliCredentials();

  connection = new jsforce.Connection({
    instanceUrl: creds.instanceUrl,
    accessToken: creds.accessToken,
    refreshToken: creds.refreshToken,
    oauth2: {
      clientId: creds.clientId,
      loginUrl: creds.instanceUrl,
    },
  });

  connection.on('refresh', (newToken: string) => {
    console.log('Salesforce token auto-refreshed');
  });

  console.log('Salesforce connected via CLI credentials');
  return connection;
}

export async function querySalesforce<T>(soql: string): Promise<T[]> {
  const conn = await getSalesforceConnection();
  const result = await conn.query<T>(soql);
  return result.records;
}

export async function searchSalesforce(sosl: string): Promise<Record<string, unknown[]>> {
  const conn = await getSalesforceConnection();
  const result = await conn.search(sosl);
  const searchRecords = (result as any).searchRecords || result;
  const grouped: Record<string, unknown[]> = {};
  for (const record of searchRecords as any[]) {
    const type = record.attributes?.type || 'Unknown';
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(record);
  }
  return grouped;
}

export async function convertLead(params: {
  leadId: string;
  convertedStatus: string;
  createOpportunity?: boolean;
  opportunityName?: string;
  accountId?: string;
}): Promise<any> {
  const conn = await getSalesforceConnection();

  const leadConvert: any = {
    leadId: params.leadId,
    convertedStatus: params.convertedStatus,
    doNotCreateOpportunity: params.createOpportunity === false,
  };

  if (params.opportunityName) {
    leadConvert.opportunityName = params.opportunityName;
  }
  if (params.accountId) {
    leadConvert.accountId = params.accountId;
  }

  const result = await (conn as any).soap.convertLead([leadConvert]);
  return Array.isArray(result) ? result[0] : result;
}
