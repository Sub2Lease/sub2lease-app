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

// ── Password rules ──────────────────────────────────────────────
const PASSWORD_RULES = [
  { id: "length",  label: "At least 8 characters",         test: (p: string) => p.length >= 8 },
  { id: "upper",   label: "One uppercase letter",          test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower",   label: "One lowercase letter",          test: (p: string) => /[a-z]/.test(p) },
  { id: "number",  label: "One number",                    test: (p: string) => /[0-9]/.test(p) },
  { id: "special", label: "One special character (!@#$…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password: string): { score: number; label: string; color: string; barColor: string } {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;
  if (password.length === 0) return { score: 0, label: "",           color: "text-gray-400",   barColor: "bg-gray-200" };
  if (passed <= 1)           return { score: 1, label: "Weak",       color: "text-red-500",    barColor: "bg-red-400" };
  if (passed === 2)          return { score: 2, label: "Fair",       color: "text-orange-500", barColor: "bg-orange-400" };
  if (passed === 3)          return { score: 3, label: "Good",       color: "text-yellow-500", barColor: "bg-yellow-400" };
  if (passed === 4)          return { score: 4, label: "Strong",     color: "text-green-500",  barColor: "bg-green-400" };
  return                            { score: 5, label: "Very strong", color: "text-green-600",  barColor: "bg-green-500" };
}
// ───────────────────────────────────────────────────────────────

// ── Reusable eye-toggle icon ────────────────────────────────────
function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
// ───────────────────────────────────────────────────────────────

export function SignupForm({ onSubmit }: SignupFormProps) {
  const navigate = useNavigate();
  const [form, setForm] = useState<SignupData>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword]   = useState("");
  const [error, setError]                       = useState<string | null>(null);
  const [loading, setLoading]                   = useState(false);
  const [tosAgreed, setTosAgreed]               = useState(false);
  const [showPassword, setShowPassword]         = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);
  const [passwordFocused, setPasswordFocused]   = useState(false);
  const [confirmTouched, setConfirmTouched]     = useState(false);

  const set = (field: keyof SignupData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const strength     = getStrength(form.password);
  const allRulesMet  = PASSWORD_RULES.every((r) => r.test(form.password));
  const passwordsMatch = form.password === confirmPassword;

  const isValid =
    form.first_name.trim() &&
    form.last_name.trim()  &&
    form.username.trim()   &&
    form.email.trim()      &&
    allRulesMet            &&
    passwordsMatch         &&
    confirmPassword.length > 0 &&
    tosAgreed;

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

  // Confirm field border color
  const confirmBorderClass =
    !confirmTouched || confirmPassword.length === 0
      ? "border-gray-200 focus:border-gray-400"
      : passwordsMatch
      ? "border-green-400 focus:border-green-400"
      : "border-red-400 focus:border-red-400";

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

        {/* ── Password field ── */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={set("password")}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-gray-400 transition-colors"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>

        {/* ── Strength bar + rule checklist ── */}
        {form.password.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      i <= strength.score ? strength.barColor : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className={`text-xs font-medium w-16 text-right ${strength.color}`}>
                {strength.label}
              </span>
            </div>

            {(passwordFocused || !allRulesMet) && (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5 flex flex-col gap-1.5">
                {PASSWORD_RULES.map((rule) => {
                  const passed = rule.test(form.password);
                  return (
                    <div key={rule.id} className="flex items-center gap-2">
                      {passed ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 shrink-0">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 shrink-0">
                          <circle cx="12" cy="12" r="9"/>
                        </svg>
                      )}
                      <span className={`text-xs transition-colors ${passed ? "text-green-600" : "text-gray-400"}`}>
                        {rule.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Confirm password field ── */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setConfirmTouched(true);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className={`w-full rounded-lg border px-4 py-3 pr-10 text-sm text-gray-800 outline-none placeholder:text-gray-400 transition-colors ${confirmBorderClass}`}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
          >
            <EyeIcon open={showConfirm} />
          </button>
        </div>

        {/* Mismatch hint */}
        {confirmTouched && confirmPassword.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-500">Passwords don't match</p>
        )}

        {/* ── ToS Checkbox ── */}
        <label className="flex items-start gap-2 text-xs cursor-pointer">
          <input
            type="checkbox"
            checked={tosAgreed}
            onChange={(e) => setTosAgreed(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-gray-900"
          />
          <span className="text-gray-600 leading-relaxed">
            I have read and agree to the{" "}
            <a
              href="/Sub2Lease_Terms_of_Service.pdf"
              target="_blank"
              rel="noreferrer"
              className="text-gray-900 underline underline-offset-2 hover:opacity-70"
            >
              Terms of Service
            </a>
            <span className="text-gray-400"> (Version 1.0 · March 17, 2025)</span>
          </span>
        </label>

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