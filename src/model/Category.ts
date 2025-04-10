export enum BacklogCategory {
  backbone = "72",
  POS_iOS = "8",
  iOES = "9",
  customerDisplay = "10",
  POS = "585",
  POS_iOS2 = "1054",
  backbone2 = "1147",
  OES = "1149",
}

export enum GitlabCategory {
  POS = "Product::POS",
  OES = "Product::OES",
  display = "Product::display",
  backbone = "Product::backbone",
}

export function gitlabCategoryLabel(
  backlogCategoryID: string
): GitlabCategory | undefined {
  switch (backlogCategoryID) {
    case BacklogCategory.POS_iOS:
    case BacklogCategory.POS_iOS2:
    case BacklogCategory.POS:
      return GitlabCategory.POS;
    case BacklogCategory.iOES:
    case BacklogCategory.OES:
      return GitlabCategory.OES;
    case BacklogCategory.customerDisplay:
      return GitlabCategory.display;
    case BacklogCategory.backbone:
    case BacklogCategory.backbone2:
      return GitlabCategory.backbone;
    default:
      return undefined;
  }
}
