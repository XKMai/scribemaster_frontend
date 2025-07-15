import { useEffect, useState } from "react";
import { apiService } from "@/services/apiservice";
import { EntityCard } from "./EntityCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface EntityListProps {
  userId: number;
}

export const EntityList = ({ userId }: EntityListProps) => {
  const [entityIds, setEntityIds] = useState<number[]>([]);
  const [campaignFolders, setCampaignFolders] = useState<
    { id: number; name: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const ids = await apiService.getEntityIds(userId);
        setEntityIds(ids);

        const campaigns = await apiService.getCampaignList(userId);
        setCampaignFolders(
          campaigns.map((c: any) => ({ id: c.id, name: c.name }))
        );
      } catch (err) {
        console.error("Failed to load entity list:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleDelete = (id: number) => {
    setEntityIds((prev) => prev.filter((eid) => eid !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <Separator />
      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4 p-2">
          {entityIds.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No entities created yet.
            </div>
          ) : (
            entityIds.map((id) => (
              <EntityCard
                key={id}
                entityId={id}
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
