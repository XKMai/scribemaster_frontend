import { useNavigate } from "react-router";
import { Pencil, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { apiService } from "@/services/apiservice";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

interface CampaignHeaderProps {
  campaignId: number;
  campaignName: string;
}

export const CampaignHeader = ({
  campaignId,
  campaignName,
}: //onRename,
CampaignHeaderProps) => {
  const navigate = useNavigate();
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(campaignName);

  useEffect(() => {
    setNewName(campaignName);
  }, [campaignName]);

  const handleDelete = async () => {
    try {
      await apiService.deleteFolder(campaignId);
      navigate("/campaignreader");
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("Failed to delete campaign.");
    }
  };

  const handleRename = async () => {
    try {
      await apiService.updateFolder(campaignId, { name: newName });
      //onRename?.(newName); // trigger parent update
      setRenameOpen(false);
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename campaign.");
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <h3 className="text-lg font-semibold">{newName}</h3>
      <div className="flex items-center gap-2 ml-auto">
        {/* Rename Button */}
        <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Pencil className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rename Campaign</DialogTitle>
            </DialogHeader>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New campaign name"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setRenameOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRename}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-600 hover:bg-red-100"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete this campaign?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently remove the campaign and all its contents.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
