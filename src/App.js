import { useState, useEffect } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) setToken(stored);
  }, []);

  const handleLogin = (newToken) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (token) {
    return (
      <div className="app">
        <Dashboard onLogout={handleLogout} />
      </div>
    );
  }

  return (
    <div className="app app-auth">
      <div className="auth-tabs">
        <button
          type="button"
          className={showLogin ? "active" : ""}
          onClick={() => setShowLogin(true)}
        >
          Login
        </button>
        <button
          type="button"
          className={!showLogin ? "active" : ""}
          onClick={() => setShowLogin(false)}
        >
          Sign up
        </button>
      </div>
      {showLogin ? (
        <Login onLogin={handleLogin} onSwitchToRegister={() => setShowLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setShowLogin(true)} />
      )}
    </div>
  );
}
export default App;
