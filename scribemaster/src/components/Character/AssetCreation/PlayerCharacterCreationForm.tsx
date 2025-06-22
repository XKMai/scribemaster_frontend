import {
  PlayerSchema,
  type PlayerCharacterFormData,
  PlayerCharacterDefaultValues,
} from "./playerCharacterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { useState } from "react";

type SaveKey = keyof PlayerCharacterFormData["savingThrows"]["savingThrows"];
type SkillKey = keyof PlayerCharacterFormData["proficientSkills"];

const PlayerCharacterCreationForm = () => {
  const form = useForm<PlayerCharacterFormData>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: PlayerCharacterDefaultValues,
  });

  const [hitDiceInput, setHitDiceInput] = useState(
    form.getValues("hitDice").join(", ")
  );

  const onSubmit = async (data: PlayerCharacterFormData) => {
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
              <div className="grid grid-cols-4 gap-4">
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
                {/* race */}
                <FormField
                  control={form.control}
                  name="race"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Race</FormLabel>
                      <FormControl>
                        <Input placeholder="Elf" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* class */}
                <FormField
                  control={form.control}
                  name="class"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select class(es)" />
                          </SelectTrigger>
                          <SelectContent>
                            {[
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
                            ].map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* character level */}
                <FormField
                  control={form.control}
                  name="characterLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
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
            {/* <div className="grid grid-cols-3 gap-4"> */}

            {/* hitPoints, armourClass, initiative, speed */}
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

            <div className="grid grid-cols-3 gap-4">
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
                        value={hitDiceInput}
                        onChange={(e) => {
                          const raw = e.target.value;
                          setHitDiceInput(raw);
                          const parsed = raw
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          field.onChange(parsed);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* experience points */}
              <FormField
                control={form.control}
                name="experience_points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Points</FormLabel>
                    <FormControl>
                      <Input placeholder="..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* inspiration */}
              <FormField
                control={form.control}
                name="inspiration"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    </FormControl>
                    <FormLabel>Inspiration</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* proficientSkills */}
                <FormLabel className="p-1">Proficient Skills</FormLabel>
                {(
                  Object.keys(form.watch("proficientSkills")) as SkillKey[]
                ).map((skill) => (
                  <FormField
                    key={skill}
                    control={form.control}
                    name={`proficientSkills.${skill}` as const}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-4 p-1">
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
                ))}
              </div>
              {/* savingThrows */}
              <div>
                <FormLabel className="p-1">Saving Throws</FormLabel>
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
                      <FormItem className="flex items-center gap-4 p-1">
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
            </div>

            {/* languages, additional_senses, traits_and_features, equipment, notes */}
            {(
              [
                "passive_skills",
                "languages",
                "additional_senses",
                "traits_and_features",
                "equipment",
                "notes",
                "personality_traits",
                "ideals",
                "bonds",
                "flaws",
                "death_saves",
                "additional_notes",
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

export default PlayerCharacterCreationForm;
