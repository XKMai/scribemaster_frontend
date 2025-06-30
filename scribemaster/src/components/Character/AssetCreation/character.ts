export type StatBlock = {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
}

export type HitPoints = {
    current: number;
    max: number;
    temporary?: number; // Optional, default to 0 if undefined
};

export type Character = {
    // admin data
    entityId: number
    createdBy: number
    type: "friendly" | "neutral" | "enemy" | "player";

    // game data
    name: string
    race?: string
    stats: StatBlock
    hitPoints: HitPoints

}