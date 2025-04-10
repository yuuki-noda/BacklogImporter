import fs from "fs";
import { fetchAsync } from "../utils/fetch";
import { fetchWikiAttachmentURL } from "../utils/constant/backlogEndpoint";
import { Wiki } from "../model/Wiki";
import {
  wikiAttachmentsDirPath,
  wikiListFilePath,
} from "../utils/constant/filePath";
import { getAttachmentMarkdown } from "../utils/getAttachmentMarkdown";

const path = require("node:path");
require("dotenv").config();

async function main(): Promise<void> {
  const wikis: Wiki[] = JSON.parse(
    fs.readFileSync(wikiListFilePath).toString()
  );
  await fs.promises.mkdir(wikiAttachmentsDirPath, { recursive: true });
  for await (const wiki of wikis) {
    console.log("wikiID is ", wiki.id);
    const searchParams = new URLSearchParams();
    searchParams.append("apiKey", process.env.BACKLOG_API_KEY || "");
    for await (const attachment of wiki.attachments) {
      // ファイル名が保存されているならスキップ
      if (attachment.replacedName) continue;
      console.log(
        `    attachmentID:${attachment.id}, name:${attachment.filename}`
      );
      const _ = await fetchAsync({
        url: fetchWikiAttachmentURL(
          wiki.id,
          attachment.id,
          searchParams.toString()
        ),
        options: {
          method: "GET",
          headers: {},
        },
      })
        .then((response) => {
          if (!response.ok) {
            fs.writeFileSync(wikiListFilePath, JSON.stringify(wikis));
            throw new Error("faild attachment download");
          }
          return response.arrayBuffer();
        })
        .then((arrayBuffer) => {
          fs.writeFileSync(
            `${wikiAttachmentsDirPath}/backlog-${attachment.id}${attachment.extname}`,
            Buffer.from(arrayBuffer)
          );
          attachment.replacedName = `backlog-${attachment.id}${attachment.extname}`;
          attachment.markdown = getAttachmentMarkdown(
            `backlog-${attachment.id}${attachment.extname}`,
            attachment.extname
          );
        });
    }
  }
  fs.writeFileSync(wikiListFilePath, JSON.stringify(wikis));
}

main().catch((error) => {
  console.error(error);
});
