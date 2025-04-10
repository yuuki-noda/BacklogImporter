import fs from "fs";
import { fetchAsync } from "../utils/fetch";
import {
  fetchIssueCountURL,
  fetchIssuesURL,
} from "../utils/constant/backlogEndpoint";
import { BacklogCategory } from "../model/Category";
import {
  Ticket,
  TicketAttachment,
  TicketCategory,
  TicketMilestone,
} from "../model/Ticket";
import { BacklogStatus } from "../model/Status";
import { BacklogUser } from "../model/User";
import { ticketListFilePath } from "../utils/constant/filePath";

require("dotenv").config();

async function main(): Promise<void> {
  const targetProjectIDs: string[] = [process.env.BACKLOG_PROJECT_KEY || ""];
  const targetStatuses: BacklogStatus[] = [
    BacklogStatus.NotStarted,
    BacklogStatus.InProgress,
  ];
  const targetCategories: BacklogCategory[] = Object.values(BacklogCategory);
  const targetUsers: BacklogUser[] = [];

  const searchParams = new URLSearchParams();
  for (const projectID of targetProjectIDs) {
    searchParams.append("projectId[]", projectID);
  }
  for (const status of targetStatuses) {
    searchParams.append("statusId[]", status);
  }
  for (const category of targetCategories) {
    searchParams.append("categoryId[]", category);
  }
  for (const user of targetUsers) {
    searchParams.append("assigneeId[]", user);
  }
  searchParams.append("apiKey", process.env.BACKLOG_API_KEY || "");

  const countURL = fetchIssueCountURL(searchParams.toString());
  console.log("get ticket count url:", countURL);
  const countJson = await fetchAsync({
    url: countURL,
    options: {
      method: "GET",
      headers: {},
    },
  }).then((response) => {
    if (!response.ok) {
      response.json().then((json) => {
        console.log(JSON.stringify(json));
        throw new Error("faild issue count");
      });
    }
    return response.json();
  });
  const numberOfIssues: number = countJson.count;
  console.log("tickets count is ", numberOfIssues);
  searchParams.append("count", "100");
  searchParams.append("sort", "created");
  const numberOfCall = Math.ceil(numberOfIssues / 100);
  let tickets: Ticket[] = [];
  for (let i = 0; i < numberOfCall; i++) {
    searchParams.set("offset", `${i * 100}`);
    const url = fetchIssuesURL(searchParams.toString());
    console.log("fetch tickets url:", url);
    const result: Ticket[] = await fetchAsync({
      url: url,
      options: {
        method: "GET",
        headers: {},
      },
    })
      .then((response) => {
        if (!response.ok) {
          response.json().then((json) => {
            console.log(JSON.stringify(json));
            throw new Error("faild!!");
          });
        }
        return response.json();
      })
      .then((json) => {
        return (json as any[]).map((ticket) => {
          const categories: TicketCategory[] = (ticket.category as any[]).map(
            (category) => {
              return {
                id: category.id,
                name: category.name,
              };
            }
          );

          const attachments: TicketAttachment[] = (
            ticket.attachments as any[]
          ).map((attachment) => {
            return {
              id: attachment.id,
              name: attachment.name,
              filePath: "",
              markdown: "",
            };
          });
          return {
            id: ticket.id,
            keyId: ticket.keyId,
            summary: ticket.summary,
            description: ticket.description,
            priority: {
              id: ticket.priority.id,
              name: ticket.priority.name,
            },
            status: {
              id: ticket.status.id,
              name: ticket.status.name,
            },
            assignee:
              ticket.assignee !== null
                ? { id: ticket.assignee.id, name: ticket.assignee.name }
                : undefined,
            category: categories,
            attachments: attachments,
            milestone:
              ticket.milestone.length > 0
                ? { id: ticket.milestone[0].id, name: ticket.milestone[0].name }
                : undefined,
          };
        });
      });
    const ticketList: Ticket[] = JSON.parse(JSON.stringify(result));
    tickets = tickets.concat(ticketList);
  }
  fs.writeFileSync(ticketListFilePath, JSON.stringify(tickets));
}

main().catch((error) => {
  console.error(error);
});
