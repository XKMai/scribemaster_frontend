import DiceRoller from "./DiceRoller";
import { Card, CardContent, CardHeader } from "../ui/card";

export const DiceBoard = () => {
  return (
    <Card className="w-fit h-fit p-2">
      <CardHeader className="text-center text-sm font-semibold">
        DiceBoard
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
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
