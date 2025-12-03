
export enum FileType {
  PDF = 'pdf',
  XLSX = 'xlsx',
  PPT = 'pptx',
  DOCX = 'docx',
  IMG = 'img',
  UNKNOWN = 'unknown',
}

export enum NodeType {
  FILE = 'FILE',
  FOLDER = 'FOLDER',
}

export interface FileSystemNode {
  id: string;
  parentId: string | null;
  name: string;
  type: NodeType;
  // File-specific properties
  size?: number;
  fileType?: FileType;
  uploadDate?: Date;
  url?: string;
}