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
import { apiService } from "@/services/apiservice";
import { Card, CardContent, CardTitle } from "../ui/card";

const loginSchema = z.object({
  name: z.string().min(4, { message: "Campaign Name is required" }),
});

type LoginSchema = z.infer<typeof loginSchema>;

const CampaignCreation = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const userdata = await apiService.getCookie();
      const userId = userdata.user.id;

      const payload = {
        ...data,
        createdBy: userId,
      };

      await api.post("/campaign", payload);

      // open alert to inform user of successful campaign creation, give button to redirect to campaign reader
      alert("campaign created successfully");
      window.location.href = "/home";
    } catch (error: any) {
      alert("something went wrong!!!");
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardTitle className="mx-auto">
        <h1>Create a new campaign here!</h1>
      </CardTitle>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 w-full max-w-sm mx-auto my-auto"
          >
            <FormField
              control={form.control}
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
            <Button variant="outline" type="submit" className="w-full">
              Create Campaign
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CampaignCreation;
