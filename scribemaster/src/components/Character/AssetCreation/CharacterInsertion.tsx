import { ScrollArea } from "@/components/ui/scroll-area";

const CharacterInsertion = () => {
  return (
    <div className="p-4 h-screen w-full bg-muted">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {/* Column 1: Entities */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Entities</h2>
          <ScrollArea className="flex-1 overflow-auto"></ScrollArea>
        </div>

        {/* Column 2: Items */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Items</h2>
          <ScrollArea className="flex-1 overflow-auto"></ScrollArea>
        </div>

        {/* Column 3: Spells */}
        <div className="flex flex-col h-full bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Spells</h2>
          <ScrollArea className="flex-1 overflow-auto"></ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default CharacterInsertion;
