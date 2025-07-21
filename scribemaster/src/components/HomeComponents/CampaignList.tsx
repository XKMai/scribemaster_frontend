import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Pencil, Trash } from "lucide-react";
import { apiService } from "@/services/apiservice";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
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
} from "../ui/alert-dialog";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";

const CampaignScroller = () => {
  const [campaigns, setCampaigns] = useState<{ id: number; name: string }[]>(
    []
  );
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const { user } = await apiService.getCookie();
        const data = await apiService.getCampaignList(user.id);
        setCampaigns(data);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      }
    };

    fetchCampaigns();
  }, []);

  const handleRename = async (id: number) => {
    try {
      await apiService.updateFolder(id, { name: newName });
      setCampaigns((prev) =>
        prev.map((c) => (c.id === id ? { ...c, name: newName } : c))
      );
      setRenamingId(null);
    } catch (err) {
      console.error("Rename failed:", err);
      alert("Failed to rename campaign.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiService.deleteFolder(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Failed to delete campaign:", err);
      alert("Failed to delete campaign.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Campaigns</h2>
      <div className="flex overflow-x-auto gap-4 pb-2">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="min-w-[250px] flex-shrink-0">
            <CardHeader className="flex justify-between items-start">
              <CardTitle className="text-base">{campaign.name}</CardTitle>
              <div className="flex gap-2">
                {/* Rename */}
                <Dialog
                  open={renamingId === campaign.id}
                  onOpenChange={(open) =>
                    open ? setRenamingId(campaign.id) : setRenamingId(null)
                  }
                >
                  <DialogTrigger asChild>
                    <Button size="icon" variant="ghost">
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
                      placeholder="New name"
                    />
                    <div className="flex justify-end gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => setRenamingId(null)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => handleRename(campaign.id)}>
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Delete */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-600 hover:bg-red-100"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently remove the campaign and its
                        contents.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleDelete(campaign.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>

            <CardContent className="text-sm text-muted-foreground">
              ID: {campaign.id}
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                onClick={() => navigate(`/campaign/${campaign.id}`)}
              >
                Load Campaign
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CampaignScroller;
