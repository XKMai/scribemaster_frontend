import { useEffect, useState } from "react";
import { apiService } from "@/services/apiservice";
import { SpellCard } from "./SpellCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Spell } from "@/types/spellSchema";

interface SpellListProps {
  userId: number;
}

export const SpellList = ({ userId }: SpellListProps) => {
  const [spells, setSpells] = useState<Spell[]>([]);
  const [loading, setLoading] = useState(true);
  const [folders, setFolders] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const spells = await apiService.getUserSpells(userId);
        const campaigns = await apiService.getCampaignList(userId);
        setSpells(spells);
        setFolders(campaigns.map((c: any) => ({ id: c.id, name: c.name })));
      } catch (err) {
        console.error("Failed to load spell list:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  const handleDelete = (id: number) => {
    setSpells((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full h-full flex flex-col">
      <Separator />
      <ScrollArea className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-col gap-4 p-2">
          {spells.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No spells created yet.
            </div>
          ) : (
            spells.map((spell) => (
              <SpellCard
                key={spell.id}
                spell={spell}
                onDelete={handleDelete}
                availableFolders={folders}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
