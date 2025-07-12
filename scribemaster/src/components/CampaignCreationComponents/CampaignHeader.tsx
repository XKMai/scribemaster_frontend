// src/components/CampaignCreationComponents/CampaignHeader.tsx
import { useNavigate } from "react-router";
import { Trash } from "lucide-react";
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

interface CampaignHeaderProps {
  campaignId: number;
  campaignName: string;
}

export const CampaignHeader = ({
  campaignId,
  campaignName,
}: CampaignHeaderProps) => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await apiService.deleteFolder(campaignId);
      navigate("/campaignreader");
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("Failed to delete campaign.");
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-1">
      <h2 className="text-lg font-semibold">Campaign: {campaignName}</h2>

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
  );
};
