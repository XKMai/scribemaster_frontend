import DiceRoller from "./DiceRoller";
import { Card, CardContent } from "../ui/card";

export const DiceBoard = () => {
  return (
    <Card className="w-fit h-fit p-2">
      <CardContent className="flex flex-row gap-2 flex-wrap">
        <DiceRoller maxNumber={4} />
        <DiceRoller maxNumber={6} />
        <DiceRoller maxNumber={8} />
        <DiceRoller maxNumber={10} />
        <DiceRoller maxNumber={12} />
        <DiceRoller maxNumber={20} />
      </CardContent>
    </Card>
  );
};
