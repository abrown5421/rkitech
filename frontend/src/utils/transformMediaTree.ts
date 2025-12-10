import type { IMediaFile, IMediaFolder } from "../features/admin/media/mediaTypes";

export const transformMediaTree = (
  obj: Record<string, any>,
  parentPath = ""
): IMediaFolder => {
  const folder: IMediaFolder = {
    name: parentPath === "" ? "root" : parentPath.split("/").pop()!,
    path: parentPath || "root",
    type: "folder",
    children: [],
  };

  for (const key in obj) {
    const val = obj[key];
    const currentPath = parentPath ? `${parentPath}/${key}` : key;

    if (val.type === "file") {
      const file: IMediaFile = {
        name: key,
        path: currentPath,
        type: "file",
        size: val.size,
      };
      folder.children.push(file);
    } else {
      folder.children.push(transformMediaTree(val, currentPath));
    }
  }

  return folder;
};
