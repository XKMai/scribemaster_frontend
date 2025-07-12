import { cn } from "@/lib/utils";
import { isFolder, isNote, type Item } from "@/types/TreeTypes";
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
import { FolderContextMenu2 } from "./FolderContextMenu2";
import { EmptyContextMenu2 } from "./EmptyContextMenu2";

interface CampaignExplorer2Props {
  campaignId: number;
}

export const CampaignExplorer2 = ({ campaignId }: CampaignExplorer2Props) => {
  const [expandedItems, setExpandedItems] = useState([`folder-${campaignId}`]);
  const [selectedItemInstance, setSelectedItemInstance] =
    useState<ItemInstance<Item> | null>(null);

  const tree = useTree<Item>({
    initialState: { expandedItems },
    setExpandedItems,
    rootItemId: `campaign-${campaignId}`,
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
        console.log(itemId);
        const [, idStr] = itemId.split("-");
        const id = Number(idStr);
        if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);

        const item = await apiService.getItem({ itemId: id });

        console.log("Fetched item:", item);
        return item;
      },
      // getItem: async (itemId) => {
      //   const [type, idStr] = itemId.split("-");
      //   const id = Number(idStr);
      //   if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);

      //   if (type === "folder") {
      //     const folderData = await apiService.getFolder(id); // This is FolderData, not Item
      //     return {
      //       id: folderData.id,
      //       folderId: folderData.id,
      //       refId: folderData.id,
      //       position: 0,
      //       type: "folder",
      //       data: folderData,
      //     } satisfies Item;
      //   }

      //   const noteData = await apiService.getNote(id);
      //   return {
      //     id: noteData.id,
      //     folderId: noteData.id,
      //     refId: noteData.id,
      //     position: 0,
      //     type: "note",
      //     data: noteData,
      //   } satisfies Item;
      // },

      getChildren: async (itemId) => {
        const [type, rawId] = itemId.split("-");
        const id = Number(rawId);
        if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);

        let folderId: number;

        if (type === "campaign") {
          // Directly use the campaign ID (acts as a root folder)
          folderId = id;
        } else if (type === "folder") {
          // Must fetch the folder item to get its refId
          try {
            const item = await apiService.getItem({ itemId: id });
            folderId = item.refId; // real folder ID
          } catch (err) {
            console.error(`Failed to fetch item for folder-${id}:`, err);
            return [];
          }
        } else {
          console.warn(`getChildren called on unsupported type: ${type}`);
          return [];
        }

        // Now use the resolved folderId to fetch its children
        const folderData = await apiService.getFolder(folderId);

        if (!folderData.items || folderData.items.length === 0) {
          console.warn("No items in folder:", folderData);
          return [];
        }

        return folderData.items.map(
          (child: Item) => `${child.type}-${child.id}`
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

    onDrop: async (items, target) => {
      const source = items[0]; // assume single-item drag
      const sourceData = source.getItemData();
      const targetItem = target.item;
      const targetData = targetItem.getItemData();

      if (!sourceData || !targetData) return;

      // Get the target folder ID
      const newFolderId = isFolder(targetData)
        ? targetData.refId
        : targetData.folderId;

      if (!newFolderId) return;

      try {
        console.log("source item:", JSON.stringify(sourceData, null, 2));
        console.log("itemId: %d", sourceData.id);
        console.log("toFolderId: %d", newFolderId);
        await apiService.moveItem({
          itemId: sourceData.id,
          toFolderId: newFolderId,
          newPosition: 0,
        });

        source.getParent()?.invalidateChildrenIds();
        (isFolder(targetData)
          ? targetItem
          : targetItem.getParent()
        )?.invalidateChildrenIds();
      } catch (err) {
        console.error("Failed to move item:", err);
        alert("Failed to move item.");
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

  //console.log("Tree Items:", tree.getItems());

  return (
    <div className="flex h-screen w-full">
      {/* Tree */}
      <div className="w-1/3 h-full border-r overflow-auto p-4">
        <h2 className="p-1">Campaign: </h2>
        <br />
        <EmptyContextMenu2 rootFolderId={campaignId} tree={tree}>
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
                    <span className="truncate">
                      {itemInstance.getItemName()}
                    </span>
                  </div>
                </div>
              );

              if (isNote(item)) {
                return (
                  <NoteContextMenu2
                    key={itemInstance.getId()}
                    itemInstance={itemInstance}
                  >
                    {node}
                  </NoteContextMenu2>
                );
              } else if (isFolder(item)) {
                return (
                  <FolderContextMenu2
                    key={itemInstance.getId()}
                    itemInstance={itemInstance}
                  >
                    {node}
                  </FolderContextMenu2>
                );
              }

              return node;
            })}
          </div>
        </EmptyContextMenu2>
      </div>

      {/* ContentViewer */}
      <div className="w-2/3 p-1 h-full overflow-auto bg-muted rounded-2xl">
        <ContentViewer itemInstance={selectedItemInstance} />
      </div>
    </div>
  );
};
