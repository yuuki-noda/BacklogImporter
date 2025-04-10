import { exportAttachmentPath } from "./constant/filePath";

const imageExtensions: string[] = [
  "apng",
  "avif",
  "gif",
  "jpeg",
  "jpg",
  "png",
  "tif",
  "tiff",
  "webp",
];

export function getAttachmentMarkdown(
  fileName: string,
  extname: string
): string {
  const isImageFile = !!imageExtensions.find((v, i, self) => {
    `.${v}` === extname.toLowerCase();
  });
  if (isImageFile) {
    return `![${fileName}](${exportAttachmentPath}/${fileName})`;
  } else {
    return `[${fileName}](${exportAttachmentPath}/${fileName})`;
  }
}
