import { createUser } from "@/shared/api/backendGO/endpoints";
import { SignupForm } from "../../widgets/widget/SignupForm";
import { useNavigate } from "react-router-dom";

export function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    await createUser({
      ...data,
      tos_version: "1.0",
      tos_user_agent: navigator.userAgent,
    });

    navigate("/login");
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <SignupForm onSubmit={handleSignup} />
    </div>
  );
}