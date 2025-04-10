export enum BacklogUser {
  Noda = "1394",
  // TODO
}

export enum GitlabUser {
  Noda = "298",
  // TODO
}

export function gitlabUser(backlogUserID: String): GitlabUser | undefined {
  switch (backlogUserID) {
    // TODO
    case BacklogUser.Noda:
      return GitlabUser.Noda;
    default:
      return undefined;
  }
}
