import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SpellSchema,
  type Spell,
  SpellDefaultValues,
} from "../../../../types/spellSchema";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { apiService } from "@/services/apiservice";
import api from "@/lib/axiosConfig";

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

const SpellCreationForm = () => {
  const form = useForm<Spell>({
    resolver: zodResolver(SpellSchema),
    defaultValues: SpellDefaultValues,
  });

  const onSubmit = async (data: Spell) => {
    try {
      const userdata = await apiService.getCookie();
      const userId = userdata.user.id;

      const payload = {
        ...data,
        createdBy: userId,
      };

      console.log(
        `button pressed, data submitted: /n ${JSON.stringify(payload, null, 2)}`
      );
      await api.post("/spell", payload);

      alert("spell created successfully");
    } catch (error: any) {
      alert("something went wrong!!!");
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6">
      <CardHeader>
        <CardTitle>Spell Creation Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Spell Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Fireball" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* School */}
            <FormField
              control={form.control}
              name="school"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School of Magic</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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

            {/* Class */}
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
                              <FormLabel className="capitalize">
                                {cls}
                              </FormLabel>
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

            {/* Numeric fields */}
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

            {/* Duration */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Concentration, up to 1 minute"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Components */}
            <FormField
              control={form.control}
              name="components"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Components (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. V, S, M"
                      value={field.value.join(", ")}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      }
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
                    <Textarea
                      rows={4}
                      placeholder="What does the spell do?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Higher Level */}
            <FormField
              control={form.control}
              name="higherLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>At Higher Levels</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="How does the spell scale with higher spell slots?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Create Spell
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SpellCreationForm;
