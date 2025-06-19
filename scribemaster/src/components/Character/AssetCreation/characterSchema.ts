import { z } from "zod"

export const StatBlockSchema = z.object({
    strength: z.number().int().min(1),
    dexterity: z.number().int().min(1),
    constitution: z.number().int().min(1),
    intelligence: z.number().int().min(1),
    wisdom: z.number().int().min(1),
    charisma: z.number().int().min(1),
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
     stealth: z.boolean(),
     survival: z.boolean(),
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
    alignment: z.enum(["lawful good",
                        "neutral good",
                        "chaotic good",
                        "lawful neutral",
                        "true neutral",
                        "chaotic neutral",
                        "lawful evil",
                        "neutral evil",
                        "chaotic evil",]),
    size: z.enum(["tiny", "small", "medium", "large", "huge", "gargantuan"]),
    creature_type: z.enum(["aberration", "beast", "celestial", "construct", "dragon", "elemental", "fey",
  "fiend", "giant", "humanoid", "monstrosity", "ooze", "plant", "undead"]),
    creature_tag: z.string().optional(),
    stats: StatBlockSchema,
    proficientSkills: ProficientSkillsSchema,
    savingThrows: SavingThrowsSchema,
    proficiencyBonus: z.number().int(),
    armourClass:z.number().int(),
    initiative: z.number().int(),
    hitPoints: z.number().int(),
    hitDice: z.array(z.string().regex(/^\d+d\d+$/)),
    speed: z.number().int(),
    languages: z.string(),
    additional_senses: z.string().optional(),
    traits_and_features: z.string(),
    equipment: z.string(), // to be replaced with equipment type
    notes: z.string().optional(),
})

export type CharacterFormData = z.infer<typeof CharacterSchema>;

export const PlayerSchema = CharacterSchema.omit({creature_type: true, creature_tag: true}).extend({
    class: z.array(
        z.enum([
        "Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
        "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
        ])
    ),
    characterLevel: z.number().int().min(1),
    background: z.string(),
    playerName: z.string(),
    race: z.string(),
    experiencePoints: z.string(),
    passiveSkills: z.string(), 
    attacks: z.union([z.string(), z.array(z.string())]),
    personalityTraits: z.string(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    deathSaves: z.string().optional(), 
    inspiration: z.boolean(),
    additionalNotes: z.string().optional() 
})

export const CharacterDefaultValues: CharacterFormData = {
  name: "Seraphina Windrunner",
  type: "player",
  alignment: "chaotic good",
  size: "medium",
  creature_type: "humanoid",
  creature_tag: "elf",
  stats: {
    strength: 10,
    dexterity: 18,
    constitution: 14,
    intelligence: 12,
    wisdom: 13,
    charisma: 16,
  },
  proficientSkills: {
    acrobatics: true,
    animalHandling: false,
    arcana: false,
    athletics: false,
    deception: true,
    history: false,
    insight: true,
    intimidation: false,
    investigation: false,
    medicine: false,
    nature: false,
    perception: true,
    performance: true,
    persuasion: false,
    religion: false,
    sleightOfHand: false,
    stealth: true,
     survival: false,
  },
  savingThrows: {
    savingThrows: {
      strength: false,
      dexterity: true,
      constitution: true,
      intelligence: false,
      wisdom: false,
      charisma: true,
    },
  },
  proficiencyBonus: 2,
  armourClass: 15,
  initiative: 4,
  hitPoints: 15,
  hitDice: ["4d8"],
  speed: 35,
  languages: "Common, Elvish, Sylvan",
  additional_senses: "Darkvision 60ft",
  traits_and_features: "Fey Ancestry, Cunning Action, Sneak Attack",
  equipment: "Rapier, Shortbow, Leather Armor, Thieves' Tools",
  notes: "Often scouts ahead. Friendly, but elusive.",
};

