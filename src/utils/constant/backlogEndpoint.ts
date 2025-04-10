const backlogBaseURL = "https://example.com/backlog";
const backlogWikisPath = "/api/v2/wikis";
const backlogIssues = "/api/v2/issues";

export const fetchBacklogWikiDetailURL: (
  wikiID: string,
  paramsString: string
) => string = (wikiID, paramsString) => {
  return `${backlogBaseURL}${backlogWikisPath}/${wikiID}?${paramsString}`;
};

export const fetchBacklogWikiListURL: (paramsString: string) => string = (
  paramsString
) => {
  return `${backlogBaseURL}${backlogWikisPath}?${paramsString}`;
};

export const fetchWikiAttachmentURL: (
  wikiID: string,
  attachmentID: string,
  paramsString: string
) => string = (wikiID, attachmentID, paramsString) => {
  return `${backlogBaseURL}/api/v2/wikis/${wikiID}/attachments/${attachmentID}?${paramsString}`;
};

export const fetchTicketAttachmentURL: (
  ticketID: number,
  attachmentID: number,
  paramsString: string
) => string = (ticketID, attachmentID, paramsString) => {
  return `${backlogBaseURL}/api/v2/issues/${ticketID}/attachments/${attachmentID}?${paramsString}`;
};

export const fetchBacklogAuthorsURL: (
  projectName: string,
  paramsString: string
) => string = (projectName, paramsString) => {
  return `${backlogBaseURL}/api/v2/projects/${projectName}/users?${paramsString}`;
};

export const fetchBacklogStatusesURL: (
  projectName: string,
  paramsString: string
) => string = (projectName, paramsString) => {
  return `${backlogBaseURL}/api/v2/statuses?${paramsString}`;
};

export const fetchIssueCountURL: (paramsString: string) => string = (
  paramsString
) => {
  return `${backlogBaseURL}${backlogIssues}/count?${paramsString}`;
};

export const fetchIssuesURL: (paramsString: string) => string = (
  paramsString
) => {
  return `${backlogBaseURL}${backlogIssues}?${paramsString}`;
};
