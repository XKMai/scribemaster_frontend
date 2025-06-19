import {
  PlayerSchema,
  type PlayerCharacterFormData,
  PlayerCharacterDefaultValues,
} from "./playerCharacterSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const PlayerCharacterCreationForm = () => {
  const form = useForm<PlayerCharacterFormData>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: PlayerCharacterDefaultValues,
  });
  return <div>PlayerCharacterCreationForm</div>;
};

export default PlayerCharacterCreationForm;
