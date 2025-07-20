import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import api from "@/lib/axiosConfig";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.get("/logout");
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
