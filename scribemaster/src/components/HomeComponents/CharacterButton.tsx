import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface CharacterButtonProps {
  label: string;
  to: string;
}

export const CharacterButton = ({ label, to }: CharacterButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      className="w-full h-full"
      variant="outline"
      onClick={() => navigate(to)}
    >
      {label}
    </Button>
  );
};
