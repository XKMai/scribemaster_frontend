import { z } from "zod/v4"

export const StatBlockSchema = z.object({
    strength: z.int().min(1).max(20),
    dexterity: z.int().min(1).max(20),
    constitution: z.int().min(1).max(20),
    intelligence: z.int().min(1).max(20),
    wisdom: z.int().min(1).max(20),
    charisma: z.int().min(1).max(20),
});

export const HitPointsSchema = z.object({
    current: z.int().min(0),
    max: z.int().min(1),
    temporary: z.int().min(0),
});

export const ProficientSkillsSchema = z.object({
     acrobatics: z.boolean(), 
     animalHandling: z.boolean(), 
     arcana: z.boolean(), 
     athletics: z.boolean(), 
     deception: z.boolean(), 
     history: z.boolean(), 
     insight: z.boolean(), 
     intimidation: z.boolean(), 
     investigation: z.boolean(), 
     medicine: z.boolean(), 
     nature: z.boolean(), 
     perception: z.boolean(), 
     performance: z.boolean(), 
     persuasion: z.boolean(), 
     religion: z.boolean(), 
     sleightOfHand: z.boolean(),
})

export const SavingThrowsSchema = z.object({
  savingThrows: z.object({
    strength: z.boolean(),
    dexterity: z.boolean(),
    constitution: z.boolean(),
    intelligence: z.boolean(),
    wisdom: z.boolean(),
    charisma: z.boolean(),
  })
});

export const CharacterSchema = z.object({
    name: z.string().min(1),
    type: z.enum(["friendly", "neutral", "enemy", "player"]),
    alignment: z.enum(["lawful good, neutral good, chaotic good, lawful neutral, true neutral, chaotic neutral, lawful evil, neutral evil, chaotic evil"]),
    size: z.enum(["tiny, small, medium, large, huge, gargantuan"]),
    creature_type: z.enum(["aberration, beast, celestial, construct, dragon, elemental, fey, fiend, giant, humanoid, monstrosity, ooze, plant, undead"]),
    creature_tag: z.string().optional(),
    stats: StatBlockSchema,
    proficientSkills: ProficientSkillsSchema,
    savingThrows: SavingThrowsSchema,
    proficiencyBonus: z.int(),
    armourClass:z.int(),
    initiative: z.int(),
    hitPoints: HitPointsSchema,
    hitDice: z.array(z.string().regex(/^\d+d\d+$/)),
    speed: z.int(),
    languages: z.string(),
    additional_senses: z.string().optional(),
    traits_and_features: z.string(),
    equipment: z.string(), // to be replaced with equipment type
    notes: z.string().optional(),
})


export type CharacterFormData = z.infer<typeof CharacterSchema>;