import { loginUser } from "@/shared/api/backendGO/endpoints";
import { LoginForm } from "../../widgets/widget/LoginForm";
import { setToken } from "@/app/stores/authStore";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const handleLogin = async (identifier: string, password: string) => {
    const res = await loginUser({ identifier, password });
    setToken(res.access_token);
    navigate("/");
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}