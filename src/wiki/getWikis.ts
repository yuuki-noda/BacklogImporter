import fs from "fs";
import { fetchAsync } from "../utils/fetch";
import { fetchBacklogWikiListURL } from "../utils/constant/backlogEndpoint";
import { Wiki } from "../model/Wiki";
import { wikiListFilePath } from "../utils/constant/filePath";

require("dotenv").config();

async function main(): Promise<void> {
  const searchParams = new URLSearchParams();
  searchParams.append("projectIdOrKey", process.env.BACKLOG_PROJECT_KEY || "");
  searchParams.append("apiKey", process.env.BACKLOG_API_KEY || "");
  const url = fetchBacklogWikiListURL(searchParams.toString());
  const result = await fetchAsync({
    url: url,
    options: {
      method: "GET",
      headers: {},
    },
  }).then((response) => {
    return response.json();
  });
  const wikis = result as any[];
  const wikiList: Wiki[] = wikis.map((wiki) => {
    return {
      id: wiki.id as string,
      name: wiki.name as string,
      attachments: [],
      backlogContent: "",
      gitlabContent: "",
    };
  });
  const miniWiki: {
    id: string;
    name: string;
  }[] = wikiList.map((wiki) => {
    return {
      id: wiki.id,
      name: wiki.name,
    };
  });
  console.log(miniWiki);
  fs.writeFileSync(wikiListFilePath, JSON.stringify(wikiList));
}

main().catch((error) => {
  console.error(error);
});
