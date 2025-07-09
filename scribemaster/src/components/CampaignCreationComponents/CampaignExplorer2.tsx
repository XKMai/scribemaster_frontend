import { cn } from "@/lib/utils";
import {
  isFolder,
  isNote,
  type FolderData,
  type Item,
  type NoteData,
} from "@/types/TreeTypes";
import {
  selectionFeature,
  hotkeysCoreFeature,
  dragAndDropFeature,
  asyncDataLoaderFeature,
  type ItemInstance,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { apiService } from "@/services/apiservice";
import { useState } from "react";
import { ContentViewer } from "./ContentViewer";
import { NoteContextMenu2 } from "./NoteContextMenu2";

interface CampaignExplorer2Props {
  campaignId: number;
}

// Type guards

export const CampaignExplorer2 = ({ campaignId }: CampaignExplorer2Props) => {
  const [expandedItems, setExpandedItems] = useState([`folder-${campaignId}`]);
  const [selectedItemInstance, setSelectedItemInstance] =
    useState<ItemInstance<Item> | null>(null);

  const tree = useTree<Item>({
    initialState: { expandedItems },
    setExpandedItems,
    rootItemId: `folder-${campaignId}`,
    getItemName: (itemInstance) => {
      const item = itemInstance.getItemData();
      if (!item) return "Loading...";

      return isNote(item)
        ? item.data.title
        : isFolder(item)
        ? item.data.name
        : "Unnamed";
    },

    isItemFolder: (itemInstance) => {
      const item = itemInstance.getItemData();
      return !!item && isFolder(item);
    },

    dataLoader: {
      getItem: async (itemId) => {
        const [type, idStr] = itemId.split("-");
        const id = Number(idStr);
        if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);

        if (type === "folder") {
          const folderData = await apiService.getFolder(id); // ← This is FolderData, not Item
          return {
            folderId: folderData.id,
            refId: folderData.id,
            position: 0,
            type: "folder",
            data: folderData,
          } satisfies Item;
        }

        const noteData = await apiService.getNote(id);
        return {
          folderId: noteData.id,
          refId: noteData.id,
          position: 0,
          type: "note",
          data: noteData,
        } satisfies Item;
      },

      getChildren: async (itemId) => {
        const id = Number(itemId.split("-")[1]);
        const folderData = await apiService.getFolder(id);

        if (!folderData.items) {
          console.warn("No items in folderData:", folderData);
          return [];
        }

        return folderData.items.map(
          (child: Item) => `${child.type}-${child.refId}`
        );
      },
    },
    onPrimaryAction: (itemInstance) => {
      const id = itemInstance.getId();

      if (itemInstance.isFolder()) {
        setExpandedItems(
          (prev) =>
            itemInstance.isExpanded()
              ? prev.filter((i) => i !== id) // collapse
              : [...prev, id] // expand
        );
      } else {
        console.log("Clicked note:", id);
        setSelectedItemInstance(itemInstance);
      }
    },

    indent: 20,
    features: [
      asyncDataLoaderFeature,
      selectionFeature,
      hotkeysCoreFeature,
      dragAndDropFeature,
    ],
  });

  console.log("Tree Items:", tree.getItems());

  return (
    <div className="flex h-full w-screen">
      {/* Tree */}
      <div className="w-1/3 h-full border-r overflow-auto p-4">
        <div {...tree.getContainerProps()} className="tree w-full h-full">
          {tree.getItems().length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              No items to display.
            </div>
          )}
          {tree.getItems().map((itemInstance) => {
            const item = itemInstance.getItemData();
            if (!item) return null;
            const level = itemInstance.getItemMeta().level;

            const node = (
              <div
                key={itemInstance.getId()}
                {...itemInstance.getProps()}
                role="button"
                tabIndex={0}
                className="w-full text-left hover:bg-gray-100 focus:outline-none"
                style={{ paddingLeft: `${level * 20}px` }}
              >
                <div
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded text-sm",
                    {
                      "bg-blue-100 border border-blue-300":
                        itemInstance.isSelected(),
                      "ring-2 ring-blue-500": itemInstance.isFocused(),
                      "font-semibold": itemInstance.isFolder(),
                    }
                  )}
                >
                  <span>
                    {itemInstance.isFolder()
                      ? itemInstance.isExpanded()
                        ? "📂"
                        : "📁"
                      : "📄"}
                  </span>
                  <span className="truncate">{itemInstance.getItemName()}</span>
                </div>
              </div>
            );

            // 🧠 Wrap note-type nodes in a context menu
            if (isNote(item)) {
              return (
                <NoteContextMenu2
                  key={itemInstance.getId()}
                  itemInstance={itemInstance}
                >
                  {node}
                </NoteContextMenu2>
              );
            }

            return node;
          })}
        </div>
      </div>

      {/* ContentViewer */}
      <div className="flex-1 h-full p-4 bg-muted rounded-2xl">
        <div className="text-muted-foreground italic">
          <ContentViewer itemInstance={selectedItemInstance} />
        </div>
      </div>
    </div>
  );
};
