import { Ticket, TicketAttachment } from "../model/Ticket";
import { Wiki } from "../model/Wiki";

export function replaceWikiAttachment(wiki: Wiki): string {
  const attachments = wiki.attachments;
  const gitlabContent = wiki.gitlabContent;
  let replacedContent = gitlabContent;
  for (const attachment of attachments) {
    // uploadが済んでいない or 失敗しているものは除外
    if (!attachment.markdown) continue;
    // content内に添付ファイルがあれば置換する
    if (replacedContent.includes(`![${attachment.id}](${attachment.id})`)) {
      replacedContent = replacedContent.replace(
        `![${attachment.id}](${attachment.id})`,
        `${attachment.markdown}`
      );
    } else if (
      replacedContent.includes(
        `![${attachment.filename}](${attachment.filename})`
      )
    ) {
      replacedContent = replacedContent.replace(
        `![${attachment.filename}](${attachment.filename})`,
        `${attachment.markdown}`
      );
    } else if (
      replacedContent.includes(
        `[${attachment.filename}](${attachment.filename})`
      )
    ) {
      replacedContent = replacedContent.replace(
        `[${attachment.filename}](${attachment.filename})`,
        `${attachment.markdown}`
      );
    } else {
      // もし引っ掛からなければ一番下に追加する
      replacedContent = replacedContent + `\n${attachment.markdown}\n`;
    }
  }
  return replacedContent;
}

export function replaceTicketAttachment(
  attachments: TicketAttachment[],
  gitlabDesc: string
): string {
  let replacedContent = gitlabDesc;
  for (const attachment of attachments) {
    // uploadが済んでいない or 失敗しているものは除外
    if (!attachment.markdown) continue;
    // content内に添付ファイルがあれば置換する
    if (replacedContent.includes(`![${attachment.id}](${attachment.id})`)) {
      replacedContent = replacedContent.replace(
        `![${attachment.id}](${attachment.id})`,
        `${attachment.markdown}`
      );
    } else if (
      replacedContent.includes(`![${attachment.name}](${attachment.name})`)
    ) {
      replacedContent = replacedContent.replace(
        `![${attachment.name}](${attachment.name})`,
        `${attachment.markdown}`
      );
    } else if (
      replacedContent.includes(`[${attachment.name}](${attachment.name})`)
    ) {
      replacedContent = replacedContent.replace(
        `[${attachment.name}](${attachment.name})`,
        `${attachment.markdown}`
      );
    } else {
      // もし引っ掛からなければ一番下に追加する
      replacedContent = replacedContent + `\n${attachment.markdown}\n`;
    }
  }
  return replacedContent;
}
