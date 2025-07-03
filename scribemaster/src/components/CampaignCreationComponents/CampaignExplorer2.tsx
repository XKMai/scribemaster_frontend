import { cn } from "@/lib/utils";
import type { FolderData, Item, NoteData } from "@/types/TreeTypes";
import {
  syncDataLoaderFeature,
  selectionFeature,
  hotkeysCoreFeature,
  dragAndDropFeature,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { apiService } from "@/services/apiservice";

interface CampaignExplorer2Props {
  campaignId: number;
}

// Type guards
const isNote = (item: Item): item is Item & { data: NoteData } =>
  item.type === "note";
const isFolder = (item: Item): item is Item & { data: FolderData } =>
  item.type === "folder";

export const CampaignExplorer2 = () => {
  const tree = useTree<string>({
    initialState: { expandedItems: ["folder-1"] },
    rootItemId: "folder",
    getItemName: (item) => item.getItemData(),
    isItemFolder: (item) => !item.getItemData().endsWith("item"),
    dataLoader: {
      getItem: (itemId) => itemId,
      getChildren: (itemId) => [
        `${itemId}-1`,
        `${itemId}-2`,
        `${itemId}-3`,
        `${itemId}-1item`,
        `${itemId}-2item`,
      ],
      //getItem: async (itemId) =>  await apiService.getFolder(Number(itemId)),
      //getChildren: async (itemId) => await dataSources.getChildren(itemId),
    },
    indent: 20,
    features: [
      syncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
    ],
  });

  return (
    <div {...tree.getContainerProps()} className="tree">
      {tree.getItems().map((item) => (
        <button
          {...item.getProps()}
          key={item.getId()}
          className="w-full text-left"
          style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}
        >
          <div
            className={cn("block px-2 py-1 rounded text-left w-full", {
              "bg-blue-200": item.isSelected(),
              "outline-2 outline-blue-500": item.isFocused(),
              "font-semibold": item.isFolder(),
            })}
          >
            {item.getItemName()}
          </div>
        </button>
      ))}
    </div>
  );
};
