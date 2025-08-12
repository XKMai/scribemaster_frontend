import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import api from "@/lib/axiosConfig";
import { useUserStore } from "@/stores/userStore";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/logout");
      useUserStore.getState().clearUser();
      navigate("/login", { replace: true });
    } catch (error) {
      alert("Logout failed: " + error);
    }
  };

  return (
    <Button variant="ghost" onClick={handleLogout} className="w-full text-left">
      Logout
    </Button>
  );
};

export default LogoutButton;
