import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpellSchema, type SpellFormData } from "@/types/spellSchema"; // update this path
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
import { useEffect } from "react";
import type { ItemInstance } from "@headless-tree/core";
import type { Item } from "@/types/TreeTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  itemInstance: ItemInstance<Item>;
}

const schools = [
  "Abjuration",
  "Conjuration",
  "Divination",
  "Enchantment",
  "Evocation",
  "Illusion",
  "Necromancy",
  "Transmutation",
] as const;

const classes = [
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Ranger",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard",
] as const;

export const SpellViewerForm = ({ itemInstance }: Props) => {
  const item = itemInstance.getItemData();
  const spell = item.data;

  const form = useForm<SpellFormData>({
    resolver: zodResolver(SpellSchema),
    defaultValues: spell,
  });

  useEffect(() => {
    if (spell) {
      form.reset(spell);
    }
  }, [spell]);

  const onSubmit = async (data: SpellFormData) => {
    try {
      await apiService.updateSpell(spell.id, data);
      alert("Spell updated.");
      itemInstance.invalidateItemData();
    } catch (err) {
      console.error("Failed to update spell:", err);
      alert("Error saving spell.");
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
        <div className="grid grid-cols-3 gap-4">
          {(["level", "castingTime", "range"] as const).map((key) => (
            <FormField
              key={key}
              control={form.control}
              name={key}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="capitalize">{key}</FormLabel>
                  <FormControl>
                    <Input
                      type={key === "level" ? "number" : "text"}
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          key === "level"
                            ? parseInt(e.target.value) || 0
                            : e.target.value
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School of Magic</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select school" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school} value={school}>
                      {school}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="components"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Components (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  value={field.value.join(", ")}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value.split(",").map((v) => v.trim())
                    )
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
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
        <FormField
          control={form.control}
          name="higherLevel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>At Higher Levels</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classes"
          render={() => (
            <FormItem>
              <FormLabel>Classes</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {classes.map((cls) => (
                  <FormField
                    key={cls}
                    control={form.control}
                    name="classes"
                    render={({ field }) => {
                      const isChecked = field.value?.includes(cls);
                      return (
                        <FormItem
                          key={cls}
                          className="flex items-center space-x-2"
                        >
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const newValue = e.target.checked
                                  ? [...field.value, cls]
                                  : field.value.filter((v) => v !== cls);
                                field.onChange(newValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="capitalize">{cls}</FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
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
