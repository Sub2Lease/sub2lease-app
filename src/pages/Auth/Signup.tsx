import { loginUser } from "@/shared/api/backendGO/endpoints";
import { SignupForm } from "../../widgets/widget/SignupForm";

export function Signup() {
  const handleLogin = async (identifier: string, password: string) => {
    const res = await loginUser({ identifier, password });
    // Store token for subsequent API calls
    localStorage.setItem("access_token", res.access_token);
  };

  return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <SignupForm onSubmit={handleLogin} />
      </div>
  );
}