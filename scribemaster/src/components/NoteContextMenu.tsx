import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { Item } from "../services/apiservice";
import { apiService } from "../services/apiservice";
import { Input } from "./ui/input";

interface NoteContextMenuProps {
  note: Item;
  trigger: React.ReactNode;
  onItemUpdated: (updatedNote: Item) => void;
  onItemDeleted: (deletedNote: Item) => void;
}

const NoteContextMenu = () => {
  return (
    <div>NoteContextMenu</div>
  )
}

export default NoteContextMenu