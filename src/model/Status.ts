export enum BacklogStatus {
  NotStarted = "1",
  InProgress = "2",
  Processed = "3",
  Completed = "4",
}

export enum GitlabStatus {
  NotStarted = "Status::NotStarted",
  InProgress = "Status::InProgress",
}

export function gitlabStatusLabel(
  backlogStatusID: string
): GitlabStatus | undefined {
  switch (backlogStatusID) {
    case BacklogStatus.NotStarted:
      return GitlabStatus.NotStarted;
    case BacklogStatus.InProgress:
      return GitlabStatus.InProgress;
    default:
      return undefined;
  }
}
