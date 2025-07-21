import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ItemSchema, type ItemFormData } from "@/types/itemSchema";
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
import { apiService } from "@/services/apiservice";
import { useEffect, useState } from "react";
import type { ItemInstance } from "@headless-tree/core";
import type { Item } from "@/types/TreeTypes";

interface Props {
  itemInstance: ItemInstance<Item>;
}

export const ItemViewerForm = ({ itemInstance }: Props) => {
  const item = itemInstance.getItemData();
  const itemData = item?.data;

  const [characteristicInput, setCharacteristicInput] = useState({
    key: "",
    value: "",
  });

  const form = useForm<ItemFormData>({
    resolver: zodResolver(ItemSchema),
    defaultValues: itemData,
  });

  useEffect(() => {
    if (itemData) {
      form.reset(itemData);
    }
  }, [itemData]);

  const onSubmit = async (data: ItemFormData) => {
    try {
      await apiService.updateItem(itemData.id, data);
      alert("Item updated.");
      itemInstance.invalidateItemData();
    } catch (err) {
      console.error("Failed to update item:", err);
      alert("Error saving item.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
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
              <FormLabel>Characteristics</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="key"
                  value={characteristicInput.key}
                  onChange={(e) =>
                    setCharacteristicInput({
                      ...characteristicInput,
                      key: e.target.value,
                    })
                  }
                />
                <Input
                  placeholder="value"
                  value={characteristicInput.value}
                  onChange={(e) =>
                    setCharacteristicInput({
                      ...characteristicInput,
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <Button
                type="button"
                className="mt-2"
                onClick={() => {
                  const { key, value } = characteristicInput;
                  if (key && value) {
                    const current = form.getValues("characteristics") || {};
                    form.setValue("characteristics", {
                      ...current,
                      [key]: value,
                    });
                    setCharacteristicInput({ key: "", value: "" });
                  }
                }}
              >
                Add Characteristic
              </Button>
              <Textarea
                readOnly
                className="mt-2 text-sm font-mono"
                value={JSON.stringify(form.watch("characteristics"), null, 2)}
              />
            </FormItem>
          )}
        />

        {/* Optional Settings */}
        <FormField
          control={form.control}
          name="settings"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Settings</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="JSON settings..."
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
          Save Changes
        </Button>
      </form>
    </Form>
  );
};
