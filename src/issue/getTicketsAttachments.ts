import fs from "fs";
import { fetchAsync } from "../utils/fetch";
import { Ticket } from "../model/Ticket";
import {
  ticketAttachmentsDirPath,
  ticketListFilePath,
} from "../utils/constant/filePath";
import { fetchTicketAttachmentURL } from "../utils/constant/backlogEndpoint";

const path = require("node:path");
require("dotenv").config();

async function main(): Promise<void> {
  const tickets: Ticket[] = JSON.parse(
    fs.readFileSync(ticketListFilePath).toString()
  );
  for await (const ticket of tickets) {
    console.log("ticket: ", ticket.summary, ticket.keyId);
    if (!ticket.attachments) continue;
    const searchParams = new URLSearchParams();
    searchParams.append("apiKey", process.env.BACKLOG_API_KEY || "");
    for await (const attachment of ticket.attachments) {
      // filepathがあるためダウンロード済み
      if (attachment.filePath) continue;
      console.log(`    attachmentID:${attachment.id}, name:${attachment.name}`);
      const buffer = await fetchAsync({
        url: fetchTicketAttachmentURL(
          ticket.id,
          attachment.id,
          searchParams.toString()
        ),
        options: {
          method: "GET",
        },
      }).then((response) => {
        if (!response.ok) {
          console.log("status: ", response.status);
          response.json().then((json) => {
            console.log("json: ", json);
            throw new Error("faild attachment download");
          });
        }
        return response.arrayBuffer();
      });
      const extName = path.extname(attachment.name);
      fs.writeFileSync(
        `${ticketAttachmentsDirPath}/backlog-${attachment.id}${extName}`,
        Buffer.from(buffer)
      );
      attachment.filePath = `${ticketAttachmentsDirPath}/backlog-${attachment.id}${extName}`;
    }
  }
  fs.writeFileSync(ticketListFilePath, JSON.stringify(tickets), "utf8");
}

main().catch((error) => {
  console.error(error);
});
