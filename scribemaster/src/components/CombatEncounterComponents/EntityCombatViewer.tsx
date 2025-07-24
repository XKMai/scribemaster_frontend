import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntitySchema } from "@/types/characterSchema";
import {
  PlayerSchema,
  type PlayerCharacterFormData,
} from "@/types/playerCharacterSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { apiService } from "@/services/apiservice";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import type { useSocket } from "../sockets/useSocket";

interface Props {
  entityId: number;
  emit: ReturnType<typeof useSocket>["emit"];
  roomId: string;
}

type SaveKey = keyof PlayerCharacterFormData["savingThrows"];
type SkillKey = keyof PlayerCharacterFormData["skills"];

export const EntityCombatViewer = ({ entityId, emit, roomId }: Props) => {
  const [attackInput, setAttackInput] = useState({ name: "", details: "" });

  const [entityData, setEntityData] = useState<any>(null);

  useEffect(() => {
    const fetchEntity = async () => {
      const data = await apiService.getEntity(entityId);
      console.log(data);
      setEntityData(data);
    };
    fetchEntity();
  }, [entityId]);

  const isPlayer = entityData?.type === "player";

  const form = useForm({
    resolver: zodResolver(isPlayer ? PlayerSchema : EntitySchema),
    defaultValues: entityData,
  });

  useEffect(() => {
    if (entityData) {
      console.log("entityData reset:", entityData);

      const sanitized = {
        ...entityData,
        ...(entityData.playerCharacter ?? {}),
        spellcasting:
          entityData.spellcasting &&
          Object.keys(entityData.spellcasting).length > 0
            ? entityData.spellcasting
            : null,
      };
      form.reset(sanitized);
    }
  }, [entityData]);

  const onSubmit = async (data: any) => {
    try {
      console.log("Submitting form with data:", data);
      emit("updateEntity", {
        roomName: roomId,
        entityId: entityData.id,
        updatedData: data,
      });
      alert("Entity update sent.");
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update entity.");
    }
  };

  if (!entityData) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Loading entity...
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 pt-4 overflow-hidden">
      <Card className="w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {entityData?.name ?? "Select an entity"}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto space-y-4 border border-border rounded-md m-2 pt-3 pb-3">
          {entityData ? (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.warn("Validation failed:", errors);
                })}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="race"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Race</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
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
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>HP</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="maxhp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Max HP</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="temphp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temp HP</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : parseInt(e.target.value, 10)
                              )
                            }
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {(
                    [
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel className="p-1">Proficient Skills</FormLabel>
                    {form.watch("skills") &&
                      (Object.keys(form.watch("skills")) as SkillKey[]).map(
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
                                    onChange={(e) =>
                                      field.onChange(e.target.checked)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="capitalize">
                                  {skill}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        )
                      )}
                  </div>

                  <div>
                    <FormLabel className="p-1">Saving Throws</FormLabel>
                    {form.watch("savingThrows") &&
                      (
                        Object.keys(form.watch("savingThrows")) as SaveKey[]
                      ).map((key) => (
                        <FormField
                          key={key}
                          name={`savingThrows.${key}` as const}
                          control={form.control}
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-4 p-1">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                              </FormControl>
                              <FormLabel className="capitalize">
                                {key}
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                  </div>
                </div>

                {/* Features and Attacks */}
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Features</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Character features and abilities..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* attacks */}
                <div className="space-y-4">
                  <FormLabel className="text-lg font-semibold">
                    Attacks
                  </FormLabel>
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
                    {Object.entries(
                      (form.watch("attacks") as Record<string, string>) || {}
                    ).map(([name, details]) => (
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
                    ))}
                  </div>
                </div>
                {/* Spellcasting */}
                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="spellcasting.spellcastingAbility"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spellcasting Ability</FormLabel>
                        <FormControl>
                          <Input placeholder="charisma" {...field} />
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
                {/* Currency */}
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
                                min="0"
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
                {/* Other Proficiencies */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="otherProficiencies.languages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Languages</FormLabel>
                        <FormControl>
                          <Input placeholder="Common, Elvish..." {...field} />
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
                          <Input placeholder="Thieves' Tools..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Player-specific fields */}
                {isPlayer && (
                  <>
                    <Separator />
                    <FormField
                      control={form.control}
                      name="playerCharacter.playerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Player Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-4 gap-4">
                      {/* class */}
                      <FormField
                        control={form.control}
                        name="playerCharacter.characterClass"
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
                      <FormField
                        control={form.control}
                        name="playerCharacter.level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Level</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={field.value}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : parseInt(e.target.value, 10)
                                  )
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {/* Experience */}
                      <FormField
                        control={form.control}
                        name="playerCharacter.experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
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
                      {/* inspiration */}
                      <FormField
                        control={form.control}
                        name="playerCharacter.inspiration"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <input
                                type="checkbox"
                                checked={field.value}
                                onChange={(e) =>
                                  field.onChange(e.target.checked)
                                }
                              />
                            </FormControl>
                            <FormLabel>Inspiration</FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Background and Alignment */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="playerCharacter.background"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Background</FormLabel>
                            <FormControl>
                              <Input placeholder="Entertainer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="playerCharacter.alignment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alignment</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select alignment" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {[
                                  "Lawful Good",
                                  "Neutral Good",
                                  "Chaotic Good",
                                  "Lawful Neutral",
                                  "True Neutral",
                                  "Chaotic Neutral",
                                  "Lawful Evil",
                                  "Neutral Evil",
                                  "Chaotic Evil",
                                  "Other",
                                ].map((alignment) => (
                                  <SelectItem
                                    key={alignment}
                                    value={alignment.toLowerCase()}
                                  >
                                    {alignment}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Personality */}
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="playerCharacter.personality.traits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Traits</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Character traits..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="playerCharacter.personality.ideals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ideals</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Character ideals..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="playerCharacter.personality.bonds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bonds</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Character bonds..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="playerCharacter.personality.flaws"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flaws</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Character flaws..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Additional Fields */}
                    <FormField
                      control={form.control}
                      name="playerCharacter.backstory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Backstory</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Character backstory..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="playerCharacter.notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Additional notes..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="playerCharacter.treasure"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Treasure</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Character treasure..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="playerCharacter.alliesOrgs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allies & Organizations</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Allies and organizations..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <Button type="submit">Save Changes</Button>
              </form>
            </Form>
          ) : (
            <div className="text-sm text-muted-foreground">
              No entity data available.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
