import { Sheet } from "lucide-react";
import { Button } from "../ui/button";
import { SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";
import InformationBrowser from "./InformationBrowser";

const InformationSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Information Browsing</SheetTitle>
        <InformationBrowser />
      </SheetContent>
    </Sheet>
  );
};

export default InformationSheet;
