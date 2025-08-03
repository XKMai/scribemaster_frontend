import { EntityList } from "./EntityList";
import { ItemList } from "./ItemList";
import { SpellList } from "./SpellList";
import { userStore } from "@/stores/userStore";

const CharacterInsertion = () => {
  const userId = userStore((state) => state.user?.id);

  if (!userId) return <div>Loading...</div>;
  return (
    <div className="p-4 h-screen w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {/* Column 1: Entities */}
        <div className="flex flex-col h-full rounded-xl shadow p-4 overflow-hidden bg-primary">
          <h2 className="text-lg font-semibold mb-2 text-white text-center">
            Entities
          </h2>
          <div className="flex-1 overflow-hidden">
            <EntityList userId={userId} />
          </div>
        </div>

        {/* Column 2: Items */}
        <div className="flex flex-col h-full rounded-xl shadow p-4 overflow-hidden bg-primary">
          <h2 className="text-lg font-semibold mb-2 text-white text-center">
            Items
          </h2>
          <div className="flex-1 overflow-hidden">
            <ItemList userId={userId} />
          </div>
        </div>

        {/* Column 3: Spells */}
        <div className="flex flex-col h-full rounded-xl shadow p-4 overflow-hidden bg-primary">
          <h2 className="text-lg font-semibold mb-2 text-white text-center">
            Spells
          </h2>
          <div className="flex-1 overflow-hidden">
            <SpellList userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterInsertion;
