import { zodResolver } from "@hookform/resolvers/zod";
import { CharacterSchema, type CharacterFormData } from "./characterSchema";
import { useForm } from "react-hook-form";

const CharacterCreationForm = () => {
  const form = useForm<CharacterFormData>({
    resolver: zodResolver(CharacterSchema),
    defaultValues: {
      type: "friendly",
      name: "",
      race: "",
      stats: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      hitPoints: {
        current: 10,
        max: 20,
        temporary: 0,
      },
    },
  });
  return <div>CharacterCreationForm</div>;
};

export default CharacterCreationForm;
