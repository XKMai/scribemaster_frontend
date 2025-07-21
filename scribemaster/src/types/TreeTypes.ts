import type { Entity, EntitySummary } from "./characterSchema";
import type { ItemObject } from "./itemSchema";
import type { PlayerCharacter } from "./playerCharacterSchema";
import type { Spell } from "./spellSchema";

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
  type: "note" | "folder" | "entity" | "player" | "item" | "spell";
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

  export const isItem = (item: Item): item is Item & { data: ItemObject } =>
  item.type === "item";

  export const isSpell = ( item: Item): item is Item & { data: Spell }  => 
  item.type === "spell";
