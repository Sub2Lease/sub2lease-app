import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginFormProps {
  onSubmit?: (identifier: string, password: string) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!identifier || !password) return;
    setError(null);
    setLoading(true);
    try {
      await onSubmit?.(identifier, password);
      navigate("/listings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-gray-900">
        Login
      </h1>

      <div className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Email"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
        />
        <input
          type="password"
          placeholder="Password (6 or more characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
        />

        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !identifier || !password}
          className="mt-1 w-full rounded-full bg-gray-900 py-3 text-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-gray-400">
        Don't have an account?{" "}
        <button
          onClick={() => navigate("/signup")}
          className="text-gray-600 underline underline-offset-2 hover:text-gray-900"
        >
          Sign up
        </button>
      </p>
    </div>
  );
}