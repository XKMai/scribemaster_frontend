import { z } from "zod"
import { EntitySchema } from "./characterSchema";

export const PersonalitySchema = z.object({
  traits: z.string().optional(),
  ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
})

export const PlayerSchema = EntitySchema.extend({
    
  playerName: z.string(),
  level: z.number().int().min(1),
  characterClass: 
        z.enum([
        "Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
        "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
        ])
    ,
    
    background: z.string(),
    alignment: z.string().optional(),
    experience: z.number().int(),
    
    inspiration: z.boolean(),

    personality: PersonalitySchema,
    notes: z.string().optional(),
    backstory: z.string(),
    treasure: z.string(),
    alliesOrgs: z.string(),
})

export type PlayerCharacterFormData = z.infer<typeof PlayerSchema>;

export const PlayerCharacterDefaultValues: PlayerCharacterFormData = {
  // inherited from EntitySchema 
  createdBy: 0,
  name: "Kaelin Stormrider",
  type: "player",
  race: "Half-Elf",
  description: "A charismatic bard with a mysterious past.",

  stats: {
    strength: 12,
    dexterity: 16,
    constitution: 14,
    intelligence: 10,
    wisdom: 13,
    charisma: 18,
  },
  hp: 30,
  maxhp: 30,
  temphp: 0,

  ac: 15,
  speed: 30,
  initiative: 3,
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
    performance: false,
    persuasion: true,
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

  features: "Fey Ancestry, Bardic Inspiration, Jack of All Trades",
  attacks: {
    Rapier: "1d8+3",
    Vicious_Mockery: "1d4"},

  spellcasting: {
    spellcastingAbility: "charisma",
    spellSaveDC: 14,
    spellAttackBonus: 6,
  },

  currency: {
    gold: 50,
    electrum: 0,
    silver: 25,
    copper: 10,
  },

  otherProficiencies: {
    languages: "Common, Elvish, Sylvan",
    tools: "Lute, Flute, Disguise Kit",
  },

  // player specific
  playerName: "Aerin",
  level: 4,
  characterClass: "Bard",
  background: "Entertainer",
  alignment: "neutral good",
  experience: 2700,
  inspiration: true,

  personality: {
    traits: "Witty and overly curious.",
    ideals: "Freedom and creativity above all.",
    bonds: "Owes a life debt to a traveling knight.",
    flaws: "Can’t resist a good story.",
  },

  notes: "Secretly searching for their missing twin brother.",
  backstory: "Grew up learning bardic tales of the Feywild.",
  treasure: "Ornate silver flute gifted by a forest spirit.",
  alliesOrgs: "College of Lore, Bardic Council",
};

