// EntityRoomAdder.tsx
import { useEffect, useState } from "react";
import { apiService } from "@/services/apiservice";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

type Campaign = { id: number; name: string };
type EntitySummary = { id: number; name: string };

type Props = {
  roomId: string;
  emit: (
    event: "addEntity",
    payload: { roomName: string; entityId: number }
  ) => void;
};

export const CampaignEntityAdder: React.FC<Props> = ({ roomId, emit }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | null>(
    null
  );
  const [entities, setEntities] = useState<EntitySummary[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await apiService.getCookie();
        const userId = res.user.id;
        const campaigns = await apiService.getCampaignList(userId);
        setCampaigns(campaigns);
      } catch (err) {
        console.error("Failed to fetch campaigns", err);
      }
    };

    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaignId !== null) {
      apiService.getCampaignEntities(selectedCampaignId).then(setEntities);
    }
  }, [selectedCampaignId]);

  const toggleSelection = (id: number) => {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      copy.has(id) ? copy.delete(id) : copy.add(id);
      return copy;
    });
  };

  const addSelectedToRoom = () => {
    selectedIds.forEach((id) => {
      emit("addEntity", { roomName: roomId, entityId: id });
    });
    setSelectedIds(new Set());
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-md font-semibold">
        Insert Entities From Campaign
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="flex gap-2">
          {/* Campaign selector */}
          <Select onValueChange={(val) => setSelectedCampaignId(parseInt(val))}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a campaign..." />
            </SelectTrigger>
            <SelectContent>
              {campaigns.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Entity dropdown */}
          {selectedCampaignId && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-1/3">
                  {selectedIds.size > 0
                    ? `Selected (${selectedIds.size})`
                    : "Select Entities"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[250px] p-2">
                <ScrollArea className="h-40 w-full pr-1">
                  <div className="space-y-1">
                    {entities.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        No entities found in this campaign.
                      </p>
                    ) : (
                      entities.map((ent) => (
                        <div
                          key={ent.id}
                          className="flex justify-between items-center border-b py-1 px-1 hover:bg-muted rounded cursor-pointer"
                          onClick={() => toggleSelection(ent.id)}
                        >
                          <span>{ent.name}</span>
                          {selectedIds.has(ent.id) && (
                            <span className="text-xs text-green-600">✓</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          )}

          {/* Add Button */}
          {selectedIds.size > 0 && (
            <Button onClick={addSelectedToRoom} className="w-1/5">
              + Add ({selectedIds.size})
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
