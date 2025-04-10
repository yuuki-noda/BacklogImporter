export interface Ticket {
  id: number;
  keyId: number;
  summary: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignee: TicketAssignee | undefined;
  category: TicketCategory[];
  attachments: TicketAttachment[];
  milestone: TicketMilestone | undefined;
}

export interface TicketPriority {
  id: number;
  name: string;
}

export interface TicketStatus {
  id: number;
  name: string;
}

export interface TicketAssignee {
  id: number;
  name: string;
}

export interface TicketCategory {
  id: number;
  name: string;
}

export interface TicketMilestone {
  id: number;
  name: string;
}

export interface TicketAttachment {
  id: number;
  name: string;
  filePath: string;
  markdown: string;
}

export interface TicketMilestone {
  id: number;
  name: string;
}
