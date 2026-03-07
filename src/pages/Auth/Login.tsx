import { loginUser } from "@/shared/api/backendGO/endpoints";
import { LoginForm } from "../../widgets/widget/LoginForm";
import { setToken } from "@/app/stores/authStore";          // ← add

export function Login() {
  const handleLogin = async (identifier: string, password: string) => {
    const res = await loginUser({ identifier, password });
    setToken(res.access_token);                              // ← change
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
}