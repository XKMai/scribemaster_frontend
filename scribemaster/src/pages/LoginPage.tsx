import LoginForm2 from "@/components/LoginComponents/LoginForm2";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";

const LoginPage = () => {
  return (
    <>
      <h1 className="font-bold text-2xl "> Welcome to Scribe Master! </h1>
      <br />
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-center">Login Here!</CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <LoginForm2 />
        </CardContent>
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
