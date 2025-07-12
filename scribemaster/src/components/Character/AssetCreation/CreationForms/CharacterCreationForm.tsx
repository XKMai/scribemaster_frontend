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
import { Textarea } from "@/components/ui/textarea";
import { apiService } from "@/services/apiservice";
import api from "@/lib/axiosConfig";
import { useState } from "react";
import {
  type EntityFormData,
  EntitySchema,
  EntityDefaultValues,
} from "@/types/characterSchema";

type SaveKey = keyof EntityFormData["savingThrows"];
type SkillKey = keyof EntityFormData["skills"];

const CharacterCreationForm = () => {
  const [attackInput, setAttackInput] = useState({ name: "", details: "" });
  const form = useForm<EntityFormData>({
    resolver: zodResolver(EntitySchema),
    defaultValues: EntityDefaultValues,
  });

  const onSubmit = async (data: EntityFormData) => {
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
      await api.post("/entity", payload);

      alert("character created successfully");
    } catch (error: any) {
      alert("something went wrong!!!");
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
              <div className="grid grid-cols-2 gap-4">
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
            {/* description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Character description..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

            <div className="grid grid-cols-5 gap-4">
              {(
                [
                  ["maxhp", "Max Hit Points"],
                  ["ac", "Armor Class"],
                  ["speed", "Speed"],
                  ["initiative", "Initiative"],
                  ["passivePerception", "Passive Perception"],
                ] as const
              ).map(([key, label]) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                {/* proficientSkills */}
                <FormLabel className="p-1 text-lg">Proficient Skills</FormLabel>
                {(Object.keys(form.watch("skills")) as SkillKey[]).map(
                  (skill) => (
                    <FormField
                      key={skill}
                      control={form.control}
                      name={`skills.${skill}` as const}
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
                  )
                )}
              </div>
              {/* savingThrows */}
              <div>
                <FormLabel className="p-1 text-lg">Saving Throws</FormLabel>
                {(Object.keys(form.watch("savingThrows")) as SaveKey[]).map(
                  (key) => (
                    <FormField
                      key={key}
                      name={`savingThrows.${key}`}
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
                  )
                )}
              </div>
            </div>

            {/* features */}
            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* attacks */}
            <div className="space-y-4">
              <FormLabel className="text-lg">Attacks</FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="attacks"
                  render={() => (
                    <FormItem>
                      <FormLabel>Attack Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Longsword, Fireball"
                          value={attackInput.name}
                          onChange={(e) =>
                            setAttackInput({
                              ...attackInput,
                              name: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="attacks"
                  render={() => (
                    <FormItem>
                      <FormLabel>Attack Details</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. +5 to hit, 1d8+3 slashing"
                          value={attackInput.details}
                          onChange={(e) =>
                            setAttackInput({
                              ...attackInput,
                              details: e.target.value,
                            })
                          }
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <Button
                type="button"
                onClick={() => {
                  if (attackInput.name && attackInput.details) {
                    const currentAttacks = form.getValues("attacks") || {};
                    form.setValue("attacks", {
                      ...currentAttacks,
                      [attackInput.name]: attackInput.details,
                    });
                    setAttackInput({ name: "", details: "" });
                  }
                }}
              >
                Add Attack
              </Button>

              {/* Display current attacks */}
              <div className="space-y-2">
                {Object.entries(form.watch("attacks") || {}).map(
                  ([name, details]) => (
                    <div
                      key={name}
                      className="flex justify-between items-center p-2 border rounded"
                    >
                      <span>
                        <strong>{name}:</strong> {details}
                      </span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          const currentAttacks =
                            form.getValues("attacks") || {};
                          const { [name]: removed, ...rest } = currentAttacks;
                          form.setValue("attacks", rest);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Spellcasting section */}
            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">
                Spellcasting
              </FormLabel>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="spellcasting.spellcastingAbility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spellcasting Ability</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="spellcasting.spellSaveDC"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spell Save DC</FormLabel>
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
                <FormField
                  control={form.control}
                  name="spellcasting.spellAttackBonus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spell Attack Bonus</FormLabel>
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
              </div>
            </div>

            {/* Currency section */}
            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">Currency</FormLabel>
              <div className="grid grid-cols-4 gap-4">
                {(["gold", "electrum", "silver", "copper"] as const).map(
                  (currency) => (
                    <FormField
                      key={currency}
                      control={form.control}
                      name={`currency.${currency}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {currency}
                          </FormLabel>
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
                  )
                )}
              </div>
            </div>
            {/* Other Proficiencies section */}
            <div className="space-y-4">
              <FormLabel className="text-lg font-semibold">
                Other Proficiencies
              </FormLabel>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="otherProficiencies.languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="otherProficiencies.tools"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tools</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

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
