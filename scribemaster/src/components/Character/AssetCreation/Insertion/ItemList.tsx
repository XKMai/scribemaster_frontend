import { useEffect, useState } from "react";
import { apiService } from "@/services/apiservice";
import { ItemCard } from "./ItemCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ItemListProps {
  userId: number;
}

interface ItemCardProps {
  item: {
    id: number;
    name: string;
    type: string;
    description: string;
    characteristics: Record<string, any>;
    settings?: Record<string, any>;
    createdBy: number;
  };
  availableFolders: { id: number; name: string }[];
  onDelete: (id: number) => void;
}

export const ItemList = ({ userId }: ItemListProps) => {
  const [items, setItems] = useState<ItemCardProps["item"][]>([]);
  const [campaignFolders, setCampaignFolders] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const items = await apiService.getItemIds(userId);
        console.log(items);
        setItems(items);

        const campaigns = await apiService.getCampaignList(userId);
        setCampaignFolders(
          campaigns.map((c: any) => ({ id: c.id, name: c.name }))
        );
      } catch (err) {
        console.error("Failed to load item list:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((iid) => iid.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <Separator />
      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4 p-2">
          {items.length === 0 ? (
            <div className="text-sm text-white">No items created yet.</div>
          ) : (
            items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                availableFolders={campaignFolders}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
