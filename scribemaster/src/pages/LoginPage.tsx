import ForgotPasswordForm from "@/components/LoginComponents/ForgotPasswordForm";
import LoginForm2 from "@/components/LoginComponents/LoginForm2";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <>
      <h1 className="font-bold text-2xl "> Welcome to Scribe Master! </h1>
      <br />
      <Card className="w-sm ">
        <CardHeader>
          <CardTitle className="text-center">Login Here!</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <LoginForm2 />
        </CardContent>
        <CardFooter className="justify-items-center">
          <Dialog>
            <DialogTrigger>
              <Badge variant="secondary" className="w-full">
                Forgot your password?
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Password Reset</DialogTitle>
                <DialogDescription>
                  Enter the email address used for your account!
                </DialogDescription>
                <ForgotPasswordForm />
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      <br />
      <h1>Don't have an account? Sign up here!</h1>
      <br />
      <Button>
        <Link to="/signup"> Sign Up </Link>
      </Button>
    </>
  );
};

export default LoginPage;
