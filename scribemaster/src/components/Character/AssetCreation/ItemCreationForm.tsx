import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, type ItemFormData, ItemDefaultValues } from "./itemSchema";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import api from "@/lib/axiosConfig";
import { apiService } from "@/services/apiservice";
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { Select } from "@/components/ui/select";

const ItemCreationForm = () => {
  const [characteristicInput, setCharacteristicInput] = useState({
    key: "",
    value: "",
  });
  const [campaigns, setCampaigns] = useState<{ id: number; name: string }[]>(
    []
  );

  const fetchCampaigns = async () => {
    try {
      const userdata = await apiService.getCookie();
      const userId = userdata.user.id;
      const campaigndata = await apiService.getCampaignList(userId);
      setCampaigns(campaigndata);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  const form = useForm<ItemFormData>({
    resolver: zodResolver(ItemSchema),
    defaultValues: ItemDefaultValues,
  });

  useEffect(() => {
    apiService.getCookie().then((data) => {
      form.setValue("createdBy", data.user.id);
    });
  }, []);

  const onSubmit = async (data: ItemFormData) => {
    try {
      console.log(
        `button pressed, data submitted: /n ${JSON.stringify(data, null, 2)}`
      );

      await api.post("/item", data);

      alert("Item created successfully!");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <CardHeader>
        <CardTitle>Item Creation Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Le Weapon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Weapon, Tool, Artifact"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter item description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Characteristics */}
            <FormField
              control={form.control}
              name="characteristics"
              render={() => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">
                    Characteristics
                  </FormLabel>
                  <div className="grid grid-cols-2 gap-4">
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. weight"
                          value={characteristicInput.key}
                          onChange={(e) =>
                            setCharacteristicInput({
                              ...characteristicInput,
                              key: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </FormItem>
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. 2 or rare"
                          value={characteristicInput.value}
                          onChange={(e) =>
                            setCharacteristicInput({
                              ...characteristicInput,
                              value: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                  <Button
                    type="button"
                    className="mt-2"
                    onClick={() => {
                      const { key, value } = characteristicInput;
                      if (key && value) {
                        const current = form.getValues("characteristics") || {};
                        let parsedValue: any = value;
                        try {
                          parsedValue = JSON.parse(value); // try parsing to number, boolean, etc.
                        } catch {
                          // leave as string if parsing fails
                        }
                        form.setValue("characteristics", {
                          ...current,
                          [key]: parsedValue,
                        });
                        setCharacteristicInput({ key: "", value: "" });
                      }
                    }}
                  >
                    Add Characteristic
                  </Button>

                  {/* Optional: show current characteristics as JSON */}
                  <FormControl className="mt-4">
                    <Textarea
                      value={JSON.stringify(
                        form.watch("characteristics"),
                        null,
                        2
                      )}
                      readOnly
                      className="text-sm font-mono"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="folderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Folder</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    onOpenChange={(open) => open && fetchCampaigns()}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {campaigns.length > 0 ? (
                        campaigns.map((campaign) => (
                          <SelectItem
                            key={campaign.id}
                            value={campaign.id.toString()}
                          >
                            {campaign.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem disabled value="none">
                          No campaigns available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Settings (optional) */}
            <FormField
              control={form.control}
              name="settings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settings (optional JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='e.g. { "magical": true, "requiresAttunement": true }'
                      value={JSON.stringify(field.value ?? {})}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          field.onChange(parsed);
                        } catch {
                          field.onChange({});
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Item
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ItemCreationForm;
