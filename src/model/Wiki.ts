export interface Wiki {
  name: string;
  id: string;
  attachments: attachment[];
  backlogContent: string;
  gitlabContent: string;
}

export interface attachment {
  id: string;
  filename: string;
  extname: string;
  replacedName: string;
  markdown: string;
}
