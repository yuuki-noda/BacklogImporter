const gitlabBaseURL = "https://gitlab.example.com";

export const uploadResourceURL: (projectKey: string) => string = (
  projectKey: string
) => {
  return `${gitlabBaseURL}/api/v4/projects/${projectKey}/uploads`;
};

export const postIssueURL: (projectKey: string) => string = (
  projectKey: string
) => {
  return `${gitlabBaseURL}/api/v4/projects/${projectKey}/issues`;
};
