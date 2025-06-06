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
    <div
        className="absolute z-50 w-40 bg-white border rounded shadow-md"
    >
        <Button
        variant="ghost"
        className="w-full justify-start text-left px-4 py-2"
        >
        ➕ New Note
        </Button>
        <Button
        variant="ghost"
        className="w-full justify-start text-left px-4 py-2"
        >
        📁 New Folder
        </Button>
    </div>
  )
}

export default FolderContextMenu