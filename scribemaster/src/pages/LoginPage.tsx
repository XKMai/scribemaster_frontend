import LoginForm2 from "@/components/LoginForm2"
import { Button } from "@/components/ui/button"
import { Link } from "react-router"

const LoginPage = () => {
  return (
    <>
        <h1 className="font-serif text-2xl "> Welcome to ScribeMaster! </h1>
        <br />
        <LoginForm2 />
        <br />
        <h1>Don't have an account? Sign up here!</h1>
        <br />
        <Button> <Link to="/signup"> Sign Up </Link> </Button>
    </>
  )
}

export default LoginPage