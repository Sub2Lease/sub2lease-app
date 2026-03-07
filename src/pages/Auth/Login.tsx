import { loginUser } from "@/shared/api/backendGO/endpoints";
import { LoginForm } from "../../widgets/widget/LoginForm";

export function Login() {
  const handleLogin = async (identifier: string, password: string) => {
    const res = await loginUser({ identifier, password });
    // Store token for subsequent API calls
    localStorage.setItem("access_token", res.access_token);
  };

  return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <LoginForm onSubmit={handleLogin} />
      </div>
  );
}