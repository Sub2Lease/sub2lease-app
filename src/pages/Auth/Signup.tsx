import { createUser } from "@/shared/api/backendGO/endpoints";
import { SignupForm } from "../../widgets/widget/SignupForm";

export function Signup() {
  const handleSignup = async (data: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
  }) => {
    await createUser(data);
    // Signup doesn't return a token — navigate to login after
  };
  
  return (
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <SignupForm onSubmit={handleSignup} />
      </div>
  );
}