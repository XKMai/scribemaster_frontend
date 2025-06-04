import { Label } from "@radix-ui/react-label"
import { Button } from "./ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card"
import { Input } from "./ui/input"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import axios from 'axios';
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

const CampaignCreation = () => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Campaign Creator</CardTitle>
        <CardDescription className="text-center">
          Enter the name of your next adventure!
        </CardDescription>
      </CardHeader> 
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="campaign_name">Name</Label>
          <Input id="username" type="username" placeholder="The Marvelous Adventures of Foo" required />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Create Campaign</Button>
      </CardFooter>
    </Card>
  )
}

export default CampaignCreation