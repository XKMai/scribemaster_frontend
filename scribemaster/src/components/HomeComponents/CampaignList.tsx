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
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { userStore } from "@/stores/userStore";

const CampaignCarousel = () => {
  const [campaigns, setCampaigns] = useState<{ id: number; name: string }[]>(
    []
  );
  const [renamingId, setRenamingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");
  const navigate = useNavigate();
  const userId = userStore((state) => state.user?.id);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        //const { user } = await apiService.getCookie();
        if (userId) {
          const data = await apiService.getCampaignList(userId);
          setCampaigns(data);
        }
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

  const openRenameDialog = (campaign: { id: number; name: string }) => {
    setNewName(campaign.name);
    setRenamingId(campaign.id);
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col">
      <div className="p-2 pl-2 pb-2 flex-shrink-0">
        <h2 className="text-xl text-center font-bold">Your Campaigns</h2>
      </div>

      <div className="flex-1 overflow-hidden px-4 pb-4">
        {campaigns.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No campaigns found
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full h-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {campaigns.map((campaign) => (
                <CarouselItem
                  key={campaign.id}
                  className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4 flex"
                >
                  <Card className="w-full h-full flex flex-col">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-base line-clamp-2 flex-1">
                          {campaign.name}
                        </CardTitle>
                        <div className="flex gap-1 flex-shrink-0">
                          {/* Rename */}
                          <Dialog
                            open={renamingId === campaign.id}
                            onOpenChange={(open) =>
                              open
                                ? openRenameDialog(campaign)
                                : setRenamingId(null)
                            }
                          >
                            <DialogTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                              >
                                <Pencil className="h-3 w-3" />
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
                                <Button
                                  onClick={() => handleRename(campaign.id)}
                                >
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
                                className="h-8 w-8 text-red-600 hover:bg-red-100"
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Campaign?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently remove "{campaign.name}"
                                  and all its contents.
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
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {campaign.id}
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0 mt-auto">
                      <Badge
                        variant="secondary"
                        className="cursor-pointer px-3 py-2 text-sm hover:bg-primary hover:text-white transition-colors w-full justify-center"
                        onClick={() => navigate(`/campaign/${campaign.id}`)}
                      >
                        Load Campaign
                      </Badge>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden sm:flex" />
            <CarouselNext className="hidden sm:flex" />
          </Carousel>
        )}
      </div>
    </Card>
  );
};

export default CampaignCarousel;
