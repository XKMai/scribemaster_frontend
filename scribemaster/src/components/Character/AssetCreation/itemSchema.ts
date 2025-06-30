import { z } from "zod";

export const ItemSchema = z.object({
    name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Item type is required"),
  description: z.string().min(1, "Description is required"),
  characteristics: z.record(z.any()),
  createdBy: z.number().int(),
  folderId: z.number().int().optional(),
  settings: z.record(z.any()).optional(),
});

export type ItemFormData = z.infer<typeof ItemSchema>;

export const ItemDefaultValues: ItemFormData = {
  name: "Le Blade",
  type: "Weapon",
  description: "A finely crafted longsword with a jeweled hilt.",
  characteristics: {
    weight: "3 lbs",
    damage: "1d8 slashing",
    properties: ["versatile (1d10)"],
  },
  createdBy: 0, 
  folderId: undefined,
  settings: {},
};
