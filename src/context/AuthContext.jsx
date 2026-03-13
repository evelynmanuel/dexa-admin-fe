import { createContext, useContext, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem("admin_user");
      const token = localStorage.getItem("admin_token");
      return saved && token ? JSON.parse(saved) : null;
    } catch (error) {
      console.error("Failed to parse admin user from localStorage", error);
      localStorage.removeItem("admin_user");
      localStorage.removeItem("admin_token");
      return null;
    }
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const res = await authAPI.login(email, password);
    if (res.data.user.role !== "ADMIN") {
      throw new Error("Akses ditolak. Hanya admin yang dapat masuk.");
    }
    localStorage.setItem("admin_token", res.data.access_token);
    localStorage.setItem("admin_user", JSON.stringify(res.data.user));
    setAdmin(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
