import type { Entity, EntitySummary } from "./characterSchema";
import type { PlayerCharacter } from "./playerCharacterSchema";

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
  id: number;
  folderId: number; // what folder this item is in
  type: "note" | "folder" | "entity" | "player";
  refId: number; // what item this is referencing
  position: number;
  data: any;
};

export const isNote = (item: Item): item is Item & { data: NoteData } =>
  item.type === "note";

export const isFolder = (item: Item): item is Item & { data: FolderData } =>
  item.type === "folder";

export const isEntity = (
  item: Item
): item is Item & { data: Entity | PlayerCharacter | EntitySummary  } =>
  item.type === "entity" || item.type === "player";