export type NoteData = {
  id: number;
  title: string;
  content: string;
  createdBy: number;
};

export type FolderData = {
  id: number;
  name: string;
  isCampaign: boolean;
  settings: object;
  createdBy: number;
  items?: Item[];
};

export type Item = {
  folderId: number; // what folder this item is in
  type: "note" | "folder";
  refId: number; // what item this is referencing
  position: number;
  data: any;
};

export const isNote = (item: Item): item is Item & { data: NoteData } =>
  item.type === "note";

export const isFolder = (item: Item): item is Item & { data: FolderData } =>
  item.type === "folder";