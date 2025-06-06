import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import type { apiService, Item } from "../services/apiservice";

interface FolderContextMenuProps {
  folder: Item;
  trigger: React.ReactNode;
  onItemAdded: (updatedFolder: Item) => void;
}

const FolderContextMenu = () => {
  return (
    <div>FolderContextMenu</div>
  )
}

export default FolderContextMenu