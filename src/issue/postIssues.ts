import fs from "fs";
import { Ticket } from "../model/Ticket";
import { ticketListFilePath } from "../utils/constant/filePath";
import { fetchAsync, sleep } from "../utils/fetch";
import { postIssueURL } from "../utils/constant/gitlabEndpoint";
import { gitlabUser } from "../model/User";
import { replaceTicketAttachment } from "../utils/replaceAttachment";
import { GitlabCategory, gitlabCategoryLabel } from "../model/Category";
import { gitlabPriorityLabel } from "../model/Priority";
import { gitlabStatusLabel } from "../model/Status";
import { gitlabMilestoneID } from "../model/Milestone";

require("dotenv").config();
const Convert = require("../utils/convert.js");
const convert = new Convert();

async function main(): Promise<void> {
  const tickets: Ticket[] = JSON.parse(
    fs.readFileSync(ticketListFilePath, "utf8")
  );
  for await (const ticket of tickets) {
    const searchParams = new URLSearchParams();
    // タイトル
    const summary = ticket.summary;
    searchParams.append("title", summary);
    // 説明文
    const description = replaceTicketAttachment(
      ticket.attachments,
      convert.execute(ticket.description)
    );
    searchParams.append("description", description);

    // 担当者
    const assigneeID = gitlabUser(`${ticket.assignee?.id || ""}`);
    if (assigneeID) {
      searchParams.append("assignee_id", assigneeID);
    }

    // ラベル
    let labels: string[] = [];
    // カテゴリ e.g. POS, OES, Display
    if (ticket.category) {
      const categoryLabels: string[] = ticket.category
        .map((category) => {
          return gitlabCategoryLabel(`${category.id}`);
        })
        .filter(
          (category): category is GitlabCategory => category !== undefined
        );
      labels = labels.concat(categoryLabels);
    }
    // 優先度
    const priorityLabel = gitlabPriorityLabel(`${ticket.priority.id}`);
    if (priorityLabel) {
      labels.push(priorityLabel);
    }
    // 状態 e.g. 着手中 or 未着手
    const statusLabel = gitlabStatusLabel(`${ticket.status.id}`);
    if (statusLabel) {
      labels.push(statusLabel);
    }
    searchParams.append("labels", labels.join(","));

    // マイルストーン
    const milestone = gitlabMilestoneID(`${ticket.milestone?.id || ""}`);
    if (milestone) {
      searchParams.append("milestone_id", milestone);
    }
    await fetchAsync({
      url: postIssueURL(process.env.GITLAB_PROJECT_KEY || ""),
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "PRIVATE-TOKEN": process.env.GITLAB_API_KEY || "",
        },
        body: searchParams.toString(),
      },
    }).then((response) => {
      console.log(
        "ticket name: ",
        ticket.summary,
        ", status: ",
        response.status
      );
      if (!response.ok && response.status !== 429) {
        response.json().then((json) => {
          console.log("json: ", JSON.stringify(json));
          throw new Error("failed post issue!");
        });
      } else {
        return;
      }
    });
    sleep(1000);
  }
}

main().catch((error) => {
  console.error(error);
});
