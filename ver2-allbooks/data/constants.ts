import { FileSystemNode, FileType, NodeType } from './types';

export const ADMIN_PASSWORD = 'Jaat4Raj';

export const INITIAL_NODES: FileSystemNode[] = [
  { id: '1', parentId: null, name: 'Documents', type: NodeType.FOLDER },
  { id: '2', parentId: null, name: 'Photos', type: NodeType.FOLDER },
  { id: '3', parentId: null, name: 'Company Logo.png', type: NodeType.FILE, fileType: FileType.IMG, size: 50120, uploadDate: new Date('2023-10-22T16:45:00Z'), url: 'https://i.imgur.com/8p8YJH8.png' },

  // Inside Documents
  { id: '4', parentId: '1', name: 'Projects', type: NodeType.FOLDER },
  { id: '5', parentId: '1', name: 'User Manual.pdf', type: NodeType.FILE, fileType: FileType.PDF, size: 14337, uploadDate: new Date('2023-10-23T11:00:00Z'), url: 'https://pdfobject.com/pdf/sample.pdf' },

  // Inside Projects
  { id: '6', parentId: '4', name: 'Project Proposal.docx', type: NodeType.FILE, fileType: FileType.DOCX, size: 12045, uploadDate: new Date('2023-10-26T10:00:00Z'), url: 'https://file-examples.com/storage/fe52cb07a686367f79a944a/2017/02/file-sample_100kB.docx' },
  { id: '7', parentId: '4', name: 'Q3 Financials.xlsx', type: NodeType.FILE, fileType: FileType.XLSX, size: 250670, uploadDate: new Date('2023-10-25T14:30:00Z'), url: '#' },

  // Inside Photos
  { id: '8', parentId: '2', name: 'Vacation', type: NodeType.FOLDER },
  { id: '9', parentId: '2', name: 'Team Event.jpg', type: NodeType.FILE, fileType: FileType.IMG, size: 120450, uploadDate: new Date('2023-08-15T10:00:00Z'), url: 'https://i.imgur.com/s65AhX6.jpeg' },

  // Inside Vacation
  { id: '10', parentId: '8', name: 'Beach.jpg', type: NodeType.FILE, fileType: FileType.IMG, size: 250670, uploadDate: new Date('2023-07-20T14:30:00Z'), url: 'https://i.imgur.com/8i2tWKe.jpeg' },
];