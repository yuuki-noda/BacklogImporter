import fs from "fs";
import { openAsBlob } from "node:fs";
import { Ticket } from "../model/Ticket";
import { ticketListFilePath } from "../utils/constant/filePath";
import { fetchAsync } from "../utils/fetch";
import { uploadResourceURL } from "../utils/constant/gitlabEndpoint";

require("dotenv").config();
const path = require("node:path");

async function main(): Promise<void> {
  const tickets: Ticket[] = JSON.parse(
    fs.readFileSync(ticketListFilePath, "utf8")
  );
  for await (const ticket of tickets) {
    for await (const attachment of ticket.attachments) {
      // markdownがある場合はすでにアップロードが済んでいるためスキップ
      if (attachment.markdown) continue;

      console.log("upload file: ", attachment.filePath);
      const data = await openAsBlob(attachment.filePath);
      const formData = new FormData();
      const fileName = path.basename(attachment.filePath);
      formData.set("file", data, `${fileName}`);
      const json = await fetchAsync({
        url: uploadResourceURL(process.env.GITLAB_PROJECT_KEY || ""),
        options: {
          method: "POST",
          headers: {
            "PRIVATE-TOKEN": process.env.GITLAB_API_KEY || "",
          },
          body: formData,
        },
      }).then((response) => {
        if (!response.ok && !(response.status === 404))
          throw new Error("failed attachment file!");
        return response.json();
      });
      attachment.markdown = json.markdown;
    }
  }
  fs.writeFileSync(ticketListFilePath, JSON.stringify(tickets));
}

main().catch((error) => {
  console.error(error);
});
