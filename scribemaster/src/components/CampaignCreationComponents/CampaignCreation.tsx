import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import api from "@/lib/axiosConfig";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { userStore } from "@/stores/userStore";

const createSchema = z.object({
  name: z.string().min(4, { message: "Campaign Name is required" }),
});

const joinSchema = z.object({
  folderId: z
    .number({ invalid_type_error: "Please enter a number" })
    .int()
    .positive("Campaign ID must be positive"),
});

type CreateSchema = z.infer<typeof createSchema>;
type JoinSchema = z.infer<typeof joinSchema>;

const CampaignCreation = () => {
  const createForm = useForm<CreateSchema>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      name: "",
    },
  });

  const joinForm = useForm<JoinSchema>({
    resolver: zodResolver(joinSchema),
    defaultValues: { folderId: 0 },
  });

  const userId = userStore((state) => state.user?.id);
  const triggerRefresh = userStore((state) => state.triggerRefresh);

  const handleCreate = async (data: CreateSchema) => {
    try {
      const payload = {
        ...data,
        createdBy: userId,
      };

      await api.post("/campaign", payload);
      triggerRefresh();
      alert("Campaign created successfully");
    } catch (error) {
      alert("Failed to create campaign!");
    }
  };

  const handleJoin = async (data: JoinSchema) => {
    try {
      await api.post(`/campaign/join/${data.folderId}/${userId}`, {
        userId,
        folderId: data.folderId,
      });
      triggerRefresh();
      alert("Joined campaign successfully");
    } catch (error) {
      alert("Failed to join campaign!");
    }
  };

  return (
    <Card className="w-full h-full">
      <CardTitle className="mx-auto text-center text-lg">
        <h1>Join or Create a Campaign</h1>
      </CardTitle>
      <CardContent>
        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>

          {/* Create Tab */}
          <TabsContent value="create">
            <Form {...createForm}>
              <form
                onSubmit={createForm.handleSubmit(handleCreate)}
                className="space-y-6 mt-6"
              >
                <FormField
                  control={createForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="The Marvelous Adventures of Foo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Campaign
                </Button>
              </form>
            </Form>
          </TabsContent>

          {/* Join Tab */}
          <TabsContent value="join">
            <Form {...joinForm}>
              <form
                onSubmit={joinForm.handleSubmit(handleJoin)}
                className="space-y-6 mt-6"
              >
                <FormField
                  control={joinForm.control}
                  name="folderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter a friend's campaign ID to join it!"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Join Campaign
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CampaignCreation;
