import { z } from "zod"
import { CharacterSchema } from "./characterSchema";

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