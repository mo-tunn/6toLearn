import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    return username && password ? { username, password } : null;
  });

  const login = (username, password) => {
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
    setAuth({ username, password });
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    setAuth(null);
  };

  const getAuthHeader = () => {
    if (!auth?.username || !auth?.password) return null;
    return "Basic " + btoa(auth.username + ":" + auth.password);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, getAuthHeader }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 