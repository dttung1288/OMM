export interface Contact {
  id: string;
  name: string;
  email: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded data
}

export interface Template {
  id: string;
  name: string;
  to: string;
  cc: string;
  bcc: string;
  subject: string;
  body: string;
  isHtml: boolean;
  attachments: Attachment[];
}

export interface Shortcut {
  id: string;
  name: string;
  contactId: string;
  templateId: string;
}
