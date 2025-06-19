import { zodResolver } from "@hookform/resolvers/zod";
import {
  CharacterSchema,
  type CharacterFormData,
  CharacterDefaultValues,
} from "./characterSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SaveKey = keyof CharacterFormData["savingThrows"]["savingThrows"];
type SkillKey = keyof CharacterFormData["proficientSkills"];

const CharacterCreationForm = () => {
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: CharacterDefaultValues,
  });

  const onSubmit = async (data: CharacterFormData) => {
    try {
      console.log(`button pressed, data submitted: /n ${data}`);
    } catch (error: any) {
      alert("error occured");
    }
  };

  return (
    <Card className="w-full h-screen overflow-y-auto p-6">
      <CardHeader>
        <CardTitle>Character Creation Form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Character Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-3 gap-4">
                {/* type */}
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="friendly">Friendly</SelectItem>
                          <SelectItem value="neutral">Neutral</SelectItem>
                          <SelectItem value="enemy">Enemy</SelectItem>
                          <SelectItem value="player">Player</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* creature_type */}
                <FormField
                  control={form.control}
                  name="creature_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creature Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            "aberration",
                            "beast",
                            "celestial",
                            "construct",
                            "dragon",
                            "elemental",
                            "fey",
                            "fiend",
                            "giant",
                            "humanoid",
                            "monstrosity",
                            "ooze",
                            "plant",
                            "undead",
                          ].map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* creature tag */}
                <FormField
                  control={form.control}
                  name="creature_tag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Creature Tag</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Human, Elf, Dwarf"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* statBlock */}
            <div className="grid grid-cols-6 gap-4">
              {(
                [
                  "strength",
                  "dexterity",
                  "constitution",
                  "intelligence",
                  "wisdom",
                  "charisma",
                ] as const
              ).map((stat) => (
                <FormField
                  key={stat}
                  control={form.control}
                  name={`stats.${stat}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{stat}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 1)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {/* hitPoints */}
            {/* <div className="grid grid-cols-3 gap-4"> */}

            {/* proficiencyBonus, armourClass, initiative, speed */}
            <div className="grid grid-cols-4 gap-4">
              {(
                ["hitPoints", "armourClass", "initiative", "speed"] as const
              ).map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="capitalize">{key}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* hitDice */}
            <FormField
              control={form.control}
              name="hitDice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hit Dice</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 1d10, 2d8"
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

            {/* proficientSkills */}
            <div className="grid grid-cols-2 gap-2">
              <FormLabel>Proficient Skills</FormLabel>
              {(Object.keys(form.watch("proficientSkills")) as SkillKey[]).map(
                (skill) => (
                  <FormField
                    key={skill}
                    control={form.control}
                    name={`proficientSkills.${skill}` as const}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                        </FormControl>
                        <FormLabel className="capitalize">{skill}</FormLabel>
                      </FormItem>
                    )}
                  />
                )
              )}
            </div>
            {/* savingThrows */}
            <div className="grid grid-cols-2 gap-2">
              <FormLabel>Saving Throws</FormLabel>
              {(
                Object.keys(
                  form.watch("savingThrows.savingThrows")
                ) as SaveKey[]
              ).map((key) => (
                <FormField
                  key={key}
                  name={`savingThrows.savingThrows.${key}`}
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      </FormControl>
                      <FormLabel className="capitalize">{key}</FormLabel>
                    </FormItem>
                  )}
                />
              ))}
            </div>

            {/* languages, additional_senses, traits_and_features, equipment, notes */}
            {(
              [
                "languages",
                "additional_senses",
                "traits_and_features",
                "equipment",
                "notes",
              ] as const
            ).map((key) => (
              <FormField
                key={key}
                control={form.control}
                name={key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      {key.replace(/_/g, " ")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <Button type="submit" className="w-full">
              Create Character
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CharacterCreationForm;
