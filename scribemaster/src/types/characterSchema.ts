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
  
    strength: z.boolean(),
    dexterity: z.boolean(),
    constitution: z.boolean(),
    intelligence: z.boolean(),
    wisdom: z.boolean(),
    charisma: z.boolean(),
 
});

export const CurrencySchema = z.object({
  gold: z.number().int(), 
  electrum:z.number().int(), 
  silver: z.number().int(), 
  copper: z.number().int(),
})

export const otherProficienciesSchema = z.object({
  languages: z.string(),
  tools: z.string(),
})

export const spellCastingSchema = z.object({
  spellcastingAbility: z.string(),
  spellSaveDC: z.number(), 
  spellAttackBonus: z.number(),
}).nullable().optional()

export const EntitySchema = z.object({
    
    createdBy: z.number(),
    name: z.string().min(1),
    type: z.enum(["friendly", "neutral", "enemy", "player"]),
    race: z.string().min(1),
    description: z.string().min(1),
    
    stats: StatBlockSchema,
    hp: z.number().int(),
    maxhp: z.number().int(),
    temphp: z.number().int(),
    

    ac: z.number().int(),
    speed: z.number().int(),
    initiative: z.number().int(),
    passivePerception: z.number().int(),

    savingThrows: SavingThrowsSchema,
    skills: ProficientSkillsSchema,

    features: z.string(),
    attacks: z.record(z.string()),
    
    spellcasting: spellCastingSchema,
    
    currency: CurrencySchema,
    otherProficiencies: otherProficienciesSchema,
})

export type EntityFormData = z.infer<typeof EntitySchema>;

export type Entity = EntityFormData & { id: number };

export type EntitySummary = Pick<
  Entity,
  | "id"
  | "name"
  | "hp"
  | "maxhp"
  | "temphp"
  | "ac"
  | "stats"
  | "speed"
  | "passivePerception"
  | "spellcasting"
  | "type"
>;

export const EntityDefaultValues: EntityFormData = {
  createdBy: 0,
  name: "Seraphina Windrunner",
  type: "player",
  race: "Elf",
  description: "Often scouts ahead. Friendly, but elusive.",

  stats: {
    strength: 10,
    dexterity: 18,
    constitution: 14,
    intelligence: 12,
    wisdom: 13,
    charisma: 16,
  },
  hp: 15,
  maxhp: 20,
  temphp: 0,

  ac: 15,
  speed: 35,
  initiative: 4,
  passivePerception: 15,

  skills: {
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
    strength: false,
    dexterity: true,
    constitution: true,
    intelligence: false,
    wisdom: false,
    charisma: true,
  },

  features: "Fey Ancestry, Cunning Action, Sneak Attack",
  attacks: {
  sword: "1d8+3",
  bow: "1d6+2",
},

  spellcasting: {
    spellcastingAbility: "charisma",
    spellSaveDC: 13,
    spellAttackBonus: 5,
  },

  currency: {
    gold: 10,
    electrum: 0,
    silver: 50,
    copper: 100,
  },

  otherProficiencies: {
    languages: "Common, Elvish, Sylvan",
    tools: "Thieves' Tools",
  },
};


