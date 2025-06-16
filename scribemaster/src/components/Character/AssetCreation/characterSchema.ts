import { z } from "zod"

export const StatBlockSchema = z.object({
    strength: z.number().min(1).max(20),
    dexterity: z.number().min(1).max(20),
    constitution: z.number().min(1).max(20),
    intelligence: z.number().min(1).max(20),
    wisdom: z.number().min(1).max(20),
    charisma: z.number().min(1).max(20),
});

export const HitPointsSchema = z.object({
    current: z.number().min(0),
    max: z.number().min(1),
    temporary: z.number().optional().default(0),
});

export const CharacterSchema = z.object({
    type: z.enum(["friendly", "neutral", "enemy", "player"]),
    name: z.string().min(1),
    race: z.string().optional(),
    stats: StatBlockSchema,
    hitPoints: HitPointsSchema,
})

export type EntityFormData = z.infer<typeof CharacterSchema>;