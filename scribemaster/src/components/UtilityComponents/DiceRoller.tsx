import { useState } from "react";
import { Button } from "../ui/button";

type DiceRollerProps = {
  maxNumber: number;
};

const DiceRoller = ({ maxNumber }: DiceRollerProps) => {
  const [number, setNumber] = useState(0);
  const rollDice = () => {
    setNumber(Math.floor(Math.random() * maxNumber) + 1);
  };
  return (
    <Button className="h-10 w-12 text-xs" onClick={rollDice}>
      d{maxNumber}: {number}
    </Button>
  );
};

export default DiceRoller;
