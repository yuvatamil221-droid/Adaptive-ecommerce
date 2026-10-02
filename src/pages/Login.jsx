import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Button } from "../components/common";

export default function Login({ navigate, goBack }) {
  const { login, profiles } = useContext(UserContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();

    const result = login(email, password);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    if (!profiles.length) {
      navigate("addProfile");
    } else {
      navigate("home");
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--theme-bg)] p-4">

      <form
        onSubmit={submit}
        className="w-full max-w-md rounded-3xl border bg-[var(--theme-surface)] p-7 shadow-xl"
      >

        {/* Back Button */}
        <button
          type="button"
          onClick={goBack}
          className="mb-5 flex items-center gap-2 font-bold text-[var(--theme-muted)] hover:text-[var(--theme-primary)]"
        >
          ← Back
        </button>

        {/* Logo */}
        <button
          type="button"
          onClick={() => navigate("home")}
          className="flex items-center gap-2 font-black"
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--theme-primary)] text-white">
            A
          </span>

          Adaptive.
        </button>

        {/* Title */}
        <h1 className="mt-7 text-3xl font-black">
          Login
        </h1>

        <p className="mt-2 text-[var(--theme-muted)]">
          Use the account you registered with.
        </p>

        {/* Email */}
        <label className="mt-6 block font-bold">
          Email

          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </label>

        {/* Password */}
        <label className="mt-4 block font-bold">
          Password

          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </label>

        {/* Error */}
        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        {/* Login */}
        <Button
          type="submit"
          className="mt-5 w-full"
        >
          Login
        </Button>

        {/* Register */}
        <button
          type="button"
          onClick={() => navigate("register")}
          className="mt-5 w-full text-sm font-bold text-[var(--theme-primary)]"
        >
          New user? Create an account
        </button>

      </form>
    </main>
  );
}