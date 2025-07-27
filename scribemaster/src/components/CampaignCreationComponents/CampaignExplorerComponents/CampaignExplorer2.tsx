import { cn } from "@/lib/utils";
import {
  isEntity,
  isFolder,
  isItem,
  isNote,
  isSpell,
  type Item,
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
import { useEffect, useState } from "react";
import { ContentViewer } from "./ContentViewer";
import { NoteContextMenu2 } from "../ContextMenus/NoteContextMenu2";
import { FolderContextMenu2 } from "../ContextMenus/FolderContextMenu2";
import { EmptyContextMenu2 } from "../ContextMenus/EmptyContextMenu2";
import { CampaignHeader } from "./CampaignHeader";
import {
  PersonStanding,
  FolderOpen,
  Folder,
  NotepadText,
  Package,
  Sparkles,
} from "lucide-react";
import { EntityContextMenu } from "../ContextMenus/EntityContextMenu";
import { ItemContextMenu } from "../ContextMenus/ItemContextMenu";
import { SpellContextMenu } from "../ContextMenus/SpellContextMenu";

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

      if (isNote(item)) return item.data.title;
      if (isFolder(item)) return item.data.name;
      if (isEntity(item)) return item.data.name;
      if (isSpell(item)) return item.data.name;
      if (isItem(item)) return item.data.name;
      return "Unnamed";
    },

    isItemFolder: (itemInstance) => {
      const item = itemInstance.getItemData();
      return !!item && isFolder(item);
    },

    dataLoader: {
      getItem: async (itemId) => {
        const [, idStr] = itemId.split("-");
        const id = Number(idStr);
        if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);
        const item = await apiService.getFolderItem({ itemId: id });
        return item;
      },

      getChildren: async (itemId) => {
        const [type, rawId] = itemId.split("-");
        const id = Number(rawId);
        if (isNaN(id)) throw new Error(`Invalid itemId: ${itemId}`);

        let folderId: number;

        if (type === "campaign") {
          folderId = id; // directly use the campaign id (acts as a root folder)
        } else if (type === "folder") {
          try {
            const item = await apiService.getFolderItem({ itemId: id });
            folderId = item.refId; // real folder id
          } catch (err) {
            console.error(`Failed to fetch items for folder-${id}:`, err);
            return [];
          }
        } else {
          console.warn(`getChildren called on unsupported type: ${type}`);
          return [];
        }

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
        setSelectedItemInstance(itemInstance);
      }
    },

    onDrop: async (items, target) => {
      const source = items[0]; // assume single-item drag
      const sourceData = source.getItemData();
      const targetItem = target.item;

      if (!sourceData || !targetItem) return;

      let newFolderId: number;

      const targetId = targetItem.getId();
      const [targetType, targetRawId] = targetId.split("-");
      const parsedId = Number(targetRawId);

      if (isNaN(parsedId)) {
        console.error("Invalid target ID:", targetId);
        return;
      }

      if (targetType === "campaign") {
        // special handling for root folder
        newFolderId = parsedId;
      } else {
        const targetData = targetItem.getItemData();
        if (!targetData) return;

        newFolderId = isFolder(targetData)
          ? targetData.refId
          : targetData.folderId;
      }

      try {
        await apiService.moveFolderItem({
          itemId: sourceData.id,
          toFolderId: newFolderId,
          newPosition: 0,
        });

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
                        "bg-[#FCECC9] border border-[#D5BDAF]":
                          itemInstance.isSelected(),
                        "ring-2 ring-[#EAAE61]": itemInstance.isFocused(),
                        "font-semibold text-[#4C3A2D]": itemInstance.isFolder(),
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
                      ) : isItem(item) ? (
                        <Package size={18} />
                      ) : isSpell(item) ? (
                        <Sparkles size={18} />
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
                return (
                  <EntityContextMenu
                    key={itemInstance.getId()}
                    itemInstance={itemInstance}
                  >
                    {node}
                  </EntityContextMenu>
                );
              }
              if (isItem(item)) {
                return (
                  <ItemContextMenu
                    key={itemInstance.getId()}
                    itemInstance={itemInstance}
                  >
                    {node}
                  </ItemContextMenu>
                );
              }
              if (isSpell(item)) {
                return (
                  <SpellContextMenu
                    itemInstance={itemInstance}
                    key={itemInstance.getId()}
                  >
                    {node}
                  </SpellContextMenu>
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
