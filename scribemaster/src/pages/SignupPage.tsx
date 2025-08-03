import SignupForm2 from "@/components/LoginComponents/SignupForm2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SignupPage = () => {
  return (
    <>
      <Card className="w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            Sign up for a new account here!
          </CardTitle>
        </CardHeader>
        <CardContent className="w-full">
          <SignupForm2 />
        </CardContent>
      </Card>
    </>
  );
};

export default SignupPage;
