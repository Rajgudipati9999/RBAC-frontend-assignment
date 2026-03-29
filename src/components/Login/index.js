import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiFetch } from "../../services/api";
import "./index.css";

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const jwt = data?.token;
      const role = data?.role || data?.user?.role;
      const userId = data?.user?._id || data?.user?.id || data?.id;

      if (jwt) {
        localStorage.setItem("token", jwt);
        if (role) {
          localStorage.setItem("role", role);
        }
        if (userId) {
          localStorage.setItem("userId", String(userId));
        }
        onLogin(jwt);
        navigate("/dashboard", { replace: true });
      } else {
        setError("No token received from server");
      }
    } catch (err) {
      const message = err.body?.message || err.message || "Invalid credentials";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="auth-error">{error}</p>}
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Login"}
        </button>
        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="link-btn">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
