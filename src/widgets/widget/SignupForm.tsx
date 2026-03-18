import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SignupData {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
}

interface SignupFormProps {
  onSubmit?: (data: SignupData) => Promise<void>;
}

export function SignupForm({ onSubmit }: SignupFormProps) {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof SignupData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValid =
    form.first_name.trim() &&
    form.last_name.trim() &&
    form.username.trim() &&
    form.email.trim() &&
    form.password.length >= 8;

  const handleSubmit = async () => {
    if (!isValid) return;
    setError(null);
    setLoading(true);
    try {
      await onSubmit?.(form);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        Create account
      </h1>

      <div className="flex flex-col gap-3">
        {/* Name row */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="First name"
            value={form.first_name}
            onChange={set("first_name")}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
          />
          <input
            type="text"
            placeholder="Last name"
            value={form.last_name}
            onChange={set("last_name")}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
          />
        </div>

        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={set("username")}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={set("email")}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
        />

        <input
          type="password"
          placeholder="Password (8 or more characters)"
          value={form.password}
          onChange={set("password")}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="mt-1 w-full rounded-full bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {loading ? "Creating account…" : "Sign up"}
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-gray-400">
        Already have an account?{" "}
        <button
          onClick={() => navigate("/login")}
          className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          Log in
        </button>
      </p>
    </div>
  );
}