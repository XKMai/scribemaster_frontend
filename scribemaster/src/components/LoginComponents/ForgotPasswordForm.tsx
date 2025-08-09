import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
});

type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: ForgotPasswordSchema) => {
    try {
      console.log("Email sent: ", data);

      navigate("/login");
    } catch (error: any) {
      alert("failed to submit password");
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full max-w-sm"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Email</Button>
        </form>
      </Form>
    </>
  );
};

export default ForgotPasswordForm;
