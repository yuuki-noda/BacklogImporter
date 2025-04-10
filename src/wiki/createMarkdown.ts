import fs from "fs";
import path from "path";
import { Wiki } from "../model/Wiki";
import { wikiListFilePath } from "../utils/constant/filePath";
import { replaceWikiAttachment } from "../utils/replaceAttachment";

function main() {
  const baseDir = path.resolve("./output/wiki");
  const wikis: Wiki[] = JSON.parse(fs.readFileSync(wikiListFilePath, "utf8"));

  for (const wiki of wikis) {
    const fullPath = path.join(baseDir, wiki.name);
    const dirPath = path.dirname(fullPath);
    const fileName = path.basename(wiki.name);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const content = replaceWikiAttachment(wiki);
    fs.writeFileSync(`${fullPath}.md`, content, "utf8");
    console.log(`Created: ${fullPath}.md`);
  }
}

main();
