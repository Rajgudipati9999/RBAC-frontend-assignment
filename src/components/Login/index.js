import { useState } from "react";
import API from "../../services/api";
import "./index.css";

function Login({ onLogin, onSwitchToRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      const jwt = res.data.token;
      console.log(res.status)
      if(res.status === 200){
        localStorage.setItem("token", jwt);
        onLogin(jwt);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
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
          <button type="button" className="link-btn" onClick={onSwitchToRegister}>
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
