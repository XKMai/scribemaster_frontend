import { z } from "zod"
import { CharacterSchema } from "./characterSchema";

export const PlayerSchema = CharacterSchema.omit({creature_type: true, creature_tag: true}).extend({
    class: 
        z.enum([
        "Artificer", "Barbarian", "Bard", "Cleric", "Druid", "Fighter",
        "Monk", "Paladin", "Ranger", "Rogue", "Sorcerer", "Warlock", "Wizard"
        ])
    ,
    characterLevel: z.number().int().min(1),
    background: z.string(),
    playerName: z.string(),
    race: z.string(),
    experiencePoints: z.string(),
    passiveSkills: z.string(), 
    attacks: z.union([z.string(), z.array(z.string())]),
    personality_traits: z.string(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    deathSaves: z.string().optional(), 
    inspiration: z.boolean(),
    additionalNotes: z.string().optional() 
})

export type PlayerCharacterFormData = z.infer<typeof PlayerSchema>;

export const PlayerCharacterDefaultValues: PlayerCharacterFormData = {
  name: "Kaelin Stormrider",
  type: "player",
  alignment: "neutral good",
  size: "medium",
  stats: {
    strength: 12,
    dexterity: 16,
    constitution: 14,
    intelligence: 10,
    wisdom: 13,
    charisma: 18,
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
    performance: false,
    persuasion: true,
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
  initiative: 3,
  hitPoints: 30,
  hitDice: ["4d8"],
  speed: 30,
  languages: "Common, Elvish",
  additional_senses: "Darkvision 60ft",
  traits_and_features: "Fey Ancestry, Bardic Inspiration, Jack of All Trades",
  equipment: "Rapier, Leather Armor, Lute, Backpack",
  notes: "Keeps a journal of every encounter.",
  
  // player-exclusive fields

  class: "Bard",
  characterLevel: 4,
  background: "Entertainer",
  playerName: "Aerin",
  race: "Half-Elf",
  experiencePoints: "2700",
  passiveSkills: "Passive Perception: 15",
  attacks: ["Rapier +5 (1d8+3)", "Vicious Mockery (1d4)"],
  personality_traits: "Witty and overly curious.",
  ideals: "Freedom and creativity above all.",
  bonds: "Owes a life debt to a traveling knight.",
  flaws: "Can’t resist a good story.",
  deathSaves: "2 successes, 1 failure",
  inspiration: true,
  additionalNotes: "Secretly searching for their missing twin brother.",
};