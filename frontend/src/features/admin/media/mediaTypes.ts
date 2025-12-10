export interface IMediaFile {
  name: string;
  path: string;
  type: "file";
  size: number;
}

export interface IMediaFolder {
  name: string;
  path: string;
  type: "folder";
  children: Array<IMediaFolder | IMediaFile>;
}

export interface MediaUploadResponse {
  success: boolean;
  message: string;
  data: IMediaFile;
}

export interface MediaRenamePayload {
  oldPath: string;
  newPath: string;
}

export interface MediaReplacePayload {
  targetPath: string;
  file: File;
}

export interface MediaNode {
  name: string;
  path: string;
  type: "folder" | "file";
  children?: MediaNode[];
}

export interface TreeNodeProps {
  node: IMediaFolder | IMediaFile;
  level?: number;
}