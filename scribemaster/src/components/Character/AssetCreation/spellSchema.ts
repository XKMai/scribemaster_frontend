import { z } from "zod";

export const SpellSchema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(0).max(9),
  school: z.enum(["Abjuration",
    "Conjuration",
    "Divination",
    "Enchantment",
    "Evocation",
    "Illusion",
    "Necromancy",
    "Transmutation",]),
  castingTime: z.string().min(1),
  range: z.string().min(1),
  components: z.array(z.string()),
  duration: z.string().min(1),
  description: z.string().min(1),
  higherLevel: z.string(),
  classes:  z.enum([
        "Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
        "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
        ])
    ,
  createdBy: z.number().int(),
  settings: z.record(z.any()).optional(),
});

export type SpellFormData = z.infer<typeof SpellSchema>;

export const SpellDefaultValues: SpellFormData = {
  name: "Magic Missile",
  level: 1,
  school: "Evocation",
  castingTime: "1 action",
  range: "120 feet",
  components: ["V", "S"],
  duration: "Instantaneous",
  description: "You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.",
  higherLevel: "When you cast this spell using a spell slot of 2nd level or higher, the spell creates one more dart for each slot level above 1st.",
  classes: "Wizard",
  createdBy: 0,
  settings: {}
};
