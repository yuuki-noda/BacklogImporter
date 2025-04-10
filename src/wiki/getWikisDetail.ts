import fs from "fs";
import { fetchAsync } from "../utils/fetch";
import { fetchBacklogWikiDetailURL } from "../utils/constant/backlogEndpoint";
import { attachment, Wiki } from "../model/Wiki";
import { wikiListFilePath } from "../utils/constant/filePath";
const path = require("node:path");
const Convert = require("./utils/convert.js");
const convert = new Convert();
require("dotenv").config();

async function main(): Promise<void> {
  const wikis: Wiki[] = JSON.parse(
    fs.readFileSync(wikiListFilePath).toString()
  );
  for await (const wiki of wikis) {
    if (wiki.gitlabContent && wiki.backlogContent && wiki.attachments) {
      continue;
    }
    const searchParams = new URLSearchParams();
    searchParams.append("apiKey", process.env.BACKLOG_API_KEY || "");
    const url = fetchBacklogWikiDetailURL(wiki.id, searchParams.toString());
    console.log(`fetch wikiID:${wiki.id} name:${wiki.name}`);
    const result = await fetchAsync({
      url: url,
      options: {
        method: "GET",
        headers: {},
      },
    }).then((response) => {
      if (!response.ok) {
        fs.writeFileSync(wikiListFilePath, JSON.stringify(wikis));
        throw new Error();
      }
      return response.json();
    });
    const responseAttachments: any[] = result.attachments;
    const attachmnts: attachment[] = responseAttachments.map(
      (attachment, index, attachments) => {
        return {
          id: attachment.id as string,
          filename: attachment.name as string,
          extname: path.extname(attachment.name as string),
          replacedName: "",
          markdown: "",
        };
      }
    );
    wiki.attachments = attachmnts;
    wiki.backlogContent = result.content;
    wiki.gitlabContent = convert.execute(result.content);
  }
  fs.writeFileSync(wikiListFilePath, JSON.stringify(wikis));
}

main().catch((error) => {
  console.error(error);
});
