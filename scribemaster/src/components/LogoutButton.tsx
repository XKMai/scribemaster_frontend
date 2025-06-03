import { useNavigate } from "react-router"
import axios from "axios"
import { Button } from "./ui/button"

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.post("http://127.0.0.1:5000/logout", null, {
        withCredentials: true,
      })

      navigate("/login")
    } catch (error) {
      alert("Logout failed: " + error)
    }
  }

  return (
    <Button onClick={handleLogout}>
      Logout
    </Button>
  )
}

export default LogoutButton
