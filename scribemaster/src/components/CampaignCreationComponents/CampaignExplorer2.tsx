import { cn } from "@/lib/utils";
import { isEntity, isFolder, isNote, type Item } from "@/types/TreeTypes";
import {
  selectionFeature,
  hotkeysCoreFeature,
  dragAndDropFeature,
  asyncDataLoaderFeature,
  type ItemInstance,
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import { apiService } from "@/services/apiservice";
import { useEffect, useState } from "react";
import { ContentViewer } from "./ContentViewer";
import { NoteContextMenu2 } from "./NoteContextMenu2";
import { FolderContextMenu2 } from "./FolderContextMenu2";
import { EmptyContextMenu2 } from "./EmptyContextMenu2";
import { CampaignHeader } from "./CampaignHeader";
import { PersonStanding, FolderOpen, Folder, NotepadText } from "lucide-react";

interface CampaignExplorer2Props {
  campaignId: number;
}

export const CampaignExplorer2 = ({ campaignId }: CampaignExplorer2Props) => {
  const [campaignName, setCampaignName] = useState("");

  useEffect(() => {
    const fetchCampaignName = async () => {
      try {
        const folder = await apiService.getFolder(campaignId);
        setCampaignName(folder.name);
      } catch (err) {
        console.error("Failed to fetch campaign name:", err);
        setCampaignName("Unnamed Campaign");
      }
    };

    fetchCampaignName();
  }, [campaignId]);

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

      // return isNote(item)
      //   ? item.data.title
      //   : isFolder(item) || isEntity(item)
      //   ? item.data.name
      //   : "Unnamed";

      if (isNote(item)) return item.data.title;
      if (isFolder(item)) return item.data.name;
      if (isEntity(item)) return item.data.name;
      return "Unnamed";
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
        console.log("Clicked item:", itemInstance.getItemName());
        setSelectedItemInstance(itemInstance);
      }
    },

    onDrop: async (items, target) => {
      const source = items[0]; // assume single-item drag
      const sourceData = source.getItemData();
      const targetItem = target.item;

      if (!sourceData || !targetItem) return;

      let newFolderId: number;

      const targetId = targetItem.getId(); // e.g., "campaign-123" or "folder-456"
      const [targetType, targetRawId] = targetId.split("-");
      const parsedId = Number(targetRawId);

      if (isNaN(parsedId)) {
        console.error("Invalid target ID:", targetId);
        return;
      }

      if (targetType === "campaign") {
        // Special handling for root folder
        newFolderId = parsedId;
      } else {
        const targetData = targetItem.getItemData();
        if (!targetData) return;

        newFolderId = isFolder(targetData)
          ? targetData.refId
          : targetData.folderId;
      }

      try {
        console.log("source item:", JSON.stringify(sourceData, null, 2));
        console.log("itemId:", sourceData.id);
        console.log("toFolderId:", newFolderId);

        await apiService.moveItem({
          itemId: sourceData.id,
          toFolderId: newFolderId,
          newPosition: 0,
        });

        // Refresh parent and target folder
        source.getParent()?.invalidateChildrenIds();
        targetItem.invalidateChildrenIds();
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
        <CampaignHeader campaignId={campaignId} campaignName={campaignName} />
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
                      {itemInstance.isFolder() ? (
                        itemInstance.isExpanded() ? (
                          <FolderOpen size={18} />
                        ) : (
                          <Folder size={18} />
                        )
                      ) : isEntity(item) ? (
                        <PersonStanding size={18} />
                      ) : (
                        <NotepadText size={18} />
                      )}
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
              } else if (isEntity(item)) {
                return <div key={itemInstance.getId()}>{node}</div>;
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
